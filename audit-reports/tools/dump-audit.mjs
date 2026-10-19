// Dump full Lighthouse audit objects by id.
//   node dump-audit.mjs <lh-json> <auditId> [auditId2 ...]
import { readFileSync } from 'node:fs';

const [file, ...ids] = process.argv.slice(2);
const j = JSON.parse(readFileSync(file, 'utf8'));
const out = {};
for (const id of ids) out[id] = j.audits?.[id] ?? null;
console.log(JSON.stringify(out, null, 1));
