// Summarizes Lighthouse and axe-core JSON reports into a compact form.
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const out = [];
for (const f of args) {
  const j = JSON.parse(readFileSync(f, 'utf8'));
  if (j.audits && j.categories) {
    const cats = {};
    for (const [k, v] of Object.entries(j.categories)) cats[k] = v.score === null ? null : Math.round(v.score * 100);
    const m = (id) => j.audits[id]?.displayValue ?? null;
    const fails = Object.values(j.audits)
      .filter((a) => typeof a.score === 'number' && a.score < 1)
      .map((a) => ({ id: a.id, score: a.score, dv: a.displayValue ?? '' }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 14);
    out.push({
      kind: 'lighthouse',
      file: f,
      url: j.finalDisplayedUrl ?? j.requestedUrl,
      formFactor: j.configSettings?.formFactor,
      throttling: j.configSettings?.throttlingMethod,
      fetchTime: j.fetchTime,
      categories: cats,
      metrics: { FCP: m('first-contentful-paint'), LCP: m('largest-contentful-paint'), TBT: m('total-blocking-time'), CLS: m('cumulative-layout-shift'), SI: m('speed-index') },
      topFails: fails,
    });
  } else if (Array.isArray(j.violations)) {
    out.push({
      kind: 'axe',
      file: f,
      url: j.url,
      axeVersion: j.testEngine?.version,
      violations: j.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, targets: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })),
      passes: j.passes?.length ?? 0,
      incomplete: j.incomplete?.length ?? 0,
    });
  } else {
    out.push({ kind: 'unknown', file: f });
  }
}
console.log(JSON.stringify(out, null, 2));
