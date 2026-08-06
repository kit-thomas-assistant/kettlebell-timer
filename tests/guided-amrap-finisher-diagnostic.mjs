#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-guided-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (_request, response) => {
  response.setHeader('Content-Type', 'text/html; charset=utf-8');
  response.end(await readFile(resolve('index.html')));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const url = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, url,
], { stdio: 'ignore' });
const wait = milliseconds => new Promise(done => setTimeout(done, milliseconds));

async function getPage() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const pages = await fetch(`http://127.0.0.1:${debugPort}/json`).then(response => response.json());
      const page = pages.find(candidate => candidate.type === 'page' && candidate.url.includes('index.html'));
      if (page) return page;
    } catch {}
    await wait(100);
  }
  throw new Error('Chromium did not expose a debug page');
}

let messageId = 1;
function call(websocket, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = messageId++;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      websocket.removeEventListener('message', onMessage);
      if (message.error || message.result?.exceptionDetails) reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      else resolveCall(message.result);
    };
    websocket.addEventListener('message', onMessage);
    websocket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(websocket, expression) {
  const response = await call(websocket, 'Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return response.result.value;
}

try {
  const page = await getPage();
  const websocket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((open, reject) => {
    websocket.addEventListener('open', open, { once: true });
    websocket.addEventListener('error', reject, { once: true });
  });
  await wait(400);

  const result = await evaluate(websocket, `(() => {
    localStorage.clear();
    equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, weight === 12 ? 1 : 0]));
    renderEquipmentSelector();
    setLang('fr');

    const guidedDiscoverable = document.getElementById('guided-disclosure')
      && document.querySelectorAll('.guided-recipe').length === 2
      && document.querySelector('[data-mode="amrap"]');
    const minimal = GUIDED_RECIPES.minimal3;
    const minimalExact = JSON.stringify(minimal.exercises.map(exercise => [exercise.name, exercise.reps]))
      === JSON.stringify([['Thruster par côté', 5], ['Row par côté', 6], ['Kettlebell Swing', 15]])
      && minimal.recommendedRounds === '3–4';
    const restOptionsExact = JSON.stringify([...document.querySelectorAll('[data-rest]')].map(button => Number(button.dataset.rest)))
      === JSON.stringify([60, 90, 120, 180]) && selectedRoundRest === 90;

    const density = AMRAP_PRESETS.fullBodyDensity;
    const expectedDensity = [
      ['Row par côté', 5], ['Kettlebell Swing', 15], ['Clean + Thruster par côté', 4],
      ['Goblet Reverse Lunge', 10], ['Toe Taps', 20], ['Pompes au sol', 10],
    ];
    const amrapExact = JSON.stringify(density.exercises.map(exercise => [exercise.name, exercise.reps])) === JSON.stringify(expectedDensity)
      && JSON.stringify(MODE_DURATIONS.amrap) === JSON.stringify([10, 12, 15, 20]);

    selectedMode = 'amrap'; selectedMin = 12; selectedGuidedRecipe = density;
    renderSequencePreview();
    const previewExact = [...document.querySelectorAll('#cp-list .cp-item-name')].map(element => element.textContent).join('|')
      === density.exercises.map(exercise => exercise.name).join('|');
    startSequenceRunner('amrap', density);
    clearInterval(timerInterval);
    for (let step = 0; step < density.exercises.length; step++) advanceSequence();
    const manualRoundCounterWorks = runnerRoundsCompleted === 1 && runnerRound === 2 && runnerIndex === 0
      && document.getElementById('seq-round').textContent.includes('1 tour terminé');
    runnerPaused = true; renderSequenceRunner();
    const pauseWorks = document.getElementById('seq-pause').textContent.includes('Reprendre');
    runnerFreeRest = true; renderSequenceRunner();
    const freeRestWorks = document.getElementById('seq-name').textContent === 'Repos libre';

    runnerFreeRest = false;
    runnerSecondsLeft = 0;
    completeSequenceRunner();
    const mainHistory = readHistory();
    const mainCompletionWorks = mainHistory.length === 1
      && mainHistory[0].modeId === 'amrap'
      && mainHistory[0].recipeId === density.id
      && mainHistory[0].roundsCompleted === 1
      && document.getElementById('finisher-offer').classList.contains('visible');
    const laneAfterMain = weeklyLaneForHistory().id === 'hinge-power';

    finisherRounds = 2;
    startSequenceRunner('finisher', ARMS_FINISHER);
    clearInterval(timerInterval);
    runnerRoundsCompleted = 2;
    completeSequenceRunner();
    const afterFinisher = readHistory();
    const finisherInvariantWorks = afterFinisher.length === 1
      && afterFinisher[0].weeklyLaneId === 'base-force'
      && weeklyLaneForHistory().id === 'hinge-power'
      && afterFinisher[0].finisher.id === ARMS_FINISHER.id
      && afterFinisher[0].finisher.exercises.length === 3
      && !document.getElementById('finisher-offer').classList.contains('visible');

    const newNames = ['Dead Clean (G)', 'Dead Clean (D)', 'Goblet Curl', 'Extension triceps au-dessus de la tête', 'Toe Taps', 'Clean + Thruster par côté'];
    const translationsWork = newNames.every(name => EX_NAME_EN[name] && EX_STEPS_EN[name]?.length === 4)
      && (() => { setLang('en'); return t('finisherTitle') === 'I still have 5 minutes' && exName('Dead Clean (G)') === 'Dead Clean (L)'; })();
    const demoQueriesOnly = newNames.every(name => {
      const demo = YOUTUBE_DEMOS[name];
      const resolved = getYouTubeDemo(name)?.url || '';
      return demo?.query && !demo.videoId && resolved.includes('/results?search_query=') && !resolved.includes('watch?v=');
    });
    const metadataWorks = exerciseMeta('Dead Clean (G)').family === 'dead-clean'
      && exerciseMeta('Dead Clean (G)').laterality === 'single-side'
      && exerciseMeta('Goblet Curl').loadBias === 'light'
      && exerciseMeta('Extension triceps au-dessus de la tête').pattern === 'elbow-extension'
      && exerciseMeta('Toe Taps').bellCount === 0
      && exerciseMeta('Toe Taps').laterality === 'alternating'
      && exerciseMeta('Clean + Thruster par côté').laterality === 'per-side'
      && POOL.beginner.some(exercise => exercise.name === 'Goblet Curl')
      && POOL.inter.some(exercise => exercise.name === 'Clean + Thruster par côté');

    equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, 0]));
    const equipmentFilteringWorks = hasCompatibleEquipment('Toe Taps')
      && hasCompatibleEquipment('Pompes au sol')
      && ['Dead Clean (G)', 'Goblet Curl', 'Extension triceps au-dessus de la tête', 'Clean + Thruster par côté'].every(name => !hasCompatibleEquipment(name));

    return { guidedDiscoverable: Boolean(guidedDiscoverable), minimalExact, restOptionsExact, amrapExact, previewExact, manualRoundCounterWorks, pauseWorks, freeRestWorks, mainCompletionWorks, laneAfterMain, finisherInvariantWorks, translationsWork, demoQueriesOnly, metadataWorks, equipmentFilteringWorks };
  })()`);

  await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(websocket, `(() => {
    equipmentInventory[12] = 1;
    setLang('fr');
    showOnly('setup');
    const setupFits = document.getElementById('setup').scrollWidth <= document.getElementById('setup').clientWidth && document.documentElement.scrollWidth <= 320;
    selectedMode = 'amrap'; selectedMin = 12; selectedGuidedRecipe = AMRAP_PRESETS.fullBodyDensity;
    startSequenceRunner('amrap', AMRAP_PRESETS.fullBodyDensity); clearInterval(timerInterval);
    const runnerFits = document.getElementById('sequence-runner').scrollWidth <= document.getElementById('sequence-runner').clientWidth && document.documentElement.scrollWidth <= 320;
    document.getElementById('finisher-offer').classList.add('visible'); showOnly('done');
    const finisherFits = document.getElementById('done').scrollWidth <= document.getElementById('done').clientWidth && document.documentElement.scrollWidth <= 320;
    return { mobile320Works: setupFits && runnerFits && finisherFits };
  })()`);
  const combined = { ...result, ...mobile };
  console.log(JSON.stringify(combined, null, 2));
  if (Object.values(combined).some(value => value !== true)) process.exitCode = 1;
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
