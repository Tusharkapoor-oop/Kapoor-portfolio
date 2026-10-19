// lh-compare.mjs — compact metric table across all lighthouse artifacts in a dir.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] ?? 'audit-reports/lighthouse';
const files = readdirSync(dir).filter((f) => f.endsWith('.json')).sort();
for (const f of files) {
  try {
    const l = JSON.parse(readFileSync(join(dir, f), 'utf8'));
    const lhr = l.lhr ?? l;
    const a = lhr.audits ?? {};
    const cat = lhr.categories ?? {};
    const num = (k) => Math.round(a[k]?.numericValue ?? 0);
    const score = (k) => Math.round((cat[k]?.score ?? 0) * 100);
    const ff = (lhr.fetchTime ?? '?').slice(0, 16).replace('T', ' ');
    const form = /desktop/.test(f) ? 'desk' : /mobile/.test(f) ? 'mob ' : '?';
    console.log(
      f.padEnd(34),
      form,
      'perf', String(score('performance')).padStart(3),
      'a11y', String(score('accessibility')).padStart(3),
      'bp', String(score('best-practices')).padStart(3),
      'seo', String(score('seo')).padStart(3),
      '| FCP', String(num('first-contentful-paint')).padStart(4),
      'LCP', String(num('largest-contentful-paint')).padStart(4),
      'TBT', String(num('total-blocking-time')).padStart(4),
      'SI', String(num('speed-index')).padStart(4),
      '|', ff,
    );
  } catch (e) {
    console.log(f.padEnd(34), 'ERR', String(e.message).slice(0, 60));
  }
}
