
import { Tome } from '../types';

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
      threshold: 10,
      hpLoss: 5,
      goldReward: 2,
      xpReward: 8
    },
    {
      id: 't1_goblin',
      name: 'Math Goblin',
      name_fr: 'Gobelin des Maths',
      description: 'He demands the correct answers or your gold!',
      description_fr: 'Il exige les bonnes réponses ou votre or !',
      threshold: 14,
      hpLoss: 8,
      goldReward: 3,
      xpReward: 10
    }
  ]
};