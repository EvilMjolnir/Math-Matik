
import { Tome } from '../types';

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
    }
  },
  encounterRate: 20,
  possibleEncounters: [
    {
      id: 't3_shade',
      name: 'Void Shade',
      name_fr: 'Ombre du Vide',
      description: 'A shadow that consumes numbers.',
      description_fr: 'Une ombre qui consume les nombres.',
      threshold: 25,
      hpLoss: 20,
      goldReward: 50,
      xpReward: 100
    },
    {
      id: 't3_wizard',
      name: 'Mad Arithmetician',
      name_fr: 'Arithméticien Fou',
      description: 'He casts spells of confusion!',
      description_fr: 'Il lance des sorts de confusion !',
      threshold: 35,
      hpLoss: 25,
      goldReward: 75,
      xpReward: 150
    }
  ]
};