// W3C Nu HTML validation: built index.html (POST) + live URL (GET doc=).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const results = {};

if (existsSync('dist/index.html')) {
  const html = readFileSync('dist/index.html', 'utf8');
  try {
    const res = await fetch('https://validator.w3.org/nu/?out=json', {
      method: 'POST',
      headers: { 'content-type': 'text/html; charset=utf-8', 'user-agent': 'portfolio-audit/1.0' },
      body: html,
      signal: AbortSignal.timeout(60000),
    });
    results.local = await res.json();
  } catch (e) {
    results.local = { error: String(e) };
  }
}

try {
  const res = await fetch(
    'https://validator.w3.org/nu/?doc=' +
      encodeURIComponent('https://tusharkapoor-oop.github.io/Kapoor-portfolio/') +
      '&out=json',
    { headers: { 'user-agent': 'portfolio-audit/1.0' }, signal: AbortSignal.timeout(90000) },
  );
  results.live = await res.json();
} catch (e) {
  results.live = { error: String(e) };
}

writeFileSync('audit-reports/html-validator.json', JSON.stringify(results, null, 2));
for (const [k, v] of Object.entries(results)) {
  const msgs = v.messages ?? [];
  console.log(`== ${k}: ${msgs.length} messages`);
  for (const m of msgs.slice(0, 15)) {
    console.log(`  [${m.type}] ${m.subType ?? ''} ${m.message} ${m.lastLine ? `(line ${m.lastLine})` : ''}`);
  }
}
console.log('saved → audit-reports/html-validator.json');
