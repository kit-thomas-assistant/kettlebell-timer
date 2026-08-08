(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.KettlebellHistorySync = api;
})(typeof globalThis !== 'undefined' ? globalThis : window, function () {
  'use strict';

  const HISTORY_KEY = 'kb_history';
  const QUEUE_KEY = 'kb_sync_queue_v1';
  const HISTORY_LIMIT = 200;

  function generateStableId(cryptoApi = globalThis.crypto) {
    if (cryptoApi && typeof cryptoApi.randomUUID === 'function') return cryptoApi.randomUUID();
    const bytes = new Uint8Array(16);
    if (cryptoApi && typeof cryptoApi.getRandomValues === 'function') cryptoApi.getRandomValues(bytes);
    else for (let index = 0; index < bytes.length; index++) bytes[index] = Math.floor(Math.random() * 256);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map(value => value.toString(16).padStart(2, '0'));
    return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
  }

  function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ''));
  }

  function parseTime(value) {
    const time = Date.parse(value || '');
    return Number.isFinite(time) ? time : 0;
  }

  function richness(value) {
    if (!value || typeof value !== 'object') return 0;
    let score = 0;
    const visit = item => {
      if (Array.isArray(item)) {
        score += item.length;
        item.forEach(visit);
      } else if (item && typeof item === 'object') {
        for (const [key, child] of Object.entries(item)) {
          if (child !== null && child !== '' && child !== undefined) score += key.length + 1;
          visit(child);
        }
      }
    };
    visit(value);
    return score;
  }

  function migrateLegacySessions(history, options = {}) {
    const makeId = options.makeId || (() => generateStableId(options.cryptoApi));
    const sessions = Array.isArray(history) ? history : [];
    let changed = false;
    const seen = new Set();
    const migrated = sessions.map(session => {
      const source = session && typeof session === 'object' ? session : {};
      let id = source.id;
      if (!isUuid(id) || seen.has(id)) {
        do id = makeId(); while (!isUuid(id) || seen.has(id));
        changed = true;
      }
      seen.add(id);
      const date = source.date || new Date(0).toISOString();
      const updatedAt = source.updatedAt || date;
      if (source.updatedAt !== updatedAt) changed = true;
      return { ...source, id, date, updatedAt };
    });
    return { sessions: migrated, changed };
  }

  function mergeSessionPair(localSession, cloudSession) {
    if (!localSession) return cloudSession;
    if (!cloudSession) return localSession;
    const localTime = parseTime(localSession.updatedAt || localSession.date);
    const cloudTime = parseTime(cloudSession.updatedAt || cloudSession.date);
    let winner = localSession;
    let loser = cloudSession;
    if (cloudTime > localTime || (cloudTime === localTime && richness(cloudSession) > richness(localSession))) {
      winner = cloudSession;
      loser = localSession;
    }
    return { ...loser, ...winner, id: winner.id || loser.id };
  }

  function mergeHistories(localHistory, cloudHistory, limit = HISTORY_LIMIT) {
    const merged = new Map();
    for (const session of [...(Array.isArray(localHistory) ? localHistory : []), ...(Array.isArray(cloudHistory) ? cloudHistory : [])]) {
      if (!session || !isUuid(session.id)) continue;
      merged.set(session.id, mergeSessionPair(merged.get(session.id), session));
    }
    return [...merged.values()]
      .sort((a, b) => parseTime(b.date) - parseTime(a.date) || String(a.id).localeCompare(String(b.id)))
      .slice(0, limit);
  }

  function safeJsonParse(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function readArray(storage, key) {
    const parsed = safeJsonParse(storage.getItem(key) || '[]', []);
    return Array.isArray(parsed) ? parsed : [];
  }

  function createHistorySync(options) {
    const storage = options.storage;
    const client = options.client;
    const limit = options.limit || HISTORY_LIMIT;
    const onHistory = options.onHistory || (() => {});
    const onState = options.onState || (() => {});
    const isOnline = options.isOnline || (() => typeof navigator === 'undefined' || navigator.onLine !== false);
    let currentUser = null;
    let syncing = null;

    function state(status, detail = {}) {
      onState({ status, user: currentUser, ...detail });
    }

    function readLocal() { return readArray(storage, HISTORY_KEY); }
    function writeLocal(history) {
      const capped = (Array.isArray(history) ? history : []).slice(0, limit);
      storage.setItem(HISTORY_KEY, JSON.stringify(capped));
      onHistory(capped);
      return capped;
    }
    function readQueue() { return readArray(storage, QUEUE_KEY).filter(isUuid); }
    function writeQueue(ids) {
      const unique = [...new Set(ids.filter(isUuid))];
      storage.setItem(QUEUE_KEY, JSON.stringify(unique));
      return unique;
    }
    function queueIds(ids) { return writeQueue([...readQueue(), ...ids]); }

    function migrateLocal() {
      const result = migrateLegacySessions(readLocal(), options);
      if (result.changed) {
        writeLocal(result.sessions);
        queueIds(result.sessions.map(session => session.id));
      }
      return result;
    }

    function cloudRowToSession(row) {
      const payload = row && row.payload && typeof row.payload === 'object' ? row.payload : {};
      return {
        ...payload,
        id: row.id,
        date: payload.date || row.completed_at,
        updatedAt: payload.updatedAt || row.updated_at || row.completed_at,
      };
    }

    function sessionToCloudRow(session) {
      return {
        id: session.id,
        user_id: currentUser.id,
        completed_at: session.date,
        payload: session,
      };
    }

    async function upsertSessions(sessions) {
      if (!sessions.length) return;
      const { error } = await client.from('workout_sessions').upsert(
        sessions.map(sessionToCloudRow),
        { onConflict: 'id' }
      );
      if (error) throw error;
    }

    async function pullSessions() {
      const { data, error } = await client
        .from('workout_sessions')
        .select('id, completed_at, payload, updated_at')
        .order('completed_at', { ascending: false });
      if (error) throw error;
      return (data || []).map(cloudRowToSession);
    }

    async function runSync() {
      const migration = migrateLocal();
      if (!currentUser) {
        state('signed-out');
        return readLocal();
      }
      if (!isOnline()) {
        queueIds(readLocal().map(session => session.id));
        state('offline', { queued: readQueue().length });
        return readLocal();
      }
      state('syncing');
      try {
        const local = readLocal();
        // Legacy IDs are new and conflict-free. Upload them before the first pull so
        // a first sign-in can never lose the device history if the pull is interrupted.
        if (migration.changed && local.length) await upsertSessions(local);
        const cloud = await pullSessions();
        const merged = mergeHistories(local, cloud, limit);
        writeLocal(merged);
        await upsertSessions(merged);
        const uploadedIds = new Set(merged.map(session => session.id));
        writeQueue(readQueue().filter(id => !uploadedIds.has(id)));
        state('synced', { count: merged.length });
        return merged;
      } catch (error) {
        queueIds(readLocal().map(session => session.id));
        state(isOnline() ? 'error' : 'offline', { error, queued: readQueue().length });
        throw error;
      }
    }

    function syncNow() {
      if (!syncing) syncing = runSync().finally(() => { syncing = null; });
      return syncing;
    }

    function setUser(user) {
      currentUser = user || null;
      if (!currentUser) {
        state('signed-out');
        return Promise.resolve(readLocal());
      }
      return syncNow();
    }

    function notifyLocalSave(session) {
      if (session && isUuid(session.id)) queueIds([session.id]);
      if (currentUser && syncing) {
        syncing.finally(() => {
          if (currentUser && isOnline() && readQueue().length) syncNow().catch(() => {});
        }).catch(() => {});
      } else if (currentUser) {
        syncNow().catch(() => {});
      }
    }

    function retry() {
      if (!currentUser) return Promise.resolve(readLocal());
      return syncNow();
    }

    function getQueue() { return readQueue(); }
    function getUser() { return currentUser; }

    return { migrateLocal, notifyLocalSave, retry, setUser, syncNow, getQueue, getUser, readLocal, writeLocal };
  }

  return {
    HISTORY_KEY,
    QUEUE_KEY,
    HISTORY_LIMIT,
    generateStableId,
    isUuid,
    mergeSessionPair,
    mergeHistories,
    migrateLegacySessions,
    createHistorySync,
  };
});
