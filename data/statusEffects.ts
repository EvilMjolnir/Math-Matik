
import { StatusEffect, EffectType } from '../types';

export const STATUS_EFFECTS: Record<string, StatusEffect> = {
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

  // Movement Bonuses
  'navigator_1': {
    id: 'navigator_1',
    name: 'Pathfinder',
    name_fr: 'Éclaireur',
    type: EffectType.MOVEMENT_BONUS,
    value: 1,
    description: '+1 Extra Step per completion',
    description_fr: '+1 Pas supplémentaire par réussite'
  },
  'navigator_2': {
    id: 'navigator_2',
    name: 'Wayfarer',
    name_fr: 'Voyageur',
    type: EffectType.MOVEMENT_BONUS,
    value: 2,
    description: '+2 Extra Steps per completion',
    description_fr: '+2 Pas supplémentaires par réussite'
  },

  // Combat Bonuses
  'fighter_1': {
    id: 'fighter_1',
    name: 'Sharp',
    name_fr: 'Vif',
    type: EffectType.COMBAT_SCORE_BONUS,
    value: 1,
    description: '+1 Bonus Score in Combat',
    description_fr: '+1 Score bonus en Combat'
  }
};