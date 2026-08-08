(function () {
  'use strict';

  const PROJECT_URL = 'https://oquzrgjehtacfqgvnpio.supabase.co';
  const PUBLISHABLE_KEY = 'sb_publishable_1XgzcJU_aDvr_HOr5VfqcA_aQlU7znD';
  const SDK_URL = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.55.0/dist/umd/supabase.min.js';
  const copy = {
    fr: {
      heading: 'Sauvegarde cloud', local: 'Local uniquement', loading: 'Connexion…', signedOut: 'Optionnelle', awaiting: 'Code envoyé',
      syncing: 'Synchronisation…', synced: 'À jour', offline: 'Hors ligne', error: 'À réessayer', unavailable: 'Cloud indisponible',
      pitch: 'Optionnel. Reprends ton historique sur tes autres appareils.', emailPlaceholder: 'Email', send: 'Recevoir le code',
      codeCopy: 'Entre le code à 6 chiffres reçu par email.', codePlaceholder: '000000', verify: 'Synchroniser', change: 'Changer d’email',
      sync: 'Synchroniser', signOut: 'Déconnexion', sent: email => `Code envoyé à ${email}.`, signedIn: 'Historique sauvegardé dans le cloud.',
      syncCount: count => `${count} séance${count > 1 ? 's' : ''} synchronisée${count > 1 ? 's' : ''}.`,
      queued: count => `${count} modification${count > 1 ? 's' : ''} en attente. Reprise automatique au retour du réseau.`,
      genericError: 'La synchronisation a échoué. Ton historique reste sauvegardé sur cet appareil.', invalidCode: 'Code invalide ou expiré.',
      sdkError: 'Le cloud ne répond pas. Le timer et l’historique local restent disponibles.', pillLocal: 'Local', pillCloud: 'Cloud à jour', pillSync: 'Sync…', pillOffline: 'Hors ligne', pillError: 'Sync en attente',
    },
    en: {
      heading: 'Cloud backup', local: 'Local only', loading: 'Connecting…', signedOut: 'Optional', awaiting: 'Code sent',
      syncing: 'Syncing…', synced: 'Up to date', offline: 'Offline', error: 'Retry needed', unavailable: 'Cloud unavailable',
      pitch: 'Optional. Resume your history on your other devices.', emailPlaceholder: 'Email', send: 'Send code',
      codeCopy: 'Enter the 6-digit code sent to your email.', codePlaceholder: '000000', verify: 'Sync', change: 'Change email',
      sync: 'Sync now', signOut: 'Sign out', sent: email => `Code sent to ${email}.`, signedIn: 'History is backed up to the cloud.',
      syncCount: count => `${count} session${count === 1 ? '' : 's'} synced.`,
      queued: count => `${count} change${count === 1 ? '' : 's'} queued. Sync will resume when the network returns.`,
      genericError: 'Sync failed. Your history is still saved on this device.', invalidCode: 'Invalid or expired code.',
      sdkError: 'Cloud is not responding. The timer and local history remain available.', pillLocal: 'Local', pillCloud: 'Cloud up to date', pillSync: 'Syncing…', pillOffline: 'Offline', pillError: 'Sync queued',
    },
  };

  const ui = { status: 'loading', user: null, pendingEmail: '', message: '', messageError: false, count: 0, queued: 0 };
  let client = null;
  let manager = null;

  const $ = id => document.getElementById(id);
  const language = () => document.documentElement.lang === 'en' ? 'en' : 'fr';
  const tr = key => copy[language()][key];

  function visualStatus() {
    if (ui.status === 'synced') return { label: tr('synced'), className: 'is-ok' };
    if (ui.status === 'syncing' || ui.status === 'loading') return { label: tr(ui.status), className: 'is-busy' };
    if (ui.status === 'offline') return { label: tr('offline'), className: 'is-warn' };
    if (ui.status === 'error' || ui.status === 'unavailable') return { label: tr(ui.status), className: 'is-error' };
    if (ui.pendingEmail) return { label: tr('awaiting'), className: 'is-busy' };
    return { label: ui.user ? tr('signedIn') : tr('signedOut'), className: '' };
  }

  function setText(id, value) { const element = $(id); if (element) element.textContent = value; }

  function renderState() {
    const status = visualStatus();
    setText('history-sync-heading', tr('heading'));
    setText('history-sync-state', status.label);
    setText('history-sync-copy', tr('pitch'));
    setText('history-code-copy', tr('codeCopy'));
    setText('history-email-submit', tr('send'));
    setText('history-code-submit', tr('verify'));
    setText('history-change-email', tr('change'));
    setText('history-sync-now', tr('sync'));
    setText('history-sign-out', tr('signOut'));
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
    setText('history-account-email', ui.user?.email || '');
    const message = ui.message || (ui.status === 'synced' ? tr('syncCount')(ui.count) : ui.status === 'offline' && ui.queued ? tr('queued')(ui.queued) : '');
    setText('history-sync-message', message);
    const messageElement = $('history-sync-message');
    if (messageElement) messageElement.classList.toggle('is-error', ui.messageError || ui.status === 'error' || ui.status === 'unavailable');
    document.querySelectorAll('.history-sync-button').forEach(button => { button.disabled = ui.status === 'syncing' || ui.status === 'loading'; });

    const pill = $('history-sync-pill');
    if (pill) {
      const pillMap = ui.status === 'synced' ? ['pillCloud', 'is-ok']
        : ui.status === 'syncing' ? ['pillSync', 'is-busy']
          : ui.status === 'offline' ? ['pillOffline', 'is-warn']
            : (ui.status === 'error' || ui.status === 'unavailable') ? ['pillError', 'is-error']
              : ['pillLocal', ''];
      pill.textContent = tr(pillMap[0]);
      pill.className = `history-sync-pill ${pillMap[1]}`.trim();
      pill.hidden = false;
    }
  }

  function onManagerState(next) {
    ui.status = next.status;
    ui.user = next.user || null;
    ui.count = next.count || 0;
    ui.queued = next.queued || 0;
    if (['signed-out', 'syncing', 'synced'].includes(next.status)) {
      ui.message = next.status === 'signed-out' ? '' : ui.message;
      ui.messageError = false;
    }
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
      await manager.setUser(sessionUser).catch(() => {});
      client.auth.onAuthStateChange((_event, session) => {
        window.setTimeout(() => {
          ui.user = session?.user || null;
          if (ui.user) ui.pendingEmail = '';
          manager.setUser(ui.user).catch(() => {});
          renderState();
        }, 0);
      });
    } catch (_error) {
      ui.status = navigator.onLine === false ? 'offline' : 'unavailable';
      ui.message = tr('sdkError');
      ui.messageError = true;
      renderState();
    }
  }

  $('history-email-form')?.addEventListener('submit', async event => {
    event.preventDefault();
    if (!client) return;
    const email = $('history-auth-email').value.trim();
    if (!email) return;
    ui.status = 'syncing'; ui.message = ''; ui.messageError = false; renderState();
    const { error } = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
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
    ui.user = null; ui.pendingEmail = ''; ui.status = 'signed-out'; ui.message = ''; ui.messageError = false;
    await manager.setUser(null);
    renderState();
  });
  window.addEventListener('online', () => manager?.retry().catch(() => {}));
  window.addEventListener('offline', () => {
    if (ui.user) { ui.status = 'offline'; ui.queued = manager?.getQueue().length || 0; renderState(); }
  });
  window.addEventListener('kb:language', renderState);

  window.KettlebellCloudSync = {
    renderState,
    notifyLocalSave(session) { manager?.notifyLocalSave(session); },
    retry() { return manager?.retry(); },
    getState() { return { ...ui }; },
  };

  initialize();
})();
