
import { Tome } from '../types';
import { ENCOUNTERS } from '../data/encounters';

export const tome4: Tome = {
  id: 'tome_4',
  title: 'The Summit of Sorcery',
  title_fr: 'Le Sommet de la Sorcellerie',
  description: 'High above the clouds where ancient magic twists reality itself.',
  description_fr: 'Bien au-dessus des nuages où la magie ancienne tord la réalité elle-même.',
  totalDistance: 300,
  currentDistance: 0,
  isUnlocked: false,
  isCompleted: false,
  difficultyMultiplier: 1.8,
  config: {
    movement: {
      minVal: 5,
      maxVal: 200,
      targetSegments: 5,
    },
    combat: {
      multiplicationMax: 20,
      questionsCount: 5,
    },
    recherche: {
      divisionMaxDividend: 50,
      baseCost: 10,
      costIncrement: 3,
    },
    alchimie: {
      numeratorMax: 15,
      denominatorMax: 12,
      ops: ['add', 'sub', 'mult']
    },
    boss: {
      timerDuration: 12,
      actionsPerTurn: 5
    }
  },
  encounterRate: 18,
  possibleEncounters: [
    ENCOUNTERS.t4_trigonometry_troll,
    ENCOUNTERS.t4_integration_imp,
    ENCOUNTERS.t4_calculus_kraken,
    ENCOUNTERS.t4_probability_phantom,
    ENCOUNTERS.t4_statistic_sphinx,
    ENCOUNTERS.t4_matrix_minotaur
  ]
};
