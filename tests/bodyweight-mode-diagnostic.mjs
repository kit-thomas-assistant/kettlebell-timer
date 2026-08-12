#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-bodyweight-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const allowedAssets = new Set(['/index.html', '/history-sync.js', '/workout-stats.js', '/supabase-sync.js']);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const safePath = pathname === '/' ? '/index.html' : pathname;
  if (safePath === '/favicon.ico') {
    response.statusCode = 204;
    response.end();
    return;
  }
  if (!allowedAssets.has(safePath)) {
    response.statusCode = 404;
    response.end('Not found');
    return;
  }
  const asset = safePath.slice(1);
  response.setHeader('Content-Type', extname(asset) === '.js' ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));

const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
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

let callId = 1;
function call(websocket, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = callId++;
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
  const page = await debugPage();
  const websocket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((open, reject) => {
    websocket.addEventListener('open', open, { once: true });
    websocket.addEventListener('error', reject, { once: true });
  });
  const consoleErrors = [];
  websocket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') {
      consoleErrors.push(message.params.exceptionDetails?.text || 'Uncaught exception');
    }
    if (message.method === 'Log.entryAdded' && message.params.entry?.level === 'error') {
      consoleErrors.push(message.params.entry.text);
    }
  });
  await call(websocket, 'Runtime.enable');
  await call(websocket, 'Log.enable');
  await wait(500);

  const result = await evaluate(websocket, `(async () => {
    localStorage.clear();
    equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, weight === 12 ? 1 : 0]));
    renderEquipmentSelector();
    selectMode('circuit');

    setLang('fr');
    const card = document.querySelector('[data-mode="bodyweight"]');
    const frenchEntryWorks = card.textContent.includes('Sans kettlebell')
      && card.textContent.includes('Programme voyage full-body');
    card.click();
    const explicitSelectionWorks = selectedMode === 'bodyweight'
      && selectedWeights().length === 0
      && Object.values(equipmentInventory).every(count => count === 0)
      && !document.getElementById('go-btn').disabled
      && card.classList.contains('active')
      && card.getAttribute('aria-pressed') === 'true';

    equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, weight === 12 ? 2 : 0]));
    selectedMode = 'circuit';
    renderEquipmentSelector();
    cycleEquipment(12);
    const lastBellZeroEntersMode = selectedMode === 'bodyweight'
      && selectedWeights().length === 0
      && !document.getElementById('go-btn').disabled;
    cycleEquipment(16);
    const selectingBellExitsCleanly = selectedMode === 'circuit'
      && equipmentInventory[16] === 1
      && selectedWeights().length === 1
      && document.querySelector('[data-mode="circuit"]').classList.contains('active');

    selectMode('bodyweight');
    const durationAndLevelOptionsWork = JSON.stringify(MODE_DURATIONS.bodyweight) === JSON.stringify([10, 15, 20])
      && document.querySelectorAll('#duration-row .dur-btn').length === 3
      && document.querySelectorAll('#diff-group .diff-btn').length === 2
      && getComputedStyle(document.getElementById('duration-group')).display !== 'none'
      && getComputedStyle(document.getElementById('diff-group')).display !== 'none';

    const allTravelNames = [...new Set(BODYWEIGHT_LANES.flatMap(lane => [...lane.beginner, ...lane.inter]))];
    const zeroEquipmentOnly = allTravelNames.every(name => BODYWEIGHT_EXERCISES.has(name)
      && exerciseMeta(name).bellCount === 0
      && recommendedWeight(name) === null
      && hasCompatibleEquipment(name));
    const completeExerciseUx = allTravelNames.every(name => EX_DATA[name]?.svg?.includes('<svg')
      && EX_DATA[name]?.steps?.length === 4
      && EX_DATA[name]?.meta?.equipment === 'Sans kettlebell'
      && EX_STEPS_EN[name]?.length === 4
      && EX_NAME_EN[name]
      && getYouTubeDemo(name)?.url.startsWith('https://www.youtube.com/results?search_query=')
      && !getYouTubeDemo(name)?.url.includes('watch?v='));

    let programsAreSensible = true;
    for (const minutes of [10, 15, 20]) {
      for (const level of ['beginner', 'inter']) {
        selectedMin = minutes;
        selectedLevel = level;
        activeBodyweightLane = BODYWEIGHT_LANES[0];
        createBodyweightPlan(activeBodyweightLane);
        buildBodyweight();
        const seconds = circuit.reduce((sum, step) => sum + step.duration, 0);
        programsAreSensible &&= bodyweightPlan.length === 6
          && seconds >= minutes * 60 * 0.9
          && seconds <= minutes * 60 * 1.02
          && circuit.filter(step => step.type === 'work').every(step => step.bellCount === 0 && step.weightKg === null);
      }
    }

    const now = new Date();
    const weighted = { date: now.toISOString(), mode: 'Circuit', modeId: 'circuit', duration: 20, exercises: ['Goblet Squat'] };
    const body = index => ({ date: new Date(now - index * 1000).toISOString(), mode: 'Sans kettlebell', modeId: 'bodyweight', duration: 15, exercises: ['Bird Dog'] });
    const laneRotationUsesBodyweightOnly = bodyweightLaneForHistory([]).id === 'bodyweight-base'
      && bodyweightLaneForHistory([weighted]).id === 'bodyweight-base'
      && bodyweightLaneForHistory([weighted, body(1)]).id === 'bodyweight-unilateral'
      && bodyweightLaneForHistory([weighted, body(1), weighted, body(2)]).id === 'bodyweight-conditioning';
    const weightedLaneIgnoresBodyweight = weeklyLaneForHistory([body(1)], now).id === 'base-force'
      && weeklyLaneForHistory([body(1), weighted], now).id === 'hinge-power';

    localStorage.setItem('kb_history', '[]');
    selectedMode = 'bodyweight';
    selectedMin = 10;
    selectedLevel = 'beginner';
    activeBodyweightLane = bodyweightLaneForHistory();
    createBodyweightPlan(activeBodyweightLane);
    buildBodyweight();
    const workSteps = circuit.filter(step => step.type === 'work');
    sessionExercises = bodyweightPlan.map(exercise => exercise.name);
    sessionSaved = false;
    completeMainSession({
      workSteps,
      workSeconds: workSteps.reduce((sum, step) => sum + step.duration, 0),
    });
    const saved = readHistory()[0];
    const mergedBodyweightStats = window.KettlebellWorkoutStats.mergeExerciseStats(saved.exerciseStats);
    const summarizedBodyweightStats = window.KettlebellWorkoutStats.summarize([saved]);
    const bodyweightHistoryAndStatsWork = saved.modeId === 'bodyweight'
      && saved.mode === 'Sans kettlebell'
      && saved.bodyweightLaneId === 'bodyweight-base'
      && saved.weeklyLaneId === null
      && Object.keys(saved.equipment).length === 0
      && saved.exerciseStats.length === 6
      && saved.exerciseStats.every(item => item.bellCount === 0 && item.weightKg === null && item.volumeKg === 0)
      && mergedBodyweightStats.every(item => item.bellCount === 0 && item.weightKg === null && item.volumeKg === 0)
      && summarizedBodyweightStats.totalVolumeKg === 0
      && summarizedBodyweightStats.exerciseStats.every(item => item.bellCount === 0 && item.weightKg === null && item.volumeKg === 0)
      && !document.getElementById('finisher-offer').classList.contains('visible');

    setLang('fr');
    selectMode('bodyweight');
    updatePreview();
    showBodyweightPreview();
    const frenchPreviewWorks = document.getElementById('preview-text').textContent.includes('programme voyage full-body')
      && document.querySelector('.cp-title').textContent === 'Ton programme voyage'
      && document.getElementById('cp-science-note').textContent.includes('ne remplacent pas des rows chargés');
    setLang('en');
    const englishCopyWorks = card.textContent.includes('No kettlebell')
      && document.getElementById('preview-text').textContent.includes('full-body travel program');
    renderBodyweightPreview();
    const englishPreviewWorks = document.querySelector('.cp-title').textContent === 'Your travel program'
      && document.getElementById('cp-science-note').textContent.includes('do not replace loaded rows');

    showOnly('setup');
    const cardRect = card.getBoundingClientRect();
    const touchTargetsWork = cardRect.height >= 44
      && document.getElementById('go-btn').getBoundingClientRect().height >= 44
      && [...document.querySelectorAll('.equipment-btn')].every(button => button.getBoundingClientRect().height >= 44);

    return {
      frenchEntryWorks, explicitSelectionWorks, lastBellZeroEntersMode, selectingBellExitsCleanly,
      durationAndLevelOptionsWork, zeroEquipmentOnly, completeExerciseUx, programsAreSensible,
      laneRotationUsesBodyweightOnly, weightedLaneIgnoresBodyweight, bodyweightHistoryAndStatsWork,
      frenchPreviewWorks, englishCopyWorks, englishPreviewWorks, touchTargetsWork,
    };
  })()`);

  await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 900, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(websocket, `(() => {
    setLang('fr');
    selectMode('bodyweight');
    showOnly('setup');
    const setup = document.getElementById('setup');
    const card = document.querySelector('[data-mode="bodyweight"]');
    const setupContained = document.documentElement.scrollWidth <= 320
      && setup.scrollWidth <= setup.clientWidth
      && card.getBoundingClientRect().left >= 0
      && card.getBoundingClientRect().right <= 320;
    showBodyweightPreview();
    const preview = document.getElementById('circuit-preview');
    const previewContained = document.documentElement.scrollWidth <= 320
      && preview.scrollWidth <= preview.clientWidth
      && [...document.querySelectorAll('.cp-item')].every(item => item.getBoundingClientRect().right <= 320);
    return { mobile320ContainmentWorks: setupContained && previewContained };
  })()`);

  const combined = { ...result, ...mobile, noConsoleErrors: consoleErrors.length === 0 };
  console.log(JSON.stringify(combined, null, 2));
  if (consoleErrors.length) console.error(JSON.stringify({ consoleErrors }, null, 2));
  if (Object.values(combined).some(value => value !== true)) process.exitCode = 1;

  if (process.env.BODYWEIGHT_QA_DIR) {
    await mkdir(process.env.BODYWEIGHT_QA_DIR, { recursive: true });
    const capture = async (filename, width, height, expression) => {
      await call(websocket, 'Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
      await evaluate(websocket, expression);
      await wait(120);
      const screenshot = await call(websocket, 'Page.captureScreenshot', { format: 'png', captureBeyondViewport: true });
      await writeFile(join(process.env.BODYWEIGHT_QA_DIR, filename), Buffer.from(screenshot.data, 'base64'));
    };
    const setupExpression = `(() => { localStorage.clear(); equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, weight === 12 ? 1 : 0])); renderEquipmentSelector(); setLang('fr'); selectMode('circuit'); showOnly('setup'); window.scrollTo(0, 0); })()`;
    const bodyweightSetupExpression = `(() => { localStorage.clear(); setLang('fr'); selectMode('bodyweight'); showOnly('setup'); window.scrollTo(0, 0); })()`;
    const previewExpression = `(() => { localStorage.clear(); setLang('fr'); selectMode('bodyweight'); selectedMin = 15; selectedLevel = 'beginner'; showBodyweightPreview(); window.scrollTo(0, 0); })()`;
    await capture('bodyweight-desktop-1280.png', 1280, 1100, setupExpression);
    await capture('bodyweight-mobile-390.png', 390, 1000, bodyweightSetupExpression);
    await capture('bodyweight-preview-320.png', 320, 900, previewExpression);
    console.log(`QA screenshots: ${process.env.BODYWEIGHT_QA_DIR}`);
  }
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
