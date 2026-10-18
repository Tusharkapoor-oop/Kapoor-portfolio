#!/usr/bin/env node
/**
 * Renders resume/resume.html -> public/Tushar_Kapoor_Resume.pdf
 * using a locally installed Chromium-based browser (Edge or Chrome).
 * No extra npm dependencies required.
 *
 * Usage: npm run resume:build
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = resolve(root, 'resume', 'resume.html');
const outPath = resolve(root, 'public', 'Tushar_Kapoor_Resume.pdf');

const candidates = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const browser = candidates.find((p) => existsSync(p));
if (!browser) {
  console.error('No Chrome/Edge found. Set BROWSER_PATH to a Chromium-based browser executable.');
  process.exit(1);
}
if (!existsSync(htmlPath)) {
  console.error(`Missing ${htmlPath}`);
  process.exit(1);
}

mkdirSync(dirname(outPath), { recursive: true });

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-first-run',
  '--no-pdf-header-footer',
  '--virtual-time-budget=4000',
  `--print-to-pdf=${outPath}`,
  pathToFileURL(htmlPath).href,
];

const result = spawnSync(browser, args, { stdio: 'inherit' });
if (result.status !== 0) {
  console.error('Browser exited with code', result.status);
  process.exit(result.status ?? 1);
}
console.log(`Resume written to ${outPath}`);
