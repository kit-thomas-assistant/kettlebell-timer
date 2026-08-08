#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-rotation-test-'));
const port = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = pathname === '/history-sync.js' || pathname === '/supabase-sync.js' ? pathname.slice(1) : 'index.html';
  response.setHeader('Content-Type', asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, pageUrl,
], { stdio: 'ignore' });
const wait = ms => new Promise(done => setTimeout(done, ms));

async function debugPage() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then(response => response.json());
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

  const result = await evaluate(ws, `(async () => {
    localStorage.clear();
    equipmentInventory = Object.fromEntries(EQUIPMENT_WEIGHTS.map(weight => [weight, weight === 12 ? 1 : 0]));
    const upper = level => POOL[level].filter(exercise => exercise.group === 'upper' && hasCompatibleEquipment(exercise.name));
    const upperPoolWorks = upper('beginner').length >= 10 && upper('inter').length >= 14;
    const funExerciseWorks = ['Pompe décalée sur kettlebell', 'Push-up + kettlebell drag', 'Floor Press par côté', 'Half Get-Up Press', 'Kettlebell Pullover']
      .every(name => EX_DATA[name]?.steps?.length === 4
        && EX_STEPS_EN[name]?.length === 4
        && EX_NAME_EN[name]
        && exerciseMeta(name).bellCount === 1
        && exerciseMeta(name).loadBias
        && getYouTubeDemo(name));
    const safetyFallbackWorks = EX_DATA['Pompe décalée sur kettlebell'].meta.warning.includes('Base parfaitement stable')
      && EX_DATA['Pompe décalée sur kettlebell'].steps.some(step => step.includes('mi-temps'))
      && !Object.keys(EX_DATA).some(name => /crush.?grip/i.test(name));

    activeGroups = new Set(['upper']);
    let pushPullWorks = true;
    for (let i = 0; i < 80; i++) {
      const picked = pickCircuitExercises(5, i % 2 ? 'beginner' : 'inter', activeGroups);
      const patterns = picked.map(exercise => exercisePattern(exercise.name));
      pushPullWorks &&= patterns.includes('horizontal-push') && patterns.includes('horizontal-pull');
    }
    const sideFamiliesWork = exerciseFamily('Row (gauche)') === exerciseFamily('Row (droite)')
      && exerciseFamily('Clean & Press (G)') === exerciseFamily('Clean & Press (D)')
      && exerciseFamily('Planche latérale (G)') === exerciseFamily('Planche latérale (D)');

    const demoNames = Object.keys(YOUTUBE_DEMOS);
    const youtubeSearchWorks = demoNames.every(name => {
      const url = getYouTubeDemo(name)?.url || '';
      return url.startsWith('https://www.youtube.com/results?search_query=') && !url.includes('watch?v=');
    });

    selectedMode = 'fatloss'; selectedMin = 20; selectedLevel = 'inter';
    activeWeeklyLane = weeklyLaneForHistory([]);
    generateFatlossPlan({ avoidPlan: null });
    let previousSignature = fatlossPlanSignature(fatlossPlan);
    let regenerationWorks = true;
    for (let i = 0; i < 12; i++) {
      const previous = fatlossPlan;
      generateFatlossPlan();
      const signature = fatlossPlanSignature(fatlossPlan);
      regenerationWorks &&= signature !== previousSignature
        && ['prep', 'metabolic', 'strength', 'finisher'].every(phase => fatlossPlan[phase].length === previous[phase].length)
        && Object.values(fatlossPlan).flat().every(exercise => hasCompatibleEquipment(exercise.name));
      previousSignature = signature;
    }

    const now = new Date();
    const monday = localWeekStart(now);
    const session = offset => ({ date: addLocalDays(monday, offset).toISOString(), mode: 'Circuit', duration: 20, exercises: [] });
    const laneSequenceWorks = weeklyLaneForHistory([], now).id === 'base-force'
      && weeklyLaneForHistory([session(0)], now).id === 'hinge-power'
      && weeklyLaneForHistory([session(0), session(1)], now).id === 'mixed-unilateral';

    localStorage.setItem('kb_history', '[]');
    showFatlossPreview();
    const laneBefore = activeWeeklyLane.id;
    regenerateFatloss(); regenerateFatloss();
    const regenerateKeepsLane = activeWeeklyLane.id === laneBefore;
    saveSession('fatloss', 20, Object.values(fatlossPlan).flat().map(exercise => exercise.name));
    const saved = readHistory()[0];
    const saveAdvancesLane = saved.modeId === 'fatloss'
      && saved.weeklyLaneId === 'base-force'
      && weeklyLaneForHistory().id === 'hinge-power';

    const legacy = [{ date: new Date().toISOString(), mode: 'Circuit', duration: 10, exercises: ['Goblet Squat'] }];
    localStorage.setItem('kb_history', JSON.stringify(legacy));
    const backwardsCompatibilityWorks = readHistory()[0].modeId === undefined
      && weeklyLaneForHistory().id === 'hinge-power';

    localStorage.setItem('kb_history', '[]');
    setLang('fr'); showFatlossPreview();
    const badgeFrenchWorks = document.getElementById('cp-lane-badge').textContent === 'Séance 1/3 · Base force';
    setLang('en'); renderFatlossPreview();
    const badgeEnglishWorks = document.getElementById('cp-lane-badge').textContent === 'Session 1/3 · Strength base'
      && document.getElementById('cp-regenerate').textContent.includes('Vary this session');

    return { upperPoolWorks, funExerciseWorks, safetyFallbackWorks, pushPullWorks, sideFamiliesWork, youtubeSearchWorks, regenerationWorks, laneSequenceWorks, regenerateKeepsLane, saveAdvancesLane, backwardsCompatibilityWorks, badgeFrenchWorks, badgeEnglishWorks };
  })()`);

  await call(ws, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(ws, `(() => {
    setLang('fr'); renderFatlossPreview();
    const preview = document.getElementById('circuit-preview');
    return { mobile320Works: preview.scrollWidth <= preview.clientWidth && document.documentElement.scrollWidth <= 320 };
  })()`);
  const combined = { ...result, ...mobile };
  console.log(JSON.stringify(combined, null, 2));
  if (Object.values(combined).some(value => value !== true)) process.exitCode = 1;
  ws.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
