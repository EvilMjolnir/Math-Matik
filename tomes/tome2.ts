
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
      questionsCount: 5,
    },
    recherche: {
      divisionMaxDividend: 20,
      baseCost: 10,
      costIncrement: 3,
    },
    alchimie: {
      numeratorMax: 10,
      denominatorMax: 8,
      ops: ['reduce', 'add']
    },
    boss: {
      timerDuration: 25,
      actionsPerTurn: 4
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
