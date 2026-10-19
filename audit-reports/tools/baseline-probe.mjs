// baseline-probe.mjs — live site quick probe
const r = await fetch('https://tusharkapoor-oop.github.io/Kapoor-portfolio/');
const t = await r.text();
const title = (t.match(/<title>(.*?)<\/title>/i) || [])[1] ?? 'none';
const desc = (t.match(/name="description" content="([^"]*)/i) || [])[1] ?? 'none';
const og = (t.match(/property="og:title" content="([^"]*)/i) || [])[1] ?? 'none';
console.log('status:', r.status, 'bytes:', t.length);
console.log('title:', title);
console.log('desc:', desc.slice(0, 140));
console.log('og:title:', og);
console.log('has llms meta:', /llms/i.test(t));
for (const p of [
  'assets/index-DXg9iWZm.js', // placeholder; we print asset URLs instead
]) { /* noop */ }
const scripts = [...t.matchAll(/src="(assets[^"]+)"/g)].map((m) => m[1]);
console.log('scripts:', scripts);
const links = [...t.matchAll(/href="(assets[^"]+|resume[^"]*)"/g)].map((m) => m[1]);
console.log('links:', links);
