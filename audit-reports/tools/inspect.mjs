// Inspect helper.
//   node inspect.mjs axe <file>  → compact per-state violation summary
//   node inspect.mjs lh <file>   → failing audits + details for interesting audits
import { readFileSync } from 'node:fs';

const [mode, file] = process.argv.slice(2);
const j = JSON.parse(readFileSync(file, 'utf8'));

if (mode === 'axe') {
  console.log(`axe ${j.axeVersion} — ${file}`);
  for (const [state, res] of Object.entries(j.states ?? {})) {
    console.log(`\n== ${state}: ${res.violations.length} violations`);
    for (const v of res.violations) {
      console.log(`  [${v.impact}] ${v.id} — ${v.nodes.length} nodes — ${v.help}`);
      for (const n of v.nodes.slice(0, 30)) {
        console.log(`      ${n.target}`);
        console.log(`      ${(n.failure ?? '').slice(0, 160)}`);
      }
      if (v.nodes.length > 30) console.log(`      … +${v.nodes.length - 30} more nodes`);
    }
    for (const inc of res.incomplete ?? []) {
      console.log(`  incomplete: ${inc.id} (${inc.nodes})`);
    }
  }
} else if (mode === 'lh') {
  const cats = j.categories ?? {};
  console.log('file:', file);
  console.log('url:', j.finalDisplayedUrl ?? j.requestedUrl ?? '?');
  console.log(
    'categories:',
    Object.entries(cats)
      .map(([k, v]) => `${k}=${v.score == null ? 'null' : Math.round(v.score * 100)}`)
      .join(' '),
  );
  console.log('\n-- failing audits (numeric score < 1, non-informative) --');
  for (const [id, a] of Object.entries(j.audits ?? {})) {
    const s = a.score;
    if (typeof s === 'number' && s < 1 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable') {
      console.log(`  ${s} ${id} — ${a.title}${a.displayValue ? ' — ' + a.displayValue : ''}`);
    }
  }
  const ab = cats['agentic-browsing'];
  if (ab) {
    console.log('\n-- agentic-browsing auditRefs --');
    for (const r of ab.auditRefs) {
      const a = j.audits[r.id];
      console.log(`  w=${r.weight ?? 0} score=${a?.score} ${r.id} — ${a?.title ?? ''} ${a?.displayValue ?? ''}`);
    }
  }
  for (const id of ['llms-txt', 'ard-schema', 'unused-javascript', 'render-blocking-resources', 'layout-shifts', 'offscreen-images', 'total-byte-weight']) {
    const a = j.audits?.[id];
    if (!a) continue;
    console.log(`\n### ${id} — score=${a.score} ${a.displayValue ?? ''}`);
    console.log((a.description ?? '').replace(/\[[^\]]+\]\([^)]+\)/g, '').replace(/\s+/g, ' ').slice(0, 400));
    const items = a.details?.items;
    if (Array.isArray(items)) {
      for (const it of items.slice(0, 6)) console.log('   ', JSON.stringify(it).slice(0, 240));
    }
  }
}
