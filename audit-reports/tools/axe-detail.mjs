import { readFileSync } from 'node:fs';
const file = process.argv[2] ?? 'audit-reports/axe/live2.json';
const j = JSON.parse(readFileSync(file, 'utf8'));
const w = j.states;
const seen = new Map();
for (const [k, v] of Object.entries(w)) {
  for (const x of v.violations || []) {
    if (!seen.has(x.id)) seen.set(x.id, { impact: x.impact, help: x.help, nodes: [] });
    const rec = seen.get(x.id);
    for (const n of x.nodes) {
      if (rec.nodes.length >= 24) continue;
      rec.nodes.push({ state: k, target: JSON.stringify(n.target), ratio: n.any?.[0]?.data?.contrastRatio, fg: n.any?.[0]?.data?.fgColor, bg: n.any?.[0]?.data?.bgColor, html: (n.html || '').slice(0, 110) });
    }
  }
}
for (const [id, r] of seen) {
  console.log(`\n=== ${id} [${r.impact}] ${r.help}`);
  console.log(' states:', [...new Set(r.nodes.map((n) => n.state))].join(','), ' utils:', r.nodes.length);
  const ratios = [...new Set(r.nodes.map((n) => `${n.fg} on ${n.bg} = ${n.ratio}`))];
  console.log(' pair:', ratios.slice(0, 6).join(' ; '));
  for (const n of r.nodes.slice(0, 8)) console.log('  -', n.target, '||', n.html.replace(/\s+/g, ' '));
}
