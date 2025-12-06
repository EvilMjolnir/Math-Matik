

import { Tome } from '../types';
import { ENCOUNTERS } from '../data/encounters';

export const tome1: Tome = {
  id: 'tome_1',
  title: 'The Forest of Integers',
  title_fr: 'La Forêt des Entiers',
  description: 'A dense woodland where numbers grow on trees. Clear a path to find the ancient ruins.',
  description_fr: 'Une forêt dense où les nombres poussent sur les arbres. Frayez-vous un chemin pour trouver les ruines antiques.',
  image: 'https://iili.io/fzRK4LX.md.png',
  totalDistance: 50,
  currentDistance: 0,
  isUnlocked: true,
  isCompleted: false,
  difficultyMultiplier: 1.0,
  config: {
    movement: {
      minVal: 1,
      maxVal: 30,
      targetSegments: 5,
    },
    combat: {
      multiplicationMax: 10,
      questionsCount: 5,
    },
    recherche: {
      divisionMaxDividend: 20,
      baseCost: 5,
      costIncrement: 2,
    },
    boss: {
      timerDuration: 20,
      actionsPerTurn: 4
    }
  },
  encounterRate: 10,
  possibleEncounters: [
    ENCOUNTERS.t1_wolf,
    ENCOUNTERS.t1_goblin,
    ENCOUNTERS.t1_vector_viper,
    ENCOUNTERS.t1_boss
  ]
};
