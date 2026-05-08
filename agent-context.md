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

---

## Session 5 — 2026-05-08 — PokePaste Visualizer

- **New project page:** `src/pages/projects/pokepaste-visualizer.astro` — full client-side PokePaste team visualizer.
- **Core flow:** Full-screen textarea with "Paste PokePaste here" placeholder → "Visualize" button → renders team card.
- **Team card layout:** Single card containing a 3x2 grid of square Pokemon cells (250px, `aspect-ratio: 1`). Each cell: name centered over info section, animated PMD sprite on left, item/ability/nature/EVs on right, 2x2 move grid at bottom.
- **Color coding:** Pokemon names colored by typing (dual types get CSS gradient). Move pills colored by move type via PokeAPI lookup. EV spreads color-coded: HP=red, Atk=orange, Def=yellow, SpA=blue, SpD=green, Spe=pink.
- **Animated sprites:** Reuses PMDCollab sprite system from SpriteBackground. Idle animation by default, click triggers attack. Toggle button switches between animated PMD sprites and official PokeAPI artwork.
- **Fallback sprites:** If no PMD sprite exists, falls back to official Pokemon artwork from PokeAPI.
- **Role tags:** Up to 3 role tags per Pokemon via dropdown selects. Starts with just a "+" button, each click adds a dropdown (max 3). Options: Physical/Special/Mixed/Setup Sweeper, Tailwind/Trick Room Setter, Support, Pivot, Fast, Slow, Wall, Tank, Redirection, Weather/Terrain Setter, Lead. Tags hidden by default, toggled via "Show Tags" button. Tags overlay at bottom of cell without shifting layout.
- **Save/Load:** Teams saved to localStorage with name, paste text, roles, and tag visibility. Team name input defaults to "Team 1", "Team 2", etc. Load/Delete per team, "Delete All Teams" with confirmation.
- **Styling:** Fully opaque `#1a1a1a` team card background (sprites don't bleed through). Pixel font throughout. Dropdown options styled dark to match site theme.
- **Responsive:** 3 columns >850px, 2 columns <=850px, scaled-down text/sprites on mobile <=600px. EVs use `min(0.55rem, 1.8vw)` to prevent overflow.
- **Projects listing:** Added entry to `projects.astro` array.
- **Pushed:** Single commit "Add PokePaste Visualizer project page" to main.

---

## Session 6 — 2026-05-08 — Theme System & Footer

- **"Buy me a coffee" link:** Added to `Footer.astro` with accent-colored link pointing to `buymeacoffee.com/adamkenawell`. Account pending creation.
- **Theme system overhaul:** Converted the entire site from hardcoded `#f5d000` / `rgba(245,208,0,...)` / `rgba(255,255,255,...)` / `#1a1a1a` to CSS custom properties. Touched 13 files total.
- **CSS custom properties:** Defined on `:root` in `Layout.astro`: `--accent`, `--accent-rgb`, `--bg`, `--bg-rgb`, `--bg-card`, `--text`, `--text-muted`, `--text-faint`, `--header-bg`. All page/component styles reference these vars.
- **ThemeControls component:** `src/components/ThemeControls.astro` — fixed bottom-right, collapsible "Theme" label (mirrors Pokémon Controls pattern). Panel contains dark/light mode toggle and a 5x4 grid of 20 accent color swatches (Gold, Red, Coral, Orange, Amber, Lime, Green, Emerald, Teal, Cyan, Sky, Blue, Indigo, Violet, Purple, Fuchsia, Pink, Rose, White, Silver). Active swatch gets highlighted border.
- **Light mode:** Swaps background to `#f5f5f5`, text to dark `rgba(30,30,30,...)`, cards to white-tinted fills. All text elements properly invert for readability.
- **Persistence:** Theme mode and accent RGB saved to `localStorage`. Inline `<script is:inline>` in `<head>` applies saved theme before first paint (no flash). `astro:after-swap` listener reapplies on view transitions.
- **Click-outside-to-close:** Both Theme and Pokémon Controls panels close when clicking anywhere outside. Uses `stopPropagation` on panel internals so interacting with controls doesn't dismiss them.
- **Files modified:** `Layout.astro`, `ThemeControls.astro` (new), `Header.astro`, `Footer.astro`, `SpriteBackground.astro`, `index.astro`, `about.astro`, `resume.astro`, `projects.astro`, `blog.astro`, `[slug].astro`, `local-llm-stack.astro`, `pokepaste-visualizer.astro`.

---

## Session 7 — 2026-05-08 — Settings Dropdown Consolidation & Header Restructure

- **Settings dropdown:** Merged Pokémon Controls and Theme into a single ⚙ settings dropdown in the header. Two collapsible groups ("Pokémon Controls" and "Theme") expand/collapse independently inside the dropdown.
- **Header restructure:** Three-part flex layout: `.left-group` (avatar button + name + About Me) | `.nav-links` inside `.right-group` (Blog/Resumé/Projects/GitHub/LinkedIn/Coffee, scrollable) | `.settings-wrapper` (outside overflow, prevents dropdown clipping).
- **Overflow clipping lesson (critical):** `overflow-x: auto` on a parent clips absolutely-positioned children (dropdowns). Settings wrapper must NEVER be inside an overflow container. This bug caused hours of debugging — the dropdown was toggling correctly but was invisible due to clipping.
- **Avatar button:** Wrapped Electivire sprite canvas in a styled `<button class="avatar-btn">` with accent border, hover glow, and lift effect. Shrunk from 40px to 32px (26px mobile).
- **ThemeControls.astro gutted:** Removed all HTML and CSS. Now JS-only — contains `applyTheme()`, `initThemeControls()`, and `ACCENT_COLORS` array. UI elements live in Header.astro.
- **SpriteBackground.astro cleaned:** Removed `#sprite-controls` HTML div and all its CSS. Removed controls toggle JS. Controls now live in Header.astro settings dropdown. Component only has background canvas + sprite engine JS.
- **Footer.astro simplified:** Removed "Buy me a coffee" link (moved to header nav). Now just copyright line.
- **Color swatch CSS fix:** Swatches are created dynamically via `document.createElement()` in ThemeControls JS, so they don't get Astro's scoped `data-astro-cid-xxx` attributes. Fixed by using `:global()` selectors for `.color-grid` and `.color-swatch` in Header.astro.
- **Script timing fix:** Settings toggle uses `<script is:inline>` (not regular `<script>`) to ensure DOM elements exist when listeners attach. Regular Astro scripts are hoisted to `<head>` as ES modules and may run before the body is parsed.
- **Inline onclick approach:** Settings button uses `onclick` attribute as the most reliable method — no script timing, no DOM readiness issues, no module hoisting problems.

---

## Session 8 — 2026-05-08 — Code Optimization & Modularization

- **Shared sprite utilities:** Extracted `spriteUrl`, `animDataUrl`, `loadImage`, `fetchAnimData`, `calcFrameInfo`, and `FrameInfo` type into `src/utils/sprite-utils.ts`. Eliminated ~80 lines of duplicated code across SpriteBackground, PokePaste Visualizer, and Header avatar.
- **Shared theme utilities:** Extracted `applyTheme` and `applyStoredTheme` into `src/utils/theme-utils.ts`. Theme CSS var mappings stored as data (single object) instead of repeated if/else blocks. ThemeControls.astro now imports from shared utils instead of defining its own copy.
- **Layout inline script compacted:** Replaced 20-line if/else theme init with data-driven loop (themes object + for-in), cut to ~10 lines. Same data structure as `theme-utils.ts`.
- **Global `.page` CSS:** Moved the `.page { display:flex; flex-direction:column; min-height:100vh }` pattern from 8 separate pages into `Layout.astro` global styles. Removed ~32 lines of duplicated CSS.
- **Header avatar refactored:** Replaced inline AnimData XML parsing with `fetchAnimData()` from shared utils. Replaced manual URL construction with `spriteUrl()`. Cut ~25 lines.
- **Hardcoded color fix:** Replaced `#1a1a1a` with `var(--bg)` in pokepaste-visualizer delete button hover.
- **Removed unused code:** `POKEMON_IDS` array (curated list), `ATTACK_MS` constant — both were dead code in SpriteBackground.
- **Build verified:** All 8 pages build successfully after each change.

---

## Session 9 — 2026-05-08 — CSS Consolidation & Deduplication

- **`.accent-btn` base class:** Added to Layout globals. Consolidates shared border/radius/transition/cursor/color styles used by 7 Header buttons (`.name-btn`, `.github-link`, `.avatar-btn`, `.settings-btn`, `.settings-action-btn`). Each button now only defines its own size/padding overrides.
- **Content-page shared patterns:** Added `.content-page`, `.hero`, `.hero h1`, `.hero .tagline`, `.content-page section/h2/p/strong`, `.hero + section h2`, `.info-grid`, `.info-card`, `.info-card-label`, `.info-card-value` to Layout globals. Used by `about.astro` and `local-llm-stack.astro` — removed ~130 lines of duplicated CSS.
- **SpriteBackground `setState()` consolidation:** Merged 4 separate functions (`setWalking`, `setIdle`, `setSleeping`, `setAttacking`) into single `setState(s, state)` with data-driven animation name lookup.
- **Font-family global inherit:** Added `button, input, select, textarea { font-family: inherit }` to Layout globals, then removed 14 redundant `font-family` declarations across Header, blog, and pokepaste-visualizer.
- **PowerShell corruption fix:** `Set-Content -NoNewline` collapsed pokepaste-visualizer.astro to 1 line. Recovered via `git checkout` + manual re-application of all changes. Lesson: never use PowerShell `Set-Content` for file writes — use `replace_string_in_file` tool only.

### Context-Loading Tips for Future Sessions

To minimize context needed when starting a new session:

1. **Read `agent-context.md` first** — it has the full history of decisions and gotchas.
2. **Read `.github/copilot-instructions.md`** — it has the complete project structure, design system, and component patterns.
3. **Only read files relevant to the task.** Use the Key Files table in copilot-instructions.md to know which files to read.
4. **Shared utilities location:** `src/utils/sprite-utils.ts` (sprite loading/rendering) and `src/utils/theme-utils.ts` (theme application). Both are imported by multiple components.
5. **Don't re-read Layout.astro** unless changing global styles or theme init — the design system vars are documented in copilot-instructions.md.
6. **For CSS changes:** Check Layout.astro global styles first (`.page`, CSS vars, resets). Page-scoped styles are in each `.astro` file's `<style>` block.
7. **For sprite work:** All sprite URL construction, image loading, and frame calculation lives in `sprite-utils.ts`. SpriteBackground, PokePaste Visualizer, and Header avatar all import from it.
