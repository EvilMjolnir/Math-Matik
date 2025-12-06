

import { Tome } from '../types';
import { ENCOUNTERS } from '../data/encounters';

export const tome3: Tome = {
  id: 'tome_3',
  title: 'The Void of Variables',
  title_fr: 'Le Vide des Variables',
  description: 'A mystical realm where reality shifts constantly.',
  description_fr: 'Un royaume mystique où la réalité change constamment.',
  totalDistance: 200,
  currentDistance: 0,
  isUnlocked: false,
  isCompleted: false,
  difficultyMultiplier: 1.5,
  config: {
    movement: {
      minVal: 20,
      maxVal: 100,
      targetSegments: 8,
    },
    combat: {
      multiplicationMax: 15,
      questionsCount: 15,
    },
    recherche: {
      divisionMaxDividend: 144,
      baseCost: 20,
      costIncrement: 5,
    },
    boss: {
      timerDuration: 12,
      actionsPerTurn: 6
    }
  },
  encounterRate: 20,
  possibleEncounters: [
    ENCOUNTERS.t3_shade,
    ENCOUNTERS.t3_wizard
  ]
};
