// Pulls the exact failing nodes out of Lighthouse + axe JSON reports.
import { readFileSync } from 'node:fs';

const [lhFile, axeFile] = process.argv.slice(2);

if (lhFile) {
  const j = JSON.parse(readFileSync(lhFile, 'utf8'));
  for (const id of ['color-contrast', 'layout-shifts', 'label-content-name-mismatch', 'heading-order']) {
    const a = j.audits[id];
    if (!a) continue;
    console.log(`\n== LH ${id} == score=${a.score} ${a.displayValue ?? ''}`);
    const items = a.details?.items ?? [];
    for (const it of items.slice(0, 60)) {
      const n = it.node ?? it;
      console.log(JSON.stringify({
        score: it.score,
        sel: n.selector,
        snippet: (n.snippet ?? '').slice(0, 150),
        label: (n.nodeLabel ?? '').slice(0, 80),
        ratio: it.contrastRatio,
        explanation: (n.explanation ?? '').replace(/\n/g, ' ').slice(0, 200),
      }));
    }
  }
}

if (axeFile) {
  const a = JSON.parse(readFileSync(axeFile, 'utf8'));
  console.log('\n== AXE violations ==');
  for (const v of a.violations) {
    console.log(`\n# ${v.id} (${v.impact}) x${v.nodes.length} nodes`);
    for (const n of v.nodes.slice(0, 60)) {
      console.log('  -', n.target.join(' '), '::', (n.failureSummary ?? '').replace(/\n/g, ' ').slice(0, 180));
    }
    console.log('  tags:', (v.tags ?? []).join(','));
  }
}
