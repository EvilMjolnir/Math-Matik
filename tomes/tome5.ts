

import { Tome } from '../types';
import { ENCOUNTERS } from '../data/encounters';

export const tome5: Tome = {
  id: 'tome_5',
  title: 'The Core of Chaos',
  title_fr: 'Le Cœur du Chaos',
  description: 'The center of the mathematical universe. Entropy reigns supreme here.',
  description_fr: 'Le centre de l\'univers mathématique. L\'entropie y règne en maître.',
  totalDistance: 500,
  currentDistance: 0,
  isUnlocked: false,
  isCompleted: false,
  difficultyMultiplier: 2.5,
  config: {
    movement: {
      minVal: 100,
      maxVal: 500,
      targetSegments: 12,
    },
    combat: {
      multiplicationMax: 20,
      questionsCount: 25,
    },
    recherche: {
      divisionMaxDividend: 300,
      baseCost: 50,
      costIncrement: 10,
    },
    boss: {
      timerDuration: 8,
      actionsPerTurn: 8
    }
  },
  encounterRate: 30,
  possibleEncounters: [
    ENCOUNTERS.t5_chaos,
    ENCOUNTERS.t5_dragon
  ]
};
