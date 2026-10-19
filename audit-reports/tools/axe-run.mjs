// Runs axe-core at resting scroll states (hero, about-end, contact-end) on desktop + mobile.
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const tag = process.argv[2] ?? 'before';
const url = process.argv[3] ?? 'http://localhost:4173/';
const axeSource = readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
mkdirSync('audit-reports/axe', { recursive: true });

const states = [
  ['hero', null, 0],
  ['about-end', 'about', 1],
  ['work-end', 'work', 1],
  ['journey-end', 'journey', 1],
  ['skills-end', 'skills', 1],
  ['awards-end', 'awards', 1],
  ['contact-end', 'contact', 1],
];

async function scrollScene(page, id, p) {
  await page.evaluate(
    ({ id, p }) => {
      const el = document.querySelector(`[data-scene="${id}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const max = el.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo(0, top + Math.max(0, max) * p);
    },
    { id, p },
  );
  await page.waitForTimeout(1000);
}

const out = { url, tag, axeVersion: null, states: {} };
const browser = await chromium.launch();

for (const vp of [
  { name: 'desktop', width: 1600, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
]) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    bypassCSP: true, // shipped page sets a meta CSP; axe injects its checker as an inline script
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'load' });
  await page.addScriptTag({ content: axeSource });
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(() => !document.querySelector('.boot') && !document.querySelector('.preloader'), null, {
      timeout: 15000,
    })
    .catch(() => {});
  await page.waitForTimeout(700);

  for (const [state, scene, p] of states) {
    if (scene) await scrollScene(page, scene, p);
    else await page.waitForTimeout(600);
    const res = await page.evaluate(async () => {
      const r = await window.axe.run(document, { resultTypes: ['violations', 'incomplete'] });
      return {
        version: r.testEngine.version,
        violations: r.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          helpUrl: v.helpUrl,
          tags: v.tags,
          nodes: v.nodes.map((n) => ({
            target: n.target.join(' '),
            html: (n.html ?? '').slice(0, 180),
            failure: (n.failureSummary ?? '').replace(/\n/g, ' ').slice(0, 220),
          })),
        })),
        incomplete: r.incomplete.map((v) => ({
          id: v.id,
          nodes: v.nodes.length,
          targets: v.nodes.slice(0, 40).map((n) => n.target.join(' ')),
        })),
      };
    });
    out.axeVersion = res.version;
    out.states[`${vp.name}-${state}`] = { violations: res.violations, incomplete: res.incomplete };
    console.log(`${vp.name}-${state}: ${res.violations.length} violations`);
  }
  await context.close();
}

await browser.close();
writeFileSync(`audit-reports/axe/${tag}.json`, JSON.stringify(out, null, 2));
console.log('axe saved →', `audit-reports/axe/${tag}.json`);
