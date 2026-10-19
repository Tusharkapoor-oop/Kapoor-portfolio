// Single-frame capture: node shot-one.mjs <tag> <scene|none> <p> <desktop|mobile>
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [tag = 'focus', scene = 'none', p = '1', vp = 'desktop'] = process.argv.slice(2);
const outDir = `audit-reports/screenshots/${tag}`;
mkdirSync(outDir, { recursive: true });

const viewports = { desktop: { width: 1600, height: 900 }, mobile: { width: 390, height: 844 } };
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: viewports[vp] ?? viewports.desktop });
await page.goto('http://localhost:4173/', { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => !document.querySelector('.preloader'), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(700);

if (scene !== 'none') {
  await page.evaluate(
    ({ scene, p }) => {
      const el = document.querySelector(`[data-scene="${scene}"]`);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const max = el.getBoundingClientRect().height - window.innerHeight;
      window.scrollTo(0, top + Math.max(0, max) * p);
    },
    { scene, p: parseFloat(p) },
  );
  await page.waitForTimeout(1300);
}

const name = `${vp}-${scene}-${p}`;
await page.screenshot({ path: `${outDir}/${name}.png` });
console.log('saved', `${outDir}/${name}.png`);
await browser.close();
