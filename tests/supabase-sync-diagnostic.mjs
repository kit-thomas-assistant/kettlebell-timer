#!/usr/bin/env node

import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';

const require = createRequire(import.meta.url);
const Sync = require('../history-sync.js');

const ids = [
  '10000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003',
  '10000000-0000-4000-8000-000000000004',
];
let idCursor = 0;
const legacy = [
  { id: 'kb-old', date: '2026-08-01T10:00:00.000Z', mode: 'Circuit' },
  { date: '2026-08-02T10:00:00.000Z', mode: 'EMOM' },
];
const migrated = Sync.migrateLegacySessions(legacy, { makeId: () => ids[idCursor++] });
assert.equal(migrated.changed, true);
assert.deepEqual(migrated.sessions.map(item => item.id), ids.slice(0, 2));
assert.ok(migrated.sessions.every(item => item.updatedAt === item.date));

const base = { id: ids[0], date: '2026-08-01T10:00:00.000Z', updatedAt: '2026-08-01T10:00:00.000Z', mode: 'Circuit' };
const richer = { ...base, exercises: ['Swing', 'Squat'], equipment: { 12: 1 } };
const later = { ...base, updatedAt: '2026-08-03T10:00:00.000Z', duration: 20 };
assert.deepEqual(Sync.mergeHistories([base], [richer]), [richer]);
const laterMerged = Sync.mergeHistories([richer], [later]);
assert.equal(laterMerged.length, 1);
assert.equal(laterMerged[0].duration, 20);
assert.deepEqual(laterMerged[0].exercises, ['Swing', 'Squat']);

const storageData = new Map();
const storage = {
  getItem: key => storageData.has(key) ? storageData.get(key) : null,
  setItem: (key, value) => storageData.set(key, value),
};
const session = { id: ids[2], date: '2026-08-04T10:00:00.000Z', updatedAt: '2026-08-04T10:00:00.000Z', mode: 'AMRAP' };
storage.setItem(Sync.HISTORY_KEY, JSON.stringify([session]));
let online = false;
const remote = new Map();
const states = [];
const client = {
  from(table) {
    assert.equal(table, 'workout_sessions');
    return {
      async upsert(rows) {
        for (const row of rows) remote.set(row.id, { ...row, updated_at: row.payload.updatedAt });
        return { error: null };
      },
      select() {
        return {
          async order() { return { data: [...remote.values()], error: null }; },
        };
      },
    };
  },
};
const manager = Sync.createHistorySync({ storage, client, isOnline: () => online, onState: state => states.push(state.status) });
manager.notifyLocalSave(session);
assert.deepEqual(manager.getQueue(), [session.id]);
await manager.setUser({ id: ids[3], email: 'test@example.com' });
assert.equal(states.at(-1), 'offline');
assert.deepEqual(JSON.parse(storage.getItem(Sync.HISTORY_KEY)), [session]);
online = true;
await manager.retry();
assert.equal(remote.size, 1);
assert.deepEqual(manager.getQueue(), []);
assert.equal(states.at(-1), 'synced');
const beforeLogout = storage.getItem(Sync.HISTORY_KEY);
await manager.setUser(null);
assert.equal(storage.getItem(Sync.HISTORY_KEY), beforeLogout);

const migrationSql = await readFile(new URL('../supabase/migrations/20260808065000_create_workout_sessions.sql', import.meta.url), 'utf8');
for (const operation of ['select', 'insert', 'update', 'delete']) {
  assert.match(migrationSql, new RegExp(`for ${operation}[\\s\\S]+auth\\.uid\\(\\)\\) = user_id`, 'i'));
}
assert.match(migrationSql, /alter table public\.workout_sessions enable row level security/i);
assert.match(migrationSql, /user_id uuid not null default auth\.uid\(\) references auth\.users\(id\)/i);
assert.match(migrationSql, /create index if not exists workout_sessions_user_completed_idx/i);

console.log(JSON.stringify({
  ok: true,
  checks: {
    legacyIdMigration: true,
    deterministicMergeNoDuplicates: true,
    richerAndLatestPayloadPreserved: true,
    offlineQueueAndRetry: true,
    logoutPreservesLocalHistory: true,
    schemaAndRlsPolicies: true,
  },
}, null, 2));
