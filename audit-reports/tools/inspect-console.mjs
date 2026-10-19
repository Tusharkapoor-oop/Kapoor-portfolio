// Compact printer for console-net-*.json
import { readFileSync } from 'node:fs';

const j = JSON.parse(readFileSync(process.argv[2] ?? 'audit-reports/console-net-after.json', 'utf8'));
for (const [vp, run] of Object.entries(j.runs ?? {})) {
  console.log(`== ${vp}`);
  console.log('console:');
  for (const c of run.console ?? []) console.log(`  [${c.type}] ${c.text}`);
  console.log('requestFailed:');
  for (const f of run.requestFailed ?? []) console.log(`  ${f.err} — ${f.url}`);
  console.log('badStatuses:');
  for (const b of run.badStatuses ?? []) console.log(`  ${b.status} — ${b.url}`);
}
