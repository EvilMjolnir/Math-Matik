



import { PlayerStats, EffectType, Encounter } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';

export interface AggregatedStats {
  xpMultiplier: number; // Base 1.0
  goldMultiplier: number; // Base 1.0
  movementBonus: number; // Base 0
  combatScoreBonus: number; // Base 0
  totalAttack: number;
}

export interface EnemyStats {
  hpBonus: number; // Renamed from thresholdBonus, Base 0
  damageBonus: number;    // Base 0
  goldRewardBonus: number; // Base 0
  xpRewardBonus: number;   // Base 0
}

export const getAggregatedStats = (player: PlayerStats): AggregatedStats => {
  const stats: AggregatedStats = {
    xpMultiplier: 1.0,
    goldMultiplier: 1.0,
    movementBonus: 0,
    combatScoreBonus: 0,
    totalAttack: player.attack || 1
  };

  // Only calculate bonuses from EQUIPPED items
  if (!player.equipped) return stats;

  player.equipped.forEach(item => {
    if (item && item.tags) {
      item.tags.forEach(tagId => {
        const effect = STATUS_EFFECTS[tagId];
        if (effect) {
          switch (effect.type) {
            case EffectType.XP_MULTIPLIER:
              stats.xpMultiplier += effect.value;
              break;
            case EffectType.GOLD_MULTIPLIER:
              stats.goldMultiplier += effect.value;
              break;
            case EffectType.MOVEMENT_BONUS:
              stats.movementBonus += effect.value;
              break;
            case EffectType.COMBAT_SCORE_BONUS:
              stats.combatScoreBonus += effect.value;
              break;
          }
        }
      });
    }
  });

  // Total Attack is Base + Combat Bonuses
  stats.totalAttack += stats.combatScoreBonus;

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
        switch (effect.type) {
          case EffectType.ENEMY_HP_BONUS:
            stats.hpBonus += effect.value;
            break;
          case EffectType.ENEMY_DAMAGE_BONUS:
            stats.damageBonus += effect.value;
            break;
          case EffectType.ENEMY_GOLD_REWARD_BONUS:
            stats.goldRewardBonus += effect.value;
            break;
          case EffectType.ENEMY_XP_REWARD_BONUS:
            stats.xpRewardBonus += effect.value;
            break;
        }
      }
    });
  }

  return stats;
};