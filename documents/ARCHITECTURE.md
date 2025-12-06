
# Architecture Documentation

## Overview
"Math et Matik" is a Single Page Application (SPA) built with React and TypeScript. It utilizes a modular component-based architecture to separate game logic from UI presentation. The styling is handled via Tailwind CSS with a custom theme configuration to achieve a medieval fantasy aesthetic.

## Technology Stack
- **Frontend Framework**: React 19+
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React
- **Persistence**: Hybrid Storage (LocalStorage + Firebase Cloud)

## Directory Structure
- **root**: Contains entry points (`index.html`, `index.tsx`, `App.tsx`) and configuration (`constants.ts`, `types.ts`).
- **components/**: Reusable UI elements.
    - `ActiveQuestPanel.tsx`: Displays current Tome progress, boss alerts, or Infinite mode status.
    - `GameMenu.tsx`: The main navigation grid for the three minigames.
    - `Keypad.tsx`: Numeric and Operator input for touch/mouse optimization.
    - `Modal.tsx`: Generic overlay for success/failure states.
    - `PlayerStatsWidget.tsx`: HUD for HP, XP, and Gold.
    - `PlayerProfileModal.tsx`: Inventory management (Drag & Drop) and stats detail.
    - `TomeSelectionModal.tsx`: UI for selecting levels/tomes.
    - `AuthScreen.tsx`: Login/Registration interface handling dual storage modes.
    - `ScratchpadModal.tsx` & `DrawingCanvas.tsx`: In-game drawing tool for complex calculations.
    - `ItemDetailOverlay.tsx`: Pop-up for viewing item lore and effects.
- **views/**: Main game screens.
    - `Home.tsx`: Dashboard displaying player stats, menu, and active quest status.
    - `Movement.tsx`: Logic for addition/subtraction and Tome progress.
    - `Combat.tsx`: Complex logic handling Normal (Turn-based) and Boss (Action Gauge) battle modes.
    - `Recherche.tsx`: Logic for division, loot rarity, and multi-step deciphering mechanics.
    - `Options.tsx`: Configuration interface.
    - `AdminPanel.tsx`: Dashboard for Game Master controls, including Enemy management and Tome config.
- **services/**: Business logic.
    - `mathService.ts`: Pure functions to generate math problems (Arithmetic & Algebraic).
    - `lootService.ts`: Handles loot generation from static data.
    - `statusService.ts`: Calculates aggregated player stats and enemy modifiers from Tags.
    - `storageService.ts`: LocalStorage wrapper for offline persistence.
    - `storageService_Live.ts`: Firebase wrapper for cloud persistence.
- **tomes/**: Game content definitions.
    - Contains configuration files (`tome1.ts`, etc.) for specific levels, linking to centralized encounter data.
- **data/**: Static game data.
    - `loot.ts`: Definitions of items and rarities.
    - `encounters.ts`: Centralized database of all enemies (Mobs, Mini-Bosses, Bosses).
    - `statusEffects.ts`: Definitions of Tags (Buffs/Debuffs) for Items and Enemies.
- **localization/**: Internationalization files.
    - `en.ts`, `fr.ts`: Translation strings.
    - `UI_locale.ts`: Central dictionary mapping keys to both languages.

## Data Flow
1. **State Management**:
   - `App.tsx` serves as the central store for `PlayerStats`, `Tome` progress, and `GameConfig`.
   - **Tome Progress**: Moving in *Movement* calls `handleTomeProgress`, which checks distance against `encounterRate` and specific Boss/Mini-Boss triggers defined in `tomeX.ts`.

2. **Combat Systems (Dual Mechanic)**:
   - **Normal Encounters**: Implements a **3-Action Turn System**. The player must solve 3 equations to complete a turn. Performance (Time/Accuracy) accumulates damage, which is dealt at the end of the turn.
   - **Boss Encounters**: Implements a **Real-Time Pressure System**. A timer constantly counts down; if it hits zero, the player takes damage. Correct answers fill an **Action Gauge**. When full, the player attacks.

3. **Recherche System**:
   - **Rarity-Based Difficulty**: Higher rarity chests require more successful steps (1 to 5) to open.
   - **Win/Loss Logic**: Players must achieve a threshold of "Wins" before accumulating too many "Losses".

4. **Entity Tagging System**:
   - **Items** and **Enemies** share a `tags` array referencing `statusEffects.ts`.
   - `statusService.ts` aggregates these tags to modify runtime values (e.g., `ENEMY_HP_BONUS`, `XP_MULTIPLIER`).

5. **Storage Strategy**:
   - The user selects `StorageMode` (Local vs Cloud) at login.
   - `App.tsx` abstracts the calls to the appropriate service, allowing seamless offline play or cloud syncing.

## Styling System
The application uses a custom Tailwind configuration injected in `index.html`.
- **Colors**: Custom palette (`parchment`, `mythic`, `legendary`, etc.) defined in `tailwind.config`.
- **Fonts**: 'Cinzel' for headers (serif) and 'Lato' for body text (sans-serif).
