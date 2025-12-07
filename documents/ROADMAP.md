
# Product Roadmap

## Completed Features (v1.0 - v1.9)
- [x] **Tome System**: Structured progression with distinct chapters.
- [x] **Economy**: Gold currency, earning via combat, spending via research.
- [x] **Localization**: Full English and French support.
- [x] **Admin Dashboard**: Tools to edit tomes, enemies, and users.
- [x] **Cloud Save**: Cross-device progression using Firebase.
- [x] **Static Loot System**: Robust loot table with rarities.

## Recent Completions (v1.20 - Visuals & Refinement)
- [x] **UI Overhaul**:
    - **Borders**: Implemented 'Roman' and 'Bevel' custom CSS borders for Quest Panels and Cards.
    - **Animations**: Added card transitions (`slide-out`, `roll-in`) and holographic effects for Loot.
    - **Layout**: Expanded Inventory modal size and added Attack stat visibility.
- [x] **Combat Polish**:
    - **Admin Tools**: In-game buttons to force-kill enemies or force-take damage for testing.
    - **Action Granularity**: Admin tools now affect single actions rather than entire battles in Combat mode.
- [x] **Recherche Enhancements**:
    - **Visuals**: Replaced generic icons with specific Chest images per rarity.
    - **Layout**: New Card design splitting image and requirements.
- [x] **Versioning**: Implemented Semantic Versioning display in Auth screen.

## Previous Completions (v2.0 - The Combat & Depth Update)
- [x] **Centralized Data Architecture**: Decoupled encounter data from Tome definitions for easier balancing.
- [x] **Entity Tag System**: Added Status Effects/Tags for both Items (Buffs) and Enemies (Affixes like "Armored", "Fierce").
- [x] **Combat Overhaul**:
    - **Normal Mode**: Added 3-Action Turn structure with reaction-time bonuses (Gold/Green/Red timer zones).
    - **Boss Mode**: Added Real-time Timer loops and Action Gauge mechanics.
    - **UI**: Added 3-column layout (Player Stats, Arena, Enemy Stats).
- [x] **Recherche Deepening**: Added multi-step deciphering mechanics based on item rarity (Common = 1 step, Mythic = 5 steps).
- [x] **Inventory 2.0**: Drag-and-Drop equipment management and locked slots based on level.
- [x] **Scratchpad**: Integrated canvas for manual calculations during minigames.

## Short Term (v2.1)
- [ ] **Sound Effects**: Audio feedback for combat hits, correct answers, and UI interactions (Partially implemented in menu).
- [ ] **Code Organization**: Migrate inline CSS from `index.html` to dedicated CSS modules.

## Medium Term (v2.5)
- [ ] **Companion System**: Ability to level up companions for passive bonuses (currently visual only).
- [ ] **Daily Quests**: Rotational challenges for bonus gold.

## Long Term (v3.0)
- [ ] **Character Classes**: Wizard/Warrior/Rogue archetypes affecting starting stats and math bonuses.
- [ ] **Leaderboards**: Global ranking for Infinite Mode.
- [ ] **Multiplayer**: Live math duels.
