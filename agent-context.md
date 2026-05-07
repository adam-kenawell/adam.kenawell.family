# Agent Context — adam.kenawell.family

Running log of notable decisions, constraints, and context across sessions.

---

## 2026-05-07 — Initial Build Session

### Environment
- **Node version:** Upgraded to Node 22 via Volta (Astro v6 requires ≥22)
- **npm registry:** Project-local `.npmrc` points to public `registry.npmjs.org` to bypass Ford's internal Nexus proxy. The user-level `.npmrc` points to Ford Nexus — do NOT remove it, just rely on the project-local override.
- **Project scaffolded:** Astro v6.3 minimal template. Package renamed from `deeply-doppler` to `adam.kenawell.family`.

### Typography
- Adam prefers pixelated retro fonts. Chosen font: `Fusion Pixel 12px Monospaced KR` from Fontsource (`@fontsource/fusion-pixel-12px-monospaced-kr`). Imported in `Layout.astro`.

### Design Decisions
- **Background color:** `#1a1a1a` (dark charcoal) — Adam wanted "slightly less black" than pure black.
- **Transparent fills:** Use grey (`rgba(255,255,255,0.06)`) not yellow for card/header backgrounds. Adam explicitly asked for grey instead of yellow transparency.
- **Card outlines:** Keep yellow (`rgba(245,208,0,0.5)`) borders to make cards pop.
- **3D depth:** Cards and buttons use box shadows, border-radius, and `translateY` lift on hover. Adam said the flat look wasn't working and wanted everything to look more 3D.
- **Header:** Sticky with backdrop blur (`rgba(26,26,26,0.9)`). Adam wanted content to scroll under the header.

### Navigation Decisions
- Landing page shows 3 large cards (Blog, Resume, Projects) as primary navigation — no nav links in the header on this page (`showNav={false}`).
- Subpages show nav links (Blog, Resume, Projects) in the header as **plain small text** (not buttons). Adam specifically asked to remove the button styling and make them smaller to distinguish from the GitHub button.
- "Adam Kenawell" in top-left is always a button-styled link back to the landing page.

### Content Collections
- Blog uses Astro content collections with `glob()` loader. Config at `src/content.config.ts` (not project root). Uses `z` from `astro/zod` (not `astro:content`).
- 6 sample blog posts exist in `src/content/blog/`. Individual post pages at `/blog/[slug]`.

### Resume
- Real resume data is now in `resume.astro` — experience at Ford, education (PSU + Bellevue), achievements, and grouped technical skills. Source data came from `adam-kenawell-resume-example.txt`.
- Sections separated with `3rem` gap, uppercase headings with thick yellow underline, bullet points with ▸ and ★ markers.

### Deployment — GitHub Actions CI/CD
- Site deploys automatically when code is pushed to `main`. Workflow at `.github/workflows/deploy.yml`.
- **Agent workflow to publish changes:**
  1. Make edits to source files
  2. Verify with `npx astro build` (must exit 0, currently builds 10 pages)
  3. Run `git add -A && git commit -m "<message>" && git push` to deploy
  4. GitHub Actions picks up the push → builds → deploys to GitHub Pages (~1–2 min)
- GitHub Pages source is set to **GitHub Actions** (not "Deploy from branch") in repo Settings → Pages.
- `base` in `astro.config.mjs` is `'/'` — custom domain `adam.kenawell.family`. All internal links use `import.meta.env.BASE_URL` to prefix paths correctly.
- Git remote uses a PAT for auth under the `adam-kenawell` account (not the Ford `akenawel_ford` account).

### Mobile Responsiveness
- All pages have `@media (max-width: 600px)` breakpoints added (2026-05-07).
- Cards go full-width on mobile, font sizes reduce, padding shrinks.

### Animated Sprite Background
- `SpriteBackground.astro` renders Pokémon Mystery Dungeon sprites on a canvas behind page content.
- **Source:** Sprite sheets loaded directly from `https://raw.githubusercontent.com/PMDCollab/SpriteCollab/master/sprite/{ID}/{Action}-Anim.png`. Curated list of ~37 Pokémon IDs; 6-8 chosen randomly per load.
- **Sprite sheets:** 8 rows (directions: S, SE, E, NE, N, NW, W, SW), N columns (frames). Frame size = sheetHeight/8 (square). Animated by cycling columns via canvas `drawImage`.
- **Scale:** 1x (original size). Fully opaque. `image-rendering: pixelated`.
- **Z-layering:** background (z:0) → sprites (z:1) → page content (z:2). Sprites walk behind cards/header.
- **CSS:** Must use `is:global` on SpriteBackground style block — canvases are created dynamically and don't get Astro's scoped data attributes.
- **Timing:** All timers use `performance.now()` (not `Date.now()`) to match `requestAnimationFrame`'s timestamp.
- **Frame dimensions:** Fetched from each Pokémon's `AnimData.xml` — each action has different FrameWidth/FrameHeight.
- **State machine per sprite:**
  - **Walking** (default): moves in random direction, row = direction of travel. Small random chance each frame to transition to Idle. Bounces off screen edges.
  - **Idle**: faces south (row 0), plays Idle sheet for 2-4 sec, then resumes Walking.
  - **Sleeping**: after 2.5 min of no user interaction, all non-attacking sprites transition to Sleep (faces south). Clicking a sleeping sprite wakes it (→ Walking, no attack).
  - **Attacking**: clicking a non-sleeping sprite plays Attack sheet for 1 sec, then → Walking.
- **Sheets loaded per sprite:** Walk (required), Idle, Sleep, Attack (optional — falls back to Walk if missing).
- **Interaction tracking:** mousemove, keydown, scroll reset the inactivity timer. Clicking a sprite also resets it.

### Reference Docs
- Astro: [https://docs.astro.build/en/getting-started/](https://docs.astro.build/en/getting-started/)
- GitHub Pages: [https://docs.github.com/en/pages](https://docs.github.com/en/pages)
