import { readFileSync } from 'node:fs';
const f = process.argv[2];
const l = JSON.parse(readFileSync(f, 'utf8'));
const lhr = l.lhr ?? l;
const c = lhr.categories;
console.log('scores:', JSON.stringify(Object.fromEntries(Object.entries(c).map(([k, v]) => [k, Math.round((v.score ?? -1) * 100)]))));
const a = lhr.audits;
console.log('perf:', JSON.stringify(Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'total-blocking-time', 'cumulative-layout-shift', 'speed-index'].map((k) => [k, Math.round(a[k].numericValue)]))));
const el = a['largest-contentful-paint-element'];
if (el?.details?.items) {
  for (const item of el.details.items) {
    if (item.items) console.log('LCP detail:', JSON.stringify(item.items[0]).slice(0, 300));
  }
}
for (const ref of c['best-practices'].auditRefs) {
  const av = a[ref.id];
  if (av && av.score !== null && av.score < 1) console.log('bp fail:', ref.id, '|', (av.displayValue ?? '').slice(0, 60));
}
const op = Object.values(a).filter((x) => x.details && x.details.type === 'opportunity' && (x.details.overallSavingsMs || 0) > 80).sort((p, q) => q.details.overallSavingsMs - p.details.overallSavingsMs);
for (const o of op.slice(0, 8)) console.log('opp:', o.id, Math.round(o.details.overallSavingsMs) + 'ms');
if (a['mainthread-work-breakdown']) {
  const mt = a['mainthread-work-breakdown'].details?.items ?? [];
  for (const t of mt.filter((t) => t.duration > 300)) console.log('mainthread:', t.group, Math.round(t.duration) + 'ms');
}
