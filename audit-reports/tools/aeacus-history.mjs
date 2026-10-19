// aeacus-history.mjs — open Aeacus History and open the report saved for our URL (submitted yesterday).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const rec = {};

try {
  await page.goto('https://aeacus.app/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
  const hist = page.locator('button:has-text("History"), a:has-text("History"), [role=tab]:has-text("History")').first();
  await hist.click({ timeout: 8000 });
  await page.waitForTimeout(3500);
  const body = await page.locator('body').innerText();
  rec.historyText = body.slice(0, 4000);

  // find an entry linking our audit: click list rows mentioning kapoor or tushar
  const rows = page.locator('text=/Kapoor-portfolio|tusharkapoor|Kapoor/i').first();
  if (await rows.count()) {
    await rows.click({ timeout: 8000 });
    await page.waitForTimeout(9000);
    const reportText = await page.locator('body').innerText();
    rec.reportText = reportText.slice(0, 12000);
    rec.reportUrl = page.url();
    await page.screenshot({ path: 'audit-reports/external/screens/aeacus-report.png', fullPage: true });
  } else {
    rec.ourEntryFound = false;
    await page.screenshot({ path: 'audit-reports/external/screens/aeacus-history.png', fullPage: true });
  }
} catch (e) {
  rec.error = String(e.message).slice(0, 250);
}
await browser.close();
writeFileSync('audit-reports/external/aeacus-history-2026-10-19.json', JSON.stringify(rec, null, 2));
const t = rec.reportText || rec.historyText || '';
console.log(rec.reportUrl ? 'REPORT URL: ' + rec.reportUrl : 'no report entry opened');
console.log(t.slice(0, 2400));
