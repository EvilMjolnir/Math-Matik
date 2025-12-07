


export enum GameView {
  HOME = 'HOME',
  MOVEMENT = 'MOVEMENT',
  COMBAT = 'COMBAT',
  RECHERCHE = 'RECHERCHE',
  OPTIONS = 'OPTIONS',
  ADMIN = 'ADMIN',
}

export enum StorageMode {
  LOCAL = 'LOCAL',
  CLOUD = 'CLOUD'
}

export enum Rarity {
  COMMON = 'Common',
  RARE = 'Rare',
  MAGIC = 'Magic',
  LEGENDARY = 'Legendary',
  MYTHIC = 'Mythic',
}

export enum EffectType {
  XP_MULTIPLIER = 'XP_MULTIPLIER',     // e.g. 1.1 for +10%
  GOLD_MULTIPLIER = 'GOLD_MULTIPLIER', // e.g. 1.1 for +10%
  MOVEMENT_BONUS = 'MOVEMENT_BONUS',   // Flat add to steps
  COMBAT_SCORE_BONUS = 'COMBAT_SCORE_BONUS', // Flat add to combat score (now Attack Bonus)
  
  // Enemy Specific Effects
  ENEMY_HP_BONUS = 'ENEMY_HP_BONUS',   // Renamed from ENEMY_THRESHOLD_BONUS (Increases HP/Score needed)
  ENEMY_DAMAGE_BONUS = 'ENEMY_DAMAGE_BONUS',       // Increases HP damage dealt
  ENEMY_GOLD_REWARD_BONUS = 'ENEMY_GOLD_REWARD_BONUS', // Increases gold dropped
  ENEMY_XP_REWARD_BONUS = 'ENEMY_XP_REWARD_BONUS',     // Increases XP dropped
}

export interface StatusEffect {
  id: string;
  name: string;
  name_fr?: string;
  type: EffectType;
  value: number;
  description: string;
  description_fr?: string;
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
  boss?: {
    timerDuration: number; // Seconds before boss attacks
    actionsPerTurn: number; // How many correct answers to trigger a player attack
  };
}

export interface MathProblem {
  question: string;
  answer: number | string;
  type?: 'number' | 'operator'; 
}

export interface Item {
  name: string;
  name_fr?: string;
  description: string;
  description_fr?: string;
  rarity: Rarity;
  image?: string; // URL to specific item image
  tags?: string[]; // IDs mapping to statusEffects
}

export interface Card {
  id: string;
  rarity: Rarity;
  color: string;
}

export interface Companion {
  id: string;
  name: string;
  role: string;
  level: number;
  description?: string;
  description_fr?: string;
  image?: string;
  tags?: string[]; // IDs mapping to statusEffects for bonuses
}

export type EncounterType = 'normal' | 'boss' | 'miniboss';

export interface Encounter {
  id: string;
  name: string;
  name_fr?: string;
  description: string;
  description_fr?: string;
  monsterHP: number; // Renamed from threshold
  attack: number; // Damage dealt to player on failure or timer tick
  goldReward: number; // Gold earned on victory
  xpReward: number; // XP earned on victory
  type?: EncounterType; // Defaults to 'normal'
  triggerStep?: number; // Only for 'miniboss', the step at which it appears
  tags?: string[]; // IDs mapping to statusEffects
  timerDuration?: number; // Specific timer for this encounter (normal mode)
  image?: string; // URL to monster image
}

export interface Tome {
  id: string;
  title: string;
  title_fr?: string;
  description: string;
  description_fr?: string;
  image?: string;
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
  uid?: string; // Firebase Auth UID
  username: string;
  email?: string; // Added for Firebase
  password?: string; // Legacy local storage
  photoURL?: string; // Added for Firebase
  level: number;
  currentXp: number;
  currentHp: number;
  maxHp: number;
  defense: number;
  attack: number; // Base attack stat
  gold: number;
  inventory: Item[]; 
  equipped: Item[]; // Items currently in active slots
  itemBonuses: string[]; // Deprecated, kept for backward compatibility if needed, or used for display text
  companions: Companion[];
  activeCompanionId?: string; // The ID of the currently selected companion
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
  playerStats?: PlayerStats; // Passed down for calculating damage
  lootWeights?: LootWeight[]; // Added for dynamic loot
  isAdmin?: boolean;
}