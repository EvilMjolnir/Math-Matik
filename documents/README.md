# Math et Matik: L'aventure numérique

A browser-based RPG-themed mathematics challenge game designed to make learning arithmetic operations engaging through fantasy game mechanics.

## Core Features

### 1. Tomes & Quests (Progression)
The game is divided into distinct "Tomes" (Chapters), each representing a different environment and difficulty level.
- **Progression**: Solving math problems in *Mouvement* advances your position within the active Tome.
- **Infinite Mode**: A sandbox mode with customizable settings and no distance limits.
- **Unlocking**: completing a Tome unlocks the next one.

### 2. Encounters & Combat
Focuses on **Multiplication**.
- **Random Encounters**: While traveling through a Tome, players may be ambushed by enemies (Goblins, Guards, Shades).
- **Mechanics**: 
    - The game locks other activities until the enemy is defeated.
    - **Thresholds**: You must achieve a specific score to win.
    - **Penalties**: Failing an encounter results in HP loss.
    - **Rewards**: Victory grants XP and **Gold**.

### 3. Recherche (Search) & Economy
Focuses on **Division**.
- **Gold System**: Players earn Gold from winning Combat encounters.
- **Cost**: Opening magical chests in *Recherche* costs Gold. The cost increases the more you play.
- **Loot**: 
    - Choose a card based on Rarity (Common to Mythic).
    - Solve a division problem to open the chest.
    - **AI Integration**: Upon success, the Google Gemini API generates a unique fantasy item description based on the rarity.

### 4. Mouvement (Movement)
Focuses on **Addition and Subtraction**.
- **Objective**: Complete a sequence of equations to fill a progress bar.
- **Result**: Successfully filling the bar advances your distance in the current Tome, potentially triggering an Encounter.

### 5. Options & Localization
- **Localization**: Fully translated into **English** and **French**. Toggle available on the home screen.
- **Customization**: Adjust number ranges, timer settings, and progress bar lengths in the Options menu (applies specifically to Infinite Mode).

## Getting Started

This application is built to run in a browser environment that supports ES modules and React.

### Prerequisites
- A valid Google Gemini API Key is required via `process.env.API_KEY` for the "Recherche" loot generation feature.

### Installation
No build process is required if serving `index.html` with an appropriate Import Map setup (as provided in the source).

## Credits
- Built with React & TypeScript.
- AI powered by Google Gemini.
- Icons by Lucide.
