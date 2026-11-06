# Mystery Emblem — Memory

## Status & Environment
- **Progress:** Step 1 complete & live. Next: **Step 2** (PMD Asset Loader, UI Window Framework & Portrait Dialogue Engine).
- **Branches:** Work on `mystery-emblem-dev`; merge to `main` to deploy to `https://adam.kenawell.family/projects/mystery-emblem`.
- **Key Paths:** `src/mystery-emblem/{data,types,state,assets,ui,scenes,engine}`, `src/pages/projects/mystery-emblem.astro`, `src/utils/sprite-utils.ts` (supports nested `pmdAssetId` e.g. `"0122/0001"`), `Mystery Emblem - LLM Master Spec & Game Design Document.md`.
- **Cloud Sync:** Live Firebase project `poke-emblem` (`saves/{uid}` via `firestore.rules`; `PUBLIC_FIREBASE_*` in GitHub Actions vars + `.env`; `localhost` & `adam.kenawell.family` authorized). Bind Google OAuth popup triggers to `click` (not `pointerup`) to prevent mobile popup blocking.
- **UI Convention:** Keep public UI clean and free of dev jargon; place all diagnostics/inspectors in top-left **`Dev Tools`** gated to `adam.kenawell.family@gmail.com`.

## Completed Steps
- **Step 0:** Scaffolded `src/mystery-emblem/`, PMD EoS window shell, and `sprite-utils.ts` animation pipeline.
- **Step 1:** Implemented `types/{schemas,validators}.ts`; static `data/` (`pokemon_species.json`: 342 stages/114 lines, `gastly_line` sole shared; `moves.json`: 88 moves, 0 pure stat moves; `items.json`: 80 items/24 TMs; `personal_skills.json`: 47 skills); `state/{SaveStateManager,firebaseSync}.ts` (`mystery_emblem_save_v1`, `lastUpdated` cloud sync, JSON I/O); clean Campaign Menu + admin `Dev Tools`. Verified via `npm run build` & Playwright (`1920x1080`, `390x844`, `844x390`; port `4329`).
