
export enum GameView {
  HOME = 'HOME',
  MOVEMENT = 'MOVEMENT',
  COMBAT = 'COMBAT',
  RECHERCHE = 'RECHERCHE',
  OPTIONS = 'OPTIONS',
  ADMIN = 'ADMIN',
}

export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  MAGIC = 'Magic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
}

export interface GameConfig {
  movement: {
    minVal: number;
    maxVal: number;
    targetSegments: number;
  };
  combat: {
    multiplicationMax: number;
    questionsCount: number;
  };
  recherche: {
    divisionMaxDividend: number;
    baseCost: number;
    costIncrement: number;
  };
}

export interface MathProblem {
  question: string;
  answer: number;
}

export interface Item {
  name: string;
  description: string;
  rarity: Rarity;
}

export interface Card {
  id: string;
  rarity: Rarity;
  color: string;
}

export interface Companion {
  name: string;
  role: string;
  level: number;
}

export interface Encounter {
  id: string;
  name: string;
  name_fr?: string;
  description: string;
  description_fr?: string;
  threshold: number; // Score needed to win
  hpLoss: number; // HP lost on failure
  goldReward: number; // Gold earned on victory
}

export interface Tome {
  id: string;
  title: string;
  title_fr?: string;
  description: string;
  description_fr?: string;
  totalDistance: number;
  currentDistance: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  difficultyMultiplier: number;
  config?: Partial<GameConfig>;
  encounterRate: number; // Encounters happen every X steps
  possibleEncounters: Encounter[];
}

export interface PlayerStats {
  username: string;
  password?: string; // Added for auth
  level: number;
  currentXp: number;
  currentHp: number;
  maxHp: number;
  defense: number;
  gold: number;
  itemBonuses: string[];
  companions: Companion[];
  activeTomeId: string;
  researchPlayCount: number;
}

export interface LootWeight {
  rarity: Rarity;
  weight: number;
}

export interface MinigameProps {
  onBack: () => void;
  onAddXp: (amount: number) => void;
  onAddGold?: (amount: number) => void;
  onSpendGold?: (amount: number) => void;
  onProgressTome: (steps: number) => void;
  playerGold?: number;
  playCount?: number; 
  encounter?: Encounter;
  onEncounterComplete?: () => void;
  onTakeDamage?: (amount: number) => void;
  lootWeights?: LootWeight[]; // Added for dynamic loot
}
