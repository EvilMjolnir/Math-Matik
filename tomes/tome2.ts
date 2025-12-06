

import { Tome } from '../types';
import { ENCOUNTERS } from '../data/encounters';

export const tome2: Tome = {
  id: 'tome_2',
  title: 'The Iron Fortress',
  title_fr: 'La Forteresse de Fer',
  description: 'A stronghold of rigid logic. Only the precise may enter.',
  description_fr: 'Une forteresse de logique rigide. Seuls les précis peuvent entrer.',
  totalDistance: 100,
  currentDistance: 0,
  isUnlocked: false,
  isCompleted: false,
  difficultyMultiplier: 1.2,
  config: {
    movement: {
      minVal: 5,
      maxVal: 50,
      targetSegments: 5,
    },
    combat: {
      multiplicationMax: 10,
      questionsCount: 8,
    },
    recherche: {
      divisionMaxDividend: 50,
      baseCost: 10,
      costIncrement: 3,
    },
    boss: {
      timerDuration: 15,
      actionsPerTurn: 5
    }
  },
  encounterRate: 15,
  possibleEncounters: [
    ENCOUNTERS.t2_exponent_eater,
    ENCOUNTERS.t2_fraction_ogre,
    ENCOUNTERS.t2_guard,
    ENCOUNTERS.t2_golem,
    ENCOUNTERS.t2_geometry_golem
  ]
};
