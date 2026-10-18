# Kapoor Portfolio — AI-Powered Portfolio (cinematic)

**White-paper / red-ink, scroll-driven cinematic portfolio** — React 19 + Vite + TypeScript, Lenis smooth
scroll behind a custom scene director, CSS-3D only (no WebGL), deployed to GitHub Pages on every push to `main`.

> **Live:** https://tusharkapoor-oop.github.io/Kapoor-portfolio/ — deployed automatically by
> `.github/workflows/deploy.yml` on every push to `main`.

---

## What's in it

| Feature | Implementation |
|---|---|
| Scroll engine | `src/engine/director.ts` — one Lenis + GSAP-ticker RAF loop; scenes register via `[data-scene]` and receive `{ enter, p, exit, vis }` every frame |
| Frame API | `src/engine/hooks.ts` — `useScene(id, cb)` / `useFrame(cb)`; all animation writes go through refs (zero re-renders while scrolling) |
| Hero | Anton nameplate, giant watermark, dual CTAs (`MagneticButton`), scroll cue |
| About | Word-by-word manifesto reveal, tilt stat cards, rolling odometer counters |
| Work | 3D card deck: perspective flip + crossfade between the three builds, masked reveal, project mocks (chat / gauge / heatmap) |
| Journey | Outlined Anton year odometer (2024 → 2028), SVG line-draw timeline |
| Toolkit | Fibonacci-sphere skill orbit — billboarded chips around a red core, mouse-parallax tilt, z-sorted glass chips |
| Awards | Flip-in counters + 3D certificate cylinder |
| Contact | Red curtain sweep (left → right) with a clipped white blade edge + halos; each element reveals as the edge passes it; HUD elements invert individually |
| Chrome | Preloader, per-element inverting HUD (logo / nav / progress), custom cursor (fine pointers only) |
| Content | `src/data.ts` — single source of truth (identity, manifesto, projects, journey, skills, certs, contact) |
| Design tokens | `src/styles.css` + `DESIGN_SYSTEM.md` (read before styling) |

## Project structure

```
src/
  data.ts              # ALL content — edit here, not in the scenes
  engine/
    director.ts        # Lenis + RAF loop, scene registry, scrollTo/scrollTop
    hooks.ts           # useFrame/useScene/applyReveals, easings, reduced-motion
  components/
    Chrome.tsx         # Preloader, HUD (logo/nav/progress + inversion), Cursor
    Odometer.tsx       # mechanical digit strip (carry model)
    TiltCard.tsx       # pointer-tilt wrapper
    MagneticButton.tsx # magnetic hover CTA
  scenes/              # Hero · About · Work · Journey · Skills · Awards · Contact
  styles.css           # tokens + every section's styles (single stylesheet)
public/
  og-image.jpg         # 1200×630 social card (regenerate from the hero)
  favicon.svg
resume/                # résumé source (HTML + JSON Resume) + build script
.github/workflows/     # ci.yml (checks) + deploy.yml (Pages, main only)
DESIGN_SYSTEM.md       # visual language, motion grammar, mobile rules
```

## Development

```bash
npm install
npm run dev           # http://localhost:5173
npm run lint          # oxlint
npm run build         # vite build → dist/
npm run preview       # serve dist/ locally
npm run resume:build  # regenerate public/Tushar_Kapoor_Resume.pdf from resume/resume.html
```

## CI/CD

`deploy.yml` runs on every push to `main`:
`npm ci` → `npm run lint` → `npx tsc -b` → `npm run build` → upload `dist/` → Pages deploy.

`ci.yml` runs the same checks on pull requests and non-`main` branches.
Least-privilege permissions, concurrency cancellation, weekly Dependabot.

## Performance notes (honest)

- **No WebGL.** The whole site is DOM + CSS 3D; there is no three.js chunk at all.
- Fonts are self-hosted via `@fontsource` (anton, inter-tight, jetbrains-mono) — no external font requests.
- Scrolling writes styles imperatively through refs — React never re-renders mid-scroll.
- `prefers-reduced-motion` is honored: the orbit stops spinning and CSS animations are disabled.
- No Lighthouse number is claimed here because none has been measured in CI yet (planned: `npx lighthouse-ci` job).

## Known limitations

- No unit tests yet — lint + `tsc` + build are the current gates (enforced in CI).
- Lighthouse CI is planned but not wired up yet.
- README screenshots are TODO (the live site is the reference).

## License

[MIT](LICENSE) © 2026 Tushar Kapoor
