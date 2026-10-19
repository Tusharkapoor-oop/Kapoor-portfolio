// Prints EVERY layout-shift culprit item + node from a Lighthouse JSON (uncapped).
import { readFileSync } from 'node:fs';

const j = JSON.parse(readFileSync(process.argv[2] ?? 'audit-reports/lighthouse/local-desktop.json', 'utf8'));

console.log('=== cls-culprits-insight items (all) ===');
for (const it of j.audits['cls-culprits-insight']?.details?.items ?? []) {
  const n = it.node ?? {};
  console.log(
    JSON.stringify({
      score: it.score,
      sel: n.selector,
      snippet: (n.snippet ?? '').slice(0, 110),
      value: n.value,
      cause: (it.subItems?.items ?? []).map((s) => s.cause ?? s.extra?.value).join('; '),
    }),
  );
}

console.log('\n=== layout-shifts items (all) ===');
for (const it of j.audits['layout-shifts']?.details?.items ?? []) {
  const n = it.node ?? {};
  console.log(JSON.stringify({ score: it.score, sel: n.selector, label: n.nodeLabel, cause: it.subItems?.items?.map((s) => s.cause).join('; ') }));
}
