import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import {
  IDENTITY,
  HERO,
  MANIFESTO,
  STATS,
  PROJECTS,
  JOURNEY,
  SKILLS,
  CODING,
  CERTS,
  CONTACT,
  SECTION_LABELS,
} from './src/data.ts';

const esc = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Static content fallback written into #root at build time: real headings, copy
 * and links exist in the raw HTML for crawlers that never execute JavaScript
 * (and users on very slow connections). React's createRoot clears #root on
 * mount, so this is never visible once the app boots.
 */
function staticFallback(): string {
  const label = (id: keyof typeof SECTION_LABELS): string => {
    const l = SECTION_LABELS[id];
    return l ? `${l.n} — ${l.name}` : '';
  };

  const projects = PROJECTS.map((p) => {
    const href = p.link ?? p.repo ?? IDENTITY.github;
    const cta = p.link ? (p.linkLabel ?? 'VIEW ON LINKEDIN ↗') : 'VIEW ON GITHUB ↗';
    return `<article>
        <h3>${esc(p.name)}</h3>
        <p class="mono">${esc(p.category)}</p>
        <p>${esc(p.desc)}</p>
        <p class="mono">${esc(p.chips.join(' · '))}</p>
        <p><a href="${esc(href)}">${esc(cta)}</a></p>
      </article>`;
  }).join('\n      ');

  const journey = JOURNEY.items
    .map((i) => `<li><h3>${esc(i.title)}</h3><p class="mono">${esc(i.year)}</p><p>${esc(i.org)}</p></li>`)
    .join('\n      ');

  const manifesto = MANIFESTO.map((line) => `<p>${line.map((t) => esc(t.t)).join('')}</p>`).join('\n      ');

  const stats = STATS.map(
    (s) => `<li><strong>${esc(s.value.toFixed(s.decimals))}</strong> ${esc(s.label)} — ${esc(s.caption)}</li>`,
  ).join('\n      ');

  const coding = CODING.map(
    (c) => `<li><strong>${esc(c.value + c.suffix)}</strong> — ${esc(c.label)} (${esc(c.note)})</li>`,
  ).join('\n      ');

  const certs = CERTS.map(
    (c) => `<li><strong>${esc(c.title)}</strong> — ${esc(c.sub)} (${esc(c.year)})</li>`,
  ).join('\n      ');

  const contactLinks = [
    ...CONTACT.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`),
    `<li><a href="${esc(IDENTITY.leetcode)}">LEETCODE</a></li>`,
    `<li><a href="mailto:${esc(IDENTITY.email)}">${esc(IDENTITY.email)}</a></li>`,
  ].join('\n      ');

  return `<div class="boot">
    <header class="boot-hero">
      <p class="mono boot-kicker">${esc(IDENTITY.name)} — ${esc(IDENTITY.location)}</p>
      <h1 class="boot-title">${esc(IDENTITY.name)}</h1>
      <p class="mono boot-roles">${esc(IDENTITY.role1)} ${esc(IDENTITY.role2)}</p>
      <p class="boot-desc">${esc(HERO.desc)}</p>
      <p class="boot-cta">
        <a href="#boot-work-h">See my work</a>
        <a href="${esc(IDENTITY.resumeUrl)}">Download résumé</a>
        <a href="mailto:${esc(IDENTITY.email)}">Email me</a>
      </p>
    </header>
    <nav class="boot-nav mono" aria-label="Sections">
      <a href="#boot-about-h">${label('about')}</a>
      <a href="#boot-work-h">${label('work')}</a>
      <a href="#boot-journey-h">${label('journey')}</a>
      <a href="#boot-skills-h">${label('skills')}</a>
      <a href="#boot-awards-h">${label('awards')}</a>
      <a href="#boot-contact-h">${label('contact')}</a>
    </nav>
    <section class="boot-section" aria-labelledby="boot-about-h">
      <h2 id="boot-about-h" class="mono">${label('about')}</h2>
      <div class="boot-manifesto">
      ${manifesto}
      </div>
      <ul class="boot-stats">
      ${stats}
      </ul>
    </section>
    <section class="boot-section" aria-labelledby="boot-work-h">
      <h2 id="boot-work-h" class="mono">${label('work')}</h2>
      ${projects}
    </section>
    <section class="boot-section" aria-labelledby="boot-journey-h">
      <h2 id="boot-journey-h" class="mono">${label('journey')}</h2>
      <ol class="boot-journey">
      ${journey}
      </ol>
    </section>
    <section class="boot-section" aria-labelledby="boot-skills-h">
      <h2 id="boot-skills-h" class="mono">${label('skills')}</h2>
      <p>${esc(SKILLS.join(' · '))}</p>
      <ul class="boot-coding">
      ${coding}
      </ul>
    </section>
    <section class="boot-section" aria-labelledby="boot-awards-h">
      <h2 id="boot-awards-h" class="mono">${label('awards')}</h2>
      <ul class="boot-certs">
      ${certs}
      </ul>
    </section>
    <section class="boot-section" aria-labelledby="boot-contact-h">
      <h2 id="boot-contact-h" class="mono">${label('contact')}</h2>
      <ul class="boot-contact">
      ${contactLinks}
      </ul>
    </section>
  </div>`;
}

/**
 * Post-build pass: inline the built stylesheet into index.html and preload the
 * four latin font files the first paint actually uses. Removes the render-
 * blocking CSS request and the late font swap (the two biggest LCP/CLS costs).
 */
function inlineCssPreloadFonts(): Plugin {
  return {
    name: 'inline-css-preload-fonts',
    apply: 'build',
    closeBundle() {
      const dist = resolve(process.cwd(), 'dist');
      let html: string;
      try {
        html = readFileSync(join(dist, 'index.html'), 'utf8');
      } catch {
        return;
      }

      // 1) Replace the emitted <link rel="stylesheet"> with an inline <style>.
      const inlined: string[] = [];
      html = html.replace(/<link[^>]*rel="stylesheet"[^>]*>/g, (tag) => {
        const m = tag.match(/href="([^"]+\.css)"/);
        if (!m) return tag;
        try {
          const rel = m[1].replace(/^\.?\//, '');
          let css = readFileSync(join(dist, rel), 'utf8');
          // The stylesheet lived in /assets/, so its asset refs are relative to
          // that directory (url(./font.woff2)). Inlined at the document root
          // they would resolve against '/' and 404 — point them back at /assets/.
          css = css.replace(/url\((['"]?)\.\/([^)'"]+)\1\)/g, 'url($1./assets/$2$1)');
          inlined.push(rel);
          return `<style>${css}</style>`;
        } catch {
          return tag;
        }
      });

      // 2) Preload the latin subsets of Anton, Inter Tight, JetBrains Mono.
      let fonts: string[] = [];
      try {
        fonts = readdirSync(join(dist, 'assets')).filter(
          (f) => f.endsWith('.woff2') && f.includes('-latin-') && !f.includes('latin-ext') && !f.includes('italic'),
        );
      } catch {
        /* no assets dir — nothing to preload */
      }
      if (fonts.length) {
        const tags = fonts
          .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="./assets/${f}">`)
          .join('');
        html = html.replace('</head>', () => `${tags}</head>`);
      }

      // 3) Fill #root with real static content for non-JS crawlers. React
      //    (createRoot) replaces it on mount — users never see it after boot.
      html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${staticFallback()}</div>`);

      // 4) Keep the inline JSON-LD block CSP-compliant: append the exact
      //    SHA-256 of the script text to the policy injected by buildCsp().
      const ld = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      if (ld) {
        const hash = createHash('sha256').update(ld[1], 'utf8').digest('base64');
        html = html.replace("script-src 'self'", `script-src 'self' 'sha256-${hash}'`);
      }

      writeFileSync(join(dist, 'index.html'), html);

      // The stylesheet is inlined now — drop the orphaned emitted file.
      for (const rel of inlined) {
        try {
          unlinkSync(join(dist, rel));
        } catch {
          /* already gone */
        }
      }
    },
  };
}

/**
 * Build-only Content-Security-Policy meta tag (GitHub Pages cannot send HTTP
 * headers). Locks the shipped page down to same-origin resources. Inline
 * styles stay allowed because the built stylesheet is inlined and GSAP writes
 * inline transforms; scripts are already external (Vite bundles), so
 * `script-src 'self'` is safe. Intentionally NOT applied in dev, where Vite
 * injects inline scripts and the HMR websocket.
 */
function buildCsp(): Plugin {
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "form-action 'none'",
  ].join('; ');
  return {
    name: 'build-csp-meta',
    apply: 'build',
    transformIndexHtml(html) {
      return html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}">`);
    },
  };
}

// Relative base so the build works both at '/' and under '/Kapoor-portfolio/'.
// No client-side router, so unknown paths must 404 (parity with GitHub Pages).
export default defineConfig({
  base: './',
  appType: 'mpa',
  plugins: [react(), buildCsp(), inlineCssPreloadFonts()],
  // Only index.html is our entry — keep the untracked Tusharkapoor-oop/ project out of dep scanning.
  optimizeDeps: {
    entries: ['index.html'],
  },
  server: {
    watch: {
      ignored: ['**/Tusharkapoor-oop/**'],
    },
  },
});
