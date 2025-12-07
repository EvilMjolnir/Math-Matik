

import { PlayerStats, EffectType, Encounter, StatusEffect } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';

export interface ActiveEffectDetail {
  id: string;
  description: string;
  description_fr?: string;
  type: EffectType;
  value: number;
  sourceName: string;
  sourceName_fr?: string;
}

export interface AggregatedStats {
  xpMultiplier: number; // Base 1.0
  goldMultiplier: number; // Base 1.0
  movementMultiplier: number; // Base 1.0
  attackMultiplier: number; // Base 0.0 (Additive percentage)
  totalAttack: number;
  effectDetails: ActiveEffectDetail[];
}

export interface EnemyStats {
  hpBonus: number; 
  damageBonus: number;    
  goldRewardBonus: number; 
  xpRewardBonus: number;   
}

export const getAggregatedStats = (player: PlayerStats): AggregatedStats => {
  const stats: AggregatedStats = {
    xpMultiplier: 1.0,
    goldMultiplier: 1.0,
    movementMultiplier: 1.0,
    attackMultiplier: 0.0,
    totalAttack: player.attack || 1,
    effectDetails: []
  };

  const applyEffect = (effect: StatusEffect, sourceName: string, sourceName_fr?: string) => {
      // Logic for aggregating modifiers
      switch (effect.type) {
        case EffectType.XP_MULTIPLIER:
            stats.xpMultiplier += effect.value;
            break;
        case EffectType.GOLD_MULTIPLIER:
            stats.goldMultiplier += effect.value;
            break;
        case EffectType.MOVEMENT_BONUS:
            stats.movementMultiplier += effect.value;
            break;
        case EffectType.COMBAT_SCORE_BONUS:
            stats.attackMultiplier += effect.value;
            break;
      }

      // Add to details list
      stats.effectDetails.push({
          id: effect.id,
          description: effect.description,
          description_fr: effect.description_fr,
          type: effect.type,
          value: effect.value,
          sourceName: sourceName,
          sourceName_fr: sourceName_fr
      });
  };

  // 1. Calculate bonuses from EQUIPPED items
  if (player.equipped) {
    player.equipped.forEach(item => {
        if (item && item.tags) {
            item.tags.forEach(tagId => {
                const effect = STATUS_EFFECTS[tagId];
                if (effect) {
                    applyEffect(effect, item.name, item.name_fr);
                }
            });
        }
    });
  }

  // 2. Calculate bonuses from ACTIVE COMPANION
  if (player.activeCompanionId && player.companions) {
      const activeCompanion = player.companions.find(c => c.id === player.activeCompanionId);
      if (activeCompanion && activeCompanion.tags) {
          activeCompanion.tags.forEach(tagId => {
              const effect = STATUS_EFFECTS[tagId];
              if (effect) {
                  applyEffect(effect, activeCompanion.name, activeCompanion.name);
              }
          });
      }
  }

  // Total Attack Calculation: Base * (1 + Sum of Percentages)
  stats.totalAttack = Math.floor((player.attack || 1) * (1 + stats.attackMultiplier));

  return stats;
};

export const getEnemyStats = (encounter: Encounter): EnemyStats => {
  const stats: EnemyStats = {
    hpBonus: 0,
    damageBonus: 0,
    goldRewardBonus: 0,
    xpRewardBonus: 0
  };

  if (encounter.tags) {
    encounter.tags.forEach(tagId => {
      const effect = STATUS_EFFECTS[tagId];
      if (effect) {
        // Calculate the Bonus Amount based on the Percentage of the Base Stat
        switch (effect.type) {
          case EffectType.ENEMY_HP_BONUS:
            stats.hpBonus += Math.floor(encounter.monsterHP * effect.value);
            break;
          case EffectType.ENEMY_DAMAGE_BONUS:
            stats.damageBonus += Math.floor(encounter.attack * effect.value);
            break;
          case EffectType.ENEMY_GOLD_REWARD_BONUS:
            stats.goldRewardBonus += Math.floor(encounter.goldReward * effect.value);
            break;
          case EffectType.ENEMY_XP_REWARD_BONUS:
            stats.xpRewardBonus += Math.floor((encounter.xpReward || 0) * effect.value);
            break;
        }
      }
    });
  }

  return stats;
};
