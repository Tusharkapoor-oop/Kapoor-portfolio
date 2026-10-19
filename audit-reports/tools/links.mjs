// Checks every external URL in the source + built HTML, plus local asset references in dist.
import { readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const sources = ['src/data.ts', 'index.html'].filter((f) => existsSync(f));
const ext = new Set();
for (const f of sources) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/https?:\/\/[^\s"'`<>)]+/g)) {
    const u = m[0].replace(/[.,;]+$/, '');
    if (!u.includes('localhost') && !u.includes('schema.org')) ext.add(u);
  }
}

const rows = [];
for (const u of ext) {
  try {
    const res = await fetch(u, {
      method: 'GET',
      redirect: 'follow',
      headers: { 'user-agent': UA, accept: 'text/html,*/*' },
      signal: AbortSignal.timeout(20000),
    });
    rows.push({ url: u, status: res.status, ok: res.ok, final: res.url !== u ? res.url : undefined });
  } catch (e) {
    rows.push({ url: u, status: null, ok: false, error: String(e).slice(0, 140) });
  }
  await new Promise((r) => setTimeout(r, 900));
}

// local asset references: any root-relative path used in data.ts (e.g. /resume.pdf)
const local = new Set();
for (const f of sources) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/['"]\/([A-Za-z0-9_\-./]+\.(?:pdf|png|jpe?g|svg|webp|ico))['"]/g)) local.add(m[1]);
}
const localRows = [...local].map((p) => ({
  path: p,
  public: existsSync(`public/${p}`),
  dist: existsSync(`dist/${p}`),
}));

console.log('=== external links ===');
for (const r of rows) console.log(JSON.stringify(r));
console.log('=== local assets ===');
for (const r of localRows) console.log(JSON.stringify(r));
console.log('=== dist root files ===');
if (existsSync('dist')) console.log(readdirSync('dist').join(', '));

writeFileSync('audit-reports/links.json', JSON.stringify({ external: rows, local: localRows }, null, 2));
console.log('links saved → audit-reports/links.json');
