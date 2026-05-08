# Agent Context — adam.kenawell.family

Running log of notable decisions, constraints, and context across sessions.

---

## Session 1 — 2026-05-07 (Morning) — Initial Build

- **Environment:** Node 22 (Volta), Astro v6.3, GitHub Pages. `.npmrc` → `registry.npmjs.org` (bypasses Ford proxy; don't remove user-level `.npmrc`). Git remote uses PAT under `adam-kenawell` (not Ford `akenawel_ford`).
- **Design system:** Background `#1a1a1a`, accent `#f5d000`, body text `rgba(255,255,255,0.85)`. Card borders yellow, fills grey. Sticky header with backdrop blur. Mobile breakpoint at 600px.
- **Pages:** Landing (3 nav cards, `showNav={false}`), Resume (Ford experience, PSU + Bellevue education), Blog (content collections with `glob()` loader + Zod schema).
- **Sprite background:** PMD sprites from PMDCollab GitHub. 8-directional spritesheets, frame size from `AnimData.xml`. Z-layering: background(0) → sprites(1) → content(2). Card backgrounds must be opaque (`rgba(26,26,26,0.95)`) so sprites don't bleed through.

---

## Session 2 — 2026-05-07 (Afternoon) — Content & Style

- **About page:** 6 bio sections + favorites grid. Genuine tone, no emojis/m-dashes.
- **Resume overhaul:** Objective section, 3 positions with 3 bullets each, achievements as objects, skills 5/group.
- **Typography:** Font switched to `Fusion Pixel 12px Proportional KR`. Global `line-height: 1.8`. View transitions via `ClientRouter`. Shared `Footer.astro`.
- **Landing:** 100 rotating taglines, card hover effects.
- **Projects:** Listing page + `local-llm-stack.astro` detail page with spec grid.
- **Blog system:** 4 category filter tabs with client-side JS, 50 random empty messages. Content schema has `category` enum. First real post: `from-pixel-one.md`. Post template: white body, yellow headings/links.
- **Pokémon controls:** "Spawn" button, collapsible controls row.
- **Optimization:** Removed unused monospaced font dep, added `.page` wrappers for footer positioning, fixed markdown lint.

---

## Session 3 — 2026-05-08 — Sprites, Resume PDF, RSS

- **Sprite overhaul:** Condensed to ~300 lines. 10 sprites per load, full dex range (1-1025), no localStorage. Spawn reuses old position, validates before removing, debounces. State machine: Walk → Idle → Sleep (2.5min) → Attack (click).
- **Resume PDF:** `public/Adam_Kenawell_Resume.html` — printable one-pager. Download button on resume page.
- **View transitions:** `transition:persist` on sprite elements. Tagline randomizes client-side via `astro:page-load`.
- **Card opacity fix:** `.spec-card` and `.fav-card` → opaque `rgba(26,26,26,0.95)`.
- **RSS feed:** `@astrojs/rss` dependency, `rss.xml.ts` endpoint, RSS pill button on blog filter bar.

---

## Session 4 — 2026-05-08 — Mobile Polish, Avatar, Favicon, Open Graph

- **Mobile header:** Removed flex-wrap; nav scrolls horizontally with hidden scrollbar. All links `white-space: nowrap`.
- **Blog filter bar:** RSS button moved to left of filters. Row is `nowrap` + `overflow-x: auto`, all buttons `flex-shrink: 0`.
- **Electivire avatar:** Animated idle sprite (dex #466) canvas in header, left of name button. Bottom 15% cropped. Click toggles status speech bubble. Reinits on `astro:after-swap`.
- **Animated favicon:** Electivire headshot — top 35% of frame, center-cropped to fill 32x32, offset nudged 1px. Updates via `setInterval`.
- **RSS auto-discovery:** `<link rel="alternate" type="application/rss+xml">` in Layout `<head>`.
- **Open Graph:** Added `description` prop to Layout. `og:type`, `og:title`, `og:description`, `og:url` + standard meta description on every page. Blog posts use `excerpt` field.
