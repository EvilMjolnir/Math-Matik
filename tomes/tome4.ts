
import { Tome } from '../types';

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
    }
  },
  encounterRate: 25,
  possibleEncounters: [
    {
      id: 't4_elemental',
      name: 'Storm Elemental',
      name_fr: 'Élémentaire de Tempête',
      description: 'A being composed of pure lightning and thunder.',
      description_fr: 'Un être composé de pur foudre et tonnerre.',
      threshold: 45,
      hpLoss: 30,
      goldReward: 100,
      xpReward: 200
    },
    {
      id: 't4_sorcerer',
      name: 'High Sorcerer',
      name_fr: 'Grand Sorcier',
      description: 'He weaves complex equations to trap travelers.',
      description_fr: 'Il tisse des équations complexes pour piéger les voyageurs.',
      threshold: 55,
      hpLoss: 35,
      goldReward: 125,
      xpReward: 250
    }
  ]
};