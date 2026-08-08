#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const chromium = process.env.CHROMIUM_BIN || '/snap/bin/chromium';
const profile = await mkdtemp(join(tmpdir(), 'kb-consistency-test-'));
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

let cdpId = 1;
function cdpCall(websocket, method, params = {}) {
  return new Promise((resolveCall, reject) => {
    const id = cdpId++;
    const onMessage = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      websocket.removeEventListener('message', onMessage);
      if (message.error || message.result?.exceptionDetails) {
        reject(new Error(JSON.stringify(message.error || message.result?.exceptionDetails)));
      } else {
        resolveCall(message.result);
      }
    };
    websocket.addEventListener('message', onMessage);
    websocket.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(websocket, expression) {
  const result = await cdpCall(websocket, 'Runtime.evaluate', {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result.result.value;
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
    const session = date => ({ date: date.toISOString(), mode: 'Circuit', duration: 20, exercises: [] });
    const dateAt = (year, month, day, hour = 12) => new Date(year, month, day, hour);
    const now = dateAt(2026, 6, 29);
    const history = [
      session(dateAt(2026, 6, 27)),
      session(dateAt(2026, 6, 28)),
      session(dateAt(2026, 6, 20)),
      session(dateAt(2026, 6, 21)),
      session(dateAt(2026, 6, 22)),
      session(dateAt(2026, 6, 13)),
      session(dateAt(2026, 6, 14)),
      session(dateAt(2026, 6, 15)),
      session(dateAt(2026, 6, 6)),
      session(dateAt(2026, 6, 7)),
      session(dateAt(2026, 6, 8)),
    ];

    const dayAggregation = aggregateSessionsByDay([
      session(dateAt(2026, 6, 27, 8)),
      session(dateAt(2026, 6, 27, 18)),
      { date: 'invalid' },
    ]);
    const weekAggregation = aggregateSessionsByWeek(history);
    const pureAggregationWorks = dayAggregation['2026-07-27'] === 2
      && weekAggregation['2026-07-27'] === 2
      && weekAggregation['2026-07-20'] === 3;

    const incompleteCurrent = weeklyConsistency(history, now);
    const incompleteWeekDoesNotBreakStreak = incompleteCurrent.currentCount === 2
      && incompleteCurrent.streak === 3;
    const completedHistory = [session(dateAt(2026, 6, 29)), ...history];
    const completedCurrent = weeklyConsistency(completedHistory, now);
    const completedWeekExtendsStreak = completedCurrent.currentCount === 3
      && completedCurrent.streak === 4;
    const heatmapShapeWorks = buildConsistencyHeatmap(history, now).length === 12
      && buildConsistencyHeatmap(history, now).every(week => week.length === 7)
      && buildConsistencyHeatmap(history, now).flat().at(-1).key === '2026-08-02';

    setLang('fr');
    localStorage.removeItem('kb_history');
    renderConsistency(now);
    const historyButton = document.getElementById('history-btn');
    const emptyStateWorks = historyButton.textContent.includes('Ta première semaine commence ici')
      && historyButton.textContent.includes('0 / 3 cette semaine');

    localStorage.setItem('kb_history', JSON.stringify(history));
    renderConsistency(now);
    const cells = [...historyButton.querySelectorAll('.consistency-day')];
    const progressUiWorks = historyButton.textContent.includes('2 / 3 cette semaine')
      && historyButton.textContent.includes('3 semaines dans le rythme')
      && historyButton.querySelectorAll('.consistency-marker.is-done').length === 2;
    const heatmapUiWorks = cells.length === 84
      && cells.filter(cell => cell.classList.contains('has-session')).length === 11
      && cells.every(cell => cell.title && cell.getAttribute('aria-label'))
      && historyButton.querySelector('.consistency-heatmap').getAttribute('aria-label').includes('12 dernières semaines');
    const ctaOrderWorks = document.getElementById('go-btn').compareDocumentPosition(historyButton)
      & Node.DOCUMENT_POSITION_FOLLOWING;
    const accessibleControlWorks = parseFloat(getComputedStyle(historyButton).minHeight) >= 44
      && Boolean(historyButton.getAttribute('aria-label'));

    historyButton.click();
    await new Promise(requestAnimationFrame);
    const historyOpenWorks = document.getElementById('history-modal').style.display === 'flex'
      && document.activeElement === document.getElementById('history-close');
    closeHistory();

    setLang('en');
    renderConsistency(now);
    const englishUiWorks = historyButton.textContent.includes('2 / 3 this week')
      && historyButton.textContent.includes('3 weeks in rhythm')
      && historyButton.textContent.includes('View details');

    localStorage.removeItem('kb_history');
    selectedRecipe = null;
    saveSession('circuit', 20, ['Goblet Squat']);
    const saveRerendersWorks = historyButton.textContent.includes('1 / 3 this week')
      && historyButton.querySelectorAll('.consistency-marker.is-done').length === 1;

    const oversizedHistory = Array.from({ length: 205 }, (_, index) =>
      session(new Date(Date.now() - index * 86400000))
    );
    localStorage.setItem('kb_history', JSON.stringify(oversizedHistory));
    saveSession('circuit', 20, ['Goblet Squat']);
    const retentionWorks = JSON.parse(localStorage.getItem('kb_history')).length === 200;

    localStorage.setItem('kb_history', JSON.stringify([{ date: dateAt(2026, 6, 27).toISOString(), mode: 'Circuit' }]));
    setLang('fr');
    renderConsistency(now);
    const legacyHistoryWorks = historyButton.querySelectorAll('.consistency-day.has-session').length === 1;

    return {
      pureAggregationWorks,
      incompleteWeekDoesNotBreakStreak,
      completedWeekExtendsStreak,
      heatmapShapeWorks,
      emptyStateWorks,
      progressUiWorks,
      heatmapUiWorks,
      ctaOrderWorks: Boolean(ctaOrderWorks),
      accessibleControlWorks,
      historyOpenWorks,
      englishUiWorks,
      saveRerendersWorks,
      retentionWorks,
      legacyHistoryWorks,
    };
  })()`);

  await cdpCall(websocket, 'Emulation.setDeviceMetricsOverride', {
    width: 320,
    height: 800,
    deviceScaleFactor: 1,
    mobile: true,
  });
  const mobileResult = await evaluate(websocket, `(() => {
    renderConsistency(new Date(2026, 6, 29, 12));
    const button = document.getElementById('history-btn');
    const rect = button.getBoundingClientRect();
    return {
      mobileLayoutWorks: button.scrollWidth <= button.clientWidth
        && rect.left >= 0
        && rect.right <= document.documentElement.clientWidth
        && document.querySelectorAll('.consistency-day').length === 84,
    };
  })()`);

  const combined = { ...result, ...mobileResult };
  const failed = Object.entries(combined).filter(([, value]) => value !== true);
  console.log(JSON.stringify(combined, null, 2));
  if (failed.length) process.exitCode = 1;

  if (process.env.CONSISTENCY_QA_DIR) {
    await mkdir(process.env.CONSISTENCY_QA_DIR, { recursive: true });
    await evaluate(websocket, `(() => {
      const now = new Date();
      const monday = localWeekStart(now);
      const sample = [0, 1, -7, -6, -5, -14, -13, -12].map(offset => ({
        date: addLocalDays(monday, offset).toISOString(),
        mode: 'Circuit',
        duration: 20,
        exercises: ['Goblet Squat'],
      }));
      localStorage.setItem('kb_history', JSON.stringify(sample));
      setLang('fr');
      renderConsistency(now);
      window.scrollTo(0, document.body.scrollHeight);
    })()`);
    await cdpCall(websocket, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: true,
    });
    const screenshot = await cdpCall(websocket, 'Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    await writeFile(
      join(process.env.CONSISTENCY_QA_DIR, 'consistency-mobile.png'),
      Buffer.from(screenshot.data, 'base64'),
    );
    console.log(`QA screenshot: ${process.env.CONSISTENCY_QA_DIR}`);
  }
  websocket.close();
} finally {
  browser.kill('SIGTERM');
  server.close();
}
