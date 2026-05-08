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
      local-llm-stack.astro  # Project detail page
    blog.astro           # Blog listing with 4 category filter tabs
    blog/
      [slug].astro       # Blog post template
  components/
    Header.astro         # Sticky header (showNav prop, active page indicator)
    Footer.astro         # Shared footer
    SpriteBackground.astro  # Animated Pokémon sprites background
  layouts/
    Layout.astro         # Base layout (font, global styles, ClientRouter)
  content/
    blog/                # Markdown blog posts (content collection)
  content.config.ts      # glob() loader + Zod schema (includes category field)
```

## Design System

- **Background:** `#1a1a1a` · **Accent:** `#f5d000` (yellow) · **Body text:** `rgba(255,255,255,0.85)` (white)
- **Card fills:** grey `rgba(255,255,255,0.06)` · **Card borders:** yellow `rgba(245,208,0,0.5)` · 3D hover lift
- **Header:** Sticky, backdrop blur, `rgba(26,26,26,0.9)`. "Adam Kenawell" button links home.
- **Nav links:** White `rgba(255,255,255,0.7)`, active = yellow + underline
- **Section separators:** `border-top: 1px solid rgba(245, 208, 0, 0.2)`
- **Font:** `Fusion Pixel 12px Proportional KR` · **Line-height:** `1.8` globally
- **View Transitions:** `ClientRouter` from `astro:transitions`
- **Tone:** Playful yet polished. No filler text. No emojis/m-dashes in body copy.
- **Mobile:** `@media (max-width: 600px)` breakpoints on all pages

## Component Patterns

- **Header:** `showNav` prop (default `true`). Landing passes `showNav={false}`. "About Me" link in `.left-group` always visible.
- **Blog:** Content collections with `glob()` loader, Zod schema with `category: z.enum(['featured','technical','lifestyle','monthly-report'])`. 4 filter tabs with client-side JS.
- **Sprites:** Pokémon Mystery Dungeon sprites on canvas. States: Walking → Idle → Sleeping (2.5min inactivity) → Attacking (click). CSS uses `is:global`. Controls collapsible.
- **Internal links** use `import.meta.env.BASE_URL` prefix.

## Agent Behavior

- **Present a plan** before executing, wait for approval
- Proceed through all steps once approved
- Persist notable decisions to `agent-context.md`
- **Markdown hygiene:** Fix all reasonable lint errors (blank lines around headings/lists, etc.) in any markdown file created or edited.
- **Writing tone:** First-person, conversational, genuine. Write like you're explaining something to a friend — casual but thoughtful, with natural humor and self-awareness. Avoid corporate buzzwords, filler, emojis, and m-dashes. Let personality come through. Reference: `from-pixel-one.md` and `local-llm-stack.astro`.
- **Optimization requests:** Before making changes, check `agent-context.md` for past optimization work to avoid redundancy and build on prior improvements.
- **Session wrap-up:** At the end of each session, log any optimization or efficiency changes made to `agent-context.md`.

## Key Files

| File | Purpose |
|------|---------|
| `agent-context.md` | Running log of session decisions/context |
| `.github/copilot-instructions.md` | This file — AI agent guidance |
