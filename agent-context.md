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

### Reference Docs
- Astro: [https://docs.astro.build/en/getting-started/](https://docs.astro.build/en/getting-started/)
- GitHub Pages: [https://docs.github.com/en/pages](https://docs.github.com/en/pages)
