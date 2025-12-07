# Game Balance & Progression Analysis (v1.21)

## 1. Executive Summary
The current progression of *Math et Matik* starts with a gentle learning curve but experiences a sharp difficulty spike (both mathematical and RPG-stat based) around Tome 3 and 4. Tome 5 presents a significant "grind wall" where the distance required vs. movement speed becomes tedious.

To achieve a more **linear progression** that remains challenging but fair, we need to smooth the mathematical difficulty curve and adjust the "Time-to-Kill" (TTK) ratio between the Player and High-Level Enemies.

---

## 2. Current State Analysis

### Player Power Curve
*   **HP Growth:** +10 per Level. (Lvl 1: 20HP → Lvl 20: 210HP)
*   **Attack Growth:** +1 per Level. (Lvl 1: 5 Atk → Lvl 20: 24 Atk)
*   *Observation:* Player damage output scales linearly and slowly (x5 increase), while Enemy HP scales exponentially (x15 increase from Wolf to Pi Phantom).

### The "Lethality" Gap
*   **Tome 1:** Player takes ~4 hits to die. Player kills Enemy in ~2 hits. (Easy)
*   **Tome 5:** Player (Lvl 20, ~210 HP) vs Pi Phantom (50 Atk). Player dies in **4 hits**.
*   **Tome 5:** Player (24 Atk) vs Pi Phantom (163 HP). Player kills Enemy in **7 hits**.
*   *Issue:* High-level combat drags on too long (spongy enemies) and is too punishing (high enemy damage).

---

## 3. Recommendations

### A. XP Curve Adjustment (`constants.ts`)
**Goal:** Speed up early levels to unlock equipment slots faster, then slow down slightly in mid-game.

**Current:** `[0, 15, 45, ... 2850]`
**Recommended:**
```typescript
export const XP_TABLE = [
  0,    // Lvl 1
  20,   // Lvl 2 (Slightly slower start to learn mechanics)
  60,   // Lvl 3
  120,  // Lvl 4
  200,  // Lvl 5 (Unlock Slot 1)
  300,  // Lvl 6
  450,  // Lvl 7
  650,  // Lvl 8
  900,  // Lvl 9
  1200, // Lvl 10 (Unlock Slot 2)
  1600, // Lvl 11
  2100, // Lvl 12
  2700, // Lvl 13
  3400, // Lvl 14
  4200, // Lvl 15 (Unlock Slot 3)
  5100, // Lvl 16
  6100, // Lvl 17
  7200, // Lvl 18
  8500, // Lvl 19
  10000 // Lvl 20 (Endgame Goal)
];
```
*Note: This requires increasing Enemy XP rewards in Tomes 4 & 5 to compensate.*

---

### B. Tome Configuration (`tomes/`)
**Goal:** Reduce the "Grind Wall" of Tome 5 and smooth the Math difficulty.

#### Tome 1 (No Change - Good Tutorial)
*   Distance: 50
*   Math: `+-`[1-30], `x`10, `/`20

#### Tome 2 (Slight Buff)
*   **Distance:** 100 → **120** (Slightly longer)
*   **Movement Segments:** 5 → **6** (Reward player for enduring longer sequences)

#### Tome 3 (The Bridge)
*   **Distance:** 200 (Keep)
*   **Combat Questions:** 15 → **12** (Reduce combat fatigue)
*   **Boss Timer:** 12s → **14s** (Give slightly more breathing room)

#### Tome 4 (The Spike Fix)
*   **Distance:** 300 (Keep)
*   **Math (Combat):** Max Multiplier 18 → **15** (18 is awkward mental math, 15 is standard)
*   **Boss Actions/Turn:** 6 → **5** (Allow player to attack slightly more often)

#### Tome 5 (The Grind Fix)
*   **Distance:** 500 → **450**
*   **Movement Segments:** 12 → **15** (Drastically increase movement speed per game to reduce grind)
*   **Math (Movement):** Min 100, Max 500 → **Min 50, Max 300** (Speed up mental calculation time)
*   **Boss Timer:** 8s → **10s** (8s is extremely punishing for complex math)

---

### C. Encounter Balancing (`data/encounters.ts`)
**Goal:** Reduce "Bullet Sponge" effect in late game.

| Encounter | Current HP | Rec. HP | Current Atk | Rec. Atk | Rec. XP Reward |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tome 1 Boss** | 25 | **30** | 10 | 10 | 50 |
| **Tome 2 Boss** | 54 | **60** | 20 | **15** | 100 |
| **Tome 3 Boss** | 45 | **100** | 20 | **22** | 250 |
| **Tome 4 Normal** | 70-80 | **80-90** | 25-35 | **25-28** | 150 |
| **Tome 4 Boss** | 90 | **150** | 40 | **35** | 500 |
| **Tome 5 Normal** | 120-145 | **110-130** | 42-50 | **30-35** | 300 |
| **Tome 5 Boss** | 163 | **250** | 50 | **40** | 1000 |

**Logic:**
1.  **Lower Late-Game Attack:** Player HP doesn't scale high enough to tank 50 damage hits repeatedly. Lowering Tome 5 mobs to ~35 damage makes them threatening but manageable (6-7 hits to kill player).
2.  **Adjust Boss HP:** Bosses should be tanky. Tome 5 boss needs significantly more HP because the player will likely have powerful items/companions by then.

---

### D. Loot Economy
**Goal:** Make gold meaningful in late game.

*   **Recherche Cost:** Increase `costIncrement` in `tome4` and `tome5` to drain the player's gold reserves, forcing them to engage in combat to fund research.
    *   Tome 4 Cost Increment: 8 → **15**
    *   Tome 5 Cost Increment: 10 → **25**

---

### Implementation Plan
1.  Apply **XP Table** changes in `constants.ts`.
2.  Apply **Tome Config** changes in `tomes/tomeX.ts`.
3.  Apply **Encounter Stat** changes in `data/encounters.ts`.
