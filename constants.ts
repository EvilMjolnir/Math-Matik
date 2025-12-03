
import { GameConfig, Rarity, PlayerStats, Tome } from './types';

export const DEFAULT_CONFIG: GameConfig = {
  movement: {
    minVal: 1,
    maxVal: 20,
    targetSegments: 5,
  },
  combat: {
    multiplicationMax: 12,
    questionsCount: 5,
  },
  recherche: {
    divisionMaxDividend: 100,
    baseCost: 5,
    costIncrement: 2,
  },
};

export const DEFAULT_PLAYER: PlayerStats = {
  username: "Novice Mathematician",
  level: 1,
  currentXp: 0,
  currentHp: 20,
  maxHp: 20,
  defense: 0,
  gold: 5, // Start with a little gold to try mechanics
  inventory: [],
  itemBonuses: [], // Deprecated
  companions: [
    { name: "Pythagoras the Owl", role: "Advisor", level: 1 },
    { name: "Pascal the Frog", role: "Scout", level: 1 }
  ],
  activeTomeId: 'tome_1',
  researchPlayCount: 0,
};

// Cumulative XP required to reach each level (Index 0 = Level 1, Index 1 = Level 2, etc.)
export const XP_TABLE = [
  0,      // Level 1
  10,     // Level 2
  30,     // Level 3
  60,     // Level 4
  100,    // Level 5
  150,    // Level 6
  210,    // Level 7
  280,    // Level 8
  360,    // Level 9
  450,    // Level 10
  550,    // Level 11
  660,    // Level 12
  780,    // Level 13
  910,    // Level 14
  1050,   // Level 15
  1200,   // Level 16
  1360,   // Level 17
  1530,   // Level 18
  1710,   // Level 19
  1900    // Level 20
];

export const RARITY_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'bg-gray-500 border-gray-700',
  [Rarity.RARE]: 'bg-green-600 border-green-800',
  [Rarity.MAGIC]: 'bg-blue-600 border-blue-800',
  [Rarity.LEGENDARY]: 'bg-amber-500 border-amber-700',
  [Rarity.MYTHIC]: 'bg-purple-600 border-purple-800',
};

export const RARITY_TEXT_COLORS: Record<Rarity, string> = {
  [Rarity.COMMON]: 'text-gray-400',
  [Rarity.RARE]: 'text-green-400',
  [Rarity.MAGIC]: 'text-blue-400',
  [Rarity.LEGENDARY]: 'text-amber-400',
  [Rarity.MYTHIC]: 'text-purple-400',
};

// Weighted probabilities for rarity
export const RARITY_WEIGHTS = [
  { rarity: Rarity.COMMON, weight: 70 },
  { rarity: Rarity.RARE, weight: 30 },
  { rarity: Rarity.MAGIC, weight: 15 },
  { rarity: Rarity.LEGENDARY, weight: 5 },
  { rarity: Rarity.MYTHIC, weight: 2 },
];
