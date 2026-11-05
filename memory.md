# Poké Emblem — Project Memory (`memory.md`)

## Current Status
- **Active Branch:** `poke-emblem-dev` (for building and testing Poké Emblem without affecting the live `main` GitHub Pages deployment).
- **Roadmap Progress:** **Step 0 Complete** (Project scaffolding, starting shell, and PMD sprite widget verification). Ready to begin **Step 1: Core Data Schemas, Manual Balance Registries & Save State Manager**.

## Session Log

### Session 1 (2026-11-05) — Repo Cleanup & Poké Emblem Scaffolding
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
