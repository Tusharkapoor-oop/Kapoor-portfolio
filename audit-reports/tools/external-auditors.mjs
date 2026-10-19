// external-auditors.mjs — attempts real audits against public review services.
// Records honestly what is reachable, gated, attempted, or blocked. Single attempt each.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const PORTFOLIO_URL = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
const services = [
  { name: 'Aeacus', url: 'https://aeacus.app/' },
  { name: 'AI Website Critic', url: 'https://www.aiwebsitecritic.com/' },
  { name: 'WebsiteValidator', url: 'https://websitevalidator.com/' },
  { name: 'Website Auditor', url: 'https://websiteaudit.com/' },
];

mkdirSync('audit-reports/external/screens', { recursive: true });
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
});
const results = [];

for (const s of services) {
  const rec = { service: s.name, serviceUrl: s.url, reachable: false, httpStatus: null, formFound: false, gates: [], notes: [], submission: null };
  const page = await ctx.newPage();
  const shot = `audit-reports/external/screens/${s.name.replace(/\W+/g, '-').toLowerCase()}.png`;
  try {
    const resp = await page.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 45000 });
    rec.httpStatus = resp?.status() ?? null;
    try { await page.waitForLoadState('networkidle', { timeout: 12000 }); } catch { rec.notes.push('networkidle timeout (long-loading page or analytics)'); }
    rec.reachable = page.title().length > 0;
    rec.pageTitle = await page.title();

    // Detect gates
    const content = await page.content();
    if (/Just a moment|Attention Required|cf-challenge|cf-browser-verification/i.test(content)) rec.gates.push('cloudflare-challenge');
    if (/grecaptcha|recaptcha\/api\.js|hcaptcha|challenges\.cloudflare\.com|turnstile/i.test(content)) rec.gates.push('captcha');
    if (/sign ?in|log ?in|create (an )?account|sign ?up/i.test(content) && /password/i.test(content)) rec.gates.push('possible-login-wall');

    // Look for a URL-like input + nearby submit
    const inputs = page.locator('input[type=url], input[name*=url i], input[placeholder*="http" i], input[placeholder*="website" i], input[placeholder*="your" i], input[name*=link i]');
    const n = await inputs.count();
    if (n > 0) rec.formFound = true;
    rec.urlInputCount = n;

    await page.screenshot({ path: shot, fullPage: false });
    rec.screenshot = shot;

    // Attempt submission ONLY if a URL input exists and no captcha gate
    if (rec.formFound && !rec.gates.includes('captcha') && !rec.gates.includes('cloudflare-challenge')) {
      try {
        await inputs.first().fill(PORTFOLIO_URL, { timeout: 5000 });
        // find a submit button within the form or button[type=submit]
        const submit = page.locator('form button[type=submit], form input[type=submit], form button:has-text("analy"), form button:has-text("submit"), form button:has-text("check"), form button:has-text("audit"), form button:has-text("audite"), form button:has-text("review"), form button:has-text("run")').first();
        if (await submit.count()) {
          await submit.click({ timeout: 5000 });
          rec.submission = { attempted: true, clickedSubmit: true };
          try {
            await page.waitForLoadState('networkidle', { timeout: 25000 });
          } catch { /* audits can take a while */ }
          await page.screenshot({ path: shot.replace('.png', '-submitted.png'), fullPage: false });
          rec.submission.afterSubmitUrl = page.url();
          rec.submission.afterSubmitTitle = await page.title();
          const after = await page.content();
          rec.submission.mentionsPortfolio = after.includes('Kapoor-portfolio') || after.includes(PORTFOLIO_URL);
          rec.submission.showsReportOrResult = /report|score|result|audit/i.test(page.title()) || /score|result/i.test((await page.locator('h1,h2').first().textContent({timeout:3000}).catch(()=> '')) ?? '');
        } else {
          await page.screenshot({ path: shot.replace('.png', '-filled.png'), fullPage: false });
          rec.submission = { attempted: false, reason: 'filled input but no clear submit control found' };
        }
      } catch (e) {
        rec.submission = { attempted: true, failed: String(e.message).slice(0, 140) };
      }
    } else if (!rec.formFound) {
      rec.submission = { attempted: false, reason: 'no URL input visible on landing page' };
    }
  } catch (e) {
    rec.notes.push('navigation/session failure: ' + String(e.message).slice(0, 200));
  }
  await page.close();
  results.push(rec);
  console.log(rec.service, '->', rec.reachable ? 'reachable' : 'UNREACHABLE', '| form:', rec.formFound, '| gates:', rec.gates.join(',') || 'none', '| submission:', rec.submission ? (rec.submission.attempted ? 'attempted' : rec.submission.reason || 'skipped') : 'unknown');
}

await browser.close();
writeFileSync('audit-reports/external/attempt-2026-10-18.json', JSON.stringify({ when: new Date().toISOString(), portfolioUrl: PORTFOLIO_URL, results }, null, 2));
console.log('saved -> audit-reports/external/attempt-2026-10-18.json');
