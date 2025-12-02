
import { Tome } from '../types';

export const tome1: Tome = {
  id: 'tome_1',
  title: 'The Forest of Integers',
  title_fr: 'La Forêt des Entiers',
  description: 'A dense woodland where numbers grow on trees. Clear a path to find the ancient ruins.',
  description_fr: 'Une forêt dense où les nombres poussent sur les arbres. Frayez-vous un chemin pour trouver les ruines antiques.',
  totalDistance: 50,
  currentDistance: 0,
  isUnlocked: true,
  isCompleted: false,
  difficultyMultiplier: 1.0,
  config: {
    movement: {
      minVal: 1,
      maxVal: 10,
      targetSegments: 3,
    },
    combat: {
      multiplicationMax: 5,
      questionsCount: 5,
    },
    recherche: {
      divisionMaxDividend: 20,
      baseCost: 5,
      costIncrement: 2,
    }
  },
  encounterRate: 10,
  possibleEncounters: [
    {
      id: 't1_wolf',
      name: 'Timber Wolf',
      name_fr: 'Loup des Bois',
      description: 'A growling wolf blocks the path!',
      description_fr: 'Un loup grondant bloque le chemin !',
      threshold: 8,
      hpLoss: 5,
      goldReward: 10
    },
    {
      id: 't1_goblin',
      name: 'Math Goblin',
      name_fr: 'Gobelin des Maths',
      description: 'He demands the correct answers or your gold!',
      description_fr: 'Il exige les bonnes réponses ou votre or !',
      threshold: 10,
      hpLoss: 3,
      goldReward: 15
    }
  ]
};
