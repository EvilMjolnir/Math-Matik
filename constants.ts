


import { GameConfig, Rarity, PlayerStats } from './types';

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
  boss: {
    timerDuration: 15,
    actionsPerTurn: 5
  }
};

export const DEFAULT_PLAYER: PlayerStats = {
  username: "Novice Mathematician",
  level: 1,
  currentXp: 0,
  currentHp: 20,
  maxHp: 20,
  defense: 0,
  attack: 5, 
  gold: 5, // Start with a little gold to try mechanics
  inventory: [],
  equipped: [], // New equipment slots
  itemBonuses: [], // Deprecated
  companions: [
    { 
      id: "comp_owl",
      name: "Pythagoras the Owl", 
      role: "Advisor", 
      level: 1,
      description: "A wise old owl who helps you learn faster.",
      description_fr: "Un vieux hibou sage qui vous aide à apprendre plus vite.",
      tags: ["scholar_1"]
    },
    { 
      id: "comp_frog",
      name: "Pascal the Frog", 
      role: "Scout", 
      level: 1,
      description: "A quick hopper who finds shortcuts in the path.",
      description_fr: "Une grenouille agile qui trouve des raccourcis sur le chemin.",
      tags: ["navigator_1"]
    }
  ],
  activeCompanionId: undefined,
  activeTomeId: 'tome_1',
  researchPlayCount: 0,
};

// Cumulative XP required to reach each level (Index 0 = Level 1, Index 1 = Level 2, etc.)
export const XP_TABLE = [
  0,    // Level 1
  15,   // Level 2
  45,   // Level 3
  90,   // Level 4
  150,  // Level 5
  225,  // Level 6
  315,  // Level 7
  420,  // Level 8
  540,  // Level 9
  675,  // Level 10
  825,  // Level 11
  990,  // Level 12
  1170, // Level 13
  1365, // Level 14
  1575, // Level 15
  1800, // Level 16
  2040, // Level 17
  2295, // Level 18
  2565, // Level 19
  2850  // Level 20
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