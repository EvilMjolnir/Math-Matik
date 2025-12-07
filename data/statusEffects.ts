

import { StatusEffect, EffectType } from '../types';

export const STATUS_EFFECTS: Record<string, StatusEffect> = {
  // --- PLAYER EFFECTS ---

  // Experience Bonuses
  'scholar_1': {
    id: 'scholar_1',
    name: 'Novice Scholar',
    name_fr: 'Érudit Novice',
    type: EffectType.XP_MULTIPLIER,
    value: 0.05, // +5%
    description: '+5% XP gain',
    description_fr: '+5% Gain d\'XP'
  },
  'scholar_2': {
    id: 'scholar_2',
    name: 'Adept Scholar',
    name_fr: 'Érudit Expert',
    type: EffectType.XP_MULTIPLIER,
    value: 0.10, // +10%
    description: '+10% XP gain',
    description_fr: '+10% Gain d\'XP'
  },

  // Gold Bonuses
  'merchant_1': {
    id: 'merchant_1',
    name: 'Thrifty',
    name_fr: 'Économe',
    type: EffectType.GOLD_MULTIPLIER,
    value: 0.05,
    description: '+5% Gold gain',
    description_fr: '+5% Gain d\'Or'
  },
  'merchant_2': {
    id: 'merchant_2',
    name: 'Deep Pockets',
    name_fr: 'Poches Profondes',
    type: EffectType.GOLD_MULTIPLIER,
    value: 0.15,
    description: '+15% Gold gain',
    description_fr: '+15% Gain d\'Or'
  },

  // Movement Bonuses (Changed to %)
  'navigator_1': {
    id: 'navigator_1',
    name: 'Pathfinder',
    name_fr: 'Éclaireur',
    type: EffectType.MOVEMENT_BONUS,
    value: 0.25,
    description: '+25% Travel Speed',
    description_fr: '+25% Vitesse de Voyage'
  },
  'navigator_2': {
    id: 'navigator_2',
    name: 'Wayfarer',
    name_fr: 'Voyageur',
    type: EffectType.MOVEMENT_BONUS,
    value: 0.50,
    description: '+50% Travel Speed',
    description_fr: '+50% Vitesse de Voyage'
  },

  // Combat Bonuses (Changed to % Attack)
  'fighter_1': {
    id: 'fighter_1',
    name: 'Sharp',
    name_fr: 'Vif',
    type: EffectType.COMBAT_SCORE_BONUS,
    value: 0.20,
    description: '+20% Attack Power',
    description_fr: '+20% Puissance d\'Attaque'
  },

  // --- MONSTER EFFECTS (Changed to %) ---

  'mon_fierce': {
    id: 'mon_fierce',
    name: 'Fierce',
    name_fr: 'Féroce',
    type: EffectType.ENEMY_DAMAGE_BONUS,
    value: 0.20,
    description: '+20% Damage',
    description_fr: '+20% Dégâts'
  },
  'mon_armored': {
    id: 'mon_armored',
    name: 'Armored',
    name_fr: 'Blindé',
    type: EffectType.ENEMY_HP_BONUS,
    value: 0.20,
    description: '+20% HP',
    description_fr: '+20% PV'
  },
  'mon_elite': {
    id: 'mon_elite',
    name: 'Elite',
    name_fr: 'Élite',
    type: EffectType.ENEMY_XP_REWARD_BONUS,
    value: 0.50,
    description: '+50% XP Reward',
    description_fr: '+50% Récompense XP'
  },
  'mon_wealthy': {
    id: 'mon_wealthy',
    name: 'Wealthy',
    name_fr: 'Riche',
    type: EffectType.ENEMY_GOLD_REWARD_BONUS,
    value: 0.50,
    description: '+50% Gold Reward',
    description_fr: '+50% Récompense Or'
  },
  'mon_deadly': {
    id: 'mon_deadly',
    name: 'Deadly',
    name_fr: 'Mortel',
    type: EffectType.ENEMY_DAMAGE_BONUS,
    value: 0.40,
    description: '+40% Damage',
    description_fr: '+40% Dégâts'
  }
};
