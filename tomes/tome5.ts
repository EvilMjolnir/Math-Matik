
import { Tome } from '../types';

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
    }
  },
  encounterRate: 30,
  possibleEncounters: [
    {
      id: 't5_chaos',
      name: 'Chaos Bringer',
      name_fr: 'Porteur de Chaos',
      description: 'An entity that defies the laws of arithmetic.',
      description_fr: 'Une entité qui défie les lois de l\'arithmétique.',
      threshold: 70,
      hpLoss: 40,
      goldReward: 200,
      xpReward: 400
    },
    {
      id: 't5_dragon',
      name: 'Null Dragon',
      name_fr: 'Dragon du Néant',
      description: 'The ancient devourer of all values.',
      description_fr: 'L\'ancien dévoreur de toutes valeurs.',
      threshold: 90,
      hpLoss: 50,
      goldReward: 300,
      xpReward: 500
    }
  ]
};