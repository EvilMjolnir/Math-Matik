
//Versioning semantic : Major.minor.patch
export const APP_VERSION = "1.24.1";

/*
  Changelog (Last 15 changes):
  1. UI Scaling: Implemented 80% resolution scaling for Mobile and Tablet views to ensure all game elements fit comfortably on screen.
  2. Mobile Layout: Redesigned Home screen with compact buttons, integrated step counters, and optimized navigation positioning.
  3. Inventory: Reordered mobile/tablet layout (Backpack on top) and moved Black Mirror access to the header for better ergonomics.
  4. Animation Fixes: Solved issues with the progress bar not playing sounds or animating correctly; added start delays and minimum duration.
  5. Event Queuing: Decoupled Level Up logic to ensure players are fully healed and stats applied only after animations complete, prioritizing it over encounters.
  6. Visual Polish: Replaced text with icons in the Level Up modal and added visual pulsing to the progress bar during movement.
  7. Code Quality: Removed unused variables and fixed audio interruption errors for smoother performance.
  8. Visual Overhaul: Redesigned Tome Selection menu with vertical stacking and atmospheric background images.
  9. UI Polish: Updated Active Quest Panel on Home screen to use tome-specific backgrounds, increased height, and removed redundant icons.
  10. Audio: Added distinct sound effects for Correct (ding) and Wrong (buzz) answers across all minigames.
  11. Cleanup: Removed the Scratchpad feature to streamline the interface.
  12. Mechanics: Implemented Defeat consequences (Gold loss, step rollback) and synchronized encounter animations.
  13. Content: Replaced Tome 3 boss with 'Infinite Ouroboros'.
  14. Visuals: Added specific background textures for Loot Cards and Encounter Cards based on rarity/type.
*/