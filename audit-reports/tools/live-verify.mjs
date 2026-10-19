// live-verify.mjs — deployed-site behavioral audit: scene mounting, Hud pill
// navigation precision, odometer counting, preloader completion, screenshots.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const LIVE = 'http://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 200)));
mkdirSync('audit-reports/screenshoots', { recursive: true });

await page.goto(LIVE, { waitUntil: 'load', timeout: 45000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => !document.querySelector('.preloader'), null, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(2500); // idle-mount window

const scenes = await page.evaluate(() => [...document.querySelectorAll('[data-scene]')].map((el) => el.dataset.scene));
console.log('scenes mounted on live:', JSON.stringify(scenes));

const tops = await page.evaluate(() => {
  const sy = window.scrollY;
  const out = {};
  document.querySelectorAll('[data-scene]').forEach((el) => {
    const r = el.getBoundingClientRect();
    out[el.dataset.scene] = { top: (r.top + sy) | 0, height: r.height | 0 };
  });
  return out;
});
console.log('tops:', JSON.stringify(tops));

// pill navigation precision end to end
const shot = async (name) => { await page.screenshot({ path: `audit-reports/screenshoots/live2-${name}.png` }); };
const wheels = async (to) => {
  for (let i = 0; i < 200; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (Math.abs(to - y) <= 140) break;
    await page.mouse.wheel(0, Math.min(140, Math.max(-140, to - y)) || Math.sign(to - y) * 620);
    await page.waitForTimeout(130);
  }
  await page.waitForTimeout(800);
};
await wheels(tops.contact.top + tops.contact.height * 0.5);
const yMid = await page.evaluate(() => window.scrollY);
await shot('contact-mid');
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(800);
await page.click('button:has-text("CONTACT")', { timeout: 5000 }).catch(() => console.log('pill click failed'));
await page.waitForTimeout(3200);
const yPill = await page.evaluate(() => window.scrollY);
console.log('pill nav → y', yPill | 0, '(contact top', tops.contact.top, ')');
await shot('contact-via-pill');
const stats = await page.evaluate(() => [...document.querySelectorAll('[data-scene="about"] [class*=stat]')].length);
console.log('about stat nodes:', stats);
writeFileSync('audit-reports/live-verify.json', JSON.stringify({ scenes, tops, yMid, yPill, errors }, null, 2));
console.log('errors:', errors.length, errors.slice(0, 5));
await browser.close();
