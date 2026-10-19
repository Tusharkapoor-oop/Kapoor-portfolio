// Submits the LIVE site to public audit services through a real browser and
// records exactly what happened (report / signup wall / error). No bypassing of
// auth, CAPTCHA or paywalls — blocked outcomes are recorded as such.
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const live = 'https://tusharkapoor-oop.github.io/Kapoor-portfolio/';
mkdirSync('audit-reports/external', { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

async function attempt(name, fn) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const rec = { name, status: 'unknown', finalUrl: null, notes: [], shots: [], text: '' };
  try {
    await fn(page, rec, name);
  } catch (e) {
    rec.status = rec.status === 'unknown' ? 'error' : rec.status;
    rec.notes.push(String(e).slice(0, 400));
  }
  rec.finalUrl = page.url();
  try {
    rec.text = (await page.innerText('body')).replace(/\s+/g, ' ').slice(0, 2500);
  } catch {
    /* page closed */
  }
  results.push(rec);
  console.log(`== ${name}: ${rec.status} :: ${rec.notes.join(' | ').slice(0, 220)}`);
  try {
    await page.close();
  } catch {
    /* already closed */
  }
}

const shot = async (page, file) => {
  await page.screenshot({ path: `audit-reports/external/${file}`, fullPage: false });
  return `audit-reports/external/${file}`;
};

const submit = async (page, rec, buttonRe) => {
  const input = page
    .locator('input[type="url"], input[type="text"], input[type="search"], input:not([type])')
    .first();
  if (!(await input.count())) {
    rec.notes.push('no URL input found');
    rec.status = 'no-input';
    return false;
  }
  await input.fill(live);
  const btn = page.getByRole('button', { name: buttonRe }).first();
  if (await btn.count()) {
    await btn.click();
  } else {
    await input.press('Enter');
  }
  return true;
};

const waitForReport = async (page, rec, ms) => {
  try {
    await page.waitForLoadState('networkidle', { timeout: ms });
  } catch {
    rec.notes.push(`networkidle timeout after ${ms}ms`);
  }
  await page.waitForTimeout(4000);
};

// 1) Aeacus — free, no signup, JS-rendered audit.
await attempt('aeacus.app', async (page, rec, name) => {
  await page.goto('https://aeacus.app/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  rec.shots.push(await shot(page, 'aeacus-home.png'));
  if (!(await submit(page, rec, /audit|scan|analyz|run|check/i))) return;
  await waitForReport(page, rec, 90000);
  rec.shots.push(await shot(page, 'aeacus-result.png'));
  const body = (await page.innerText('body').catch(() => '')) || '';
  if (/\b(score|audit|fixes|prioritized)\b/i.test(body) && page.url() !== 'https://aeacus.app/') {
    rec.status = 'report';
  } else if (/sign in|sign up|log in|log in to continue/i.test(body)) {
    rec.status = 'auth-wall';
  } else {
    rec.status = 'submitted-unknown';
  }
});

// 2) WebsiteValidator — free no-account quick + full scan.
await attempt('websitevalidator.com', async (page, rec) => {
  await page.goto('https://websitevalidator.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  rec.shots.push(await shot(page, 'websitevalidator-home.png'));
  if (!(await submit(page, rec, /full scan|scan|check|audit/i))) return;
  await waitForReport(page, rec, 120000);
  await page.waitForTimeout(15000);
  rec.shots.push(await shot(page, 'websitevalidator-result.png'));
  const body = (await page.innerText('body').catch(() => '')) || '';
  if (/overall score|per-area|you scored|\/100/i.test(body)) rec.status = 'report';
  else if (/captcha|verify you are human/i.test(body)) rec.status = 'captcha';
  else rec.status = 'submitted-unknown';
});

// 3) Website Auditor — AI visibility audit (asks for business + city).
await attempt('website-auditor.io', async (page, rec) => {
  await page.goto('https://website-auditor.io/ai-website-audit', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  rec.shots.push(await shot(page, 'website-auditor-home.png'));
  if (!(await submit(page, rec, /scan my site|scan|audit/i))) return;
  await waitForReport(page, rec, 90000);
  rec.shots.push(await shot(page, 'website-auditor-result.png'));
  const body = (await page.innerText('body').catch(() => '')) || '';
  if (/appearance rate|competitors named|your report/i.test(body)) rec.status = 'report';
  else if (/enter a city|city to continue/i.test(body)) rec.status = 'input-mismatch';
  else rec.status = 'submitted-unknown';
});

// 4) AI Website Critic — previously hit a Clerk auth wall; retry in a real browser.
await attempt('aiwebsitecritic.com', async (page, rec) => {
  await page.goto('https://aiwebsitecritic.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  rec.shots.push(await shot(page, 'aiwebsitecritic-home.png'));
  const body = (await page.innerText('body').catch(() => '')) || '';
  if (/sign in|sign up|continue with|clerk/i.test(body)) {
    rec.status = 'auth-wall';
    rec.notes.push('sign-in required before use');
    return;
  }
  if (!(await submit(page, rec, /critique|analyze|scan|audit|submit/i))) return;
  await waitForReport(page, rec, 90000);
  rec.shots.push(await shot(page, 'aiwebsitecritic-result.png'));
  rec.status = 'submitted-unknown';
});

// 5) websiteaudit.com — previously 403 via plain fetch; retry with full browser.
await attempt('websiteaudit.com', async (page, rec) => {
  await page.goto('https://websiteaudit.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  rec.shots.push(await shot(page, 'websiteaudit-home.png'));
  const body = (await page.innerText('body').catch(() => '')) || '';
  rec.notes.push(`title: ${(await page.title()).slice(0, 80)}`);
  if (!(await submit(page, rec, /audit|scan|submit|start/i))) return;
  await waitForReport(page, rec, 90000);
  rec.shots.push(await shot(page, 'websiteaudit-result.png'));
  rec.status = 'submitted-unknown';
});

await browser.close();
writeFileSync('audit-reports/external/results.json', JSON.stringify(results, null, 2));
console.log('saved → audit-reports/external/results.json');
