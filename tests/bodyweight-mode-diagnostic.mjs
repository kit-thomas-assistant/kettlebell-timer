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

    const focusPanel = document.getElementById('bodyweight-focus-group');
    const focusButtons = [...document.querySelectorAll('.bodyweight-focus-btn')];
    const focusSelectorWorks = !focusPanel.hidden
      && focusButtons.length === 4
      && document.getElementById('bodyweight-focus-grid').getAttribute('role') === 'group'
      && document.getElementById('bodyweight-focus-grid').getAttribute('aria-labelledby') === 'bodyweight-focus-label'
      && focusButtons.every(button => button.tagName === 'BUTTON' && button.type === 'button' && button.hasAttribute('aria-pressed'))
      && selectedBodyweightFocusId === 'balanced'
      && focusButtons.find(button => button.dataset.bodyweightFocus === 'balanced')?.getAttribute('aria-pressed') === 'true'
      && focusButtons.find(button => button.dataset.bodyweightFocus === 'upper-core')?.textContent.includes('Recommandé après vélo');
    selectMode('circuit');
    const focusOnlyInBodyweight = focusPanel.hidden;
    selectMode('bodyweight');
    selectBodyweightFocus('upper-core');
    const focusPersistenceWorks = selectedBodyweightFocusId === 'upper-core'
      && localStorage.getItem(BODYWEIGHT_FOCUS_STORAGE_KEY) === 'upper-core'
      && document.querySelector('[data-bodyweight-focus="upper-core"]').getAttribute('aria-pressed') === 'true';
    selectBodyweightFocus('balanced');

    const allTravelNames = [...new Set([
      ...BODYWEIGHT_LANES.flatMap(lane => [
        ...lane.beginner,
        ...lane.inter,
        ...(lane.alternatives?.beginner || []).flat(),
        ...(lane.alternatives?.inter || []).flat(),
      ]),
      ...BODYWEIGHT_FOCUSES.flatMap(focus => [
        ...(focus.beginner || []),
        ...(focus.inter || []),
        ...(focus.alternatives?.beginner || []).flat(),
        ...(focus.alternatives?.inter || []).flat(),
      ]),
    ])];
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

    const upperLegLoading = new Set(['Squat au poids du corps', 'Squat tempo', 'Fente arrière alternée', 'Pont fessier', 'Pont fessier une jambe', 'Mountain Climber', 'Bear Plank Shoulder Tap']);
    const hardConditioning = new Set(['Mountain Climber', 'Bear Plank Shoulder Tap']);
    let programsAreSensible = true;
    let focusPlansRespectIntent = true;
    let allFocusRegenerationsChangeExercises = true;
    for (const focus of BODYWEIGHT_FOCUSES) {
      selectBodyweightFocus(focus.id, false);
      for (const minutes of [10, 15, 20]) {
        for (const level of ['beginner', 'inter']) {
          selectedMin = minutes;
          selectedLevel = level;
          activeBodyweightLane = focus.id === 'balanced' ? BODYWEIGHT_LANES[0] : null;
          createBodyweightPlan(activeBodyweightLane);
          buildBodyweight();
          const names = bodyweightPlan.map(exercise => exercise.name);
          const seconds = circuit.reduce((sum, step) => sum + step.duration, 0);
          const work = circuit.filter(step => step.type === 'work');
          programsAreSensible &&= bodyweightPlan.length === 6
            && seconds >= minutes * 60 * 0.9
            && seconds <= minutes * 60 * 1.02
            && work.every(step => step.bellCount === 0 && step.weightKg === null)
            && work.every(step => focus.id === 'balanced'
              ? step.modeLabel.includes('Voyage 1/3')
              : step.modeLabel.includes(t(focus.nameKey)));
          if (focus.id === 'upper-core') {
            focusPlansRespectIntent &&= names.every(name => !upperLegLoading.has(name))
              && work.every(step => step.detail.includes('RPE 6–7'));
          }
          if (focus.id === 'lower-core') {
            focusPlansRespectIntent &&= names.some(name => bodyweightExercise(name).group === 'lower')
              && names.every(name => bodyweightExercise(name).group !== 'upper');
          }
          if (focus.id === 'core-posture') {
            focusPlansRespectIntent &&= names.every(name => !hardConditioning.has(name))
              && work.every(step => step.detail.includes('RPE 4–6'));
          }

          const regeneratedNames = createBodyweightPlan(activeBodyweightLane, { avoidPlan: bodyweightPlan })
            .map(exercise => exercise.name);
          allFocusRegenerationsChangeExercises &&= regeneratedNames.length === 6
            && names.some(name => !regeneratedNames.includes(name))
            && regeneratedNames.some(name => !names.includes(name));
          if (focus.id === 'upper-core') {
            focusPlansRespectIntent &&= regeneratedNames.every(name => !upperLegLoading.has(name));
          }
          if (focus.id === 'lower-core') {
            focusPlansRespectIntent &&= regeneratedNames.some(name => bodyweightExercise(name).group === 'lower')
              && regeneratedNames.every(name => bodyweightExercise(name).group !== 'upper');
          }
          if (focus.id === 'core-posture') {
            focusPlansRespectIntent &&= regeneratedNames.every(name => !hardConditioning.has(name));
          }
        }
      }
    }
    selectBodyweightFocus('balanced', false);

    const now = new Date();
    const weighted = { date: now.toISOString(), mode: 'Circuit', modeId: 'circuit', duration: 20, exercises: ['Goblet Squat'] };
    const body = (index, focusId) => ({ date: new Date(now - index * 1000).toISOString(), mode: 'Sans kettlebell', modeId: 'bodyweight', bodyweightFocusId: focusId, duration: 15, exercises: ['Bird Dog'] });
    const laneRotationUsesBodyweightOnly = bodyweightLaneForHistory([]).id === 'bodyweight-base'
      && bodyweightLaneForHistory([weighted]).id === 'bodyweight-base'
      && bodyweightLaneForHistory([weighted, body(1)]).id === 'bodyweight-unilateral'
      && bodyweightLaneForHistory([weighted, body(1), weighted, body(2)]).id === 'bodyweight-conditioning';
    const focusScopedHistoryWorks = bodyweightLaneForHistory([body(1, 'upper-core')], 'balanced').id === 'bodyweight-base'
      && bodyweightLaneForHistory([body(1, 'upper-core')], 'upper-core').id === 'bodyweight-unilateral'
      && sessionBodyweightFocusId(body(2)) === 'balanced';
    const weightedLaneIgnoresBodyweight = weeklyLaneForHistory([body(1)], now).id === 'base-force'
      && weeklyLaneForHistory([body(1), weighted], now).id === 'hinge-power';

    localStorage.setItem('kb_history', '[]');
    selectedMode = 'bodyweight';
    selectedBodyweightFocusId = 'upper-core';
    selectedMin = 10;
    selectedLevel = 'beginner';
    activeBodyweightLane = null;
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
      && saved.bodyweightFocusId === 'upper-core'
      && saved.bodyweightLaneId === null
      && saved.weeklyLaneId === null
      && Object.keys(saved.equipment).length === 0
      && saved.exerciseStats.length === 6
      && saved.exerciseStats.every(item => item.bellCount === 0 && item.weightKg === null && item.volumeKg === 0)
      && mergedBodyweightStats.every(item => item.bellCount === 0 && item.weightKg === null && item.volumeKg === 0)
      && summarizedBodyweightStats.totalVolumeKg === 0
      && summarizedBodyweightStats.exerciseStats.every(item => item.bellCount === 0 && item.weightKg === null && item.volumeKg === 0)
      && !document.getElementById('finisher-offer').classList.contains('visible');

    showHistory();
    const historyFocusWorks = document.getElementById('history-list').textContent.includes('Focus · Haut + tronc');
    closeHistory();
    const currentHistory = readHistory();
    localStorage.setItem('kb_history', JSON.stringify([body(9), ...currentHistory]));
    showHistory();
    const legacyHistoryDisplaysBalanced = document.getElementById('history-list').textContent.includes('Focus · Équilibré');
    closeHistory();
    localStorage.setItem('kb_history', JSON.stringify(currentHistory));

    setLang('fr');
    selectMode('bodyweight');
    selectBodyweightFocus('upper-core');
    updatePreview();
    showBodyweightPreview();
    const frenchPreviewWorks = document.getElementById('preview-text').textContent.includes('Haut + tronc')
      && document.getElementById('preview-text').textContent.includes('RPE 6–7')
      && document.querySelector('.cp-title').textContent === 'Ton programme voyage'
      && document.getElementById('cp-lane-badge').textContent.includes('Focus · Haut + tronc')
      && document.getElementById('cp-science-note').textContent.includes('sans remplacer un row chargé');

    // Exercise regeneration must run through the actual setup -> preview ->
    // button flow. It must swap at least one exercise, not merely reorder the
    // same names, while preserving every setup preference and history.
    showOnly('setup');
    selectedMode = 'bodyweight';
    selectedMin = 15;
    selectedLevel = 'beginner';
    selectBodyweightFocus('upper-core');
    const historyBeforeRegeneration = localStorage.getItem('kb_history');
    document.getElementById('go-btn').click();
    const planBeforeRegeneration = bodyweightPlan.map(exercise => exercise.name);
    const regenerateButton = document.getElementById('cp-regenerate');
    const bodyweightRegenerateIsAvailable = getComputedStyle(regenerateButton).display !== 'none'
      && !regenerateButton.disabled
      && regenerateButton.textContent.includes('Régénérer');
    regenerateButton.click();
    const planAfterRegeneration = bodyweightPlan.map(exercise => exercise.name);
    const changedExerciseNames = planBeforeRegeneration.some(name => !planAfterRegeneration.includes(name))
      && planAfterRegeneration.some(name => !planBeforeRegeneration.includes(name));
    const bodyweightPreferencesSurviveRegeneration = selectedMode === 'bodyweight'
      && selectedMin === 15
      && selectedLevel === 'beginner'
      && selectedBodyweightFocusId === 'upper-core'
      && localStorage.getItem(BODYWEIGHT_FOCUS_STORAGE_KEY) === 'upper-core'
      && document.getElementById('cp-lane-badge').textContent.includes('Focus · Haut + tronc')
      && localStorage.getItem('kb_history') === historyBeforeRegeneration;
    const regeneratedUpperCoreRespectsIntent = planAfterRegeneration.length === 6
      && planAfterRegeneration.every(name => !upperLegLoading.has(name));
    buildWorkout();
    const regeneratedPlanFeedsRunner = JSON.stringify(sessionExercises) === JSON.stringify(planAfterRegeneration)
      && circuit.filter(step => step.type === 'work').every(step => planAfterRegeneration.includes(step.name))
      && circuit.filter(step => step.type === 'work').every(step => step.modeLabel.includes('Haut + tronc'));
    saveSession('bodyweight', selectedMin, sessionExercises);
    const regeneratedHistoryKeepsFocus = readHistory()[0]?.bodyweightFocusId === 'upper-core'
      && readHistory()[0]?.bodyweightLaneId === null
      && JSON.stringify(readHistory()[0]?.exercises) === JSON.stringify(planAfterRegeneration);
    localStorage.setItem('kb_history', historyBeforeRegeneration);

    setLang('en');
    const englishCopyWorks = card.textContent.includes('No kettlebell')
      && document.getElementById('preview-text').textContent.includes('Upper + core')
      && document.querySelector('[data-bodyweight-focus="upper-core"]').textContent.includes('Recommended after cycling')
      && document.getElementById('cp-regenerate').textContent.includes('Regenerate');
    renderBodyweightPreview();
    const englishPreviewWorks = document.querySelector('.cp-title').textContent === 'Your travel program'
      && document.getElementById('cp-lane-badge').textContent.includes('Focus · Upper + core')
      && document.getElementById('cp-science-note').textContent.includes('do not replace loaded rows');

    showOnly('setup');
    const cardRect = card.getBoundingClientRect();
    const touchTargetsWork = cardRect.height >= 44
      && document.getElementById('go-btn').getBoundingClientRect().height >= 44
      && [...document.querySelectorAll('.equipment-btn')].every(button => button.getBoundingClientRect().height >= 44)
      && [...document.querySelectorAll('.bodyweight-focus-btn')].every(button => button.getBoundingClientRect().height >= 44);

    return {
      frenchEntryWorks, explicitSelectionWorks, lastBellZeroEntersMode, selectingBellExitsCleanly,
      durationAndLevelOptionsWork, focusSelectorWorks, focusOnlyInBodyweight, focusPersistenceWorks,
      zeroEquipmentOnly, completeExerciseUx, programsAreSensible, focusPlansRespectIntent,
      allFocusRegenerationsChangeExercises,
      laneRotationUsesBodyweightOnly, focusScopedHistoryWorks, weightedLaneIgnoresBodyweight,
      bodyweightHistoryAndStatsWork, historyFocusWorks, legacyHistoryDisplaysBalanced,
      frenchPreviewWorks, bodyweightRegenerateIsAvailable, changedExerciseNames,
      bodyweightPreferencesSurviveRegeneration, regeneratedUpperCoreRespectsIntent,
      regeneratedPlanFeedsRunner, regeneratedHistoryKeepsFocus, englishCopyWorks,
      englishPreviewWorks, touchTargetsWork,
    };
  })()`);

  await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 900, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(websocket, `(() => {
    setLang('fr');
    selectMode('bodyweight');
    showOnly('setup');
    const setup = document.getElementById('setup');
    const card = document.querySelector('[data-mode="bodyweight"]');
    const focusButtons = [...document.querySelectorAll('.bodyweight-focus-btn')];
    const setupContained = document.documentElement.scrollWidth <= 320
      && setup.scrollWidth <= setup.clientWidth
      && card.getBoundingClientRect().left >= 0
      && card.getBoundingClientRect().right <= 320
      && focusButtons.every(button => button.getBoundingClientRect().left >= 0 && button.getBoundingClientRect().right <= 320);
    let previewContained = true;
    for (const focus of BODYWEIGHT_FOCUSES) {
      selectBodyweightFocus(focus.id, false);
      showBodyweightPreview();
      const preview = document.getElementById('circuit-preview');
      previewContained &&= document.documentElement.scrollWidth <= 320
        && preview.scrollWidth <= preview.clientWidth
        && [...document.querySelectorAll('.cp-item')].every(item => item.getBoundingClientRect().right <= 320);
    }
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
    const bodyweightSetupExpression = `(() => { localStorage.clear(); setLang('fr'); selectMode('bodyweight'); selectBodyweightFocus('upper-core'); showOnly('setup'); window.scrollTo(0, 0); })()`;
    const previewExpression = `(() => { localStorage.clear(); setLang('fr'); selectMode('bodyweight'); selectBodyweightFocus('upper-core'); selectedMin = 15; selectedLevel = 'beginner'; showBodyweightPreview(); window.scrollTo(0, 0); })()`;
    await capture('bodyweight-desktop-1280.png', 1280, 1100, setupExpression);
    await capture('bodyweight-focus-desktop-1280.png', 1280, 1300, bodyweightSetupExpression);
    await capture('bodyweight-mobile-390.png', 390, 1000, bodyweightSetupExpression);
    await capture('bodyweight-preview-320.png', 320, 900, previewExpression);
    console.log(`QA screenshots: ${process.env.BODYWEIGHT_QA_DIR}`);
  }
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
