
# Product Roadmap

## Completed Features (v1.0 - v1.9)
- [x] **Tome System**: Structured progression with distinct chapters.
- [x] **Economy**: Gold currency, earning via combat, spending via research.
- [x] **Localization**: Full English and French support.
- [x] **Admin Dashboard**: Tools to edit tomes, enemies, and users.
- [x] **Cloud Save**: Cross-device progression using Firebase.
- [x] **Static Loot System**: Robust loot table with rarities.

## Recent Completions (v2.1 - Companions & Polish)
- [x] **Companion System**: 
    - **Visuals**: Dedicated artwork for 5 unique companions.
    - **Leveling**: Implemented Gold cost scaling (150g -> 3000g) to level up companions.
    - **Mechanics**: Auto-upgrading of Status Tags (e.g. `scholar_1` -> `scholar_2`) upon leveling.
- [x] **Code Organization**:
    - **Split Views**: Separated `Home` into `Mobile`, `Tablet`, and `Desktop` layouts for better maintainability.
    - **Hooks**: Implemented `useDeviceType` for responsive logic.
- [x] **UI Polish**:
    - **Alchimie**: Added "Glass Break" sound effect for failed potions.
    - **Visuals**: Enhanced detail overlays with larger images.

## Previous Completions (v2.0 - The Combat & Depth Update)
- [x] **Centralized Data Architecture**: Decoupled encounter data from Tome definitions for easier balancing.
- [x] **Entity Tag System**: Added Status Effects/Tags for Items, Enemies, and Companions.
- [x] **Combat Overhaul**:
    - **Normal Mode**: Added 3-Action Turn structure with reaction-time bonuses.
    - **Boss Mode**: Added Real-time Timer loops and Action Gauge mechanics.
- [x] **Recherche Deepening**: Added multi-step deciphering mechanics based on item rarity.
- [x] **Inventory 2.0**: Drag-and-Drop equipment management and locked slots.
- [x] **Alchimie Minigame**: Fraction-based crafting system.
- [x] **Black Mirror**: Item recycling system (Items -> Nems).

## Short Term (v2.2)
- [ ] **Daily Quests**: Rotational challenges for bonus gold.
- [ ] **Sound Effects**: More varied sounds for specific item interactions.

## Medium Term (v2.5)
- [ ] **Achievements**: Visual badges for milestones (e.g., "Slayer of 100 Goblins").
- [ ] **Leaderboards**: Global ranking for Infinite Mode.

## Long Term (v3.0)
- [ ] **Character Classes**: Wizard/Warrior/Rogue archetypes affecting starting stats and math bonuses.
- [ ] **Multiplayer**: Live math duels.
