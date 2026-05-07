# Copilot Instructions — adam.kenawell.family

## Project Overview
Personal website for Adam Kenawell (Data Engineer at Ford), hosted on **GitHub Pages**, built with **Astro v6**. The repo is owned by the `adam-kenawell` GitHub account (adam.kenawell.family@gmail.com), not the `akenawel_ford` account.

## Tech Stack
- **Framework:** Astro v6.3 (static site builder) — docs: https://docs.astro.build/en/getting-started/
- **Hosting:** GitHub Pages — docs: https://docs.github.com/en/pages
- **Node:** ≥22 (managed via Volta)
- **Registry:** Project-local `.npmrc` → public `registry.npmjs.org` (bypasses Ford's internal Nexus proxy)

## Developer Workflows

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build locally | `npm run preview` |
| Sync content collections | `npx astro sync` |
| Deploy to GitHub Pages | Push to `main` (triggers GitHub Actions automatically) |

## Publishing Changes (GitHub Actions CI/CD)

The site is deployed automatically via GitHub Actions. The workflow lives at `.github/workflows/deploy.yml`.

**Process to make and publish changes:**
1. Make code changes locally (edit `.astro`, `.md`, config files, etc.)
2. Build locally to verify: `npx astro build`
3. Stage, commit, and push in one step:
   ```
   git add -A && git commit -m "<descriptive message>" && git push
   ```
4. GitHub Actions automatically triggers on push to `main`:
   - Checks out code → installs Node 22 → runs `npm ci` → runs `npm run build` → uploads `./dist` as artifact → deploys to GitHub Pages
5. Site is live at `https://adam-kenawell.github.io/adam.kenawell.family/` within ~1–2 minutes

**Key details:**
- GitHub Pages source is set to **GitHub Actions** (not "Deploy from branch") in the repo Settings → Pages
- The workflow uses `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`
- Concurrency is configured to prevent overlapping deploys (`cancel-in-progress: false`)
- `workflow_dispatch` is enabled so deploys can also be triggered manually from the Actions tab
- The `base` in `astro.config.mjs` is set to `'/adam.kenawell.family/'` to match the repo-name-based GitHub Pages URL

## Project Structure
```
src/
  pages/            # File-based routing
    index.astro     # Landing page (3 cards: Blog, Resume, Projects)
    blog/
      index.astro   # Blog listing page
      [slug].astro  # Dynamic blog post pages
    resume.astro    # Resume page (real data)
    projects.astro  # Projects showcase
  components/
    Header.astro    # Shared sticky header (accepts showNav prop)
  layouts/
    Layout.astro    # Base layout (imports font, global styles)
  content/
    blog/           # Markdown blog posts (content collection)
  content.config.ts # Content collection config (glob loader + Zod schema)
public/             # Static assets
astro.config.mjs
.npmrc              # Points to public npm registry
```

## Design System
- **Background:** `#1a1a1a` (dark charcoal, not pure black)
- **Accent:** `#f5d000` (yellow) — used for borders, text, hover states
- **Transparency:** Grey `rgba(255,255,255,0.06)` for card/header backgrounds (not yellow)
- **Borders:** Yellow `rgba(245,208,0,0.5)` for card outlines
- **3D depth:** Cards use `box-shadow`, `border-radius: 8px`, lift on hover (`translateY(-4px)`)
- **Header:** Sticky, backdrop blur, semi-transparent `rgba(26,26,26,0.9)`
- **Typography:** `Fusion Pixel 12px Monospaced KR` via `@fontsource/fusion-pixel-12px-monospaced-kr`
- **Tone:** Playful yet polished and professional
- **Layout:** Clean — no filler text; every element has purpose

## Component Patterns
- **`Header.astro`** accepts `showNav` prop (default `true`). Landing page passes `showNav={false}` since the 3 cards serve as navigation. Subpages show nav links as plain small text (not buttons) to distinguish from the GitHub button.
- **Blog** uses Astro content collections with `glob()` loader and Zod schema. Posts are Markdown in `src/content/blog/`. Config is at `src/content.config.ts`.
- **Resume data** is defined inline in `resume.astro` as typed arrays — experience bullets, education entries, achievements, and grouped skill tags.

## Workflow & Agent Behavior
- **Always present a plan** before executing tasks and wait for Adam's approval
- Once approved, proceed through all steps without re-asking
- Persist notable decisions to `agent-context.md`

## Key Files
| File | Purpose |
|------|---------|
| `agent-instructions.md` | Source-of-truth intent and project constraints |
| `agent-context.md` | Running log of notable decisions/context |
| `.github/copilot-instructions.md` | This file — AI agent guidance |
| `.github/copilot-instructions.md` | This file — AI agent guidance |
