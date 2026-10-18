# Tushar Kapoor — Design System · "Editorial Cinema"

> Single source for the visual language, motion grammar and mobile rules of the cinematic rebuild.
> Stack: React 19 + Vite + TypeScript · Lenis + GSAP ticker · CSS-3D only (no WebGL).
> Principle: `WHITE PAPER · RED INK · ONE CONTINUOUS FILM` — proof over adjectives.

## 1. Tokens (`src/styles.css`)

```css
--red: #ff1f1f;              /* the ink — accents, active states, the curtain */
--ink: #0d0d0d;              /* near-black text */
--paper: #ffffff;            /* canvas */
--mute: #5e5e5e;             /* secondary text */
--line: rgba(13, 13, 13, .09); /* hairlines, card borders */
```

Rules: red is a *statement*, not decoration — section labels' numbers, active nav pill, hero accent
line, the entire contact curtain. Body copy is always ink/mute. White is the default surface;
red surfaces invert their contents to paper.

## 2. Typography

- Display: **Anton** (`--font-d`), uppercase, `line-height .84–1.05`, used for the nameplate,
  section titles, big numbers. Never for body.
- Body: **Inter Tight** (`--font-b`), 400–600, `-0.02em` tracking, generous leading — manifesto,
  descriptions, cards.
- Labels: **JetBrains Mono** (`--font-m`), 10–13px, `letter-spacing .06–.14em`, uppercase —
  `(0N) — Section` labels (number in red), stats captions, chips, HUD.
- Never more than two families in one visual field; mono is metadata only.

## 3. Motion grammar

- One clock: `director.ts` runs Lenis (`lerp .075`, `wheelMultiplier .9`, `touchMultiplier 1.4`)
  and a GSAP ticker with `lagSmoothing(0)`. Everything animates from that single web-animation frame.
- Scenes are registered by `[data-scene]`; each frame they receive `{ enter, p, exit, vis }`
  (`enter = clamp((y−(top−vh))/vh)`, `p = clamp((y−top)/(h−vh))`).
- `applyReveals(root, enter, exit)` drives `.rv[data-rv]` items: delay = `data-rv * 0.78vh` of scroll.
- All writes are imperative (refs). React re-renders only on mount.
- Only `transform`, `opacity`, `clip-path` are animated. Barely anything else is allowed.
- Enter moments use `easeOutCubic`/`easeInOutSine` on scroll progress; nothing ever loops
  except ambient touches (core pulse, tape marquee) which freeze under reduced motion.

## 4. Scene grammar

| Scene | Height | Behaviour |
|---|---|---|
| Hero | 230vh | Sticky 100vh stage; content lifts + the giant watermark counter-scrolls; red accent line draws in |
| About | 280vh | Manifesto words fade ink→black word-by-word; stat cards tilt in; odometer digits roll |
| Work | 460vh | One deck in 3D: card `j` flips up/back (`z 900f`, `rx 28f`) while card `j+1` settles in; swap only in the last quarter (`k = smoothstep(.72, 1, f)`) |
| Journey | 240vh | Outlined Anton year odometer 2024→2028 rolls continuously; SVG path draws; nodes pop |
| Skills | 280vh | Fibonacci sphere of pills (billboarded) around a red core; spin = time + scroll + mouse; chips z-sort to glass `.zback` behind |
| Awards | 320vh | Counters flip in; 5 certificate plates ride a rotating 3D cylinder |
| Contact | 240vh | Red curtain sweeps **left → right**; blade = clipped 3px white stripe + two halo stripes; content reveals per element as the edge passes (`edge(y) = e + skew − (2·skew/vh)·y`); HUD logo/nav/progress invert individually |

Every scene owns its own 100vh sticky inner — there is **no global stage or portal**.

## 5. CSS-3D rules (learned the hard way)

1. `opacity < 1` on a `preserve-3d` ancestor forces **flattening** (children lose real 3D). Put the
   opacity fade on an **unrotated wrapper** (`.orbit-stage`), not on the rotating element.
2. Give every rotating container `perspective` on the parent (`.orbit-stage { perspective: 1400px }`)
   and `transform-style: preserve-3d` on each level that must keep depth (`.orbit`, `.orbit-chip`).
3. Billboarded chips need `transform-style: preserve-3d` on their wrapper too, or the
   counter-rotation (`rotateY(−spin) rotateX(−tilt)`) is flattened into slivers.
4. Never trust `will-change` + mutable `width/left/transform` for repaints: a composited layer can
   end up with a stale/empty raster. Elements that must repaint every frame should be driven by
   `clip-path` (paint property) like the curtain/blade — that reliably re-rasterizes.
5. `ch` widths resolve against the element's *own* font-size — set `max-width` on the element that
   owns the font-size, or use `min(44vw, Npx)`.

## 6. Contact curtain math

```
skew = 0.2 · vh                       e = −skew + (vw + 2·skew)·t       t = clamp01(scene.p)
edge(y) = e + skew − (2·skew/vh)·y    (x of the blade at viewport height y)
reveal(el, lead, ramp) = clamp01((edge(rect.top + 6) − (rect.right − lead)) / ramp)
```

- Curtain clip: `polygon(0 0, (e+skew)px 0, (e−skew)px 100%, 0 100%)` — red enters from the left.
- Blade stripes: three `clip-path` layers, half-widths 1.5 / 13 / 34px at opacities 1 / .5 / .22.
- HUD inversion is per element (cached rects): logo ≈ t .06, nav ≈ t .79, progress ≈ t .96
  (`edge(center.y) ≥ rect.right − 24`).

## 7. Mobile (≤ 820px)

- HUD nav hidden; logo + progress remain. Section padding drops to 6vw.
- Panels (head boxes, stats) become white 80–82% + `backdrop-filter: blur(14–18px)`.
- `.work-visual` mocks are hidden; the card collapses to a single column.
- Contact: email sits at `bottom: 30vh`, links at `11vh`, footer stacks — no collisions; email text
  is fully paper (both user and domain).
- Skills orbit radius uses a larger vw factor (`.36`) so the sphere doesn't collapse into the core.
- Custom cursor never mounts (`isFine()` gate); `overflow-x: clip` on `html` protects the sticky scenes.

## 8. Accessibility / SEO

- Semantic landmarks (`section` + `h1→h2→h3`), `sr-only` text summary of the contact block,
  `aria-hidden` on decorative layers (curtain, blade, orbit, mocks, marquee).
- `prefers-reduced-motion`: orbit spin frozen, CSS pulse/marquee disabled, transitions cut.
- Focus-visible styles on all interactive elements; buttons/links ≥ 44px touch targets.
- Title/meta/OG/Twitter updated for the new identity; JSON-LD Person in `index.html`;
  `public/og-image.jpg` regenerated from the hero at 1200×630.

## 9. Voice

- Human engineer speaking. Specific > impressive. "Proof over adjectives." applies to copy too.
- Ban: passionate, cutting-edge, leveraging, revolutionizing, seamless, dynamic, ninjas.
- No fake numbers anywhere; every stat on screen is traceable to the résumé or public profile.

## 10. Definition of done

`TYPECHECK → BUILD → HEADLESS SCROLL-THROUGH (1600×900 + 390×844) → FIX → REPEAT`
until every scene reads correctly at both sizes, then — and only then — merge to `main` (merging deploys).
