// before-shots.mjs — fresh before.png screenshots of the live portfolio at desktop + mobile.
import { chromium } from 'playwright';
const URL = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const browser = await chromium.launch();
// desktop
const d = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await d.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await d.waitForTimeout(4000);
await d.screenshot({ path: 'audit-reports/screenshoots/live2-desktop-hero.png' }).catch(() => {});
await d.evaluate(() => window.scrollTo(0, 2200)).catch(() => {});
await d.waitForTimeout(2500);
await d.screenshot({ path: 'audit-reports/screenshoots/live2-desktop-scrolled.png' }).catch(() => {});
// mobile
const m = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await m.goto(URL, { waitUntil: 'networkidle', timeout: 60000 }).catch(() => {});
await m.waitForTimeout(4000);
await m.screenshot({ path: 'audit-reports/screenshoots/live2-mobile-hero.png' }).catch(() => {});
await m.evaluate(() => window.scrollTo(0, 2200)).catch(() => {});
await m.waitForTimeout(2500);
await m.screenshot({ path: 'audit-reports/screenshoots/live2-mobile-scrolled.png' }).catch(() => {});
await browser.close();
console.log('before shots saved');
