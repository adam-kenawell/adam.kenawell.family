# Poké Emblem — Project Memory (`memory.md`)

## Current Status
- **Active Branch:** `poke-emblem-dev` (synced with `main`; use `poke-emblem-dev` for building/testing new steps and merge to `main` when deploying live to `https://adam.kenawell.family/projects/poke-emblem`).
- **Live Cloud Sync:** Firebase project `poke-emblem` (Google Sign-In + Cloud Firestore `saves/{uid}`) is live, configured in GitHub Actions repository variables + local `.env`, and confirmed working end-to-end between Desktop PC and Mobile Phone.
- **UI Convention Established:** Keep the public player-facing game UI clean, immersive, and free of technical jargon; place all developer diagnostics, balance/registry inspectors, and debug tools inside the top-left **`Dev Tools`** panel strictly gated to `adam.kenawell.family@gmail.com`.
- **Roadmap Progress:** **Step 1 Complete & Live-Verified**. Ready to begin **Step 2: PMD Asset Loader, UI Window Framework & Portrait Dialogue Engine**.

## Session Log

### Session 1 (2026-11-05) — Repo Cleanup & Poké Emblem Scaffolding (Step 0)
1. **Repository & Website Cleanup (pushed to `main`):**
   - Permanently removed old project pages (`chample`, `local-llm-stack`, `pokepaste-visualizer`, `rescue-team-ai`, `task-shard`), untracked WIP folders (`dsc520/`, `src/game/`), and unused dependencies (`phaser`, external `pmd-visualizer` file link).
   - Removed all references and blog posts related to `rescue-team-ai` and `pokepaste-visualizer`.
   - Inlined PMD sprite loading and interactive widget utilities directly into `src/utils/sprite-utils.ts`.
2. **Agent Instructions & Master Spec Setup (`poke-emblem-dev` branch):**
   - Created `GEMINI.md` at the repo root containing Section 3.5 (Custom LLM Agent System Instructions, auto-importing `memory.md`) and Section 3.6 (10-Step Implementation Roadmap & Verification Gates).
   - Added full Master Spec (`Poké Emblem - LLM Master Spec & Game Design Document.md`) at the repo root.
   - Created `src/poke-emblem/` directory structure (`data/`, `types/`, `state/`, `assets/`, `ui/`, `scenes/`, `engine/`).
3. **Local Dev Shell & PMD Sprite Verification:**
   - Added the **Poké Emblem** card to `src/pages/projects.astro` linking to `src/pages/projects/poke-emblem.astro`.
   - Built the initial *Pokémon Mystery Dungeon: Explorers of Sky*-styled title window shell in `src/pages/projects/poke-emblem.astro` and verified interactive PMD sprite rendering.

### Session 2 (2026-11-05) — Step 1 Complete, Live Firebase PC ↔ Mobile Sync & Polished Title/DevTools UI
1. **Core Schemas & Runtime Validators (`src/poke-emblem/types/`):**
   - Implemented `schemas.ts` and `validators.ts` enforcing 100% manual balance structures, Rule 4 move categories/ranges (`Physical` = Range `[1,1]`, `Special` = Range `[2,2]`, `Support/Heal` = Range `[1,1]` or `[1,2]`, `0` pure stat-changing moves), and Rule 5 faction separation + 3-stage promotion curves.
2. **Human-Editable Balance Registries (`src/poke-emblem/data/`):**
   - Authored `pokemon_species.json` (`342` static species stages across `114` evolutionary lines: `8` Dragon Lords, `27` Gen 1–9 Starter Partners, `47` Q1–Q9 Quiz lines, `5` Story Chapter lines, `7` Paralogue lines including 8-branch Lv. 15 Eevee, Hidden Potential Slakoth, and sole shared `gastly_line`, plus `20` pure Enemy lines / `21` total enemy-tagged lines including `gastly_line`).
   - Authored `moves.json` (`88` moves across all 18 types; `0` pure stat-changing moves), `items.json` (`80` items including Held Gear, Berries, all 18 Type Enhancers, Consumables, Evolution Stone/Gem, X-Items, Vitamins, and `24` single-use general TMs), `personal_skills.json` (`47` tactical abilities), and typed accessors in `data/index.ts`.
   - Upgraded `src/utils/sprite-utils.ts` to support regional/form `pmdAssetId` paths (e.g., `"0001"` and `"0122/0001"`).
3. **Hybrid `SaveStateManager` & Live Firebase Cloud Sync (`src/poke-emblem/state/`):**
   - Built `firebaseSync.ts` (`FirestoreSyncAdapter` + `InMemoryCloudSyncAdapter`) and `SaveStateManager.ts` with instant `localStorage` writes, persistent custom nickname editing, 4-move loadout + single `[E]` equipped move enforcement, Support matrix (`5/12/22/35/50` thresholds), JSON backup export/import, and deduplicated `lastUpdated` UTC timestamp reconciliation.
   - Configured live Firebase project `poke-emblem` (`firestore.rules` deployed restricting `saves/{uid}` to `request.auth.uid == uid`; `adam.kenawell.family` and `localhost` added to Authorized Domains), set all 6 `PUBLIC_FIREBASE_*` GitHub Actions repository variables, wired `.github/workflows/deploy.yml`, and verified live Google Sign-In + Cloud Firestore save sync from PC to Mobile phone.
   - *Mobile OAuth Note:* Keep Google OAuth popup trigger buttons bound to pointer `click` (rather than `pointerup`) so iOS Safari and Android Chrome preserve transient user activation for `signInWithPopup`.
4. **Player-Facing UI Polish & Admin-Only `Dev Tools` (`src/pages/projects/poke-emblem.astro`):**
   - Removed the temporary banner sprite/dev badge and stripped technical jargon from the player Title Screen (`Continue`, `New Game`, `Cloud Save`) and **Campaign Menu** (`Party` & `Cloud & Save`).
   - Added a top-left **`Dev Tools`** button and diagnostics modal strictly visible only when signed in as `adam.kenawell.family@gmail.com`.
   - Passed `npm run build` and Playwright Desktop (`1920x1080`) + Mobile (`390x844` & `844x390`) verification suites and deployed to `main`.
