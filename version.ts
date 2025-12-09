
//Versioning semantic : Major.minor.patch
export const APP_VERSION = "1.23.0";

/*
  Changelog (Last 15 changes):
  1. New Minigame "Alchimie": Craft potions by solving fraction problems (Reduce, Add, Subtract, Multiply).
  2. Added "Black Mirror of Dee" Modal: Melt unused items into "Nems" (new currency).
  3. Implemented Potion System: Consumable items with limited uses and specific effects.
  4. Added new Status Effects: INSTANT_HEAL, HEAL_TURN (Regen), WEAKEN_ENEMY.
  5. Added "Drink" action to Inventory for consuming potions.
  6. Added Granular Difficulty Configuration for Alchimie per Tome.
  7. Implemented Defense Stat system (Base Defense +1 every 4 levels).
  8. Added 'Guardian' item suffix granting flat Defense bonuses.
  9. Updated Damage Calculation: Incoming Damage is now reduced by Total Defense (Min 1).
  10. Extended Player Level cap and XP Table to Level 25.
  11. Added Defense display to Player Widget, Profile, and Item Overlays.
  12. Added DEFENSE_BONUS effect type to the engine.
  13. Created detailed Level Progression and Boss Benchmark design documentation.
  14. Defined Min/Normal/Max stat tiers for balance analysis.
  15. Added sound effects for Combat hits, Player damage, Level up fanfare, and Item Loot reveal.
*/