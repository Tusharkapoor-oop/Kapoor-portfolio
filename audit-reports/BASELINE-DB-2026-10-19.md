# Portfolio Autopilot — Baseline Audit DB
**Portfolio:** https://tusharkapoor-oop.github.io/Kapoor-portfolio/
**Baseline window:** 18–19 Oct 2026 · Auditor: autonomous loop (Playwright + Lighthouse + axe-core + Nu + Aeacus)
**Repo:** Kapoor-Portfolio-project (branch strategy documented below)

## Codebase topology (Stage 1)
| Artifact | Where | State |
|---|---|---|
| **LIVE site** | `origin/main` @ 9e7b395 | Old Tailwind/shadcn React app, 830 KB bundle, three.js `Background3D`, GL splash loader. Deployed via `deploy.yml` on push to `main`. |
| Local `main` @ 9ee4a54 | polish for the OLD app («CI gates, SEO + resume pipeline…») | committed but **not pushed** |
| Branch `cinematic-rebuild` @ 01738a7 | v2 cinematic app + **uncommitted polish batch** (perf plugin: CSS inline + woff2 preload; axe contrast/aria fixes; JSON-LD jobTitle «Applied AI Engineer») | local only, never deployed |
| `C:\Users\ACER\Downloads\AI-Portfolio` | v3 person-on-canvas rebuild (master-prompt spec), full QA rig 24 shots | local only, **no git** |
| `Tusharkapoor-oop/` (untracked) | GitHub profile-README repo clone | informational only |

## Baseline measurements (fresh runs, this machine, indexed)

### Lighthouse (genuine artifacts in `audit-reports/lighthouse/`)
| Target | Run | Perf | A11y | BP | SEO | Notes |
|---|---|---:|---:|---:|---:|---|
| LIVE desktop | run#1 17:19 UTC | **29** | 93 | 100 | 100 | FCP 4238ms · LCP 4751ms · TBT 1339ms · SI 4620ms · CLS 0 |
| LIVE desktop | prior session («mine-live-desktop») | 91 | 93 | 100 | 100 | **147% score variance across runs** — measurement variability documented |
| LIVE mobile | run#1 17:20 UTC | **63** | 93 | 100 | 100 | FCP 3057ms · TBT 865ms · top opportunity: unused-JS 750ms |
| v3 local desktop | 17:24 UTC | 36 | 92 | 96 | 91 | FCP 2625 · LCP 4181 · TBT 612 |
| v3 local mobile | 17:25 UTC | 59 | 92 | 96 | 91 | unused-JS 600ms · unused-CSS 150ms |
| v2 local desktop (fresh build incl. polish) | 19 Oct | 33 | **100** | 92 | 100 | FCP 2888 · LCP 4191 · TBT 883 · SI 3671 · mainthread 6.0s |

### axe-core (14 scroll states × desktop/mobile per target)
- **LIVE** («axe/live2.json»): `color-contrast` **serious, 12–13 nodes at every state** (Tailwind `text-muted/60|70` on dark imagery), `heading-order` (moderate), `region` (moderate, mobile hero).
- **v3** («axe/v3.json»): `color-contrast` up to **55 nodes in hero** (red-on-white headline cluster), `label-content-name-mismatch` (serious, 1), `heading-order` (moderate), `region` (moderate ×3).

## Finding register (grouped, deduplicated)

### O1 · Structural: public site ≠ newest codebase [objective · severity **critical-architectural**]
**Evidence:** live bundle hash `index-Dk6tbEtD.js` (830 KB, Tailwind helper, `Background3D` chunk) vs repo builds `index-BwuirFS4/BROQbKNI` (342 KB). Live HTML title/JSON-LD match repo HEAD, not the improved batch.
**Impact:** every fix must be replicated until the newest app is what's deployed.
**Fix direction:** (user decision) deploy v2 cinematic / v3 canvas / fix-in-place.

### O2 · Performance: heavy JS + startup cost [objective · high]
**Evidence (LIVE):** bundle 830 KB; unused-JS **750ms**; TBT 865–1339ms; FCP 3.0–4.2s; WebGL «GPU stall due to ReadPixels» warnings ×4 (three.js background). Same class of problem in v2 (mainthread 6.0s under 4× throttling, bootup 1.6s) and v3 (TBT 612–965ms, unused JS 600ms, unused CSS 150ms).
**Impact:** mobile/desktop perf scores 29–63; real-device slowness on mid-range phones.
**Fix direction:** code-split scenes / defer animation-server setup / cut unused CSS; retire three.js splash on old app if fixed in place.

### O3 · Accessibility contrast + semantics [objective · high]
**Evidence:** axe live2 (above). Live Tailwind muted-color system fails WCAG AA on ~12 nodes/scene.
**Status:** v2's uncommitted batch already fixes its own variant (v2 local scored **a11y 100**). Old app & v3 still fail.
**Fix direction:** port contrast tokens; fix v3 hero red contrast (`--red #ff1f1f` on white = ~2.5:1, fails 3:1 large-text) if v3 ships; fix v3 `label-content-name-mismatch` (serious) + `region` landmark.

### O4 · SEO infrastructure gaps [objective · medium, all directly verified]
- `robots.txt` → **404** (root + site) ✔ confirmed by direct fetch
- `sitemap.xml` → **404** ✔ confirmed
- og:image present, served 383 KB (<1 MB ✔), but 1024×576 < recommended 1200×630 (size not independently re-verified → verify during fix)
- **Twitter card: present in live HTML** («property="twitter:card"») — **Aeacus claim «missing» is FALSE** (checked raw HTML; it reads `name=` only, ours uses `property=`). Auditor-inaccuracy logged; no fix strictly required, but adding `name=` twin is free and kills the flag for future auditors.
- JSON-LD `jobTitle` «AI/ML Engineering Student» vs newer resume positioning «Applied AI Engineer» (uncommitted change pending) — content decision, user call.
- **Crawler-without-JS view: ~6 words** — Aeacus's core verdict; true for a CSR-only SPA (headless fetch budget hit). Real robustness question for all candidate apps (all CSR), fixed via pre-rendered content shell / prerender.

### F1 · Functional integrity [objective · live]
Prior artifacts `links-live.json` (all links + mailto valid), `console-net-live2.json` (0 failed requests, 0 bad statuses today; only warnings from three.js). Fresh breakage: none. Resume download path present on live nav (verified later at redeploy).

### S1 · Subjective design [out-of-scope of scores]
Live hero paints fine in real browsers (see `live2-desktop-hero.png`); heavy decorative 3D and glassy dark theme = creative direction, decided by user (v2 red/white cinematic vs v3 person-on-canvas).

## External auditor access log (Stage 2, honest)
| Service | Attempt | Result |
|---|---|---|
| **Aeacus** aeacus.app | real web app, submission via URL + Enter ×3 (runs #1,#2 completed later; report opened from History) | **Report obtained: overall 34/100** — UX 24 · Content 18 · Performance 58 · Accessibility 42 · SEO 40 · Conversion 20. Full text: `external/aeacus-report-1155-FULL.txt` · report URL https://aeacus.app/audits/1155 · screenshots saved |
| **AI Website Critic** | form submitted, observed 75s | no inline result — email/lead funnel ⇒ **unavailable without email**, documented |
| **WebsiteValidator** | form submitted | no inline result, page didn't retain URL ⇒ unverified funnel, documented |
| **Website Auditor** websiteaudit.com | direct | **HTTP 403 «Not available in your region»** — blocked, not bypassed |
| Lighthouse / axe / Nu / lighthouse-ci equivalent | real CLI + Playwright runs (artifacts in repo) | ✔ all executed this machine |

**Aeacus accuracy note:** 2 false/imprecise claims vs. direct evidence (Twitter card present; «no links/H1» contradicted by real-browser screenshot — their fetch died). Remaining structural checks (robots/sitemap/og-size/NAP) verified true. Category implication logged but weighted accordingly (Stage 3 rule: investigate disagreements, don't blindly follow).

## Connection to stopping criteria (Stage 8 pre-read)
- Perf is the only sub-99 category in every candidate: plan = real engineering (bundle split, defer/tier animation init, prune unused CSS/JS) — no score-gaming.
- A11y: v2 already proves 100 reachable locally (polish batch); contrast + label/region fixes needed for whichever app ships.
- SEO reachable 100 + robots/sitemap/prerender additions.
- Deployment gating: **no push to `main` without explicit user authorization.**
