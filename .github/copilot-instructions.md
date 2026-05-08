# Copilot Instructions — adam.kenawell.family

## Project Overview

Personal website for Adam Kenawell (Data Engineer at Ford), hosted on **GitHub Pages**, built with **Astro v6.3**. Repo owned by `adam-kenawell` GitHub account (not `akenawel_ford`).

## Tech Stack

- **Astro v6.3** static site · **GitHub Pages** hosting · **Node ≥22** (Volta) · Project `.npmrc` → `registry.npmjs.org`

## Session Workflow

1. `npm run dev` (background) at session start
2. Make changes — dev server hot-reloads. Adam previews at `http://localhost:4321/`
3. Iterate until satisfied
4. **End of session only:** `npx astro build && git add -A && git commit -m "<msg>" && git push`
5. GitHub Actions auto-deploys to `https://adam.kenawell.family` (~1-2 min)
6. **One push per session** — batch all changes

## Project Structure

```
src/
  pages/
    index.astro          # Landing — 3 nav cards, 100 random taglines
    about.astro          # Personal bio (6 sections + favorites grid)
    resume.astro         # Resume (objective, 3 jobs, achievements, skills)
    projects.astro       # Project listing with internal detail links
    projects/
      local-llm-stack.astro    # Project detail page
      pokepaste-visualizer.astro  # PokePaste team visualizer (client-side)
    blog.astro           # Blog listing with 4 category filter tabs
    blog/
      [slug].astro       # Blog post template
    rss.xml.ts           # RSS feed endpoint
  components/
    Header.astro         # Sticky header, nav, avatar, settings dropdown, external links
    Footer.astro         # Shared footer (copyright line)
    SpriteBackground.astro  # Animated Pokémon sprites background (canvas + JS only)
    ThemeControls.astro  # Theme JS only — applyTheme(), initThemeControls(), color swatches
  layouts/
    Layout.astro         # Base layout (font, global CSS vars, ClientRouter, theme init)
  content/
    blog/                # Markdown blog posts (content collection)
  content.config.ts      # glob() loader + Zod schema (includes category field)
```

## Design System — Theming

The site uses **CSS custom properties** for all colors. **Never hardcode** `#f5d000`, `rgba(245,208,0,...)`, `#1a1a1a`, or `rgba(255,255,255,...)` in styles. Always use the CSS vars:

| Variable | Dark mode default | Light mode default | Usage |
|----------|------------------|--------------------|-------|
| `--accent` | `rgb(245,208,0)` | User-selected | Headings, links, borders, interactive elements |
| `--accent-rgb` | `245,208,0` | User-selected | For `rgba(var(--accent-rgb), 0.X)` opacity patterns |
| `--bg` | `#1a1a1a` | `#f5f5f5` | Page background |
| `--bg-rgb` | `26,26,26` | `245,245,245` | For `rgba(var(--bg-rgb), 0.X)` |
| `--bg-card` | `rgba(26,26,26,0.9)` | `rgba(255,255,255,0.9)` | Card/panel backgrounds |
| `--text` | `rgba(255,255,255,0.85)` | `rgba(30,30,30,0.9)` | Body text |
| `--text-muted` | `rgba(255,255,255,0.5)` | `rgba(30,30,30,0.55)` | Secondary text, labels |
| `--text-faint` | `rgba(255,255,255,0.35)` | `rgba(30,30,30,0.35)` | Placeholders, subtle text |
| `--header-bg` | `rgba(26,26,26,0.9)` | `rgba(245,245,245,0.9)` | Header background |

### Common patterns

```css
color: var(--accent);                          /* accent text */
border: 1px solid rgba(var(--accent-rgb), 0.5); /* accent border with opacity */
background: var(--bg-card);                     /* card background */
color: var(--text);                             /* body text */
color: var(--text-muted);                       /* secondary text */
```

### Theme persistence

- User preferences stored in `localStorage` keys: `theme-mode` (`dark`/`light`), `theme-accent` (RGB triplet like `245,208,0`)
- Inline `<script is:inline>` in Layout `<head>` applies saved theme before first paint (prevents flash)
- `astro:after-swap` event listener reapplies theme on Astro view transitions
- `ThemeControls.astro` re-initializes via `astro:after-swap` as well

## Design System — Other

- **Card fills:** grey `rgba(255,255,255,0.06)` · **Card borders:** `rgba(var(--accent-rgb), 0.5)` · 3D hover lift
- **Header:** Sticky, backdrop blur, `var(--header-bg)`. "Adam Kenawell" button links home.
- **Nav links:** `var(--text-muted)`, active = `var(--accent)` + underline
- **Section separators:** `border-top: 1px solid rgba(var(--accent-rgb), 0.2)`
- **Font:** `Fusion Pixel 12px Proportional KR` · **Line-height:** `1.8` globally
- **View Transitions:** `ClientRouter` from `astro:transitions`
- **Tone:** Playful yet polished. No filler text. No emojis/m-dashes in body copy.
- **Mobile:** `@media (max-width: 600px)` breakpoints on all pages

## Component Patterns

- **Header (`Header.astro`):** `showNav` prop (default `true`). Landing passes `showNav={false}`. Structure: `.left-group` (avatar button + name + About Me) | `.right-group` > `.nav-links` (Blog/Resumé/Projects + GitHub/LinkedIn/Coffee) + `.settings-wrapper` (⚙ button + dropdown). Settings dropdown contains two collapsible groups: "Pokémon Controls" (dex input, spawn, hide) and "Theme" (mode toggle, color grid). **CRITICAL:** `.settings-wrapper` must stay OUTSIDE any `overflow` container or the dropdown gets clipped. The `<script is:inline>` block handles all toggle logic. Avatar is an Electivire sprite in a styled `<button>`.
- **Footer (`Footer.astro`):** Copyright line only. "Buy me a coffee" link lives in the header now.
- **Blog:** Content collections with `glob()` loader, Zod schema with `category: z.enum(['featured','technical','lifestyle','monthly-report'])`. 4 filter tabs with client-side JS.
- **Sprites (`SpriteBackground.astro`):** Pokémon Mystery Dungeon sprites on canvas. States: Walking → Idle → Sleeping (2.5min inactivity) → Attacking (click). CSS uses `is:global`. Controls HTML lives in Header.astro settings dropdown (not in this component). This component only has the background canvas div and the sprite engine JS.
- **ThemeControls (`ThemeControls.astro`):** JS-only component (no HTML or CSS). Contains `applyTheme()` function, `initThemeControls()` which wires up mode buttons and builds color swatches into `#color-grid`, and the `ACCENT_COLORS` array. The actual UI elements (mode buttons, color grid div) live in Header.astro's settings dropdown. Color swatches are created dynamically via JS, so their CSS must use `:global()` selectors in Header.astro.
- **Internal links** use `import.meta.env.BASE_URL` prefix.

## Gotchas & Lessons Learned

- **Overflow clipping:** Any element with `overflow-x: auto` (like `.nav-links`) will clip absolutely-positioned children (like dropdowns). Always keep dropdown containers OUTSIDE overflow parents.
- **Astro scoped styles vs dynamic elements:** Elements created via `document.createElement()` in `<script>` blocks don't get Astro's `data-astro-cid-xxx` attribute. Their CSS must use `:global()` selectors.
- **Astro `<script>` vs `<script is:inline>`:** Regular `<script>` tags are hoisted to `<head>` and bundled as ES modules — they run once. `<script is:inline>` renders in-place and executes immediately after the preceding HTML. Use `is:inline` for DOM manipulation that needs elements to exist.
- **Dev server port:** If port 4321 is occupied, Astro auto-increments. Always kill stale `node.exe` processes before restarting. Adam expects to use `http://localhost:4321/`.

## Agent Behavior

- **Present a plan** before executing, wait for approval
- Proceed through all steps once approved
- Persist notable decisions to `agent-context.md`
- **Markdown hygiene:** Fix all reasonable lint errors (blank lines around headings/lists, etc.) in any markdown file created or edited.
- **Writing tone:** First-person, conversational, genuine. Write like you're explaining something to a friend — casual but thoughtful, with natural humor and self-awareness. Avoid corporate buzzwords, filler, emojis, and m-dashes. Let personality come through. Reference: `from-pixel-one.md` and `local-llm-stack.astro`.
- **Optimization requests:** Before making changes, check `agent-context.md` for past optimization work to avoid redundancy and build on prior improvements.
- **Session wrap-up:** At the end of each session, log any optimization or efficiency changes made to `agent-context.md`.

## Key Files — Quick Reference

Use this to know where to look for specific features:

| Feature / Question | File(s) to Read |
|---|---|
| Header layout, nav links, settings dropdown | `src/components/Header.astro` |
| Theme system (CSS vars, dark/light mode) | `src/layouts/Layout.astro` (vars + init), `src/components/ThemeControls.astro` (JS logic), `src/components/Header.astro` (UI + CSS) |
| Pokémon background sprites | `src/components/SpriteBackground.astro` (engine), `src/components/Header.astro` (controls UI) |
| PokePaste team visualizer | `src/pages/projects/pokepaste-visualizer.astro` (self-contained) |
| Blog system, categories, filtering | `src/pages/blog.astro`, `src/pages/blog/[slug].astro`, `src/content.config.ts` |
| Landing page, taglines | `src/pages/index.astro` |
| Resume content | `src/pages/resume.astro`, `public/Adam_Kenawell_Resume.html` (PDF) |
| Global styles, fonts, meta tags | `src/layouts/Layout.astro` |
| Agent decisions log | `agent-context.md` |
| Agent rules | `.github/copilot-instructions.md` (this file) |
