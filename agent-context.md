# Agent Context — adam.kenawell.family

Running log of notable decisions, constraints, and context across sessions.

---

## Session 1 — 2026-05-07 (Morning) — Initial Build

### Environment & Deployment

- **Node 22** via Volta. Project `.npmrc` → public `registry.npmjs.org` (bypasses Ford Nexus proxy; do NOT remove user-level `.npmrc`).
- **Astro v6.3** static site. Custom domain `adam.kenawell.family`. `base: '/'` in config.
- **GitHub Actions CI/CD:** Push to `main` → auto-deploy to GitHub Pages. Workflow at `.github/workflows/deploy.yml`. Git remote uses PAT under `adam-kenawell` account (not Ford `akenawel_ford`).
- **Session workflow:** `npm run dev` (background) → iterate → `npx astro build` → single `git push` at end of session.

### Design System (established)

- **Background:** `#1a1a1a` · **Accent:** `#f5d000` (yellow) · **Body text:** white `rgba(255,255,255,0.85)`
- **Card fills:** grey `rgba(255,255,255,0.06)` (not yellow). **Card borders:** yellow `rgba(245,208,0,0.5)`. 3D depth via box-shadow + hover lift.
- **Header:** Sticky, backdrop blur, `rgba(26,26,26,0.9)`. "Adam Kenawell" button always links home.
- **Font:** `Fusion Pixel 12px Monospaced KR` (later changed to Proportional in Session 2).
- **Mobile:** `@media (max-width: 600px)` breakpoints on all pages.

### Pages Created

- **Landing (`index.astro`):** 3 nav cards (Blog, Resume, Projects). Header hides nav links (`showNav={false}`).
- **Resume (`resume.astro`):** Real data — Ford experience, PSU + Bellevue education, achievements, grouped skills. ▸ and ★ bullet markers.
- **Blog:** Content collections with `glob()` loader, config at `src/content.config.ts`, uses `z` from `astro/zod`. 6 sample posts.

### Animated Sprite Background (`SpriteBackground.astro`)

- Pokémon Mystery Dungeon sprites from PMDCollab GitHub. ~37 curated IDs, 6-8 random per load.
- Sprite sheets: 8 directional rows, N frame columns. Frame size from `AnimData.xml`. `image-rendering: pixelated`.
- Z-layering: background(0) → sprites(1) → content(2). CSS uses `is:global`.
- **Card backgrounds must be nearly opaque** (`rgba(26,26,26,0.95)`) — NOT transparent (`rgba(255,255,255,0.06)`) — so sprites don't show through them.

---

## Session 3 — 2026-05-08 — Sprite Overhaul, Resume PDF, View Transitions Fix

### Resume One-Pager

- Created `public/Adam_Kenawell_Resume.html` — printable one-page resume (Ctrl+P → Save as PDF).
- Added download link button at top of `resume.astro` with yellow-border styling.

### View Transitions Fix

- Added `transition:persist` to `#sprite-background` and `#sprite-controls` so sprites survive page navigation.
- Tagline on index page now randomizes client-side via `astro:page-load` event listener (`define:vars`).

### Sprite System Overhaul (SpriteBackground.astro condensed from 658 → 300 lines)

- **Fresh sprites on every reload** — removed localStorage persistence entirely.
- **Always 10 sprites** — fixed count instead of random 6–8.
- **Full dex range** (1–1025) for both initial load and random spawn (was curated list of 37).
- **Spawn uses old position** — new Pokémon appears where the removed one was.
- **Spawn validation** — tries creation before removing old sprite. Shows red error for invalid dex #, silently retries for random.
- **Spawn debounce** — button disables during spawn to prevent spam-breaking.
- **Spawn flash** — white circle outline, 0.3s, scale(5), z-index 9999 (visible over cards).
- **Sprites behind cards** — z-index 0 for background; cards use opaque `rgba(26,26,26,0.95)`.

### Card Opacity Fix

- Changed `.spec-card` (local-llm-stack) and `.fav-card` (about) from transparent `rgba(255,255,255,0.06)` to opaque `rgba(26,26,26,0.95)`.

### Deployment

- Commit `c978028`: 7 files changed, 265+/87-. Build: 7 pages in 4.70s.
- State machine: Walking → Idle (random chance) → Sleeping (2.5min inactivity) → Attacking (click). All timers use `performance.now()`.
- Sheets per sprite: Walk (required), Idle, Sleep, Attack (optional fallback to Walk).

---

## Session 2 — 2026-05-07 (Afternoon) — About Me, Style Refresh, Projects & Blog

### About Me Page (`about.astro`)

- Bio sections: My Childhood, My Faith, Growing Up, College, Life After College, Current Day. Favorites grid with spec cards + full-width quote card.
- Tone: genuine, professional, no emojis/m-dashes. Links to blog from Current Day section. Uses `import.meta.env.BASE_URL` for paths.

### Header Updates

- "About Me" link in `.left-group` next to name button (always visible). Nav links white (`rgba(255,255,255,0.7)`), active = yellow + underline via `Astro.url.pathname`.

### Resume Overhaul

- Added Objective section. 3 positions (Agentic AI Data Engineer, DE Intern, Bioinformatics Intern) with 3 bullets each. Achievements as `{name, period}` objects. Skills trimmed to 5/group. Yellow top-border separators.

### Typography & Global Style

- **Font switched** to `Fusion Pixel 12px Proportional KR` for readability. Updated in Layout.astro + SpriteBackground.astro.
- **View Transitions:** `ClientRouter` from `astro:transitions` in Layout.astro.
- **Shared Footer:** `Footer.astro` — "© 2026 Adam Kenawell · Built with Astro". `width: 100%` for mobile centering.
- **Global `line-height: 1.8`** on body. White body text (`rgba(255,255,255,0.85)`) standardized across all pages.
- **Section separators:** `border-top: 1px solid rgba(245, 208, 0, 0.2)`.

### Landing Page Updates

- Card text white (dark on yellow hover). 100 rotating taglines (random per build). Warm yellow hover glow.

### Pokémon Controls

- "Swap" → "Spawn". Controls row starts hidden, toggled by clicking title. Title text white, buttons yellow.

### Projects Page

- `projects.astro`: Project listing with cards linking to internal detail pages.
- `projects/local-llm-stack.astro`: Full writeup — The Big Idea, My Hardware (spec grid), Software Stack, Use Cases, How-To steps, Tips & Gotchas, What's Next.

### Blog System

- **Category filters:** 4 tabs (Featured, Technical, Lifestyle, Monthly Report) with client-side JS toggling `.hidden` class. 50 random empty state messages.
- **Content schema:** Added `category` field: `z.enum(['featured','technical','lifestyle','monthly-report']).default('featured')`.
- **First real blog post:** `from-pixel-one.md` — "From Pixel One: How I Built This Website" (category: featured, 2026-05-07). Covers tech stack, design, LLM usage, sprites, taglines, deployment.
- **All 6 sample posts deleted.**
- **Post template (`[slug].astro`):** White body text, yellow h2/h3/strong/links. Author "Adam Kenawell" next to date with dot separator.

### Final Push

- Commit `30d9008`: 12 files changed, 585+/167-. Build: 7 pages in 2.07s. All deployed successfully.

### Optimization Pass

- **Removed unused dependency:** `@fontsource/fusion-pixel-12px-monospaced-kr` was still in `package.json` after the font switch to Proportional. Uninstalled it.
- **Added `.page` wrapper to `about.astro` and `local-llm-stack.astro`:** Both were missing the flex layout div (`min-height: 100vh`, `flex-direction: column`) that other pages use, causing the footer to not stick to the bottom on short viewports.
- **Fixed markdown lint in `from-pixel-one.md`:** Two lists missing blank lines above them (MD032).
- **Removed duplicate H1 in `from-pixel-one.md`:** Title was rendered both by the `[slug].astro` template (yellow) and as an `# H1` in the markdown itself. Removed the markdown H1.
