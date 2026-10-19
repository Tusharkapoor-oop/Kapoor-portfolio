// flip-window.mjs — fine sweep of contact 90→100%: for each 1% step log
// (a) HUD invert-logo class state, (b) whether the curtain visually covers
// the logo (curtain clip edge at logo mid-height), (c) logo computed color.
import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1600, height: 900 } })).newPage();
await page.goto('http://localhost:4186/', { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => !document.querySelector('.preloader'), null, { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(4000);

const info = await page.evaluate(() => {
  const sy = window.scrollY;
  const c = document.querySelector('[data-scene="contact"]');
  const r = c.getBoundingClientRect();
  return { top: r.top + sy, height: r.height, doc: document.documentElement.scrollHeight - window.innerHeight };
});
console.log('contact:', JSON.stringify(info));

const wheelTo = async (to) => {
  for (let i = 0; i < 200; i++) {
    const y = await page.evaluate(() => window.scrollY);
    const d = to - y;
    if (Math.abs(d) <= 60) break;
    await page.mouse.wheel(0, Math.abs(d) < 400 ? Math.sign(d) * 90 : Math.sign(d) * 420);
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(700);
};

// step 90% → 100.5% in 0.6% steps
for (let pct = 90; pct <= 100.6; pct += 0.6) {
  const to = Math.round((info.doc * pct) / 100);
  await wheelTo(to);
  await page.waitForTimeout(350);
  const state = await page.evaluate(() => {
    const logo = document.querySelector('.hud-logo');
    const root = document.querySelector('div.hud');
    const cs = document.querySelector('[data-scene="contact"] .curtain');
    const lr = logo.getBoundingClientRect();
    const cr = cs ? window.getComputedStyle(cs).clipPath : 'none';
    const col = window.getComputedStyle(logo).color;
    return { flipped: root.classList.contains('invert-logo'), color: col, clip: cr.slice(0, 90), logoRight: lr.right | 0 };
  });
  // curtain edge x at logo mid-height from clip polygon points
  const m = state.clip.match(/polygon\(0 0px, ([\d.]+)px 0/);
  const edgeTop = m ? parseFloat(m[1]) : -1;
  const covered = edgeTop > state.logoRight - 10;
  console.log(
    String(pct.toFixed(1)).padStart(5),
    '| flipped:', state.flipped ? 'WHITE' : 'dark ',
    '| edgeTop', edgeTop.toFixed(0),
    '| logoRight', state.logoRight,
    '| covered:', covered ? 'yes' : 'no ',
    '| unreadable:', covered && !state.flipped ? '*** YES ***' : 'no',
  );
  await page.screenshot({ path: `audit-reports/screenshoots/flip-${String(pct).replace('.', '_').padStart(5, '0')}.png` }).catch(() => {});
}
await browser.close();
