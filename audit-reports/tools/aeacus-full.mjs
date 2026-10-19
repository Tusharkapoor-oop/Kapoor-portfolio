// aeacus-full.mjs — reopen audit 1155 and capture the ENTIRE report text (no truncation).
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
try {
  await page.goto('https://aeacus.app/audits/1155', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(3000);
  // scroll to bottom to force any lazy sections
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 1200); await page.waitForTimeout(400); }
  const body = await page.locator('body').innerText();
  writeFileSync('audit-reports/external/aeacus-report-1155-FULL.txt', body);
  console.log('saved full report text:', body.length, 'chars');
  const i = body.indexOf('UX Audit');
  if (i >= 0) console.log('UX section preview:\n' + body.slice(i, i + 900));
} catch (e) { console.log('error', String(e).slice(0, 200)); }
await browser.close();
