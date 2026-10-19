// raw-words.mjs — ground truth for the "crawlable without JS" claim: fetch the
// LIVE first-response HTML, strip tags/scripts/styles, count visible words.
const html = await (await fetch('http://tusharkapoor-oop.github.io/Kapoor-portfolio/')).text();
const body = html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<!--[\s\S]*?-->/g, ' ')
  .replace(/<[^>]+>/g, ' ');
const words = body.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));
console.log('raw-HTML visible words:', words.length);
console.log('sample:', words.slice(0, 40).join(' '));
const headings = [...html.matchAll(/<h[12][^>]*>([^<]{4,80})<\/h[12]>/gi)].map((m) => m[1].trim());
console.log('h1/h2 in raw HTML:', headings.length, '|', headings.slice(0, 8));
for (const p of ['robots.txt', 'sitemap.xml', 'og-image.jpg', 'llms.txt']) {
  const r = await fetch('http://tusharkapoor-oop.github.io/Kapoor-portfolio/' + p);
  console.log(p, '→', r.status);
}
const rootRobots = await fetch('http://tusharkapoor-oop.github.io/robots.txt');
console.log('account-root /robots.txt →', rootRobots.status);
