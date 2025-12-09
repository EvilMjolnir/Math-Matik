
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
      minVal: 5,
      maxVal: 100,
      targetSegments: 5,
    },
    combat: {
      multiplicationMax: 15,
      questionsCount: 8,
    },
    recherche: {
      divisionMaxDividend: 25,
      baseCost: 10,
      costIncrement: 3,
    },
    alchimie: {
      numeratorMax: 12,
      denominatorMax: 10,
      ops: ['add', 'sub']
    },
    boss: {
      timerDuration: 12,
      actionsPerTurn: 5
    }
  },
  encounterRate: 15,
  possibleEncounters: [
    ENCOUNTERS.t3_shade,
    ENCOUNTERS.t3_wizard,
    ENCOUNTERS.t3_prime_slime,
    ENCOUNTERS.t3_algebra_wraith,
    ENCOUNTERS.t3_logarithm_lizard,
    ENCOUNTERS.t3_tangent_tree
  ]
};
