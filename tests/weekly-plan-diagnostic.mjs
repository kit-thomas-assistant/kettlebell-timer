#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-week-plan-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = ['/motion-rigs-v2.js', '/history-sync.js', '/workout-stats.js', '/supabase-sync.js'].includes(pathname)
    ? pathname.slice(1) : 'index.html';
  response.setHeader('Content-Type', asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--password-store=basic', '--use-mock-keychain',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, pageUrl,
], { stdio: 'ignore' });
const wait = ms => new Promise(done => setTimeout(done, ms));

async function debugPage() {
  for (let attempt = 0; attempt < 60; attempt++) {
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
function call(ws, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = cdpId++;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      ws.removeEventListener('message', onMessage);
      if (message.error || message.result?.exceptionDetails) reject(new Error(JSON.stringify(message.error || message.result?.exceptionDetails)));
      else resolveCall(message.result);
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(ws, expression) {
  const result = await call(ws, 'Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return result.result.value;
}

try {
  const page = await debugPage();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((open, reject) => {
    ws.addEventListener('open', open, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  await wait(400);

  const result = await evaluate(ws, `(() => {
    localStorage.clear();
    setLang('fr');
    equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, weight === 12 ? 1 : 0]));
    saveEquipmentInventory();
    selectedMode = 'circuit'; selectedMin = 20; selectedLevel = 'inter';
    updatePreview();

    const card = document.getElementById('weekly-plan-card');
    const zeroHistoryQuickStartWorks = !card.hidden
      && document.getElementById('weekly-plan-action').textContent.includes('Préparer')
      && document.getElementById('go-btn').textContent.includes('Voir le circuit');

    const plan = createWeeklyPlan();
    const firstSnapshot = localStorage.getItem(WEEKLY_PLAN_STORAGE_KEY);
    renderWeeklyPlanCard(); updatePreview();
    const stableSnapshot = localStorage.getItem(WEEKLY_PLAN_STORAGE_KEY);
    const planShapeWorks = plan.version === 2
      && plan.sessions.length === 3
      && plan.sessions.every((session, index) => session.slot === index + 1 && session.source === 'planned' && session.exercises.length === 6)
      && firstSnapshot === stableSnapshot;
    const plannedCapsWork = plan.sessions.every(session => {
      const counts = circuitStressCounts(session.exercises);
      return (counts['horizontal-push'] || 0) <= 1
        && (counts['horizontal-push'] || 0) + (counts['vertical-push'] || 0) <= 2;
    });

    let generatedCapsWork = true;
    activeGroups = new Set(['upper', 'lower', 'full', 'core']);
    for (let i = 0; i < 100; i++) {
      const generated = pickCircuitExercises(6, i % 2 ? 'beginner' : 'inter', activeGroups);
      const counts = circuitStressCounts(generated);
      generatedCapsWork &&= (counts['horizontal-push'] || 0) <= 1
        && (counts['horizontal-push'] || 0) + (counts['vertical-push'] || 0) <= 2;
    }

    const oldId = plan.id;
    const rebuilt = createWeeklyPlan(new Date(), { force: true });
    const explicitRegenerationWorks = rebuilt.id !== oldId
      && document.getElementById('weekly-plan-regenerate').hidden === false;
    renderWeeklyPlanCard();
    launchWeeklyPlanSession(rebuilt, rebuilt.sessions[0]);
    const launchWorks = activeWeeklyPlanSession?.slot === 1
      && bodyweightPlanSignature(pickedCircuitExercises) === bodyweightPlanSignature(rebuilt.sessions[0].exercises)
      && document.getElementById('cp-regenerate').style.display === 'none'
      && document.getElementById('cp-lane-badge').textContent.includes('Plan hebdo');

    saveSession('circuit', rebuilt.duration, rebuilt.sessions[0].exercises, {
      weeklyPlanId: rebuilt.id, weeklyPlanSlot: 1,
    });
    renderWeeklyPlanCard();
    const completionWorks = weeklyPlanCompletedSlots(rebuilt).has(1)
      && document.getElementById('weekly-plan-action').textContent.includes('2/3')
      && document.getElementById('weekly-plan-regenerate').hidden;

    launchWeeklyPlanSession(rebuilt, rebuilt.sessions[1]);
    const frozenBefore = localStorage.getItem(WEEKLY_PLAN_STORAGE_KEY);
    regenerateCircuit();
    const frozenPlanWorks = localStorage.getItem(WEEKLY_PLAN_STORAGE_KEY) === frozenBefore
      && bodyweightPlanSignature(pickedCircuitExercises) === bodyweightPlanSignature(rebuilt.sessions[1].exercises);

    showOnly('setup');
    document.getElementById('go-btn').click();
    const freeRouteStillWorks = activeWeeklyPlanSession === null
      && document.getElementById('circuit-preview').style.display === 'flex';

    localStorage.removeItem(WEEKLY_PLAN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_WEEKLY_PLAN_STORAGE_KEY);
    const monday = localWeekStart(new Date());
    monday.setHours(9, 0, 0, 0);
    const mondaySession = {
      id: crypto.randomUUID(),
      date: monday.toISOString(),
      updatedAt: monday.toISOString(),
      mode: 'Circuit', modeId: 'circuit', duration: 20,
      exercises: ['Goblet Squat', 'Pompes inclinées', 'Suitcase Row', 'KB Romanian Deadlift', 'Dead Bug', 'Farmer Carry'],
    };
    localStorage.setItem('kb_history', JSON.stringify([mondaySession]));
    activeWeeklyPlanSession = null;
    showOnly('setup');
    renderWeeklyPlanCard();
    const recoveryOfferWorks = document.getElementById('weekly-plan-copy').textContent.includes('historique')
      && document.getElementById('weekly-plan-action').textContent.includes('Inclure')
      && !document.getElementById('weekly-plan-regenerate').hidden
      && document.getElementById('weekly-plan-regenerate').textContent.includes('3 nouvelles');

    document.getElementById('weekly-plan-action').click();
    const resumedPlan = readWeeklyPlan();
    const midweekResumeWorks = resumedPlan.version === 2
      && resumedPlan.historyAdoption === 'adopted'
      && resumedPlan.sessions[0].source === 'history'
      && resumedPlan.sessions[0].historySessionId === mondaySession.id
      && bodyweightPlanSignature(resumedPlan.sessions[0].exercises) === bodyweightPlanSignature(mondaySession.exercises)
      && resumedPlan.sessions.slice(1).every(session => session.source === 'planned' && session.exercises.length === 6)
      && weeklyPlanCompletedSlots(resumedPlan).has(1)
      && document.getElementById('weekly-plan-action').textContent.includes('2/3')
      && document.getElementById('weekly-plan-progress').textContent.includes('déjà faite');
    const resumedCapsWork = resumedPlan.sessions.slice(1).every(session => {
      const counts = circuitStressCounts(session.exercises);
      return (counts['horizontal-push'] || 0) <= 1
        && (counts['horizontal-push'] || 0) + (counts['vertical-push'] || 0) <= 2;
    });

    localStorage.removeItem(WEEKLY_PLAN_STORAGE_KEY);
    renderWeeklyPlanCard();
    document.getElementById('weekly-plan-regenerate').click();
    const freshPlan = readWeeklyPlan();
    const ignoreHistoryWorks = freshPlan.historyAdoption === 'declined'
      && freshPlan.sessions.every(session => session.source === 'planned')
      && weeklyPlanCompletedSlots(freshPlan).size === 0
      && document.getElementById('weekly-plan-action').textContent.includes('1/3');

    const legacyPlan = {
      ...freshPlan,
      version: 1,
      historyAdoption: undefined,
      sessions: freshPlan.sessions.map(({ source, ...session }) => session),
    };
    localStorage.removeItem(WEEKLY_PLAN_STORAGE_KEY);
    localStorage.setItem(LEGACY_WEEKLY_PLAN_STORAGE_KEY, JSON.stringify(legacyPlan));
    const migratedPlan = readWeeklyPlan();
    const legacyMigrationWorks = migratedPlan.version === 2
      && migratedPlan.sessions.every(session => session.source === 'planned')
      && Boolean(localStorage.getItem(WEEKLY_PLAN_STORAGE_KEY))
      && !localStorage.getItem(LEGACY_WEEKLY_PLAN_STORAGE_KEY);

    localStorage.removeItem(WEEKLY_PLAN_STORAGE_KEY);
    localStorage.removeItem(LEGACY_WEEKLY_PLAN_STORAGE_KEY);
    setLang('en'); showOnly('setup'); renderWeeklyPlanCard(); updatePreview();
    const bilingualWorks = document.getElementById('weekly-plan-kicker').textContent === 'My week'
      && document.getElementById('go-btn').textContent.includes('View circuit')
      && document.getElementById('weekly-plan-copy').textContent.includes('history')
      && document.getElementById('weekly-plan-action').textContent.includes('Include');

    return { zeroHistoryQuickStartWorks, planShapeWorks, plannedCapsWork, generatedCapsWork, explicitRegenerationWorks, launchWorks, completionWorks, frozenPlanWorks, freeRouteStillWorks, recoveryOfferWorks, midweekResumeWorks, resumedCapsWork, ignoreHistoryWorks, legacyMigrationWorks, bilingualWorks };
  })()`);

  await call(ws, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(ws, `(() => {
    setLang('fr'); showOnly('setup'); renderWeeklyPlanCard();
    const card = document.getElementById('weekly-plan-card');
    const buttons = [...card.querySelectorAll('button:not([hidden])')];
    return {
      mobile320Works: document.documentElement.scrollWidth <= 320
        && card.scrollWidth <= card.clientWidth
        && buttons.every(button => button.getBoundingClientRect().height >= 44),
    };
  })()`);
  const combined = { ...result, ...mobile };
  if (process.env.SCREENSHOT_PATH) {
    const screenshot = await call(ws, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
    await writeFile(process.env.SCREENSHOT_PATH, Buffer.from(screenshot.data, 'base64'));
  }
  console.log(JSON.stringify(combined, null, 2));
  if (Object.values(combined).some(value => value !== true)) process.exitCode = 1;
  ws.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
