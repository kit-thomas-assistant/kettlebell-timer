#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-achievement-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const scriptAssets = new Set(['/history-sync.js', '/workout-stats.js', '/supabase-sync.js']);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = scriptAssets.has(pathname) ? pathname.slice(1) : 'index.html';
  response.setHeader('Content-Type', asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, pageUrl,
], { stdio: 'ignore' });

const wait = ms => new Promise(resolveWait => setTimeout(resolveWait, ms));
async function getDebugPage() {
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

let cdpId = 1;
function call(websocket, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = cdpId++;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      websocket.removeEventListener('message', onMessage);
      if (message.error || message.result?.exceptionDetails) reject(new Error(JSON.stringify(message.error || message.result?.exceptionDetails)));
      else resolveCall(message.result);
    };
    websocket.addEventListener('message', onMessage);
    websocket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(websocket, expression) {
  const result = await call(websocket, 'Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return result.result.value;
}

try {
  const page = await getDebugPage();
  const websocket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    websocket.addEventListener('open', resolveOpen, { once: true });
    websocket.addEventListener('error', reject, { once: true });
  });
  await wait(400);

  const flow = await evaluate(websocket, `(async () => {
    localStorage.clear();
    setLang('fr');
    const now = new Date();
    const thisMonday = localWeekStart(now);
    const previousMonday = addLocalDays(thisMonday, -7);
    const session = (date, id) => ({ id, date: date.toISOString(), updatedAt: date.toISOString(), mode: 'Circuit', modeId: 'circuit', duration: 20, exercises: ['Goblet Squat'] });
    const history = [
      session(addLocalDays(thisMonday, 0), 'current-1'),
      session(addLocalDays(thisMonday, 0), 'current-2'),
      session(addLocalDays(previousMonday, 0), 'previous-1'),
      session(addLocalDays(previousMonday, 1), 'previous-2'),
      session(addLocalDays(previousMonday, 2), 'previous-3'),
    ];
    localStorage.setItem('kb_history', JSON.stringify(history));

    selectedMode = 'amrap';
    selectedMin = 12;
    selectedGuidedRecipe = AMRAP_PRESETS.fullBodyDensity;
    sessionExercises = AMRAP_PRESETS.fullBodyDensity.exercises.map(exercise => exercise.name);
    sessionSaved = false;
    activeSessionId = null;
    finisherCompleted = false;
    completeMainSession({ workSteps: AMRAP_PRESETS.fullBodyDensity.exercises, workSeconds: 600, metadata: { roundsCompleted: 2, runner: 'manual-sequence' } });

    const again = document.getElementById('again-btn');
    const againHiddenBeforeFinal = document.getElementById('done').dataset.stage === 'offer'
      && document.getElementById('finisher-offer').classList.contains('visible')
      && again.getClientRects().length === 0;

    document.getElementById('finisher-skip').click();
    await new Promise(requestAnimationFrame);
    const skipOpensAchievement = document.getElementById('done').dataset.stage === 'achievement'
      && getComputedStyle(document.getElementById('achievement-panel')).display !== 'none'
      && document.activeElement === document.getElementById('achievement-done');
    const historyBackedStats = document.getElementById('achievement-week-value').textContent.includes('3 / 3')
      && document.getElementById('achievement-streak-value').textContent === '2'
      && document.getElementById('achievement-total-value').textContent === '6'
      && document.querySelectorAll('#achievement-heatmap .achievement-day').length === 42;

    const selected = ACHIEVEMENT_VARIANTS.map((variant, index) => selectAchievementVariant(index));
    const tenVariantsSelectable = ACHIEVEMENT_VARIANTS.length === 10
      && new Set(ACHIEVEMENT_VARIANTS).size === 10
      && selected.join('|') === ACHIEVEMENT_VARIANTS.join('|')
      && document.getElementById('achievement-panel').dataset.celebration === ACHIEVEMENT_VARIANTS[9];

    startSequenceRunner('finisher', ARMS_FINISHER);
    clearInterval(timerInterval);
    runnerRoundsCompleted = finisherRounds;
    completeSequenceRunner();
    await new Promise(requestAnimationFrame);
    const finisherSuccessOpensAchievement = document.getElementById('done').dataset.stage === 'achievement'
      && readHistory().find(item => item.id === activeSessionId)?.finisher?.completed === true
      && !document.getElementById('finisher-recap').hidden;

    setLang('en');
    renderAchievement(now, false);
    const englishWorks = document.getElementById('achievement-kicker').textContent === 'Workout logged'
      && document.getElementById('achievement-done').textContent === 'Done'
      && document.getElementById('again-btn').textContent === 'Go again?'
      && document.getElementById('achievement-history-title').textContent === 'Your last 6 weeks';
    setLang('fr');
    renderAchievement(now, false);
    const frenchWorks = document.getElementById('achievement-kicker').textContent === 'Séance validée'
      && document.getElementById('achievement-done').textContent === 'Terminé';

    document.getElementById('again-btn').click();
    await new Promise(requestAnimationFrame);
    const againButtonWorks = document.getElementById('setup').style.display === 'flex'
      && document.activeElement === document.getElementById('go-btn');
    showAchievement({ focus: false });
    document.getElementById('achievement-done').click();
    const doneButtonWorks = document.getElementById('setup').style.display === 'flex';

    return { againHiddenBeforeFinal, skipOpensAchievement, historyBackedStats, tenVariantsSelectable, finisherSuccessOpensAchievement, englishWorks, frenchWorks, againButtonWorks, doneButtonWorks };
  })()`);

  if (process.env.KB_ACHIEVEMENT_SCREENSHOT) {
    await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 900, height: 1000, deviceScaleFactor: 1, mobile: false });
    await evaluate(websocket, `(() => {
      setLang('fr');
      showAchievement({ focus: false });
      window.scrollTo(0, 0);
    })()`);
    await wait(950);
    const screenshot = await call(websocket, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(process.env.KB_ACHIEVEMENT_SCREENSHOT, Buffer.from(screenshot.data, 'base64'));
    console.log(`Achievement screenshot: ${process.env.KB_ACHIEVEMENT_SCREENSHOT}`);
  }

  await call(websocket, 'Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const reduced = await evaluate(websocket, `(() => {
    showAchievement({ focus: false });
    selectAchievementVariant(0);
    return {
      reducedMotionWorks: matchMedia('(prefers-reduced-motion: reduce)').matches
        && !document.getElementById('achievement-panel').classList.contains('is-celebrating')
        && getComputedStyle(document.getElementById('achievement-fx')).display === 'none',
    };
  })()`);
  await call(websocket, 'Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(websocket, `(() => {
    showAchievement({ focus: false });
    const panel = document.getElementById('achievement-panel');
    const rect = panel.getBoundingClientRect();
    return {
      mobile320Works: panel.scrollWidth <= panel.clientWidth
        && rect.left >= 0
        && rect.right <= document.documentElement.clientWidth
        && document.documentElement.scrollWidth <= 320,
    };
  })()`);
  if (process.env.KB_ACHIEVEMENT_MOBILE_SCREENSHOT) {
    await wait(950);
    const screenshot = await call(websocket, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(process.env.KB_ACHIEVEMENT_MOBILE_SCREENSHOT, Buffer.from(screenshot.data, 'base64'));
    console.log(`Achievement mobile screenshot: ${process.env.KB_ACHIEVEMENT_MOBILE_SCREENSHOT}`);
  }

  const combined = { ...flow, ...reduced, ...mobile };
  console.log(JSON.stringify(combined, null, 2));
  if (Object.values(combined).some(value => value !== true)) process.exitCode = 1;
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
