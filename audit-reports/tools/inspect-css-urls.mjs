// Print distinct url(...) references from the built CSS in dist/assets.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = 'dist/assets';
const files = readdirSync(dir).filter((f) => f.endsWith('.css'));
for (const f of files) {
  const css = readFileSync(join(dir, f), 'utf8');
  const urls = [...css.matchAll(/url\(([^)]*)\)/g)].map((m) => m[1].replace(/["']/g, ''));
  const uniq = [...new Set(urls)];
  console.log(`== ${f}: ${urls.length} url() refs, ${uniq.length} unique`);
  for (const u of uniq) console.log(`   ${u}`);
}
