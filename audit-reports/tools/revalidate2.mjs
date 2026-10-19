// revalidate2.mjs — replicate the prior sessions' PROVEN flows exactly.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const live = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const browser = await chromium.launch({ headless: true });
const out = { at: new Date().toISOString(), live };

// --- WebsiteValidator: /website-checker, input[name=url], "Quick" -----------
{
  const rec = { service: 'WebsiteValidator', status: 'unknown' };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://websitevalidator.com/website-checker', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const inputs = page.locator('input[name=url]');
    await inputs.first().fill(live, { timeout: 8000 });
    // choose Quick (free, no account per homepage: "Free · No account for...")
    const quick = page.locator('button:has-text("Quick"), a:has-text("Quick")').last();
    await quick.click({ timeout: 8000 });
    rec.clicked = 'quick';
    const start = Date.now();
    while (Date.now() - start < 180000) {
      const body = await page.innerText('body').catch(() => '');
      if (/kapoor/i.test(body)) {
        rec.finalUrl = page.url();
        await page.waitForTimeout(5000);
        rec.body = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 4000);
        rec.status = 'completed';
        break;
      }
      await page.waitForTimeout(3500);
    }
    if (rec.status !== 'completed') { rec.status = 'timeout'; rec.finalUrl = page.url(); rec.body = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500); }
    await page.screenshot({ path: 'audit-reports/external/websitevalidator-re.png' }).catch(() => {});
  } catch (e) { rec.status = 'error'; rec.error = String(e).slice(0, 250); }
  out.websitevalidator = rec;
  console.log('WebsiteValidator:', rec.status, '| url', rec.finalUrl ?? '-', '|', (rec.body ?? '').replace(/\s+/g, ' ').slice(0, 140));
}

// --- AI Website Critic: placeholder-based input, "Check this page" ----------
{
  const rec = { service: 'AI Website Critic', status: 'unknown' };
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('https://www.aiwebsitecritic.com/', { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForLoadState('networkidle', { timeout: 12000 }).catch(() => {});
    const input = page.locator('input[placeholder="https://yourprospect.com"]').first();
    await input.fill(live, { timeout: 8000 });
    await page.locator('button:has-text("Check this page")').first().click({ timeout: 8000 });
    rec.submitted = true;
    const start = Date.now();
    while (Date.now() - start < 180000) {
      const body = await page.innerText('body').catch(() => '');
      if (/kapoor/i.test(body)) {
        rec.finalUrl = page.url();
        await page.waitForTimeout(6000);
        rec.body = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 4500);
        rec.status = 'completed';
        break;
      }
      await page.waitForTimeout(3500);
    }
    if (rec.status !== 'completed') { rec.status = 'timeout'; rec.finalUrl = page.url(); rec.body = (await page.innerText('body').catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500); }
    await page.screenshot({ path: 'audit-reports/external/ai-website-critic-re.png' }).catch(() => {});
  } catch (e) { rec.status = 'error'; rec.error = String(e).slice(0, 250); }
  out.aiWebsiteCritic = rec;
  console.log('AIWC:', rec.status, '| url', rec.finalUrl ?? '-', '|', (rec.body ?? '').replace(/\s+/g, ' ').slice(0, 140));
}

writeFileSync('audit-reports/external/revalidate2-2026-10-19.json', JSON.stringify(out, null, 2));
console.log('saved -> audit-reports/external/revalidate2-2026-10-19.json');
await browser.close();
