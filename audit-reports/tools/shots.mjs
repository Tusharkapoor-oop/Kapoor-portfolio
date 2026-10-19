// Captures before/after screenshots of the local preview at key scroll states.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const tag = process.argv[2] ?? 'before';
const url = process.argv[3] ?? 'http://localhost:4173/';
const outDir = `audit-reports/screenshots/${tag}`;
mkdirSync(outDir, { recursive: true });

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
  await page.waitForTimeout(1300);
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page
    .waitForFunction(() => !document.querySelector('.boot') && !document.querySelector('.preloader'), null, {
      timeout: 15000,
    })
    .catch(() => {});
  await page.waitForTimeout(900);
}

async function capture(page, name) {
  await page.screenshot({ path: `${outDir}/${name}.png` });
  console.log('shot', `${outDir}/${name}.png`);
}

const browser = await chromium.launch();

const desktop = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await desktop.goto(url, { waitUntil: 'load' });
await settle(desktop);
await capture(desktop, 'desktop-hero');
await scrollScene(desktop, 'about', 1);
await capture(desktop, 'desktop-about-end');
await scrollScene(desktop, 'contact', 1);
await capture(desktop, 'desktop-contact-end');
await desktop.close();

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto(url, { waitUntil: 'load' });
await settle(mobile);
await capture(mobile, 'mobile-hero');
await scrollScene(mobile, 'contact', 1);
await capture(mobile, 'mobile-contact-end');
await mobile.close();

await browser.close();
