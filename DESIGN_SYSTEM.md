# Tushar Kapoor — Design System + IA · Warm Lab Notebook

> Single source for visual identity, motion, IA, and content rules.
> Stack: React 19 + Vite 8 + Tailwind 4 + Motion (`motion/react`) + lucide-react.
> Principle: `PERSONAL · CURIOUS · TECHNICAL · WARM · MEMORABLE · CALM · CONFIDENT` — proof over adjectives.

## 1. Tokens (implement in `src/index.css` + `tailwind.config.js`)

```css
--background: #0E0E0C;      /* warm near-black, never pure #000 */
--surface: #161614;         /* card */
--surface-hover: #1C1C19;
--text: #EFE6D8;            /* warm parchment */
--text-muted: #ACA69C;
--text-faint: #736E68;
--accent: #E85D2A;          /* burnt lab-orange, single highlighter */
--accent-ink: #0E0E0C;      /* text on accent */
--live: #4DFF00;            /* availability dot ONLY */
--border: #2A2928;          /* hairlines */
--paper: #F4F1EA;           /* light mode canvas */
--paper-ink: #1A1917;
```

Rules: accent = whisper (CTA, active tab, chart highlight, 1 diagram node). Never body text, never gradient, never glow-everywhere. Text contrast ≥ 4.5:1.

## 2. Typography

- Display: `Space Grotesk 500/700`, `clamp(2.5rem,5vw,4.5rem)`, tracking `-0.02em`, leading `0.95-1.05`.
- Body: `Inter 400/500`, `1rem-1.125rem`, leading `1.65`.
- Mono: `JetBrains Mono 400/500 11-13px` for labels, dates, stack, metadata, `// comments`, architecture nodes.
- Max 2 families on screen at once (Display+Body, Mono for meta only). Never whole site in mono.

## 3. Layout / Rhythm

- Container `max-w-5xl`, `px-6 md:px-12`, section gap `space-y-32`.
- Alternate: large (Hero, Featured), compact (Now, Credentials), text (Context), visual (Projects), quiet (Contact).
- Hairline dividers `border-t border-[var(--border)]`, 8px section eyebrow `mono 12px muted`.
- No bento-everywhere. No card-in-card. Whitespace is the grouping device.
- Zero horizontal overflow. Touch targets ≥ 44px. Mobile is first-class, not compressed desktop.

## 4. Motion (Motion, not framer-motion@13)

> `framer-motion` npm is now alias. New code: `npm i motion lenis` + `import { motion } from "motion/react"`.

- Root: `<MotionConfig reducedMotion="user">`.
- Reveal default: `initial {opacity:0,y:24} whileInView {opacity:1,y:0} viewport {once:true, margin:"-80px"} transition {duration:0.6, ease:[0.16,1,0.3,1]}`.
- Stagger grids: parent variants, `staggerChildren:0.06-0.08`.
- Lenis: `<ReactLenis root options={{lerp:0.1, duration:1.2, anchors:true}}>` single RAF.
- Micro only: arrow `x:2-4px` spring, card `y:-4` + img `1.03` 200ms, copy-email `scale:0.95` + `role=status`.
- SVG arch: `pathLength` draw, nodes → lines → arrowheads, `aria-hidden`, 1 looping dash max.
- Animate only `transform/opacity`. Ban: scroll-hijack, particles, laggy cursor, layout anim on 100+ items.
- Reduced-motion: kill parallax/loop/large motion, keep fade + press/focus feedback.

## 5. Information Architecture (single-page + routes)

```
HERO (#top) — "I build things to understand how they work." + status + copy-email
↓ A LITTLE CONTEXT (#about) — who / what I build / how I work
↓ RIGHT NOW (#now) — learning / building / exploring (editable)
↓ THINGS I'VE BUILT (#work) — featured Nutrition + EcoSphere + Energy-O-Thon + Business Data
↓ PROJECT CASE (#work/:id) — idea / system / role / arch / learnings / links
↓ HOW I WORK (#experience) — Edunet 2025 → GO-BRICS 2026 chapters
↓ PROBLEM SOLVING (#problem-solving) — LeetCode 191 C++ / 71 Py / 16 SQL + topics + badges
↓ THE WORKSHOP (#workshop) — GitHub Tusharkapoor-oop, 3 curated repos
↓ WHAT I USE (#stack) — BUILD/THINK/TRAIN/DATA/SHIP/CLOUD/DEVOPS/DB + project links
↓ CREDENTIALS (#credentials) — education / certs / Dean's + LOR (text-only, no fake previews)
↓ LAB (#lab) — experiments, status: probing/paused, clearly WIP
↓ LET'S TALK (#connect) — "Let's build something worth talking about." + email/GitHub/LinkedIn/LeetCode
↓ FOOTER — © + sitemap + back-to-top
404 — "Looks like this branch doesn't exist. Maybe I should've tested that route." + Home
```

Nav labels: `Work · Experience · About · Lab · Connect` + `TK` mark + copy-email + resume. Active section indicator, `Cmd/Ctrl+K` only if 5+ routes.

## 6. Components

```
components/
  Nav · Hero · Context · Now · Projects · ProjectCard · ArchDiagram
  Experience · ExperienceCard · ProblemSolving · Workshop · Skills
  Credentials · Lab · Contact · Footer · Reveal · CopyEmail · CommandPalette
data/ (single truth, see src/data/README)
  profile · projects · experience · skills · credentials · site · types
lib/
  motion.ts (reveal variants, stagger) · seo.ts (meta, JSON-LD)
```

Content never hardcoded in UI. All personal strings from `src/data`.

## 7. Copy voice

- Human engineer speaking. Specific > impressive.
- Use: "Things I've actually built." / "What I reach for when I build." / "A little context." / "Let's talk."
- Ban: passionate, cutting-edge, leveraging, revolutionizing, seamless, dynamic, enthusiast, ninjas.
- No fake numbers: no accuracy/users/stars/followers/revenue/placements unless sourced. Missing → hide or `ADD_*` placeholder.

## 8. Accessibility / Perf / SEO

- Semantic HTML, h1→h2→h3, focus-visible, keyboard Cmd+K/Esc/arrows, alt text, diagram `aria-hidden` + text fallback.
- Targets: Lighthouse 90+ across Perf/A11y/Best/SEO. Lazy-load below fold, `woff2` self-host, images AVIF, bundle: Motion `LazyMotion` if needed.
- Title: `Tushar Kapoor — AI/ML Engineering Student`. Meta description human-written. OG/Twitter, canonical placeholder, JSON-LD Person + WebSite. Real text (crawlable), not canvas image.

## 9. Content truth checklist (internal, never public)

| Claim | Source | Safe? |
|---|---|---|
| Internships, dates, roles | Resume | yes |
| 10k USDA / 50k UCI / 12 insights | Resume | yes, no invented accuracy |
| Team sizes 4 / 5 / intl | Resume | yes |
| LeetCode 191/71/16 + badges | Public profile 2026 | yes, link profile |
| GitHub repos 3 named | Public GitHub | yes, no fake stars |
| CGPA 8.6 / SGPA 9.5 | Resume | yes |

## 10. Definition of done loop

`RUN → SCROLL → RECRUITER-30s → ENGINEER-5min → MEMORY → ANTI-AI audit → FIX ×5 → RE-RUN` until marginal gains only.
Fail if name-swappable with another student — then redesign, don't decorate.
