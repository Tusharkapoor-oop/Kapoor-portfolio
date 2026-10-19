// v2-lh.mjs — spin vite preview on :4186 and print readiness.
import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = 'dist';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml', '.txt': 'text/plain' };

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let file = join(ROOT, p === '/Kapoor-portfolio/' || p === '/Kapoor-portfolio' ? 'index.html' : p);
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(ROOT, 'index.html');
  try {
    const b = readFileSync(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(b);
  } catch {
    res.writeHead(404); res.end('nf');
  }
});
server.listen(4186, () => console.log('v2 preview on http://localhost:4186/'));
