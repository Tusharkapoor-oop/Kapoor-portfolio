// Probes: Anton digit metrics, scrollbar behavior with .locked, preloader/manifesto states.
import { chromium } from 'playwright';

const url = process.argv[2] ?? 'http://localhost:4173/';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto(url, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1500);

const probe = await page.evaluate(() => {
  const ctx = document.createElement('canvas').getContext('2d');
  const w = (text, font) => {
    ctx.font = font;
    return Math.round(ctx.measureText(text).width * 100) / 100;
  };
  const out = {};
  out.anton = {
    '0': w('0', '100px Anton'),
    '1': w('1', '100px Anton'),
    '8': w('8', '100px Anton'),
    '000': w('000', '100px Anton'),
    '111': w('111', '100px Anton'),
  };
  out.familiesReady = [...document.fonts]
    .filter((f) => f.status === 'loaded')
    .map((f) => `${f.family}/${f.weight}`)
    .slice(0, 14);
  const html = document.documentElement;
  out.clientWidthUnlocked = html.clientWidth;
  out.lockedNow = html.classList.contains('locked');
  html.classList.add('locked');
  out.clientWidthLocked = html.clientWidth;
  out.overflowYLocked = getComputedStyle(html).overflowY;
  html.classList.remove('locked');
  out.scrollbarGutter = getComputedStyle(html).scrollbarGutter;

  const pre = document.querySelector('.preloader');
  out.preloaderStillThere = !!pre;
  const center = document.querySelector('.pre-center');
  if (center) {
    out.centerOpacity = getComputedStyle(center).opacity;
    out.centerHTML = center.innerHTML.slice(0, 400);
  }
  const mfw = document.querySelector('.mf-w');
  if (mfw) {
    out.mfWOpacity = getComputedStyle(mfw).opacity;
    out.mfWInline = mfw.getAttribute('style');
  }
  const pill = document.querySelector('.hud-pill.on');
  if (pill) out.pillText = pill.textContent;
  return out;
});
console.log(JSON.stringify(probe, null, 2));
await browser.close();
