// aeacus-patient.mjs — submit once, poll up to 210s for our report, then check History for the saved entry.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const PORTFOLIO_URL = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const rec = { service: 'Aeacus', when: new Date().toISOString() };

try {
  await page.goto('https://aeacus.app/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  const inputs = page.locator('input[type=url], input[name*=url i], input[placeholder*="http" i], input[placeholder*="website" i], input[placeholder*="your" i], input[name*=link i]');
  await inputs.last().fill(PORTFOLIO_URL, { timeout: 8000 });
  await inputs.last().press('Enter', { timeout: 8000 });
  rec.submittedLocal = true;

  // Poll for a report view mentioning our domain with score-like layout
  const start = Date.now();
  let lastText = '';
  while (Date.now() - start < 210000) {
    const text = await page.locator('body').innerText({ timeout: 8000 }).catch(() => '');
    lastText = text;
    const hasKapoor = /Kapoor-portfolio/i.test(text);
    const isReportView = /Overall|Overall Score|Priority Fixes|Critical|Strengths|Weaknesses/i.test(text);
    if (hasKapoor && isReportView) {
      await page.waitForTimeout(6000);
      const text2 = await page.locator('body').innerText({ timeout: 8000 }).catch(() => text);
      rec.report = { at: new Date().toISOString(), url: page.url(), text: text2.slice(0, 9000) };
      break;
    }
    await page.waitForTimeout(5000);
  }

  if (!rec.report) {
    // Check History tab for the saved audit
    const hist = page.locator('button:has-text("History"), a:has-text("History"), [role=tab]:has-text("History")').first();
    if (await hist.count()) await hist.click({ timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(4000);
    const htext = await page.locator('body').innerText().catch(() => '');
    rec.historyAfterWait = htext.slice(0, 2500);
    rec.bodyTailStillRunning = lastText.includes('Running Audit') || lastText.includes('Fetching');
  }
  await page.screenshot({ path: 'audit-reports/external/screens/aeacus-patient.png', fullPage: true });
} catch (e) {
  rec.error = String(e.message).slice(0, 250);
}
await browser.close();
writeFileSync('audit-reports/external/aeacus-patient-2026-10-18.json', JSON.stringify(rec, null, 2));
console.log('report? ', !!rec.report);
if (rec.report) console.log(rec.report.text.slice(0, 2600));
else console.log(JSON.stringify(rec).slice(0, 1200));
