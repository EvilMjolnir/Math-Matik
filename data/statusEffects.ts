
import { StatusEffect, EffectType } from '../types';

const ROMAN_NUMERALS = ["I", "II", "III", "IV", "V"];

interface EffectBase {
  baseId: string;
  name: string;
  name_fr: string;
  type: EffectType;
  baseValue: number; // Value for Tier 1
  descTemplate: string;
  descTemplate_fr: string;
  isPercentage: boolean; // formatting helper
}

const EFFECT_DEFINITIONS: EffectBase[] = [
  // --- PLAYER EFFECTS ---
  {
    baseId: 'scholar',
    name: 'Scholar',
    name_fr: 'Érudit',
    type: EffectType.XP_MULTIPLIER,
    baseValue: 0.05,
    descTemplate: '+{val}% XP gain',
    descTemplate_fr: '+{val}% Gain d\'XP',
    isPercentage: true
  },
  {
    baseId: 'merchant',
    name: 'Merchant',
    name_fr: 'Marchand',
    type: EffectType.GOLD_MULTIPLIER,
    baseValue: 0.05,
    descTemplate: '+{val}% Gold gain',
    descTemplate_fr: '+{val}% Gain d\'Or',
    isPercentage: true
  },
  {
    baseId: 'navigator', // Formerly Pathfinder/Navigator mixed
    name: 'Pathfinder',
    name_fr: 'Éclaireur',
    type: EffectType.MOVEMENT_BONUS,
    baseValue: 0.10,
    descTemplate: '+{val}% Travel Speed',
    descTemplate_fr: '+{val}% Vitesse de Voyage',
    isPercentage: true
  },
  {
    baseId: 'fighter',
    name: 'Fighter',
    name_fr: 'Combattant',
    type: EffectType.COMBAT_SCORE_BONUS,
    baseValue: 0.10,
    descTemplate: '+{val}% Attack Power',
    descTemplate_fr: '+{val}% Puissance d\'Attaque',
    isPercentage: true
  },

  // --- MONSTER EFFECTS ---
  {
    baseId: 'fierce',
    name: 'Fierce',
    name_fr: 'Féroce',
    type: EffectType.ENEMY_DAMAGE_BONUS,
    baseValue: 0.10,
    descTemplate: '+{val}% Damage',
    descTemplate_fr: '+{val}% Dégâts',
    isPercentage: true
  },
  {
    baseId: 'armored',
    name: 'Armored',
    name_fr: 'Blindé',
    type: EffectType.ENEMY_HP_BONUS,
    baseValue: 0.10,
    descTemplate: '+{val}% HP',
    descTemplate_fr: '+{val}% PV',
    isPercentage: true
  },
  {
    baseId: 'elite',
    name: 'Elite',
    name_fr: 'Élite',
    type: EffectType.ENEMY_XP_REWARD_BONUS,
    baseValue: 0.20,
    descTemplate: '+{val}% XP Reward',
    descTemplate_fr: '+{val}% Récompense XP',
    isPercentage: true
  },
  {
    baseId: 'wealthy',
    name: 'Wealthy',
    name_fr: 'Riche',
    type: EffectType.ENEMY_GOLD_REWARD_BONUS,
    baseValue: 0.20,
    descTemplate: '+{val}% Gold Reward',
    descTemplate_fr: '+{val}% Récompense Or',
    isPercentage: true
  }
];

const generateEffects = (): Record<string, StatusEffect> => {
  const effects: Record<string, StatusEffect> = {};

  EFFECT_DEFINITIONS.forEach(def => {
    // Generate Tiers 1 to 5
    for (let i = 1; i <= 5; i++) {
      const tierValue = parseFloat((def.baseValue * i).toFixed(2));
      const id = `${def.baseId}_${i}`;
      const roman = ROMAN_NUMERALS[i - 1];
      
      const displayVal = def.isPercentage ? Math.round(tierValue * 100) : tierValue;

      effects[id] = {
        id: id,
        name: `${def.name} ${roman}`,
        name_fr: `${def.name_fr} ${roman}`,
        type: def.type,
        value: tierValue,
        description: def.descTemplate.replace('{val}', displayVal.toString()),
        description_fr: def.descTemplate_fr.replace('{val}', displayVal.toString())
      };
    }
  });

  return effects;
};

export const STATUS_EFFECTS = generateEffects();
