
import { PlayerStats, EffectType } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';

export interface AggregatedStats {
  xpMultiplier: number; // Base 1.0
  goldMultiplier: number; // Base 1.0
  movementBonus: number; // Base 0
  combatScoreBonus: number; // Base 0
}

export const getAggregatedStats = (player: PlayerStats): AggregatedStats => {
  const stats: AggregatedStats = {
    xpMultiplier: 1.0,
    goldMultiplier: 1.0,
    movementBonus: 0,
    combatScoreBonus: 0
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

  return stats;
};
