
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
      minVal: 5,
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
      id: 't2_exponent_eater',
      name: 'Exponent Eater',
      name_fr: 'Mangeur d’Exposants',
      description: 'Its power level is growing exponentially! Only correct simplification can stop it!',
      description_fr: 'Son niveau de puissance croît de façon exponentielle ! Seule la bonne simplification peut l’arrêter !',
      threshold: 22,
      hpLoss: 12,
      goldReward: 6,
      xpReward: 18
    },
    {
      id: 't2_fraction_ogre',
      name: 'Fraction Ogre',
      name_fr: 'Ogre des Fractions',
      description: 'He splits everything into parts. Unify the portions to defeat him!',
      description_fr: 'Il divise tout en parties. Unifiez les portions pour le vaincre !',
      threshold: 25,
      hpLoss: 15,
      goldReward: 8,
      xpReward: 20
    },    
    {
      id: 't2_guard',
      name: 'Iron Guard',
      name_fr: 'Garde de Fer',
      description: 'An animated suit of armor stands vigil.',
      description_fr: 'Une armure animée monte la garde.',
      threshold: 27,
      hpLoss: 10,
      goldReward: 10,
      xpReward: 22
    },
    {
      id: 't2_golem',
      name: 'Stone Golem',
      name_fr: 'Golem de Pierre',
      description: 'A massive construct made of heavy equations.',
      description_fr: 'Un colosse fait d\'équations lourdes.',
      threshold: 30,
      hpLoss: 12,
      goldReward: 12,
      xpReward: 25
    },
        {
      id: 't2_geometry_golem',
      name: 'Geometry Golem',
      name_fr: 'Golem de Géométrie',
      description: 'A construct of perfect angles. Measure its dimensions to find its weakness!',
      description_fr: 'Une construction d’angles parfaits. Mesurez ses dimensions pour trouver sa faiblesse !',
      threshold: 32,
      hpLoss: 20,
      goldReward: 20,
      xpReward: 35,
      type: 'boss'
    }
  ]
};