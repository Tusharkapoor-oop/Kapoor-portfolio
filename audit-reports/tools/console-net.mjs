// Captures console errors + failed/4xx network responses across a full scroll pass (desktop + mobile).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const tag = process.argv[2] ?? 'before';
const url = process.argv[3] ?? 'http://localhost:4173/';

const out = { url, tag, runs: {} };

async function fullScroll(page) {
  const scenes = await page.evaluate(() => {
    const ids = [...document.querySelectorAll('[data-scene]')].map((el) => el.dataset.scene);
    return ids;
  });
  for (const id of scenes) {
    await page.evaluate((id) => {
      const el = document.querySelector(`[data-scene="${id}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const max = el.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo(0, top + Math.max(0, max));
    }, id);
    await page.waitForTimeout(800);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
}

const browser = await chromium.launch();
for (const vp of [
  { name: 'desktop', width: 1600, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
  const consoleMsgs = [];
  const failed = [];
  const bad = [];
  page.on('console', (m) => {
    if (['error', 'warning'].includes(m.type())) consoleMsgs.push({ type: m.type(), text: m.text().slice(0, 300) });
  });
  page.on('pageerror', (e) => consoleMsgs.push({ type: 'pageerror', text: String(e).slice(0, 300) }));
  page.on('requestfailed', (r) => failed.push({ url: r.url(), err: r.failure()?.errorText }));
  page.on('response', (r) => {
    if (r.status() >= 400) bad.push({ url: r.url(), status: r.status() });
  });

  await page.goto(url, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(() => !document.querySelector('.preloader'), null, { timeout: 15000 })
    .catch(() => {});
  await page.waitForTimeout(800);
  await fullScroll(page);
  await page.waitForTimeout(500);

  out.runs[vp.name] = { console: consoleMsgs, requestFailed: failed, badStatuses: bad };
  console.log(`${vp.name}: ${consoleMsgs.length} console, ${failed.length} failed, ${bad.length} bad-status`);
  await page.close();
}

await browser.close();
writeFileSync(`audit-reports/console-net-${tag}.json`, JSON.stringify(out, null, 2));
console.log('saved →', `audit-reports/console-net-${tag}.json`);
