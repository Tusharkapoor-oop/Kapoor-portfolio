// series-shots.mjs — regenerate the prior session's after-desktop-<pct> series
// (0/14/30/48/65/80/93/100 % page progress, 1600x900) so the perf-refactored
// build can be A/B-checked against the saved baseline frames.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const PCT = [0, 14, 30, 48, 65, 80, 93, 100];
const url = 'http://localhost:4186/';
const outDir = 'audit-reports/screenshoots/series-after-perf';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });

await page.goto(url, { waitUntil: 'load', timeout: 30000 });
await page.evaluate(() => document.fonts.ready);
await page
  .waitForFunction(() => !document.querySelector('.boot') && !document.querySelector('.preloader'), null, { timeout: 15000 })
  .catch(() => {});
await page.waitForTimeout(900);

const docH = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
console.log('scrollable:', docH);

for (const pct of PCT) {
  const to = Math.round((docH * pct) / 100);
  for (let i = 0; i < 200; i++) {
    const y = await page.evaluate(() => window.scrollY);
    const d = to - y;
    if (Math.abs(d) <= 120) break;
    await page.mouse.wheel(0, Math.abs(d) < 700 ? Math.sign(d) * 140 : Math.sign(d) * 620);
    await page.waitForTimeout(130);
  }
  await page.waitForTimeout(950);
  const y = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: `${outDir}/after-desktop-${String(pct).padStart(3, '0')}.png` });
  console.log('shot', pct + '%', 'at', y | 0, '(target', to, ')');
}
writeFileSync('audit-reports/screenshoots/series-after-perf/errors.json', JSON.stringify(errors, null, 2));
console.log('page errors:', errors.length);
await browser.close();
