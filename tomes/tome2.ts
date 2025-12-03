
import { Tome } from '../types';

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
      minVal: 10,
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
    }
  },
  encounterRate: 15,
  possibleEncounters: [
    {
      id: 't2_guard',
      name: 'Iron Guard',
      name_fr: 'Garde de Fer',
      description: 'An animated suit of armor stands vigil.',
      description_fr: 'Une armure animée monte la garde.',
      threshold: 15,
      hpLoss: 10,
      goldReward: 25,
      xpReward: 60
    },
    {
      id: 't2_golem',
      name: 'Stone Golem',
      name_fr: 'Golem de Pierre',
      description: 'A massive construct made of heavy equations.',
      description_fr: 'Un colosse fait d\'équations lourdes.',
      threshold: 20,
      hpLoss: 15,
      goldReward: 35,
      xpReward: 80
    }
  ]
};