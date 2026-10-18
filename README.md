# Kapoor Portfolio

**Dark-first, motion-heavy engineering portfolio** — React 19 + Vite + Tailwind 4 + three.js, deployed to GitHub Pages on every push to `main`.

> **Live:** https://tusharkapoor-oop.github.io/Kapoor-portfolio/ — deployed automatically by
> `.github/workflows/deploy.yml` on every push to `main`.

---

## What's in it

| Feature | Implementation |
|---|---|
| 3D background | `three.js` via `@react-three/fiber` + `drei`, lazy-loaded (`src/components/Background3D.tsx`) |
| Smooth scroll | `lenis` |
| Motion | `motion` (framer-motion successor) — section reveals, staggered entrances |
| Command palette | `⌘K` overlay (`CommandPalette.tsx`) for keyboard navigation |
| Custom cursor | `CustomCursor.tsx` (pointer-devices only) |
| Content sections | Hero · Lab · Projects · Experience · ProblemSolving · Workshop · Credentials · Skills · Now · Contact · Footer |
| Data-driven content | `src/data/*.ts` — projects, skills, experience, credentials, profile (edit these, not the JSX) |
| Design tokens | Tailwind 4 + `DESIGN_SYSTEM.md` (colors, type scale, spacing — read before styling) |

## Project structure

```
src/
  components/        # UI (Hero, Projects, Contact, CommandPalette, …)
  data/              # profile.ts, projects.ts, skills.ts, experience.ts, …
  index.css          # Tailwind 4 tokens + global styles
  main.tsx → App.tsx
public/
  Tushar_Kapoor_Resume.pdf   # generated from resume/resume.html
  scholar_art_3d_wide.webp   # 3D background texture
  og-image.jpg               # social preview card
resume/                        # résumé source (HTML + JSON Resume) + build script
.github/workflows/deploy.yml   # Pages CI/CD (lint → typecheck → build → deploy)
.github/workflows/ci.yml       # PR checks (lint → typecheck → build)
DESIGN_SYSTEM.md               # visual language
```

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # oxlint
npm run build      # vite build → dist/
npm run preview    # serve dist/ locally
npm run resume:build  # regenerate public/Tushar_Kapoor_Resume.pdf from resume/resume.html
```

## CI/CD

`deploy.yml` runs on every push to `main`:

1. `npm ci` (lockfile-pinned) → 2. `npm run lint` → 3. `npx tsc -b` → 4. `npm run build` → 5. upload `dist/` as Pages artifact → 6. deploy.

`ci.yml` runs the same three checks on pull requests and non-`main` branches.
Permissions are least-privilege (`contents: read`, `pages: write`, `id-token: write`) with concurrency cancellation for superseded builds.
Dependabot keeps npm packages and Actions up to date weekly.

## Performance notes (honest)

- All imagery is optimized: the 3D background texture is WebP (~110 KB) and the social card is a dedicated 1200×630 JPEG (~140 KB); ~5 MB of unused source images were removed.
- three.js (~550 KB min) is code-split into a lazy `Background3D` chunk — the main bundle stays three-free and loads first (verified by checking the entry chunk for the `WebGLRenderer` string).
- The 3D scene honors `prefers-reduced-motion` (freezes instead of a continuous rAF loop).
- No Lighthouse number is claimed here because none has been measured in CI yet (planned: `npx lighthouse-ci` job).

## Known limitations

- README screenshots/GIF are TODO.
- No unit tests yet — lint + `tsc` + build are the current gates (enforced in CI).
- Lighthouse CI is planned but not wired up yet.

## License

[MIT](LICENSE) © 2026 Tushar Kapoor
