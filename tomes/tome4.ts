

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
      minVal: 50,
      maxVal: 200,
      targetSegments: 10,
    },
    combat: {
      multiplicationMax: 18,
      questionsCount: 20,
    },
    recherche: {
      divisionMaxDividend: 200,
      baseCost: 30,
      costIncrement: 8,
    },
    boss: {
      timerDuration: 10,
      actionsPerTurn: 6
    }
  },
  encounterRate: 25,
  possibleEncounters: [
    ENCOUNTERS.t4_elemental,
    ENCOUNTERS.t4_sorcerer
  ]
};
