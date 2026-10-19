// external-verify.mjs — one focused re-check of services that accepted a submission:
// wait up to 75s watching for report text (scores/results), then snapshot whatever state exists.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const PORTFOLIO_URL = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const spots = [
  { name: 'Aeacus', url: 'https://aeacus.app/' },
  { name: 'AI Website Critic', url: 'https://www.aiwebsitecritic.com/' },
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const out = [];

for (const s of spots) {
  const rec = { service: s.name };
  const page = await ctx.newPage();
  try {
    await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    const inputs = page.locator('input[type=url], input[name*=url i], input[placeholder*="http" i], input[placeholder*="website" i], input[placeholder*="your" i], input[name*=link i]');
    await inputs.first().fill(PORTFOLIO_URL, { timeout: 8000 });
    const submit = page
      .locator('form button[type=submit], form input[type=submit], form button:has-text("analy"), form button:has-text("submit"), form button:has-text("check"), form button:has-text("audit"), form button:has-text("audite"), form button:has-text("review"), form button:has-text("run"), form button:has-text("get")')
      .first();
    if (await submit.count()) {
      const [nav] = await Promise.all([
        page.waitForNavigation({ timeout: 15000 }).catch(() => null),
        submit.click().catch(() => {}),
      ]);
      rec.postSubmitNav = nav ? page.url() : null;
      // Watch for any score/report for up to 75s
      let found = null;
      const start = Date.now();
      while (Date.now() - start < 75000 && !found) {
        const bodyText = await page.locator('body').innerText({ timeout: 5000 }).catch(() => '');
        const m = bodyText.match(/(\d{2,3})\s*(?:\/\s*(?:100|10)\b|%)/);
        const hasReport = /report for|analysis (?:complete|of)|here is your|score of|verdict|findings/i.test(bodyText);
        if (m || hasReport) { found = { matched: m ? m[1] : hasReport, headline: bodyText.slice(0, 700) }; break; }
        await page.waitForTimeout(2500);
      }
      rec.observedAfterWait = found ? { hit: true, headline: found.headline } : { hit: false, waitedMs: 75000, finalUrl: page.url(), finalTitle: await page.title() };
      await page.screenshot({ path: `audit-reports/external/screens/${s.name.replace(/\W+/g, '-').toLowerCase()}-verified.png`, fullPage: false });
    } else {
      rec.postSubmitNav = null;
      rec.observedAfterWait = { hit: false, reason: 'submit control not found on this pass' };
    }
  } catch (e) {
    rec.error = String(e.message).slice(0, 200);
  }
  await page.close();
  out.push(rec);
  console.log(rec.service, '->', JSON.stringify(rec.observedAfterWait || rec).slice(0, 240));
}

await browser.close();
writeFileSync('audit-reports/external/verify-2026-10-18.json', JSON.stringify(out, null, 2));
console.log('saved -> audit-reports/external/verify-2026-10-18.json');
