// Verify the post-build inlining pass: stylesheet gone, urls repointed, preloads present.
import { readFileSync, readdirSync } from 'node:fs';

const html = readFileSync('dist/index.html', 'utf8');
const cssLeft = readdirSync('dist/assets').filter((f) => f.endsWith('.css'));
const styleBlocks = (html.match(/<style>/g) || []).length;
const preloads = (html.match(/rel="preload"/g) || []).length;
const assetUrls = (html.match(/url\(\.\/assets\//g) || []).length;
const rootUrls = (html.match(/url\(\.\/(?!assets)/g) || []).length;
const linkTags = (html.match(/rel="stylesheet"/g) || []).length;

console.log('css files left in dist/assets:', cssLeft.length, cssLeft);
console.log('stylesheet <link> tags     :', linkTags);
console.log('inline <style> blocks       :', styleBlocks);
console.log('font preloads               :', preloads);
console.log('url(./assets/...) refs      :', assetUrls);
console.log('url(./...) non-assets refs  :', rootUrls);
