
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
      minVal: 5,
      maxVal: 300,
      targetSegments: 5,
    },
    combat: {
      multiplicationMax: 25,
      questionsCount: 5,
    },
    recherche: {
      divisionMaxDividend: 100,
      baseCost: 20,
      costIncrement: 3,
    },
    alchimie: {
      numeratorMax: 20,
      denominatorMax: 15,
      ops: ['reduce', 'add', 'sub', 'mult']
    },
    boss: {
      timerDuration: 20,
      actionsPerTurn: 5
    }
  },
  encounterRate: 20,
  possibleEncounters: [
    ENCOUNTERS.t5_eigenvalue_elemental,
    ENCOUNTERS.t5_permutation_puck,
    ENCOUNTERS.t5_limit_leviathan,
    ENCOUNTERS.t5_set_theory_serpent,
    ENCOUNTERS.t5_series_sorcerer,
    ENCOUNTERS.t5_quadric_quest,
    ENCOUNTERS.t5_pi_phantom
  ]
};
