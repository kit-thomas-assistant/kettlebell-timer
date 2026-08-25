#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-motion-v2-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, 'http://localhost').pathname;
    const requested = pathname === '/' ? 'index.html' : pathname.slice(1);
    const safeAsset = ['index.html', 'motion-rigs-v2.js', 'history-sync.js', 'workout-stats.js', 'supabase-sync.js'].includes(requested)
      ? requested : 'index.html';
    response.setHeader('Content-Type', extname(safeAsset) === '.js' ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
    response.end(await readFile(resolve(root, safeAsset)));
  } catch (error) {
    response.statusCode = 500;
    response.end(String(error));
  }
});
await new Promise(resolveListen => server.listen(0, '127.0.0.1', resolveListen));
const pageUrl = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, [
  '--headless=new', '--no-sandbox', '--disable-gpu',
  `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, pageUrl,
], { stdio: 'ignore' });

const wait = ms => new Promise(resolveWait => setTimeout(resolveWait, ms));
async function getPage() {
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const pages = await fetch(`http://127.0.0.1:${debugPort}/json`).then(response => response.json());
      const page = pages.find(item => item.type === 'page' && item.url.includes('/index.html'));
      if (page) return page;
    } catch {}
    await wait(100);
  }
  throw new Error('Chromium debug page unavailable');
}

let commandId = 0;
function command(ws, method, params = {}) {
  return new Promise((resolveCommand, rejectCommand) => {
    const id = ++commandId;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      ws.removeEventListener('message', onMessage);
      if (message.error || message.result?.exceptionDetails) rejectCommand(new Error(JSON.stringify(message.error || message.result.exceptionDetails)));
      else resolveCommand(message.result);
    };
    ws.addEventListener('message', onMessage);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const evaluate = async (ws, expression) => {
  const result = await command(ws, 'Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  return result.result.value;
};

try {
  const page = await getPage();
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    ws.addEventListener('open', resolveOpen, { once: true });
    ws.addEventListener('error', rejectOpen, { once: true });
  });
  await wait(750);

  const result = await evaluate(ws, `(async () => {
    const api = window.KettlebellMotionV2;
    const visibleBellCount = container => [...container.querySelectorAll('[data-motion-bell]')]
      .filter(node => getComputedStyle(node).display !== 'none').length;
    const surfaces = ['pv-anim', 'wo-anim', 'seq-visual'].map(id => document.getElementById(id));
    const cases = [
      ['Goblet Squat', 1],
      ['Pompes au sol', 0],
      ['Pompe décalée sur kettlebell', 1],
      ['Farmer Carry', 2],
      ['Double KB Front Squat', 2],
      ['Kettlebell Swing', 1]
    ];
    const bellChecks = cases.map(([name, expected]) => {
      const mounted = renderExerciseVisual('pv-anim', name, getVisual(name).svg);
      return { name, mounted, expected, actual: visibleBellCount(surfaces[0]), apiExpected: api.expectedBellCount(name) };
    });
    renderExerciseVisual('pv-anim', 'Goblet Squat', getVisual('Goblet Squat').svg);
    const originalSvg = surfaces[0].firstElementChild;
    const idempotent = api.update(surfaces[0], 'Goblet Squat') && surfaces[0].firstElementChild === originalSvg;
    renderExerciseVisual('wo-anim', 'Kettlebell Swing', getVisual('Kettlebell Swing').svg);
    renderExerciseVisual('seq-visual', 'Turkish Get-Up (D)', getVisual('Turkish Get-Up (D)').svg);
    const actualSurfaces = surfaces.every(container => container.querySelector('.motion-v2-stage'));
    const mountedBeforeFallback = api.snapshot().mounted;
    renderExerciseVisual('wo-anim', null, getVisual('_rest').svg);
    const fallbackWorks = !surfaces[1].querySelector('.motion-v2-stage') && surfaces[1].querySelector('svg');
    return {
      apiEnabled: api?.enabled === true,
      allNamesMapped: api.appExerciseNames.length === 90 && api.appExerciseNames.every(name => api.mapName(name)),
      canonicalCount: api.canonicalProfiles.length,
      maps: [api.mapName('Goblet Squat'), api.mapName('Pompes au sol'), api.mapName('Farmer Carry')],
      badgeCount: document.querySelectorAll('.motion-v2-preprod-badge').length,
      bellChecks, idempotent, actualSurfaces, mountedBeforeFallback,
      mountedAfterFallback: api.snapshot().mounted, fallbackWorks
    };
  })()`);

  const failures = [];
  if (!result.apiEnabled) failures.push('API flag');
  if (!result.allNamesMapped || result.canonicalCount !== 72) failures.push(`catalogue ${result.canonicalCount}/72`);
  if (JSON.stringify(result.maps) !== JSON.stringify(['squat', 'floor-push-up', 'farmer-carry'])) failures.push(`mapping ${result.maps}`);
  if (result.badgeCount !== 0) failures.push(`production badge ${result.badgeCount}`);
  result.bellChecks.forEach(check => {
    if (!check.mounted || check.actual !== check.expected || check.apiExpected !== check.expected) {
      failures.push(`${check.name} bells ${check.actual}/${check.expected} api=${check.apiExpected}`);
    }
  });
  if (!result.idempotent) failures.push('idempotent update');
  if (!result.actualSurfaces || result.mountedBeforeFallback !== 3) failures.push(`surfaces ${result.mountedBeforeFallback}`);
  if (!result.fallbackWorks || result.mountedAfterFallback !== 2) failures.push(`fallback ${result.mountedAfterFallback}`);

  await command(ws, 'Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await wait(150);
  const reduced = await evaluate(ws, `(async () => {
    const api = window.KettlebellMotionV2;
    const before = api.snapshot();
    await new Promise(resolve => setTimeout(resolve, 180));
    const after = api.snapshot();
    return { reduced: before.reducedMotion && after.reducedMotion, mounted: after.mounted };
  })()`);
  if (!reduced.reduced || reduced.mounted !== 2) failures.push('reduced motion lifecycle');

  if (failures.length) throw new Error(`Motion V2 diagnostics failed: ${failures.join(', ')}`);
  console.log(`Motion V2 preprod diagnostics passed: ${result.bellChecks.length} bell-count cases, 3 surfaces, fallback, idempotence, reduced motion.`);
  ws.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
