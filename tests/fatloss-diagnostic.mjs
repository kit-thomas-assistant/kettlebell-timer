#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-fatloss-test-'));
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
    websocket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      } else {
        resolveEval(message.result.result.value);
      }
    });
    websocket.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true },
    }));
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
    setLang('fr');
    const fatlossCard = document.querySelector('[data-mode="fatloss"]');
    fatlossCard.click();
    const homeSelectionWorks = selectedMode === 'fatloss'
      && fatlossCard.classList.contains('active')
      && document.getElementById('go-btn').textContent.includes('plan')
      && fatlossCard.querySelector('.mode-note').textContent.includes('ne se cible pas localement');

    const durationButtons = [...document.querySelectorAll('#duration-row .dur-btn')].map(button => Number(button.dataset.min));
    const durationsWork = JSON.stringify(durationButtons) === JSON.stringify([15, 20, 25]);

    const durationChecks = {};
    for (const minutes of [15, 20, 25]) {
      selectedMin = minutes;
      selectedLevel = 'beginner';
      generateFatlossPlan();
      buildFatloss();
      const seconds = circuit.reduce((total, step) => total + step.duration, 0);
      durationChecks[minutes] = { seconds, withinTolerance: Math.abs(seconds - minutes * 60) <= 180 };
    }
    const durationToleranceWorks = Object.values(durationChecks).every(check => check.withinTolerance);

    selectedMin = 20;
    selectedLevel = 'beginner';
    generateFatlossPlan();
    renderFatlossPreview();
    buildFatloss();
    const requiredPhases = ['prep', 'metabolic', 'strength', 'finisher'];
    const phaseCoverageWorks = requiredPhases.every(phase =>
      circuit.some(step => step.type === 'work' && step.phase === phase)
    );
    const beginnerPoolsWork = requiredPhases.every(phase =>
      fatlossPlan[phase].every(exercise => FATLOSS_POOLS.beginner[phase].includes(exercise.name))
    );
    const structuredIntervalsWork = circuit
      .filter(step => step.type === 'work' && step.phase !== 'prep')
      .every(step => step.duration >= 30 && step.duration <= 40);
    const phaseIntensityWorks = circuit
      .filter(step => step.type === 'work')
      .every(step => step.detail.includes('RPE ' + phaseRpe(step.phase)))
      && circuit.filter(step => step.type === 'work' && step.phase === 'prep')
        .every(step => step.detail.includes('RPE 3–5'))
      && circuit.filter(step => step.type === 'work' && step.phase === 'finisher')
        .every(step => step.detail.includes('RPE 6–8'));
    const previewWorks = document.getElementById('circuit-preview').style.display === 'flex'
      && document.getElementById('cp-science-note').hidden === false
      && document.querySelectorAll('#cp-coverage .cp-tag').length === 4
      && document.querySelectorAll('#cp-list .cp-item').length >= 9;

    selectedLevel = 'inter';
    let intermediatePoolsWork = true;
    let regenerationCoverageWorks = true;
    for (let i = 0; i < 50; i++) {
      generateFatlossPlan();
      intermediatePoolsWork &&= requiredPhases.every(phase =>
        fatlossPlan[phase].every(exercise => FATLOSS_POOLS.inter[phase].includes(exercise.name))
      );
      buildFatloss();
      regenerationCoverageWorks &&= ['metabolic', 'strength', 'finisher'].every(phase =>
        circuit.some(step => step.type === 'work' && step.phase === phase)
      );
    }

    const originalRandom = Math.random;
    let randomState = 0x9e3779b9;
    Math.random = () => {
      randomState = (1664525 * randomState + 1013904223) >>> 0;
      return randomState / 4294967296;
    };
    let sideBalanceWorks = true;
    for (let i = 0; i < 100; i++) {
      selectedLevel = i % 2 === 0 ? 'beginner' : 'inter';
      selectedMin = [15, 20, 25][i % 3];
      generateFatlossPlan();
      for (const phase of requiredPhases) {
        const names = fatlossPlan[phase].map(exercise => exercise.name);
        for (const name of names) {
          const counterpart = FATLOSS_COUNTERPART.get(name);
          if (counterpart && !names.includes(counterpart)) sideBalanceWorks = false;
        }
      }
    }
    Math.random = originalRandom;

    const newCoreNames = BODYWEIGHT_CORE_EXERCISES.map(exercise => exercise.name);
    const bodyweightCoverageWorks = newCoreNames.every(name =>
      EX_DATA[name]?.svg?.includes('<svg')
      && EX_DATA[name]?.steps?.length === 4
      && EX_STEPS_EN[name]?.length === 4
      && Boolean(getYouTubeDemo(name)?.url)
    );

    setLang('en');
    selectMode('fatloss');
    showFatlossPreview();
    const englishUiWorks = fatlossCard.querySelector('.mode-name').textContent === 'Fat-loss goal'
      && document.querySelector('.cp-title').textContent === 'Your fat-loss plan'
      && document.getElementById('cp-science-note').textContent.includes('no exercise')
      && document.getElementById('cp-coverage').textContent.includes('Full-body strength');
    setLang('fr');

    return {
      homeSelectionWorks,
      durationsWork,
      durationToleranceWorks,
      durationChecks,
      phaseCoverageWorks,
      beginnerPoolsWork,
      intermediatePoolsWork,
      structuredIntervalsWork,
      phaseIntensityWorks,
      previewWorks,
      regenerationCoverageWorks,
      sideBalanceWorks,
      bodyweightCoverageWorks,
      englishUiWorks,
    };
  })()`);

  const failed = Object.entries(result)
    .filter(([key, value]) => key !== 'durationChecks' && value !== true);
  console.log(JSON.stringify(result, null, 2));
  if (failed.length) process.exitCode = 1;
  if (process.env.FATLOSS_SCREENSHOT_PATH) {
    const screenshot = await new Promise((resolveCapture, reject) => {
      const id = 2;
      websocket.addEventListener('message', event => {
        const message = JSON.parse(event.data);
        if (message.id !== id) return;
        if (message.error) reject(new Error(JSON.stringify(message.error)));
        else resolveCapture(message.result.data);
      });
      websocket.send(JSON.stringify({
        id,
        method: 'Page.captureScreenshot',
        params: { format: 'png', captureBeyondViewport: true },
      }));
    });
    await writeFile(process.env.FATLOSS_SCREENSHOT_PATH, Buffer.from(screenshot, 'base64'));
    console.log(`Screenshot: ${process.env.FATLOSS_SCREENSHOT_PATH}`);
  }
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
