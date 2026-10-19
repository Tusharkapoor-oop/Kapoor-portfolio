// scene-probe2.mjs — wheel-driven full sweep (real Lenis path), absolute
// page offsets, odometer state check at about 75%, HUD pill navigation check.
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
await page.waitForTimeout(4200);

// absolute page tops of each scene, measured at scroll 0
const tops = await page.evaluate(() => {
  const sy = window.scrollY;
  const out = {};
  document.querySelectorAll('[data-scene]').forEach((el) => {
    out[el.dataset.scene] = { top: (el.getBoundingClientRect().top + sy) | 0, height: el.getBoundingClientRect().height | 0 };
  });
  return out;
});
console.log('tops:', JSON.stringify(tops));

// wheel down in steps until reaching `to`, then photograph
const wheelTo = async (to, label) => {
  for (let i = 0; i < 80; i++) {
    const y = await page.evaluate(() => window.scrollY);
    if (y >= to - 40) break;
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(90);
  }
  await page.waitForTimeout(900);
  const y = await page.evaluate(() => window.scrollY);
  await page.screenshot({ path: `audit-reports/screenshoots/perf3-${label}.png` });
  console.log(label, 'settled at y=', y | 0, 'target', to | 0);
};

await wheelTo(tops.about.top + tops.about.height * 0.3, 'about-30');
await wheelTo(tops.about.top + tops.about.height * 0.75, 'about-75');
const odo = await page.evaluate(() => [...document.querySelectorAll('[data-scene="about"] .stat, [data-scene="about"] [class*=odo], [data-scene="about"] .mf-w')].length);
await wheelTo(tops.work.top + tops.work.height * 0.4, 'work-40');
await wheelTo(tops.journey.top + tops.journey.height * 0.4, 'journey-40');
await wheelTo(tops.skills.top + tops.skills.height * 0.5, 'skills-50');
await wheelTo(tops.awards.top + tops.awards.height * 0.4, 'awards-40');
await wheelTo(tops.contact.top + tops.contact.height * 0.55, 'contact-55');

// HUD pill navigation: back to top, then click CONTACT pill (lenis.scrollTo path)
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(700);
await page.click('button:has-text("CONTACT"), [data-pill="contact"], [class*=pill]:has-text("CONTACT")', { timeout: 4000 }).catch((e) => console.log('pill click fail', String(e).slice(0, 80)));
await page.waitForTimeout(3500);
const yPill = await page.evaluate(() => window.scrollY);
console.log('HUD CONTACT pill landed at y=', yPill | 0, '(contact top', tops.contact.top, ')');
await page.screenshot({ path: 'audit-reports/screenshoots/perf3-pill-contact.png' });

writeFileSync('audit-reports/scene-probe2.json', JSON.stringify({ tops, odoTokens: odo, errors }, null, 2));
console.log('console/page errors:', errors.length, errors.slice(0, 6));
await browser.close();
