// scene-probe3.mjs — precision sweep: slow wheel (600px steps, 140ms) so Lenis
// smoothing keeps up; fine-approach within 120px of target. Odometer text check.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e).slice(0, 200)));

await page.goto('http://localhost:4186/', { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
await page.waitForTimeout(4200);

const tops = await page.evaluate(() => {
  const sy = window.scrollY;
  const out = {};
  document.querySelectorAll('[data-scene]').forEach((el) => {
    const r = el.getBoundingClientRect();
    out[el.dataset.scene] = { top: (r.top + sy) | 0, height: r.height | 0 };
  });
  return out;
});

const wheelTo = async (to, label) => {
  for (let i = 0; i < 200; i++) {
    const y = await page.evaluate(() => window.scrollY);
    const d = to - y;
    if (Math.abs(d) <= 140) break;
    const step = Math.abs(d) < 700 ? Math.sign(d) * Math.min(140, Math.abs(d)) : Math.sign(d) * 600;
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(1000);
  const y = await page.evaluate(() => window.scrollY);
  const drift = (y - to) | 0;
  await page.screenshot({ path: `audit-reports/screenshoots/probe3-${label}.png` });
  console.log(label, 'y=', y | 0, 'target', to | 0, 'drift', drift);
  return y;
};

const odoY = await wheelTo(tops.about.top + tops.about.height * 0.72, 'about-72');
const odoText = await page.evaluate(() =>
  [...document.querySelectorAll('[data-scene="about"] .boot-stats, [data-scene="about"] [class*=statCard], [data-scene="about"] [class*=stat]')].map((el) => el.textContent?.replace(/\s+/g, ' ').trim().slice(0, 60)),
);
console.log('stat cards @about72:', JSON.stringify(odoText));
await wheelTo(tops.about.top + tops.about.height * 0.95, 'about-95');
await wheelTo(tops.work.top + tops.work.height * 0.38, 'work-38');
await wheelTo(tops.work.top + tops.work.height * 0.85, 'work-85');
await wheelTo(tops.journey.top + tops.journey.height * 0.45, 'journey-45');
await wheelTo(tops.skills.top + tops.skills.height * 0.55, 'skills-55');
await wheelTo(tops.awards.top + tops.awards.height * 0.42, 'awards-42');
await wheelTo(tops.contact.top + tops.contact.height * 0.6, 'contact-60');

writeFileSync('audit-reports/scene-probe3.json', JSON.stringify({ tops, errors }, null, 2));
console.log('errors:', errors.length, errors.slice(0, 6));
await browser.close();
