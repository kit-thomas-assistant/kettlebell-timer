#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-mobility-test-'));
const debugPort = 12000 + Math.floor(Math.random() * 20000);
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  const asset = ['motion-rigs-v2.js', 'history-sync.js', 'workout-stats.js', 'supabase-sync.js'].includes(pathname.slice(1))
    ? pathname.slice(1)
    : 'index.html';
  response.setHeader('Content-Type', asset.endsWith('.js') ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8');
  response.end(await readFile(resolve(asset)));
});
await new Promise(done => server.listen(0, '127.0.0.1', done));
const url = `http://127.0.0.1:${server.address().port}/index.html`;
const browser = spawn(chromium, ['--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, url], { stdio: 'ignore' });
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
    setLang('fr');
    const launch = document.getElementById('mobility-launch');
    const homepagePlacementWorks = launch.previousElementSibling?.id === 'guided-disclosure'
      && launch.nextElementSibling?.id === 'equipment-group'
      && launch.querySelector('strong').textContent === 'Mobilité hanches'
      && launch.querySelector('small').textContent === '7 mouvements · 8–10 min · sans matériel'
      && launch.querySelector('.mobility-cta').textContent === 'Lancer la routine →';

    const expected = [
      ['Fente avant dynamique', '10 par côté'],
      ['Mobilité latérale hanches/adducteurs', '10 par côté'],
      ['Squat profond mains au sol', '10 reps'],
      ['Elephant Walk', '10 par côté'],
      ['Transitions 90/90', '10 au total'],
      ['Squat Cosaque assisté', '10 par côté'],
      ['Squat cavalier', '10 reps contrôlées'],
    ];
    const exactRoutineWorks = JSON.stringify(MOBILITY_ROUTINE.exercises.map(exercise => [exercise.name, exercise.target])) === JSON.stringify(expected);
    const svgAndCoachingWork = MOBILITY_ROUTINE.exercises.every(exercise => {
      const visual = getVisual(exercise.name);
      return visual.svg.includes('<svg') && visual.svg.includes('mobility-motion') && visual.steps.length === 4
        && EX_NAME_EN[exercise.name] && EX_STEPS_EN[exercise.name]?.length === 4;
    });

    localStorage.setItem('kb_history', JSON.stringify([{ id: 'before', date: new Date().toISOString(), modeId: 'circuit', duration: 10 }]));
    launch.click();
    const launchWorks = document.getElementById('sequence-runner').style.display === 'flex'
      && document.getElementById('sequence-runner').classList.contains('is-mobility')
      && document.getElementById('seq-clock').textContent === '1 / 7'
      && document.getElementById('seq-round').textContent === 'Mouvement 1 sur 7'
      && document.getElementById('seq-checklist').children.length === 7
      && !document.getElementById('mobility-quality-cue').hidden
      && document.getElementById('mobility-quality-cue').textContent.includes('amplitude utile')
      && document.getElementById('mobility-quality-cue').textContent.includes('douleur vive')
      && document.getElementById('seq-pause').hidden
      && getComputedStyle(document.getElementById('seq-demo')).display === 'none';
    advanceSequence();
    const manualNextWorks = runnerIndex === 1
      && document.getElementById('seq-clock').textContent === '2 / 7'
      && document.getElementById('seq-name').textContent === 'Mobilité latérale hanches/adducteurs';
    while (runnerIndex < runnerExercises.length - 1) advanceSequence();
    const lastActionWorks = document.getElementById('seq-next').textContent === 'Terminer la routine';
    advanceSequence();
    const completionWorks = document.getElementById('mobility-complete').style.display === 'flex'
      && document.getElementById('mobility-complete-title').textContent === 'Routine terminée'
      && JSON.parse(localStorage.getItem('kb_history')).length === 1
      && JSON.parse(localStorage.getItem('kb_history'))[0].id === 'before';

    setLang('en');
    const englishWorks = document.getElementById('mobility-card-title').textContent === 'Hip mobility'
      && document.getElementById('mobility-card-meta').textContent === '7 movements · 8–10 min · no equipment'
      && document.getElementById('mobility-complete-title').textContent === 'Routine complete'
      && t('mobilityQualityCue').includes('sharp pain or instability');
    return { homepagePlacementWorks, exactRoutineWorks, svgAndCoachingWork, launchWorks, manualNextWorks, lastActionWorks, completionWorks, englishWorks };
  })()`);

  await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  const mobile390 = await evaluate(websocket, `(() => {
    setLang('fr');
    showOnly('setup');
    document.getElementById('mobility-launch').click();
    const columns = getComputedStyle(document.getElementById('seq-checklist')).gridTemplateColumns.split(' ').filter(Boolean);
    const next = document.getElementById('seq-next').getBoundingClientRect();
    return { mobile390LayoutWorks: columns.length === 2 && next.width >= 240 && next.right <= 390 };
  })()`);

  await call(websocket, 'Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true });
  const mobile = await evaluate(websocket, `(() => {
    setLang('fr');
    showOnly('setup');
    const launch = document.getElementById('mobility-launch');
    const setupFits = document.documentElement.scrollWidth <= 320 && launch.getBoundingClientRect().width <= 320 && launch.getBoundingClientRect().height >= 44;
    launch.click();
    const runner = document.getElementById('sequence-runner');
    const runnerFits = document.documentElement.scrollWidth <= 320 && runner.scrollWidth <= runner.clientWidth
      && document.getElementById('seq-next').getBoundingClientRect().height >= 44
      && document.getElementById('seq-stop').getBoundingClientRect().height >= 44;
    return { mobile320AndTouchWorks: setupFits && runnerFits };
  })()`);

  const source = await readFile(resolve('index.html'), 'utf8');
  const combined = {
    ...result,
    ...mobile390,
    ...mobile,
    reducedMotionWorks: source.includes('@media (prefers-reduced-motion: reduce)') && source.includes('.mobility-motion { animation: none !important; }'),
  };
  console.log(JSON.stringify(combined, null, 2));
  if (Object.values(combined).some(value => value !== true)) process.exitCode = 1;
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
