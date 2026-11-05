# Poké Emblem — Project Memory (`memory.md`)

## Current Status
- **Active Branch:** `poke-emblem-dev` (for building and testing Poké Emblem without affecting the live `main` GitHub Pages deployment).
- **Roadmap Progress:** **Step 1 Complete** (Core Data Schemas, Manual Balance Registries & Hybrid `SaveStateManager` verified across Desktop & Mobile). Ready to begin **Step 2: PMD Asset Loader, UI Window Framework & Portrait Dialogue Engine**.

## Session Log

### Session 1 (2026-11-05) — Repo Cleanup & Poké Emblem Scaffolding (Step 0)
1. **Repository & Website Cleanup (pushed to `main`):**
   - Permanently removed old project pages (`chample`, `local-llm-stack`, `pokepaste-visualizer`, `rescue-team-ai`, `task-shard`), untracked WIP folders (`dsc520/`, `src/game/`), and unused dependencies (`phaser`, external `pmd-visualizer` file link).
   - Removed all references and blog posts related to `rescue-team-ai` and `pokepaste-visualizer`.
   - Inlined PMD sprite loading and interactive widget utilities directly into `src/utils/sprite-utils.ts`.
2. **Agent Instructions & Master Spec Setup (`poke-emblem-dev` branch):**
   - Created `GEMINI.md` at the repo root containing Section 3.5 (Custom LLM Agent System Instructions) and Section 3.6 (10-Step Implementation Roadmap & Verification Gates).
   - Added full Master Spec (`Poké Emblem - LLM Master Spec & Game Design Document.md`) at the repo root.
   - Created `src/poke-emblem/` directory structure (`data/`, `types/`, `state/`, `assets/`, `ui/`, `scenes/`, `engine/`).
3. **Local Dev Shell & PMD Sprite Verification:**
   - Added the **Poké Emblem** card to `src/pages/projects.astro` linking to `src/pages/projects/poke-emblem.astro`.
   - Built the initial *Pokémon Mystery Dungeon: Explorers of Sky*-styled title window shell in `src/pages/projects/poke-emblem.astro` and verified interactive PMD sprite rendering (`createSpriteWidget` with Bulbasaur `#0001` idle/attack animations on `pointerdown`).

### Session 2 (2026-11-05) — Step 1: Core Data Schemas, Manual Balance Registries & Save State Manager
1. **Core Schemas & Runtime Validators (`src/poke-emblem/types/`):**
   - Implemented `schemas.ts` and `validators.ts` enforcing 100% manual balance structures, Rule 4 move categories/ranges (`Physical` = Range 1, `Special` = Range 2, `Support/Heal` = Range 1 or 1–2, zero pure stat-changing moves), and Rule 5 faction separation + 3-stage promotion curves.
2. **Human-Editable Balance Registries (`src/poke-emblem/data/`):**
   - Authored `pokemon_species.json` (`342` species stages across `114` evolutionary lines: `8` Dragon Lords, `27` Gen 1–9 Starter Partners, `47` Q1–Q9 Quiz lines, `5` Story Chapter lines, `7` Paralogue lines including 8-branch Lv. 15 Eevee, Hidden Potential Slakoth, and sole shared `gastly_line`, plus `20` pure Enemy lines).
   - Authored `moves.json` (`88` moves across all 18 types; `0` pure stat-changing moves), `items.json` (`80` items including Held Gear, Berries, Consumables, Evolution Stone/Gem, X-Items, Vitamins, and `24` single-use general TMs), `personal_skills.json` (`47` tactical abilities), and typed accessors in `data/index.ts`.
3. **Hybrid `SaveStateManager` & Interactive Verification (`src/poke-emblem/state/`):**
   - Installed `firebase` Web SDK, added `firestore.rules` (`saves/{uid}` restricted to `request.auth.uid == uid`) and `.env.example`, and built `firebaseSync.ts` + `SaveStateManager.ts` with instant `localStorage` writes, custom nickname editing, single `[E]` equipped move enforcement, Support matrix (`1–5`), JSON backup export/import, and cross-device `lastUpdated` UTC timestamp reconciliation.
   - Upgraded `src/utils/sprite-utils.ts` for regional/form `pmdAssetId` paths and wired the PMD-styled **Step 1 Save & Registry Inspector** into `src/pages/projects/poke-emblem.astro` (unified Pointer Events, right-click + mobile Menu/Back parity).
   - Passed `npm run build` and Playwright verification gates across Desktop (`1920x1080`) and Mobile (`390x844` & `844x390`).
