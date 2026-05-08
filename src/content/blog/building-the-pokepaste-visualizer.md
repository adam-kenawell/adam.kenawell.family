---
title: "Building the PokePaste Visualizer: A Technical Deep Dive"
date: 2026-05-08
excerpt: "How I built a fully client-side PokePaste team visualizer with animated sprites, type-aware color coding, and localStorage persistence, all in a single Astro page."
category: "technical"
---

I play competitive Pokemon. Not at a world championship level or anything, but enough that I spend way too much time staring at PokePaste exports trying to remember what my team does. PokePaste is the standard format for sharing competitive teams, and it looks like this:

```text
Arcanine-Hisui @ Assault Vest
Ability: Intimidate
Level: 50
EVs: 252 HP / 4 Atk / 116 Def / 4 SpD / 132 Spe
Adamant Nature
- Flare Blitz
- Head Smash
- Close Combat
- Extreme Speed
```

It's functional, but it's a wall of text. Six of these stacked together and my eyes glaze over. I wanted something that would let me paste a team, see it rendered visually with sprites and color coding, and save it for later. So I built one.

## The Architecture: One File, Zero Backend

The whole visualizer lives in a single Astro page (`pokepaste-visualizer.astro`). No API server, no database, no build pipeline beyond what Astro already provides. Everything runs client-side in the browser. The data flow is straightforward:

1. User pastes a PokePaste-formatted team into a textarea
2. A parser splits it into structured data (species, item, ability, nature, EVs, moves)
3. The renderer builds a visual card for each Pokemon using DOM manipulation
4. PokeAPI provides type data and official artwork as a fallback
5. PMDCollab provides animated Mystery Dungeon sprites
6. localStorage handles save/load persistence

No frameworks. No state management libraries. Just vanilla TypeScript inside an Astro `<script>` tag.

## Parsing PokePaste

The parser is probably the most boring part, but it's the foundation everything else sits on. PokePaste format is deceptively simple: blocks separated by double newlines, with each block representing one Pokemon. The first line has the species name and held item (split by `@`), and subsequent lines are key-value pairs like `Ability: Intimidate` or `EVs: 252 HP / 4 Atk`.

```typescript
function parsePokepaste(text: string): ParsedMon[] {
  const blocks = text.trim().split(/\n\n+/);
  return blocks.map(block => {
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    const firstLine = lines[0];
    const atSplit = firstLine.split('@');
    const item = atSplit[1]?.trim() || '';
    const species = atSplit[0].trim().replace(/\s*\([MF]\)\s*/, '');
    // ... parse ability, nature, EVs, moves from remaining lines
  });
}
```

The tricky part is species name normalization. Competitive Pokemon has regional forms (`Arcanine-Hisui`), mega evolutions, and gender-specific names. The parser strips gender markers like `(M)` and `(F)`, and a form mapping table handles edge cases where PokeAPI expects a different slug than what PokePaste provides. `Basculegion` becomes `basculegion-male`, for example.

## The Sprite System

This was the most fun part to build. Each Pokemon gets an animated Mystery Dungeon sprite from the PMDCollab SpriteCollab project. These are spritesheet PNGs with animation metadata stored in XML files, the same system that powers the background sprites on every page of this site.

The sprite pipeline works like this:

1. **Resolve the Dex ID.** The PokePaste gives us a species name, but sprites are indexed by National Dex number. A call to PokeAPI's `/pokemon/{name}` endpoint gets us the ID.

2. **Fetch the spritesheet and animation data in parallel.** Each Pokemon has separate sheets for Walk, Idle, and Attack actions. The `AnimData.xml` file contains frame dimensions and counts per action. I fetch all of these concurrently with `Promise.all` so the UI doesn't crawl.

3. **Calculate frame geometry.** The raw spritesheets pack multiple animation frames horizontally and multiple directions vertically. The shared `calcFrameInfo` utility takes the sheet dimensions and XML frame count to compute per-frame width and height.

4. **Render on canvas.** Each sprite gets its own `<canvas>` element. A single `requestAnimationFrame` loop drives all active sprites at 150ms per frame, drawing the correct sub-rectangle from the spritesheet.

```typescript
// One animation loop drives all sprite widgets
function startAnimLoop() {
  function loop(ts: number) {
    for (const w of activeWidgets) {
      const action = w.state === 'attacking' ? 'Attack' : 'Idle';
      const sheet = w.sheets[action];
      const info = w.frameInfo[action];
      const frameIdx = w.frame % info.count;
      w.ctx.drawImage(
        sheet,
        frameIdx * info.w, w.direction * info.h, info.w, info.h,
        0, 0, info.w * SCALE, info.h * SCALE,
      );
      w.frame++;
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}
```

Clicking a sprite triggers its Attack animation for one second, then it returns to Idle. There's also a toggle button to switch between animated PMD sprites and static official artwork from PokeAPI, in case someone prefers the cleaner look (or the PMD sprite doesn't exist for a given Pokemon).

If the PMDCollab sheet doesn't exist for a Pokemon (newer gens have gaps), it falls back to official artwork from PokeAPI. If that also fails, you get a sad little question mark.

## Color Coding Everything

Color is doing a lot of heavy lifting in the UI. Three separate color systems run at once:

### Pokemon Names by Type

Each Pokemon's name is colored by its type. Single-type Pokemon get a solid color. Dual-type Pokemon get a CSS gradient between their two type colors, applied as a background with `background-clip: text` to create the gradient text effect.

```typescript
if (types.length === 1) {
  nameTag.style.color = TYPE_COLORS[types[0]];
} else {
  nameTag.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  nameTag.style.backgroundClip = 'text';
  nameTag.style.webkitTextFillColor = 'transparent';
}
```

### Move Pills by Type

Each move is displayed as a pill-shaped badge, and its border, text, and background tint all reflect the move's type. This requires a second round of API calls since PokeAPI's move endpoint is separate from the Pokemon endpoint. Both Pokemon data and move data are cached in memory to avoid redundant fetches.

### EV Spreads by Stat

EV distributions use a fixed color scheme: HP is red, Attack is orange, Defense is yellow, SpA is blue, SpD is green, Speed is pink. The `colorizeEvs` function parses the EV string (`252 HP / 4 Atk / 132 Spe`) and wraps each stat in a colored `<span>`. It handles variant stat name formats since PokePaste isn't always consistent with abbreviations.

## Role Tagging

Competitive players think about team composition in terms of roles. A Pokemon might be a "Setup Sweeper" or a "Trick Room Setter" or "Redirection." The visualizer lets you assign up to three role tags per Pokemon via dropdown selects.

The UX starts minimal: just a `+` button on each Pokemon. Each click adds a dropdown (max three). Once you pick a role, the dropdown highlights to show it's active. Roles are saved alongside the team data in localStorage, so they persist across sessions.

Tags are hidden by default since they clutter the compact layout. A "Show Tags" toggle in the toolbar reveals them across all Pokemon at once.

## Save/Load with localStorage

Teams are persisted to `localStorage` under a single key as a JSON array. Each saved team stores the raw paste text (not the parsed data), the team name, role tag selections, and tag visibility state. Loading a team re-parses the paste and re-renders everything from scratch, which keeps the save format simple and forward-compatible.

The saved teams section shows a list of team names with Load and Delete buttons. There's also a "Delete All Teams" button that requires a `confirm()` dialog, because accidentally nuking your entire team collection would be a bad time.

Team names default to "Team 1", "Team 2", etc., auto-incrementing based on how many teams are already saved. You can override the name with whatever you want.

## The Layout

The team renders as a 3x2 grid of Pokemon cells on desktop, dropping to 2 columns on tablet and scaling down text and sprites on mobile. Each cell packs a lot of information into a small space:

- **Top:** Species name (type-colored)
- **Middle row:** Animated sprite on the left, item/ability/nature/EVs on the right
- **Bottom:** 2x2 grid of move pills (type-colored)
- **Overlay (when visible):** Up to 3 role tags

The whole card has an opaque background so the page's background sprites don't bleed through and make things unreadable. Every element uses CSS custom properties from the site's theme system, so the visualizer respects whatever accent color and dark/light mode the user has selected.

## What I'd Do Differently

If I were rebuilding this from scratch, I'd probably extract the DOM construction into a small template system instead of raw `createElement` calls. The rendering function is long, and building HTML strings or using a lightweight templating approach would be more readable. But for a single-page tool that works and I'm the only one maintaining, the vanilla approach is fine.

I'd also consider IndexedDB instead of localStorage for team storage. Right now the JSON blob approach works, but if someone saved dozens of teams with full paste data, localStorage's ~5MB limit could become a factor.

## Try It Out

The visualizer is live on the [Projects page](/projects/pokepaste-visualizer). Paste in a team, click Visualize, and see your squad come to life. If you play competitive Pokemon and you've ever squinted at a wall of PokePaste text trying to remember your EV spreads, this one's for you.
