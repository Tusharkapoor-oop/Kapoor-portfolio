// Samples the hero CTA's computed colors/opacity chain during the preloader
// sequence at 120ms intervals to find exactly what Lighthouse caught.
import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.goto('http://localhost:4173/', { waitUntil: 'load' });

const samples = [];
for (let i = 0; i < 40; i++) {
  const s = await page.evaluate(() => {
    const cta = document.querySelector('.hero-ctas a.btn');
    const span = cta?.querySelector('.btn-roll > span:first-child');
    const out = { t: Math.round(performance.now()) };
    out.pre = !!document.querySelector('.preloader');
    if (cta && span) {
      const cs = getComputedStyle(cta);
      out.btnBg = cs.backgroundColor;
      const ss = getComputedStyle(span);
      out.spanColor = ss.color;
      let o = 1;
      let el = span;
      while (el && el !== document.body) {
        o *= parseFloat(getComputedStyle(el).opacity);
        el = el.parentElement;
      }
      out.chain = +o.toFixed(4);
      const r = cta.getBoundingClientRect();
      out.pos = `${Math.round(r.left)},${Math.round(r.top)}`;
      const at = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      out.topEl = at ? `${at.tagName}.${String(at.className).split(' ')[0]}` : null;
    }
    const pc = document.querySelector('.pre-center');
    out.pcOp = pc ? getComputedStyle(pc).opacity : null;
    const half = document.querySelector('.pre-top');
    out.halfY = half ? getComputedStyle(half).transform : null;
    const cnt = document.querySelector('.pre-count');
    out.cntOp = cnt ? getComputedStyle(cnt).opacity : null;
    const mainEl = document.querySelector('main');
    out.mainVis = mainEl ? getComputedStyle(mainEl).visibility : null;
    const hudEl = document.querySelector('.hud');
    out.hudVis = hudEl ? getComputedStyle(hudEl).visibility : null;
    return out;
  });
  samples.push(s);
  await page.waitForTimeout(120);
}
for (const s of samples) console.log(JSON.stringify(s));
await browser.close();
