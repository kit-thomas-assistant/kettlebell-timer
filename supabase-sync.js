(function () {
  'use strict';

  const PROJECT_URL = 'https://oquzrgjehtacfqgvnpio.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_1XgzcJU_aDvr_HOr5VfqcA_aQlU7znD';
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.55.0/dist/umd/supabase.min.js';
  const AUTH_QUERY_KEYS = ['code', 'token_hash', 'type', 'error', 'error_code', 'error_description'];
  const copy = {
    fr: {
      login: 'Connexion', account: 'Compte', titleOut: 'Synchroniser tes séances', titleIn: 'Ton compte',
      local: 'Local uniquement', loading: 'Connexion…', awaiting: 'Email envoyé', syncing: 'Synchronisation…',
      synced: 'À jour', offline: 'Hors ligne', error: 'À réessayer', unavailable: 'Cloud indisponible',
      pitch: 'Retrouve ton historique sur tous tes appareils.', emailPlaceholder: 'Email', send: 'Continuer',
      codeCopy: 'Clique sur le lien reçu ou entre le code à 6 chiffres.', codePlaceholder: '000000', verify: 'Se connecter', change: 'Changer d’email',
      sync: 'Synchroniser', signOut: 'Déconnexion', sent: email => `Email envoyé à ${email}.`, signedIn: 'Connexion réussie.',
      syncCount: count => `${count} séance${count > 1 ? 's' : ''} synchronisée${count > 1 ? 's' : ''}.`,
      queued: count => `${count} modification${count > 1 ? 's' : ''} en attente. Reprise automatique au retour du réseau.`,
      genericError: 'La synchronisation a échoué. Ton historique reste sauvegardé sur cet appareil.', invalidCode: 'Code invalide ou expiré.',
      sdkError: 'Le cloud ne répond pas. Le timer et l’historique local restent disponibles.', neverSynced: 'Aucune synchronisation réussie',
      syncedNow: 'Dernière sync à l’instant', syncedMinutes: value => `Dernière sync il y a ${value} min`,
      syncedHours: value => `Dernière sync il y a ${value} h`, syncedAt: value => `Dernière sync ${value}`,
      triggerSignedIn: name => `Compte de ${name}`, triggerSignedOut: 'Ouvrir la connexion',
    },
    en: {
      login: 'Login', account: 'Account', titleOut: 'Sync your workouts', titleIn: 'Your account',
      local: 'Local only', loading: 'Connecting…', awaiting: 'Email sent', syncing: 'Syncing…',
      synced: 'Up to date', offline: 'Offline', error: 'Retry needed', unavailable: 'Cloud unavailable',
      pitch: 'Keep your history in sync across your devices.', emailPlaceholder: 'Email', send: 'Continue',
      codeCopy: 'Use the link in your email or enter the 6-digit code.', codePlaceholder: '000000', verify: 'Log in', change: 'Change email',
      sync: 'Sync now', signOut: 'Sign out', sent: email => `Email sent to ${email}.`, signedIn: 'You are logged in.',
      syncCount: count => `${count} session${count === 1 ? '' : 's'} synced.`,
      queued: count => `${count} change${count === 1 ? '' : 's'} queued. Sync will resume when the network returns.`,
      genericError: 'Sync failed. Your history is still saved on this device.', invalidCode: 'Invalid or expired code.',
      sdkError: 'Cloud is not responding. The timer and local history remain available.', neverSynced: 'No successful sync yet',
      syncedNow: 'Last synced just now', syncedMinutes: value => `Last synced ${value} min ago`,
      syncedHours: value => `Last synced ${value} hr ago`, syncedAt: value => `Last synced ${value}`,
      triggerSignedIn: name => `${name}'s account`, triggerSignedOut: 'Open login',
    },
  };

  const ui = { status: 'loading', user: null, pendingEmail: '', message: '', messageError: false, count: 0, queued: 0, lastSyncedAt: null };
  let client = null;
  let manager = null;

  const $ = id => document.getElementById(id);
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'fr';
  const tr = key => copy[language()][key];

  function cleanRedirectUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }

  function hasAuthCallback() {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    return AUTH_QUERY_KEYS.some(key => query.has(key)) || ['access_token', 'refresh_token', 'error', 'error_description'].some(key => hash.has(key));
  }

  function cleanAuthCallbackUrl() {
    const url = new URL(window.location.href);
    AUTH_QUERY_KEYS.forEach(key => url.searchParams.delete(key));
    url.hash = '';
    const search = url.searchParams.toString();
    window.history.replaceState(window.history.state, '', `${url.pathname}${search ? `?${search}` : ''}`);
  }

  function displayName(user) {
    const metadata = user?.user_metadata || {};
    const candidate = metadata.full_name || metadata.name || metadata.display_name || metadata.preferred_username;
    if (typeof candidate === 'string' && candidate.trim()) return candidate.trim();
    const localPart = String(user?.email || '').split('@')[0];
    return localPart || tr('account');
  }

  function visualStatus() {
    if (ui.status === 'synced') return { label: tr('synced'), className: 'is-ok' };
    if (ui.status === 'syncing' || ui.status === 'loading') return { label: tr(ui.status), className: 'is-busy' };
    if (ui.status === 'offline') return { label: tr('offline'), className: 'is-warn' };
    if (ui.status === 'error' || ui.status === 'unavailable') return { label: tr(ui.status), className: 'is-error' };
    if (ui.pendingEmail) return { label: tr('awaiting'), className: 'is-busy' };
    return { label: tr('local'), className: '' };
  }

  function formatLastSync(value) {
    const timestamp = Date.parse(value || '');
    if (!Number.isFinite(timestamp)) return tr('neverSynced');
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
    if (elapsedMinutes < 1) return tr('syncedNow');
    if (elapsedMinutes < 60) return tr('syncedMinutes')(elapsedMinutes);
    const hours = Math.floor(elapsedMinutes / 60);
    if (hours < 24) return tr('syncedHours')(hours);
    const formatter = new Intl.DateTimeFormat(language() === 'fr' ? 'fr-FR' : 'en-GB', { dateStyle: 'medium', timeStyle: 'short' });
    return tr('syncedAt')(formatter.format(new Date(timestamp)));
  }

  function setText(id, value) { const element = $(id); if (element) element.textContent = value; }

  function setPopover(open, focus = true) {
    const popover = $('account-popover');
    const trigger = $('account-trigger');
    if (!popover || !trigger) return;
    popover.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open && focus) {
      window.setTimeout(() => {
        const target = ui.user ? $('history-sync-now') : ui.pendingEmail ? $('history-auth-token') : $('history-auth-email');
        target?.focus();
      }, 0);
    }
  }

  function renderState() {
    const status = visualStatus();
    const name = displayName(ui.user);
    setText('account-popover-title', ui.user ? tr('titleIn') : tr('titleOut'));
    setText('history-sync-state', status.label);
    setText('account-sync-status', status.label);
    setText('history-sync-copy', tr('pitch'));
    setText('history-code-copy', tr('codeCopy'));
    setText('history-email-submit', tr('send'));
    setText('history-code-submit', tr('verify'));
    setText('history-change-email', tr('change'));
    setText('history-sync-now', tr('sync'));
    setText('history-sign-out', tr('signOut'));
    setText('account-trigger-name', ui.user ? name : tr('login'));
    setText('history-account-name', name);
    setText('history-account-email', ui.user?.email || '');
    setText('account-last-sync', formatLastSync(ui.lastSyncedAt));
    const trigger = $('account-trigger');
    if (trigger) trigger.setAttribute('aria-label', ui.user ? tr('triggerSignedIn')(name) : tr('triggerSignedOut'));
    const triggerIcon = trigger?.querySelector('.account-trigger-icon');
    if (triggerIcon) triggerIcon.textContent = ui.user ? name.charAt(0).toLocaleUpperCase() : '◉';

    const emailInput = $('history-auth-email');
    const codeInput = $('history-auth-token');
    if (emailInput) emailInput.placeholder = tr('emailPlaceholder');
    if (codeInput) codeInput.placeholder = tr('codePlaceholder');
    const dot = $('history-sync-dot');
    if (dot) dot.className = `history-sync-dot ${status.className}`.trim();
    const signedOut = $('history-auth-signed-out');
    const code = $('history-auth-code');
    const account = $('history-auth-account');
    if (signedOut) signedOut.hidden = Boolean(ui.user || ui.pendingEmail);
    if (code) code.hidden = Boolean(ui.user || !ui.pendingEmail);
    if (account) account.hidden = !ui.user;

    const message = ui.message || (ui.status === 'offline' && ui.queued ? tr('queued')(ui.queued) : '');
    setText('history-sync-message', message);
    const messageElement = $('history-sync-message');
    if (messageElement) messageElement.classList.toggle('is-error', ui.messageError || ui.status === 'error' || ui.status === 'unavailable');
    document.querySelectorAll('.history-sync-button, #history-auth-email, #history-auth-token').forEach(control => {
      control.disabled = !client || ui.status === 'syncing' || ui.status === 'loading' || ui.status === 'unavailable' || (!ui.user && ui.status === 'offline');
    });
  }

  function onManagerState(next) {
    ui.status = next.status;
    ui.user = next.user || null;
    ui.count = next.count || 0;
    ui.queued = next.queued || 0;
    ui.lastSyncedAt = next.lastSyncedAt || null;
    if (['signed-out', 'syncing', 'synced'].includes(next.status)) {
      if (next.status !== 'synced') ui.message = '';
      ui.messageError = false;
    }
    if (next.status === 'synced') ui.message = tr('syncCount')(ui.count);
    if (next.status === 'error') {
      ui.message = tr('genericError');
      ui.messageError = true;
    }
    renderState();
  }

  function loadSdk() {
    if (window.supabase?.createClient) return Promise.resolve(window.supabase);
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SDK_URL;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => window.supabase?.createClient ? resolve(window.supabase) : reject(new Error('Supabase SDK missing'));
      script.onerror = () => reject(new Error('Supabase SDK unavailable'));
      document.head.appendChild(script);
    });
  }

  async function initialize() {
    const authCallback = hasAuthCallback();
    renderState();
    try {
      const sdk = await loadSdk();
      client = sdk.createClient(PROJECT_URL, PUBLISHABLE_KEY, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
      });
      manager = window.KettlebellHistorySync.createHistorySync({
        storage: localStorage,
        client,
        onHistory: () => {
          if (typeof window.renderConsistency === 'function') window.renderConsistency();
          if ($('history-modal')?.style.display === 'flex' && typeof window.showHistory === 'function') window.showHistory();
        },
        onState: onManagerState,
      });
      manager.migrateLocal();
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      const sessionUser = data.session?.user || null;
      ui.user = sessionUser;
      if (sessionUser && authCallback) cleanAuthCallbackUrl();
      await manager.setUser(sessionUser).catch(() => {});
      client.auth.onAuthStateChange((_event, session) => {
        window.setTimeout(() => {
          ui.user = session?.user || null;
          if (ui.user) {
            ui.pendingEmail = '';
            if (hasAuthCallback()) cleanAuthCallbackUrl();
          }
          manager.setUser(ui.user).catch(() => {});
          renderState();
        }, 0);
      });
      if (authCallback) setPopover(true, false);
    } catch (_error) {
      ui.status = navigator.onLine === false ? 'offline' : 'unavailable';
      ui.message = tr('sdkError');
      ui.messageError = true;
      renderState();
      if (hasAuthCallback()) setPopover(true, false);
    }
  }

  $('account-trigger')?.addEventListener('click', () => setPopover($('account-popover')?.hidden !== false));
  document.addEventListener('click', event => {
    if ($('account-popover')?.hidden === false && !event.target.closest('.header-actions')) setPopover(false, false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && $('account-popover')?.hidden === false) {
      setPopover(false, false);
      $('account-trigger')?.focus();
    }
  });

  $('history-email-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!client) return;
    const email = $('history-auth-email').value.trim();
    if (!email) return;
    ui.status = 'syncing'; ui.message = ''; ui.messageError = false; renderState();
    const { error } = await client.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true, emailRedirectTo: cleanRedirectUrl() },
    });
    if (error) {
      ui.status = 'error'; ui.message = error.message || tr('genericError'); ui.messageError = true;
    } else {
      ui.status = 'signed-out'; ui.pendingEmail = email; ui.message = tr('sent')(email); ui.messageError = false;
      window.setTimeout(() => $('history-auth-token')?.focus(), 0);
    }
    renderState();
  });

  $('history-code-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!client || !ui.pendingEmail) return;
    const token = $('history-auth-token').value.replace(/\D/g, '').slice(0, 6);
    if (token.length !== 6) return;
    ui.status = 'syncing'; ui.message = ''; ui.messageError = false; renderState();
    const { data, error } = await client.auth.verifyOtp({ email: ui.pendingEmail, token, type: 'email' });
    if (error || !data.session?.user) {
      ui.status = 'error'; ui.message = tr('invalidCode'); ui.messageError = true; renderState(); return;
    }
    ui.user = data.session.user; ui.pendingEmail = ''; ui.message = tr('signedIn'); ui.messageError = false;
    await manager.setUser(ui.user).catch(() => {});
    renderState();
  });

  $('history-change-email')?.addEventListener('click', () => {
    ui.pendingEmail = ''; ui.status = 'signed-out'; ui.message = ''; ui.messageError = false; renderState();
    window.setTimeout(() => $('history-auth-email')?.focus(), 0);
  });
  $('history-sync-now')?.addEventListener('click', () => manager?.retry().catch(() => {}));
  $('history-sign-out')?.addEventListener('click', async () => {
    if (!client) return;
    await client.auth.signOut();
    ui.user = null; ui.pendingEmail = ''; ui.status = 'signed-out'; ui.message = ''; ui.messageError = false; ui.lastSyncedAt = null;
    await manager.setUser(null);
    renderState();
  });
  window.addEventListener('online', () => manager?.retry().catch(() => {}));
  window.addEventListener('offline', () => {
    if (ui.user) { ui.status = 'offline'; ui.queued = manager?.getQueue().length || 0; renderState(); }
  });
  window.addEventListener('kb:language', renderState);
  window.setInterval(() => { if (ui.user && $('account-popover')?.hidden === false) renderState(); }, 60000);

  window.KettlebellCloudSync = {
    renderState,
    notifyLocalSave(session) { manager?.notifyLocalSave(session); },
    retry() { return manager?.retry(); },
    getState() { return { ...ui }; },
    getRedirectUrl: cleanRedirectUrl,
    getDisplayName: displayName,
    cleanAuthCallbackUrl,
  };

  initialize();
})();
