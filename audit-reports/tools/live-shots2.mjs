// live-shots2.mjs — hero + about + skills states on the LIVE site.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const LIVE = 'http://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
mkdirSync('audit-reports/screenshoots', { recursive: true });
await page.goto(LIVE, { waitUntil: 'load', timeout: 45000 });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => !document.querySelector('.preloader'), null, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(2200);
await page.screenshot({ path: 'audit-reports/screenshoots/live2-hero.png' });
console.log('hero shot done');
await browser.close();
