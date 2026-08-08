#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-equipment-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = pathname === '/history-sync.js' || pathname === '/supabase-sync.js' ? pathname.slice(1) : 'index.html';
  response.setHeader('Content-Type', asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  pageUrl,
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

function evaluate(websocket, expression) {
  return new Promise((resolveEval, reject) => {
    const id = 1;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      websocket.removeEventListener('message', onMessage);
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      } else {
        resolveEval(message.result.result.value);
      }
    };
    websocket.addEventListener('message', onMessage);
    websocket.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true },
    }));
  });
}

let cdpId = 10;
function cdpCall(websocket, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = cdpId++;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      websocket.removeEventListener('message', onMessage);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolveCall(message.result);
    };
    websocket.addEventListener('message', onMessage);
    websocket.send(JSON.stringify({ id, method, params }));
  });
}

try {
  const page = await getDebugPage();
  const websocket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    websocket.addEventListener('open', resolveOpen, { once: true });
    websocket.addEventListener('error', reject, { once: true });
  });
  await wait(500);

  const result = await evaluate(websocket, `(async () => {
    const inventory = entries => {
      equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, 0]));
      for (const [weight, count] of entries) equipmentInventory[weight] = count;
      saveEquipmentInventory();
      lighterWeights = false;
      fatlossPlan = null;
      selectedRecipe = null;
      circuitPreviewFresh = true;
      renderEquipmentSelector();
    };

    setLang('fr');
    const defaultInventoryWorks = equipmentInventory[12] === 1
      && EQUIPMENT_WEIGHTS.every(weight => equipmentInventory[weight] === (weight === 12 ? 1 : 0));
    const selectorButtons = [...document.querySelectorAll('.equipment-btn')];
    const selectorAccessibilityWorks = selectorButtons.length === 7
      && selectorButtons.every(button =>
        button.getAttribute('aria-label')
        && button.getAttribute('aria-pressed') !== null
        && parseFloat(getComputedStyle(button).minHeight) >= 44
      );

    cycleEquipment(12);
    const cycleToTwoWorks = equipmentInventory[12] === 2
      && JSON.parse(localStorage.getItem('kb_equipment_v1'))['12'] === 2
      && document.querySelector('[data-weight="12"] .equipment-count').textContent === '×2';
    cycleEquipment(12);
    const cycleToZeroWorks = equipmentInventory[12] === 0
      && document.querySelector('[data-weight="12"]').getAttribute('aria-pressed') === 'false';
    cycleEquipment(12);
    const cycleBackToOneWorks = equipmentInventory[12] === 1;

    inventory([]);
    updatePreview();
    const emptyInventoryStateWorks = document.getElementById('go-btn').disabled
      && document.getElementById('preview-text').textContent === 'Aucune kettlebell sélectionnée';
    cycleEquipment(12);
    const emptyInventoryRecoveryWorks = !document.getElementById('go-btn').disabled
      && equipmentInventory[12] === 1;
    setLang('en');
    inventory([]);
    updatePreview();
    const englishEmptyInventoryWorks = document.getElementById('go-btn').disabled
      && document.getElementById('preview-text').textContent === 'No kettlebell selected';
    setLang('fr');

    const forbidden = new Set(['Double KB Front Squat', 'Farmer Carry', 'Gorilla Row', 'Renegade Row']);
    inventory([[12, 1]]);
    let singleBellFilteringWorks = true;
    for (let i = 0; i < 300; i++) {
      const circuitNames = pickCircuitExercises(8, i % 2 ? 'beginner' : 'inter', new Set(['upper', 'lower', 'full', 'core'])).map(exercise => exercise.name);
      const genericNames = pickExercises(8, i % 2 ? 'beginner' : 'inter').map(exercise => exercise.name);
      selectedLevel = i % 2 ? 'beginner' : 'inter';
      selectedMin = [15, 20, 25][i % 3];
      const planNames = Object.values(generateFatlossPlan()).flat().map(exercise => exercise.name);
      if ([...circuitNames, ...genericNames, ...planNames].some(name => forbidden.has(name))) {
        singleBellFilteringWorks = false;
        break;
      }
    }
    const singleBellOptionsRemain = ['Goblet Squat', 'Kettlebell Swing', 'Suitcase March', 'Half-Kneeling Press']
      .every(hasCompatibleEquipment);

    inventory([[12, 1], [16, 1]]);
    const mismatchedPairStaysLocked = [...forbidden].every(name => !hasCompatibleEquipment(name));
    inventory([[14, 2], [20, 1]]);
    const equalPairUnlocks = [...forbidden].every(hasCompatibleEquipment)
      && recommendedWeight('Double KB Front Squat') === 14
      && recommendedWeight('Farmer Carry') === 14;

    inventory([[12, 1], [14, 1], [16, 1]]);
    selectedMode = 'circuit';
    selectedMin = 20;
    selectedLevel = 'beginner';
    showCircuitPreview();
    const recipe = CURATED_RECIPES.nateliFullBody;
    const expectedOrder = recipe.exercises.map(exercise => exercise.name);
    const recipePreviewWorks = selectedRecipe?.id === recipe.id
      && JSON.stringify(pickedCircuitExercises.map(exercise => exercise.name)) === JSON.stringify(expectedOrder)
      && document.querySelector('.cp-title').textContent === 'Full-body David Nateli'
      && document.getElementById('cp-list').textContent.includes('6 par côté')
      && document.getElementById('cp-list').textContent.includes('12 kg')
      && document.getElementById('cp-list').textContent.includes('16 kg')
      && pickedCircuitExercises.find(exercise => exercise.name === 'Clean à deux mains').weightKg === 16;
    const mixedLoadActionWorks = document.getElementById('cp-lighten').style.display === 'block';

    buildWorkout();
    const workSteps = circuit.filter(step => step.type === 'work');
    const recipeOrderAndTimingWorks = workSteps.length === recipe.rounds * recipe.exercises.length
      && Array.from({ length: recipe.rounds }, (_, round) =>
        JSON.stringify(workSteps.slice(round * expectedOrder.length, (round + 1) * expectedOrder.length).map(step => step.name))
          === JSON.stringify(expectedOrder)
      ).every(Boolean)
      && circuit.reduce((seconds, step) => seconds + step.duration, 0) === 1155;
    const unifiedLateralityWorks = workSteps.filter(step => step.laterality === 'per-side').length === recipe.rounds * 3
      && !workSteps.some(step => /\\((G|D|gauche|droite)\\)/.test(step.name))
      && shouldTriggerMidpointCue(workSteps.find(step => step.name === 'Press par côté'), 25)
      && !shouldTriggerMidpointCue(workSteps.find(step => step.name === 'Press par côté'), 24)
      && displayDetail(workSteps.find(step => step.name === 'Press par côté')).includes('par côté');
    triggerMidpointCue();
    const midpointCueWorks = document.getElementById('wo-switch-cue').classList.contains('active')
      && document.getElementById('wo-switch-cue').textContent.includes('Change de côté');

    renderCircuitPreview();
    toggleLighterWeights();
    const lighterActionWorks = lighterWeights
      && pickedCircuitExercises.every(exercise => exercise.weightKg === 12)
      && document.getElementById('cp-lighten').textContent.includes('Charges conseillées')
      && document.getElementById('cp-lighten').style.display === 'block';
    toggleLighterWeights();
    const suggestedLoadRestoreWorks = !lighterWeights
      && new Set(pickedCircuitExercises.map(exercise => exercise.weightKg)).size > 1
      && pickedCircuitExercises.find(exercise => exercise.name === 'Clean à deux mains').weightKg === 16
      && document.getElementById('cp-lighten').textContent.includes('Tout alléger')
      && document.getElementById('cp-lighten').style.display === 'block';

    setLang('en');
    renderCircuitPreview();
    const translationWorks = document.getElementById('equipment-label').textContent === 'My kettlebells'
      && document.querySelector('.cp-title').textContent === 'David Nateli full-body'
      && document.getElementById('cp-list').textContent.includes('Two-Hand Clean')
      && document.getElementById('cp-list').textContent.includes('Press per side')
      && displayDetail(enrichExercise(recipe.exercises[2])).includes('per side')
      && exDetail(recipe.exercises[4].detail).includes('seconds per side');

    localStorage.removeItem('kb_history');
    setLang('fr');
    saveSession('circuit', 20, expectedOrder);
    const saved = JSON.parse(localStorage.getItem('kb_history'))[0];
    const automaticHistoryWorks = saved.recipeId === recipe.id
      && saved.equipment['12'] === 1
      && saved.equipment['14'] === 1
      && saved.equipment['16'] === 1
      && !('rpe' in saved);

    return {
      defaultInventoryWorks,
      selectorAccessibilityWorks,
      cycleToTwoWorks,
      cycleToZeroWorks,
      cycleBackToOneWorks,
      emptyInventoryStateWorks,
      emptyInventoryRecoveryWorks,
      englishEmptyInventoryWorks,
      singleBellFilteringWorks,
      singleBellOptionsRemain,
      mismatchedPairStaysLocked,
      equalPairUnlocks,
      recipePreviewWorks,
      mixedLoadActionWorks,
      recipeOrderAndTimingWorks,
      unifiedLateralityWorks,
      midpointCueWorks,
      lighterActionWorks,
      suggestedLoadRestoreWorks,
      translationWorks,
      automaticHistoryWorks,
    };
  })()`);

  const failed = Object.entries(result).filter(([, value]) => value !== true);
  console.log(JSON.stringify(result, null, 2));
  if (failed.length) process.exitCode = 1;

  if (process.env.EQUIPMENT_QA_DIR) {
    await mkdir(process.env.EQUIPMENT_QA_DIR, { recursive: true });
    await cdpCall(websocket, 'Runtime.evaluate', {
      expression: `setLang('fr'); equipmentInventory = {8:0,10:0,12:1,14:1,16:1,20:0,24:0}; saveEquipmentInventory(); lighterWeights=false; selectedMode='circuit'; selectedMin=20; selectedLevel='beginner'; showCircuitPreview();`,
    });
    await cdpCall(websocket, 'Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 900, deviceScaleFactor: 1, mobile: false,
    });
    const desktop = await cdpCall(websocket, 'Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
    });
    await writeFile(join(process.env.EQUIPMENT_QA_DIR, 'recipe-desktop.png'), Buffer.from(desktop.data, 'base64'));

    await cdpCall(websocket, 'Emulation.setDeviceMetricsOverride', {
      width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
    });
    const mobile = await cdpCall(websocket, 'Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
    });
    await writeFile(join(process.env.EQUIPMENT_QA_DIR, 'recipe-mobile.png'), Buffer.from(mobile.data, 'base64'));
    console.log(`QA screenshots: ${process.env.EQUIPMENT_QA_DIR}`);
  }
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
