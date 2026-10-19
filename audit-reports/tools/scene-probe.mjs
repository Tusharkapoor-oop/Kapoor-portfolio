// scene-probe.mjs — behavioral verification of the perf-refactored build:
// 1) all 7 scenes mount after idle-resolve; 2) zero console errors through a
// full scroll sweep; 3) per-scene screenshots for visual regression.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 200)));

mkdirSync('audit-reports/screenshoots', { recursive: true });
await page.goto('http://localhost:4186/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(4200); // preloader intro completes, scenes mount

const scenes = await page.evaluate(() => [...document.querySelectorAll('[data-scene]')].map((el) => el.dataset.scene));
console.log('scenes mounted:', JSON.stringify(scenes));
const docH = await page.evaluate(() => document.documentElement.scrollHeight);
console.log('doc height:', docH);

const ids = ['hero', 'about', 'work', 'journey', 'skills', 'awards', 'contact'];
for (const id of ids) {
  const el = await page.$(`[data-scene="${id}"]`);
  if (!el) { console.log(id, 'MISSING'); continue; }
  const box = await el.boundingBox();
  await page.evaluate((y) => window.scrollTo(0, y), Math.round((box?.y ?? 0) + (box?.height ?? 0) * 0.45));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `audit-reports/screenshoots/perf2-${id}.png` }).catch(() => {});
  console.log('shot', id, 'at y=', Math.round((box?.y ?? 0) + (box?.height ?? 0) * 0.45));
}
writeFileSync('audit-reports/scene-probe.json', JSON.stringify({ scenes, docH, errors }, null, 2));
console.log('console/page errors:', errors.length, errors.slice(0, 6));
await browser.close();
