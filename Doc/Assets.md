# Urban Purifier: Image Asset Generation Guide

## 1. Visual Style: "Bio-Punk Pixel Art"
- **Style**: Detailed Pixel Art with a clean, semi-realistic feel (not too retro).
- **Palette**: Dark, toxic purples/grays for polluted zones vs. Bright, vibrant emerald greens/blues for cleansed zones.
- **Lighting**: Subtle neon glow effect for energy sources and pollution.

## 2. Sprite Sheet Requirements
To optimize Phaser performance, all related sprites must be combined into a single 32x32 pixel or 64x64 pixel grid sprite sheet.

### A. Environment Tile Set (64x64px per tile)
Generate a single image containing the following tiles in a grid:
1.  **Polluted Ground**: Dark, cracked earth with green ooze.
2.  **Cleansed Ground**: Vibrant green grass/park land.
3.  **Border Tile**: The transition area between polluted and cleansed ground.
4.  **Fog of War**: A dark mist overlay to hide unrevealed tiles.

> **Image Generation Prompt (for Antigravity)**: 
> "Top-down view, bio-punk style pixel art tileset for a base-building game. Includes a dark, cracked toxic purple ground tile, a vibrant emerald green grass tile, a transition tile between them, and a dark mist fog tile. Each tile is 64x64 pixels, arranged in a grid on a single sheet. Professional game asset, isometric-like perspective but from directly above, clean lines, muted toxic palette vs bright green palette."

### B. Number Icons (32x32px per icon)
Generate numbers 1 through 8 in a single sheet:
- **Style**: Bold, neon green, slightly glowing numbers, optimized for visibility on dark ground.

> **Image Generation Prompt (for Antigravity)**: 
> "Retro-futuristic, neon green glowing pixel art numbers 1 to 8. Small, clear 32x32 pixels each, arranged in a row. For a tactical UI, visible against a dark background, bio-punk aesthetic."

### C. Building & Special Tiles (64x64px per item)
Generate a single image with the following:
1.  **Home (Residential)**: A compact, green roofed, sustainable-looking home.
2.  **Power Plant**: A solar-powered or bio-reactor structure with glowing elements.
3.  **Radar**: A spinning satellite dish with a scanning effect.
4.  **Pollutant Core (Mine)**: A dangerous-looking, pulsing purple organic orb.
5.  **Purifier Tower (Flag)**: A small, crystalline tower that glows blue.

> **Image Generation Prompt (for Antigravity)**: 
> "Top-down view, bio-punk style pixel art building sprites. Includes a small sustainable home with a green roof, a glowing bio-reactor power plant, a satellite dish radar, a dangerous pulsing purple organic orb, and a blue glowing crystalline purifier tower. Each building fits a 64x64 pixel grid. Professional game asset, vibrant vs toxic contrast, neon accents."

## 3. Post-Processing & Integration
After the images are generated:
1.  **Transparency**: The background of the sprite sheets must be made transparent.
2.  **Naming**: Save as `environment_tiles.png`, `number_icons.png`, `building_sprites.png` in the `assets` folder.
3.  **Phaser Loading**: Use `this.load.spritesheet()` in the `preload()` function of your Phaser scene to load these sheets.