// paint-probe.mjs — when does the browser actually paint, and what's visible?
// Captures paint entries + longtasks + screenshots at 100/300/700/1200/2000ms.
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 } });
const page = await ctx.newPage();

// observe paints + longtasks from the very first navigation
await page.addInitScript(() => {
  window.__paints = [];
  window.__tasks = [];
  new PerformanceObserver((l) => {
    for (const e of l.getEntries()) window.__paints.push({ name: e.name, t: Math.round(e.startTime) });
  }).observe({ type: 'paint', buffered: true });
  try {
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__tasks.push({ t: Math.round(e.startTime), d: Math.round(e.duration) });
    }).observe({ type: 'longtask', buffered: true });
  } catch {}
});

await page.goto('http://localhost:4186/', { waitUntil: 'load', timeout: 30000 }).catch(() => {});

// sample what's visible early
for (const ms of [100, 300, 700, 1200, 2000]) {
  await page.waitForTimeout(ms === 100 ? 100 : ms - (ms === 300 ? 100 : ms === 700 ? 300 : ms === 1200 ? 700 : 1200));
  const state = await page.evaluate(() => {
    const boot = document.querySelector('.boot, .boot-title');
    const pre = document.querySelector('.preloader, [class*=pre]');
    const cs = (el) => {
      if (!el) return 'absent';
      const s = getComputedStyle(el);
      return s.visibility + '/' + s.opacity + '/' + s.display;
    };
    const fonts = (() => {
      try { return document.fonts.status; } catch { return '?'; }
    })();
    return {
      bootState: cs(boot),
      bootText: boot ? (boot.textContent ?? '').trim().slice(0, 40) : '',
      preloaderState: cs(pre),
      rootChildren: document.getElementById('root')?.children.length ?? -1,
      bootClass: boot?.className ?? '',
      htmlClass: document.documentElement.className,
      loaded: document.readyState,
    };
  });
  await page.screenshot({ path: `audit-reports/screenshoots/paint-${ms}.png` });
  console.log(`@${ms}ms`, JSON.stringify(state));
}

const data = await page.evaluate(() => ({ paints: window.__paints, tasks: (window.__tasks ?? []).slice(0, 14) }));
console.log('paints:', JSON.stringify(data.paints));
console.log('longtasks:', JSON.stringify(data.tasks));
await browser.close();
