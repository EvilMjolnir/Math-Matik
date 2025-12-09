
# Math et Matik: L'aventure numérique

A browser-based RPG-themed mathematics challenge game designed to make learning arithmetic operations engaging through fantasy game mechanics.

## Core Features

### 1. Tomes & Quests (Progression)
The game is divided into distinct "Tomes" (Chapters), each representing a different environment and difficulty level.
- **Visual Immersion**: Active quests feature atmospheric artwork to set the scene.
- **Progression**: Solving math problems in *Mouvement* advances your position within the active Tome.
- **Boss System**: Specific encounters can be tagged as Mini-Bosses (mid-level) or Bosses (end-level) for dramatic pacing.
- **Unlocking**: Completing a Tome unlocks the next one.

### 2. Encounters & Combat
Focuses on **Multiplication**.
- **Dynamic Threats**: Encounters include Random mobs, Mini-Bosses, and Tome Bosses.
- **Mechanics**: 
    - The game locks other activities until the enemy is defeated.
    - **Thresholds**: You must achieve a specific score to win.
    - **Rewards**: Victory grants XP and **Gold**.

### 3. Recherche (Search) & Economy
Focuses on **Division**.
- **Gold System**: Players earn Gold from winning Combat encounters.
- **Loot**: 
    - Choose a card based on Rarity (Common to Mythic).
    - Solve a division problem to open the chest.
    - **Rewards**: Receive a unique fantasy item from the game's static loot table.
- **Offline Capable**: No external API calls are required; all loot is generated locally.

### 4. Mouvement (Movement)
Focuses on **Addition and Subtraction**.
- **Objective**: Complete a sequence of equations to fill a progress bar.
- **Result**: Successfully filling the bar advances your distance in the current Tome.

### 5. Companions
- **Allies**: Unlock and select companions like *Pascal the Frog* or *Zelda*.
- **Bonuses**: Active companions provide passive buffs (e.g., more XP, Gold, or Attack).
- **Leveling**: Spend your hard-earned Gold to level up companions (Level 1-5), increasing the potency of their buffs.

### 6. Alchimie (Alchemy)
Focuses on **Fractions**.
- **Crafting**: Create consumable potions using 'Nems' (secondary currency) and solving fraction problems.
- **Risk**: Failed calculations can destabilize the potion or shatter the flask.

### 7. Admin Panel & Tools (Game Master)
A powerful toolset accessible to administrators (User: Gandalf).
- **In-Game Intervention**: Floating toolbar in all minigames to instantly force success/failure of steps or combat turns for testing or demo purposes.
- **Enemy Management**: Add, remove, and configure enemies (HP, XP, Rewards).
- **Boss Configuration**: Tag specific encounters as Bosses or Mini-Bosses with trigger steps.
- **Export Tools**: Export Tome configurations to TypeScript for permanent integration.
- **User Management**: View and banish users from the realm.
- **Loot Control**: Adjust the probability weights for item rarities.

### 8. Responsive Design & Localization
- **Responsive**: Dedicated layouts for Mobile, Tablet, and Desktop to ensure optimal playability on any device.
- **Localization**: Fully translated into **English** and **French**.
- **Customization**: Adjust number ranges, timer settings, and progress bar lengths in the Options menu.

## Getting Started

This application is built to run in a browser environment that supports ES modules and React.

### Installation
No build process is required if serving `index.html` with an appropriate Import Map setup (as provided in the source).

## Credits
- Built with React & TypeScript.
- Icons by Lucide.
