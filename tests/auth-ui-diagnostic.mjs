#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-auth-ui-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const mockSdk = `<script>
(() => {
  let authListener = () => {};
  let session = null;
  const remote = {};
  const unavailable = new URLSearchParams(location.search).has('unavailable');
  const client = {
    auth: {
      getSession: async () => { if (unavailable) throw new Error('network unavailable'); return { data: { session }, error: null }; },
      onAuthStateChange: callback => { authListener = callback; return { data: { subscription: { unsubscribe() {} } } }; },
      signInWithOtp: async ({ email }) => { window.__otpEmail = email; return { data: { user: null, session: null }, error: null }; },
      verifyOtp: async ({ email, token }) => {
        if (email !== window.__otpEmail || token !== '123456') return { data: {}, error: new Error('invalid') };
        session = { user: { id: '20000000-0000-4000-8000-000000000001', email } };
        authListener('SIGNED_IN', session);
        return { data: { session, user: session.user }, error: null };
      },
      signOut: async () => { session = null; authListener('SIGNED_OUT', null); return { error: null }; },
    },
    from: () => ({
      upsert: async rows => { rows.forEach(row => { remote[row.id] = { ...row, updated_at: row.payload.updatedAt }; }); return { error: null }; },
      select: () => ({ order: async () => ({ data: Object.values(remote), error: null }) }),
    }),
  };
  window.supabase = { createClient: () => client };
})();
</script>`;

const server = createServer(async (request, response) => {
  const url = new URL(request.url, 'http://localhost');
  const pathname = url.pathname;
  if (pathname === '/history-sync.js' || pathname === '/supabase-sync.js') {
    response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
    response.end(await readFile(resolve(pathname.slice(1))));
    return;
  }
  const html = await readFile(resolve('index.html'), 'utf8');
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(html.replace('</head>', `${mockSdk}</head>`));
});
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, pageUrl,
], { stdio: 'ignore' });
const wait = ms => new Promise(resolveWait => setTimeout(resolveWait, ms));

async function getPage() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const pages = await fetch(`http://127.0.0.1:${debugPort}/json`).then(response => response.json());
      const page = pages.find(item => item.type === 'page' && item.url.includes('index.html'));
      if (page) return page;
    } catch {}
    await wait(100);
  }
  throw new Error('Chromium did not expose a debug page');
}

let callId = 1;
function cdp(ws, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = callId++;
    const listener = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      ws.removeEventListener('message', listener);
      if (message.error || message.result?.exceptionDetails) reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      else resolveCall(message.result);
    };
    ws.addEventListener('message', listener);
    ws.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(ws, expression) {
  const result = await cdp(ws, 'Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return result.result.value;
}

async function capture(ws, name, width, height) {
  await cdp(ws, 'Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 500 });
  const result = await cdp(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const directory = resolve('artifacts/qa/auth');
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, name), Buffer.from(result.data, 'base64'));
}

try {
  const page = await getPage();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => { ws.addEventListener('open', resolveOpen, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  const consoleErrors = [];
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') consoleErrors.push(message.params.exceptionDetails?.text || 'exception');
    if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') consoleErrors.push('console.error');
  });
  await cdp(ws, 'Runtime.enable');
  await wait(500);

  const available = await evaluate(ws, `(async () => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    showHistory();
    await sleep(20);
    const signedOut = !document.getElementById('history-auth-signed-out').hidden
      && document.getElementById('history-auth-account').hidden
      && getComputedStyle(document.getElementById('history-auth-account')).display === 'none';
    document.getElementById('history-auth-email').value = 'athlete@example.com';
    document.getElementById('history-email-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await sleep(30);
    const awaitingCode = !document.getElementById('history-auth-code').hidden
      && document.getElementById('history-auth-signed-out').hidden
      && getComputedStyle(document.getElementById('history-auth-signed-out')).display === 'none';
    document.getElementById('history-auth-token').value = '123456';
    document.getElementById('history-code-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await sleep(80);
    const signedIn = !document.getElementById('history-auth-account').hidden
      && getComputedStyle(document.getElementById('history-auth-account')).display !== 'none'
      && window.KettlebellCloudSync.getState().user?.email === 'athlete@example.com';
    const originalNotify = window.KettlebellCloudSync.notifyLocalSave;
    let localFirst = false;
    window.KettlebellCloudSync.notifyLocalSave = saved => {
      localFirst = JSON.parse(localStorage.getItem('kb_history') || '[]').some(item => item.id === saved.id);
    };
    const id = saveSession('circuit', 10, ['Kettlebell Swing']);
    window.KettlebellCloudSync.notifyLocalSave = originalNotify;
    const validUuid = /^[0-9a-f-]{36}$/i.test(id);
    const beforeLogout = localStorage.getItem('kb_history');
    document.getElementById('history-sign-out').click();
    await sleep(50);
    const logoutPreserved = beforeLogout === localStorage.getItem('kb_history')
      && !document.getElementById('history-auth-signed-out').hidden;
    setLang('en');
    const english = document.getElementById('history-email-submit').textContent === 'Send code';
    return { signedOut, awaitingCode, signedIn, localFirst, validUuid, logoutPreserved, english };
  })()`);

  await evaluate(ws, `(async () => {
    const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
    setLang('fr');
    showHistory();
    document.getElementById('history-auth-email').value = 'athlete@example.com';
    document.getElementById('history-email-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await sleep(20);
    document.getElementById('history-auth-token').value = '123456';
    document.getElementById('history-code-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await sleep(80);
  })()`);
  await capture(ws, 'history-sync-desktop-1440.png', 1440, 900);
  await capture(ws, 'history-sync-mobile-390.png', 390, 844);
  await capture(ws, 'history-sync-mobile-320.png', 320, 800);
  await evaluate(ws, `(() => {
    closeHistory();
    selectedMode = 'circuit';
    showCircuitPreview();
    buildWorkout();
    showTimer();
    clearInterval(timerInterval);
  })()`);
  await capture(ws, 'timer-desktop-1440.png', 1440, 900);
  await capture(ws, 'timer-mobile-390.png', 390, 844);
  await capture(ws, 'timer-mobile-320.png', 320, 800);

  await cdp(ws, 'Page.navigate', { url: `${pageUrl}?unavailable=1` });
  await wait(500);
  const unavailable = await evaluate(ws, `({
    state: window.KettlebellCloudSync.getState().status,
    setupVisible: getComputedStyle(document.getElementById('setup')).display !== 'none',
    historyPreserved: JSON.parse(localStorage.getItem('kb_history') || '[]').length > 0,
    messageVisible: document.getElementById('history-sync-message').textContent.length > 0,
    signedInControlsHidden: getComputedStyle(document.getElementById('history-auth-account')).display === 'none'
  })`);
  await evaluate(ws, `showHistory()`);
  await capture(ws, 'history-sync-unavailable-390.png', 390, 844);
  const checks = { ...available, unavailableFallback: unavailable.state === 'unavailable' && unavailable.setupVisible && unavailable.historyPreserved && unavailable.messageVisible && unavailable.signedInControlsHidden, noConsoleErrors: consoleErrors.length === 0 };
  const failures = Object.entries(checks).filter(([, value]) => !value).map(([key]) => key);
  console.log(JSON.stringify({ ok: failures.length === 0, checks, consoleErrors }, null, 2));
  if (failures.length) throw new Error(`Auth UI diagnostics failed: ${failures.join(', ')}`);
} finally {
  browser.kill('SIGTERM');
  server.close();
}
