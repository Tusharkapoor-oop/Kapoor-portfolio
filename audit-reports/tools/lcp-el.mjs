// lcp-el.mjs — print LCP element + phases from a lighthouse report.
import { readFileSync } from 'node:fs';
const l = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const lhr = l.lhr ?? l;
const a = lhr.audits;
for (const id of ['largest-contentful-paint-element', 'prioritize-lcp-image', 'lcp-lazy-loaded', 'render-blocking-resources']) {
  const audit = a[id];
  if (!audit) continue;
  console.log('##', id, '| score', audit.score, '| value', audit.numericValue ?? '');
  const items = (audit.details ?? {}).items ?? [];
  for (const it of items) {
    if (it.items && Array.isArray(it.items)) {
      for (const sub of it.items) console.log('  ', JSON.stringify(sub).slice(0, 320));
    } else console.log('  ', JSON.stringify(it).slice(0, 320));
  }
}
const n = a['largest-contentful-paint'] ?? {};
console.log('LCP metric:', JSON.stringify((n.details ?? {}).items ?? []).slice(0, 500));
