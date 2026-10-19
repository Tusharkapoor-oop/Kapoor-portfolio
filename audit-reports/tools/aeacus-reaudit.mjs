// aeacus-audit.mjs — submit the portfolio URL to Aeacus, wait for its audit result, extract scores.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const PORTFOLIO_URL = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const rec = { service: 'Aeacus', submitted: false, audit: null };

try {
  await page.goto('https://aeacus.app/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});

  // Aeacus app: find the new-audit URL input
  const inputs = page.locator('input[type=url], input[name*=url i], input[placeholder*="http" i], input[placeholder*="website" i], input[placeholder*="your" i], input[name*=link i]');
  await inputs.first().fill(PORTFOLIO_URL, { timeout: 8000 });
  rec.subfilled = true;

  const submit = page.locator('form button[type=submit], form input[type=submit], button:has-text("analy"), button:has-text("submit"), button:has-text("audit"), button:has-text("run"), button:has-text("start"), button:has-text("go")').first();
  await submit.click({ timeout: 8000 });
  rec.submitted = true;

  // Wait for the audit to finish: watch for a state mentioning our domain + score-like content
  const start = Date.now();
  while (Date.now() - start < 180000) {
    const text = await page.locator('body').innerText({ timeout: 8000 }).catch(() => '');
    const hasOurSite = /kapoor-portfolio|tushar/i.test(text);
    if (hasOurSite) {
      // Wait extra seconds for score to settle, then capture
      await page.waitForTimeout(8000);
      rec.audit = {
        at: new Date().toISOString(),
        urlAtCapture: page.url(),
        title: await page.title(),
        bodyExtract: text.slice(0, 4000),
      };
      break;
    }
    // Not mentioning our site yet — is the app stuck? capture URL occasionally
    if (Date.now() - start > 150000) { rec.timeoutBodyExtract = text.slice(0, 1500); }
    await page.waitForTimeout(4000);
  }
  await page.screenshot({ path: 'audit-reports/external/screens/aeacus-audit.png', fullPage: true });
  rec.screenshot = 'audit-reports/external/screens/aeacus-audit.png';
} catch (e) {
  rec.error = String(e.message).slice(0, 250);
}
await browser.close();
writeFileSync('audit-reports/external/aeacus-reaudit-2026-10-19.json', JSON.stringify(rec, null, 2));
console.log(JSON.stringify(rec, null, 2).slice(0, 3000));
console.log('saved -> audit-reports/external/aeacus-reaudit-2026-10-19.json');

