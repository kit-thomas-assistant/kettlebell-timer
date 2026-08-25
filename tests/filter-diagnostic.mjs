#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-filter-test-'));
const port = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = pathname === '/motion-rigs-v2.js' || pathname === '/history-sync.js' || pathname === '/supabase-sync.js' ? pathname.slice(1) : 'index.html';
  response.setHeader('Content-Type', asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const address = server.address();
const pageUrl = `http://127.0.0.1:${address.port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new',
  '--no-sandbox',
  '--disable-gpu',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  pageUrl,
], { stdio: 'ignore' });

const wait = ms => new Promise(resolveWait => setTimeout(resolveWait, ms));

async function getDebugPage() {
  for (let attempt = 0; attempt < 50; attempt++) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json`).then(r => r.json());
      const page = pages.find(item => item.type === 'page' && item.url.includes('index.html'));
      if (page) return page;
    } catch {}
    await wait(100);
  }
  throw new Error('Chromium did not expose a debug page');
}

function evaluate(ws, expression) {
  return new Promise((resolveEval, reject) => {
    const id = 1;
    ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      } else {
        resolveEval(message.result.result.value);
      }
    });
    ws.send(JSON.stringify({
      id,
      method: 'Runtime.evaluate',
      params: { expression, awaitPromise: true, returnByValue: true },
    }));
  });
}

try {
  const page = await getDebugPage();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, reject) => {
    ws.addEventListener('open', resolveOpen, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  await wait(500);

  const result = await evaluate(ws, `(async () => {
    showCircuitPreview();
    const before = pickedCircuitExercises.map(ex => ex.name);
    const removedNames = pickedCircuitExercises
      .filter(ex => ex.group === 'lower')
      .map(ex => ex.name);

    toggleCircuitGroup('lower');
    const afterToggle = pickedCircuitExercises.map(ex => ex.name);
    const keptExpected = before.filter(name => !removedNames.includes(name));
    const keptInPlace = keptExpected.every((name, index) => afterToggle[index] === name);
    const toggleIsClean = !activeGroups.has('lower')
      && pickedCircuitExercises.every(ex => ex.group !== 'lower');

    let regenerationIsClean = true;
    for (let i = 0; i < 100; i++) {
      regenerateCircuit();
      if (pickedCircuitExercises.some(ex => ex.group === 'lower')) {
        regenerationIsClean = false;
        break;
      }
    }

    for (const group of [...activeGroups]) toggleCircuitGroup(group);
    const zeroStateWorks = activeGroups.size === 0
      && pickedCircuitExercises.length === 0
      && document.getElementById('cp-go').disabled
      && document.getElementById('cp-regenerate').disabled;

    toggleCircuitGroup('upper');
    let singleGroupIsClean = true;
    for (let i = 0; i < 50; i++) {
      regenerateCircuit();
      if (pickedCircuitExercises.some(ex => ex.group !== 'upper')) {
        singleGroupIsClean = false;
        break;
      }
    }

    const demoCoverage = [...new Set([
      ...POOL.beginner.map(ex => ex.name),
      ...POOL.inter.map(ex => ex.name),
    ])].every(name => {
      const url = getYouTubeDemo(name)?.url || '';
      return url.startsWith('https://www.youtube.com/results?search_query=') && !url.includes('watch?v=');
    });

    setLang('en');
    showCircuitPreview();
    const englishUiWorks = document.querySelector('[data-group="lower"]').textContent.includes('Lower Body')
      && document.getElementById('cp-subtitle').textContent.includes('exercises')
      && document.querySelector('.cp-item-demo').textContent.includes('DEMO')
      && document.querySelector('#pv-demo .youtube-demo-label').textContent.includes('YouTube');
    const modernTranslationCoverage = MODERN_EXERCISES
      .every(exercise => Array.isArray(EX_STEPS_EN[exercise.name]) && EX_STEPS_EN[exercise.name].length === 4);
    setLang('fr');

    return {
      keptInPlace,
      toggleIsClean,
      regenerationIsClean,
      zeroStateWorks,
      singleGroupIsClean,
      demoCoverage,
      englishUiWorks,
      modernTranslationCoverage,
    };
  })()`);

  const failed = Object.entries(result).filter(([, value]) => value !== true);
  console.log(JSON.stringify(result, null, 2));
  if (failed.length) process.exitCode = 1;
  ws.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
