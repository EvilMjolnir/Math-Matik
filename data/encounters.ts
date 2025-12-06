

import { Encounter } from '../types';

export const ENCOUNTERS: Record<string, Encounter> = {
  // --- Tome 1: Forest ---
  t1_wolf: {
    id: 't1_wolf',
    name: 'Timber Wolf',
    name_fr: 'Loup des Bois',
    description: 'A growling wolf blocks the path!',
    description_fr: 'Un loup grondant bloque le chemin !',
    monsterHP: 10,
    attack: 5,
    goldReward: 2,
    xpReward: 8,
    timerDuration: 12,
    image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/timber_wolf.png"
  },
  t1_goblin: {
    id: 't1_goblin',
    name: 'Math Goblin',
    name_fr: 'Gobelin des Maths',
    description: 'He demands the correct answers or your gold!',
    description_fr: 'Il exige les bonnes réponses ou votre or !',
    monsterHP: 14,
    attack: 8,
    goldReward: 3,
    xpReward: 10,
    timerDuration: 10
  },
  t1_vector_viper: {
    id: 't1_vector_viper',
    name: 'Vector Viper',
    name_fr: 'Vipère Vecteur',
    description: 'It slithers with a calculated trajectory. Solve its directional query!',
    description_fr: 'Elle se faufile avec une trajectoire calculée. Résolvez son énigme directionnelle !',
    monsterHP: 18,
    attack: 10,
    goldReward: 5,
    xpReward: 15,
    timerDuration: 8
  },
  t1_boss: {
    id: 't1_boss',
    name: 'The Root Keeper',
    name_fr: 'Le Gardien des Racines',
    description: 'An ancient ent guarding the secrets of the forest.',
    description_fr: 'Un ent ancien gardant les secrets de la forêt.',
    monsterHP: 20,
    attack: 10,
    goldReward: 10,
    xpReward: 50,
    type: 'boss'
  },

  // --- Tome 2: Iron Fortress ---
  t2_exponent_eater: {
    id: 't2_exponent_eater',
    name: 'Exponent Eater',
    name_fr: 'Mangeur d’Exposants',
    description: 'Its power level is growing exponentially! Only correct simplification can stop it!',
    description_fr: 'Son niveau de puissance croît de façon exponentielle ! Seule la bonne simplification peut l’arrêter !',
    monsterHP: 22,
    attack: 12,
    goldReward: 6,
    xpReward: 18,
    timerDuration: 10
  },
  t2_fraction_ogre: {
    id: 't2_fraction_ogre',
    name: 'Fraction Ogre',
    name_fr: 'Ogre des Fractions',
    description: 'He splits everything into parts. Unify the portions to defeat him!',
    description_fr: 'Il divise tout en parties. Unifiez les portions pour le vaincre !',
    monsterHP: 25,
    attack: 15,
    goldReward: 8,
    xpReward: 20,
    tags: ['mon_armored'],
    timerDuration: 12
  },
  t2_guard: {
    id: 't2_guard',
    name: 'Iron Guard',
    name_fr: 'Garde de Fer',
    description: 'An animated suit of armor stands vigil.',
    description_fr: 'Une armure animée monte la garde.',
    monsterHP: 27,
    attack: 10,
    goldReward: 10,
    xpReward: 22,
    tags: ['mon_armored'],
    timerDuration: 9
  },
  t2_golem: {
    id: 't2_golem',
    name: 'Stone Golem',
    name_fr: 'Golem de Pierre',
    description: 'A massive construct made of heavy equations.',
    description_fr: 'Un colosse fait d\'équations lourdes.',
    monsterHP: 30,
    attack: 12,
    goldReward: 12,
    xpReward: 25,
    tags: ['mon_armored', 'mon_fierce'],
    timerDuration: 15
  },
  t2_geometry_golem: {
    id: 't2_geometry_golem',
    name: 'Geometry Golem',
    name_fr: 'Golem de Géométrie',
    description: 'A construct of perfect angles. Measure its dimensions to find its weakness!',
    description_fr: 'Une construction d’angles parfaits. Mesurez ses dimensions pour trouver sa faiblesse !',
    monsterHP: 32,
    attack: 20,
    goldReward: 20,
    xpReward: 35,
    type: 'boss',
    tags: ['mon_elite', 'mon_armored']
  },

  // --- Tome 3: Void ---
  t3_shade: {
    id: 't3_shade',
    name: 'Void Shade',
    name_fr: 'Ombre du Vide',
    description: 'A shadow that consumes numbers.',
    description_fr: 'Une ombre qui consume les nombres.',
    monsterHP: 25,
    attack: 20,
    goldReward: 50,
    xpReward: 100,
    tags: ['mon_deadly'],
    timerDuration: 7
  },
  t3_wizard: {
    id: 't3_wizard',
    name: 'Mad Arithmetician',
    name_fr: 'Arithméticien Fou',
    description: 'He casts spells of confusion!',
    description_fr: 'Il lance des sorts de confusion !',
    monsterHP: 35,
    attack: 25,
    goldReward: 75,
    xpReward: 150,
    timerDuration: 10
  },

  // --- Tome 4: Summit ---
  t4_elemental: {
    id: 't4_elemental',
    name: 'Storm Elemental',
    name_fr: 'Élémentaire de Tempête',
    description: 'A being composed of pure lightning and thunder.',
    description_fr: 'Un être composé de pur foudre et tonnerre.',
    monsterHP: 45,
    attack: 30,
    goldReward: 100,
    xpReward: 200,
    tags: ['mon_fierce', 'mon_elite'],
    timerDuration: 9
  },
  t4_sorcerer: {
    id: 't4_sorcerer',
    name: 'High Sorcerer',
    name_fr: 'Grand Sorcier',
    description: 'He weaves complex equations to trap travelers.',
    description_fr: 'Il tisse des équations complexes pour piéger les voyageurs.',
    monsterHP: 55,
    attack: 35,
    goldReward: 125,
    xpReward: 250,
    tags: ['mon_wealthy'],
    timerDuration: 10
  },

  // --- Tome 5: Chaos ---
  t5_chaos: {
    id: 't5_chaos',
    name: 'Chaos Bringer',
    name_fr: 'Porteur de Chaos',
    description: 'An entity that defies the laws of arithmetic.',
    description_fr: 'Une entité qui défie les lois de l\'arithmétique.',
    monsterHP: 70,
    attack: 40,
    goldReward: 200,
    xpReward: 400,
    tags: ['mon_deadly', 'mon_armored'],
    timerDuration: 8
  },
  t5_dragon: {
    id: 't5_dragon',
    name: 'Null Dragon',
    name_fr: 'Dragon du Néant',
    description: 'The ancient devourer of all values.',
    description_fr: 'L\'ancien dévoreur de toutes valeurs.',
    monsterHP: 90,
    attack: 50,
    goldReward: 300,
    xpReward: 500,
    tags: ['mon_deadly', 'mon_armored', 'mon_elite'],
    timerDuration: 12
  }
};