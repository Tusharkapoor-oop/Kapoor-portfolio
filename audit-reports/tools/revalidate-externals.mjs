// revalidate-externals.mjs — post-deploy re-runs of the completable external
// auditors (WebsiteValidator + AI Website Critic free pass) against the live URL.
// Records exactly what happens; no bypassing of signup walls.
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'node:fs';

const live = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
mkdirSync('audit-reports/external', { recursive: true });
const browser = await chromium.launch({ headless: true });
const out = { at: new Date().toISOString(), live };

// --- WebsiteValidator -------------------------------------------------------
{
  const rec = { service: 'WebsiteValidator', status: 'unknown' };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://websitevalidator.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const input = page.locator('input[type=url], input[name*=url i], input[placeholder*="http" i], input[name*=website i], input[name*=link i]').first();
    await input.fill(live, { timeout: 8000 });
    const btn = page.locator('button:has-text("check"), button:has-text("audit"), button:has-text("valid"), button:has-text("analy"), button[type=submit], input[type=submit]').first();
    await btn.click({ timeout: 8000 });
    rec.submitted = true;
    const start = Date.now();
    while (Date.now() - start < 120000) {
      const body = await page.innerText('body').catch(() => '');
      if (/score|\/100|verdict|result/i.test(body) && !/analyzing|loading|checking/i.test(body)) {
        await page.waitForTimeout(6000);
        rec.body = body.slice(0, 3500);
        rec.finalUrl = page.url();
        rec.status = 'completed';
        break;
      }
      await page.waitForTimeout(3500);
    }
    if (rec.status !== 'completed') { rec.status = 'timeout'; rec.body = (await page.innerText('body').catch(() => '')).slice(0, 1200); }
    await page.screenshot({ path: 'audit-reports/external/websitevalidator-re.png', fullPage: false }).catch(() => {});
  } catch (e) { rec.status = 'error'; rec.error = String(e).slice(0, 250); }
  out.websitevalidator = rec;
  console.log('WebsiteValidator:', rec.status, '|', (rec.body ?? '').slice(0, 160));
}

// --- AI Website Critic (free HTML pass) --------------------------------------
{
  const rec = { service: 'AI Website Critic (free pass)', status: 'unknown' };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://www.aiwebsitecritic.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const input = page.locator('input[type=url], input[name*=url i], input[placeholder*="http" i], input[placeholder*="website" i]').first();
    await input.fill(live, { timeout: 8000 });
    const btn = page.locator('button:has-text("critic"), button:has-text("analy"), button:has-text("review"), button[type=submit], input[type=submit]').first();
    await btn.click({ timeout: 8000 });
    rec.submitted = true;
    const start = Date.now();
    while (Date.now() - start < 120000) {
      const body = await page.innerText('body').catch(() => '');
      if (/score|\/10|grade|result/i.test(body) && !/analyzing|loading|checking/i.test(body)) {
        await page.waitForTimeout(6000);
        rec.body = body.slice(0, 3500);
        rec.finalUrl = page.url();
        rec.status = 'completed';
        break;
      }
      if (/sign|account|log ?in/i.test(body) && body.length < 900) { rec.status = 'signup-gated'; rec.body = body.slice(0, 900); break; }
      await page.waitForTimeout(3500);
    }
    if (rec.status === 'unknown') { rec.status = 'timeout'; rec.body = (await page.innerText('body').catch(() => '')).slice(0, 1200); }
    await page.screenshot({ path: 'audit-reports/external/ai-website-critic-re.png' }).catch(() => {});
  } catch (e) { rec.status = 'error'; rec.error = String(e).slice(0, 250); }
  out.aiWebsiteCritic = rec;
  console.log('AI Website Critic:', rec.status, '|', (rec.body ?? '').slice(0, 160));
}

writeFileSync('audit-reports/external/revalidate-2026-10-19.json', JSON.stringify(out, null, 2));
console.log('saved -> audit-reports/external/revalidate-2026-10-19.json');
await browser.close();
