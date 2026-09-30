# Kapoor Portfolio

**Dark-first, motion-heavy engineering portfolio** — React 19 + Vite + Tailwind 4 + three.js, deployed to GitHub Pages on every push to `main`.

> Live site: enable GitHub Pages (Settings → Pages → Source: GitHub Actions) — the workflow in
> `.github/workflows/deploy.yml` already builds and deploys on every push.

---

## What's in it

| Feature | Implementation |
|---|---|
| 3D background | `three.js` via `@react-three/fiber` + `drei` (`src/components/Background3D.tsx`, `HeroBackground.tsx`) |
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
  styles/            # index.css (tokens), App.css
  main.tsx → App.tsx
public/
  Tushar_Kapoor_Resume.pdf
  scholar_*.jpg, perfect_image.png   # imagery (see Performance)
.github/workflows/deploy.yml         # Pages CI/CD
.oxlintrc.json                       # lint config
DESIGN_SYSTEM.md                     # visual language
```

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run lint       # oxlint
npm run build      # tsc + vite build → dist/
npm run preview    # serve dist/ locally
```

## CI/CD

`deploy.yml` runs on every push to `main`:

1. `npm ci` (lockfile-pinned) → 2. `npm run build` → 3. upload `dist/` as Pages artifact → 4. deploy.
Permissions are least-privilege (`contents: read`, `pages: write`, `id-token: write`) with concurrency cancellation for superseded builds.

## Performance notes (honest)

- `public/perfect_image.png` is 2.6 MB and the `scholar_*` images total ~2.5 MB — **TODO: convert to WebP and serve at 2× display size.**
- three.js background renders only behind the hero; no post-processing passes by default.
- No Lighthouse number is claimed here because none has been measured in CI yet (planned: `npx lighthouse-ci` job).

## Known limitations

- README is new; screenshots/GIF are TODO.
- No unit tests yet — lint + `tsc` are the current gates.
- `vite.svg` / `react.svg` leftovers from the template still exist in `src/assets` (cleanup pending).

## License

No license file yet — MIT intended (to be added by the repository owner).
