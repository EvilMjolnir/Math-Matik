# Architecture Documentation

## Overview
"Math et Matik" is a Single Page Application (SPA) built with React and TypeScript. It utilizes a modular component-based architecture to separate game logic from UI presentation. The styling is handled via Tailwind CSS with a custom theme configuration to achieve a medieval fantasy aesthetic.

## Technology Stack
- **Frontend Framework**: React 19+
- **Language**: TypeScript
- **Styling**: Tailwind CSS (via CDN)
- **Icons**: Lucide React

## Directory Structure
- **root**: Contains entry points (`index.html`, `index.tsx`, `App.tsx`) and configuration (`constants.ts`, `types.ts`).
- **components/**: Reusable UI elements.
    - `Keypad.tsx`: Numeric input for touch/mouse optimization.
    - `Modal.tsx`: Generic overlay for success/failure states.
    - `PlayerStatsWidget.tsx`: HUD for HP, XP, and Gold.
    - `TomeSelectionModal.tsx`: UI for selecting levels/tomes.
- **views/**: Main game screens.
    - `Movement.tsx`: Logic for addition/subtraction and Tome progress.
    - `Combat.tsx`: Logic for multiplication, timer, and Encounters.
    - `Recherche.tsx`: Logic for division, Gold spending, and loot generation.
    - `Options.tsx`: Configuration interface.
    - `AdminPanel.tsx`: Dashboard for Game Master controls, including Tome image management and user administration.
- **services/**: Business logic and external API communication.
    - `mathService.ts`: Pure functions to generate math problems.
    - `lootService.ts`: Handles loot generation from static data.
    - `storageService.ts`: LocalStorage wrapper for persisting user data.
- **tomes/**: Game content definitions.
    - Contains configuration files for specific levels (Tomes), including enemy data, difficulty settings, and **visual assets (images)**.
- **localization/**: Internationalization files.
    - `en.ts`, `fr.ts`: Translation strings.
    - `UI_locale.ts`: Central dictionary mapping keys to both languages.
    - `index.ts`: Context provider for language switching.
- **data/**: Static game data.
    - `loot.ts`: Definitions of items and rarities.

## Data Flow
1. **State Management**:
   - `App.tsx` serves as the central store for `PlayerStats` (HP, XP, Gold, Level), `Tome` progress, and `GameConfig`.
   - **Tome Progress**: Moving in the *Movement* view calls `handleTomeProgress`, which checks distance against `encounterRate` to trigger events.
   - **Economy**: Gold is added via `handleEncounterComplete` and spent via `onSpendGold` in *Recherche*.

2. **Game Logic**:
   - **Encounters**: Triggered in `App.tsx`, these lock the view to *Combat* mode until resolved.
   - **Localization**: A `LocalizationProvider` wraps the app, supplying the `t` object for text strings based on the selected language.

3. **Administration**:
   - The `AdminPanel` allows runtime modification of the `tomes` state, enabling dynamic updates to descriptions, difficulty config, and **images**.

## Styling System
The application uses a custom Tailwind configuration injected in `index.html`.
- **Colors**: Custom palette (`parchment`, `mythic`, `legendary`, etc.) defined in `tailwind.config`.
- **Fonts**: 'Cinzel' for headers (serif) and 'Lato' for body text (sans-serif).