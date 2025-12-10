
import { Encounter } from '../types';

export const ENCOUNTERS: Record<string, Encounter> = {
          // --- Tome 1: Forest (Levels 1-2) ---
  // HP kept low for new players, Boss HP slightly increased.
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
    timerDuration: 10,
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/math_goblin.png"
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
    timerDuration: 8,
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/vector_viper.png"
  },
  t1_boss: {
    id: 't1_boss',
    name: 'The Root Keeper',
    name_fr: 'Le Gardien des Racines',
    description: 'An ancient ent guarding the secrets of the forest.',
    description_fr: 'Un ent ancien gardant les secrets de la forêt.',
    monsterHP: 25, // Increased from 20
    attack: 10,
    goldReward: 10,
    xpReward: 50,
    type: 'boss',
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/root_keeper.png"
  },

  // --- Tome 2: Iron Fortress (Levels 3-4) ---
  // HP increased by ~20%
  t2_exponent_eater: {
    id: 't2_exponent_eater',
    name: 'Exponent Eater',
    name_fr: 'Mangeur d’Exposants',
    description: 'Its power level is growing exponentially! Only correct simplification can stop it!',
    description_fr: 'Son niveau de puissance croît de façon exponentielle ! Seule la bonne simplification peut l’arrêter !',
    monsterHP: 26, // Increased from 22
    attack: 12,
    goldReward: 6,
    xpReward: 18,
    timerDuration: 10,
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/exponent_eater.png"
  },
  t2_fraction_ogre: {
    id: 't2_fraction_ogre',
    name: 'Fraction Ogre',
    name_fr: 'Ogre des Fractions',
    description: 'He splits everything into parts. Unify the portions to defeat him!',
    description_fr: 'Il divise tout en parties. Unifiez les portions pour le vaincre !',
    monsterHP: 30, // Increased from 25
    attack: 15,
    goldReward: 8,
    xpReward: 20,
    tags: ['fierce_2'], // +20% dmg
    timerDuration: 12,
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/fraction_ogre.png"
  },
  t2_guard: {
    id: 't2_guard',
    name: 'Iron Guard',
    name_fr: 'Garde de Fer',
    description: 'An animated suit of armor stands vigil.',
    description_fr: 'Une armure animée monte la garde.',
    monsterHP: 32, // Increased from 27
    attack: 10,
    goldReward: 10,
    xpReward: 22,
    tags: ['armored_2'], // +20% HP
    timerDuration: 9,
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/iron_guard.png"
  },
  t2_golem: {
    id: 't2_golem',
    name: 'Stone Golem',
    name_fr: 'Golem de Pierre',
    description: 'A massive construct made of heavy equations.',
    description_fr: 'Un colosse fait d\'équations lourdes.',
    monsterHP: 36, // Increased from 30
    attack: 12,
    goldReward: 12,
    xpReward: 25,
    tags: ['armored_3'], // +30% HP
    timerDuration: 15,
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/stone_golem.png"
  },
  t2_geometry_golem: {
    id: 't2_geometry_golem',
    name: 'Geometry Golem',
    name_fr: 'Golem de Géométrie',
    description: 'A construct of perfect angles. Measure its dimensions to find its weakness!',
    description_fr: 'Une construction d’angles parfaits. Mesurez ses dimensions pour trouver sa faiblesse !',
    monsterHP: 54, // Increased significantly from 32 (x1.7)
    attack: 20,
    goldReward: 20,
    xpReward: 35,
    type: 'boss',
    tags: ['armored_2'], // +20% HP
	  image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/geometry%20golem.png"
  },

  // --- Tome 3: Void (Levels 5-6) ---
  // HP increased by ~50%
  t3_shade: {
    id: 't3_shade',
    name: 'Void Shade',
    name_fr: 'Ombre du Vide',
    description: 'A shadow that consumes numbers.',
    description_fr: 'Une ombre qui consume les nombres.',
    monsterHP: 38, // Increased from 25
    attack: 20,
    goldReward: 50,
    xpReward: 100,
    tags: ['fierce_4'], // +40% Dmg (was Deadly)
    timerDuration: 7
  },
  t3_wizard: {
    id: 't3_wizard',
    name: 'Mad Arithmetician',
    name_fr: 'Arithméticien Fou',
    description: 'He casts spells of confusion!',
    description_fr: 'Il lance des sorts de confusion !',
    monsterHP: 53, // Increased from 35
    attack: 25,
    goldReward: 75,
    xpReward: 150,
    timerDuration: 10
  },
  t3_prime_slime: {
    id: 't3_prime_slime',
    name: 'Prime Slime',
    name_fr: 'Slime Premier',
    description: 'This creature can only be divided by two things: 1 and itself. Find its factors!',
    description_fr: 'Cette créature ne peut être divisée que par deux choses : 1 et elle-même. Trouvez ses facteurs !',
    monsterHP: 42, // Increased from 28
    attack: 18,
    goldReward: 10,
    xpReward: 25,
    timerDuration: 8
  },
  t3_algebra_wraith: {
    id: 't3_algebra_wraith',
    name: 'Algebra Wraith',
    name_fr: 'Spectre Algébrique',
    description: 'A floating equation! Isolate the variable to banish the spirit.',
    description_fr: 'Une équation flottante ! Isolez la variable pour bannir l’esprit.',
    monsterHP: 45, // Increased from 30
    attack: 20,
    goldReward: 12,
    xpReward: 30,
    timerDuration: 8
  },
  t3_logarithm_lizard: {
    id: 't3_logarithm_lizard',
    name: 'Logarithm Lizard',
    name_fr: 'Lézard Logarithme',
    description: 'Its camouflage is based on powers. Find the exponent to reveal its position!',
    description_fr: 'Son camouflage est basé sur les puissances. Trouvez l’exposant pour révéler sa position !',
    monsterHP: 47, // Increased from 31
    attack: 21,
    goldReward: 13,
    xpReward: 32,
    timerDuration: 8
  },
  t3_Ouroboros: {
    id: 't3_Ouroboros',
    name: 'Ouroboros',
    name_fr: 'Ouroboros',
    description: 'An ancient serpent eternally consuming itself. Find the slope at the point where it bites its tail!',
    description_fr: 'Un serpent ancien se consumant éternellement. Trouvez la pente au point où il mord sa queue !',
    monsterHP: 75,
    attack: 20,
    goldReward: 50,
    xpReward: 75,
    type: 'boss',
    timerDuration: 8
  },

  // --- Tome 4: Summit (Levels 7-8) ---
  // HP doubled (x2.0). Attack capped at 40.
  t4_trigonometry_troll: {
    id: 't4_trigonometry_troll',
    name: 'Trigonometry Troll',
    name_fr: 'Troll de Trigonométrie',
    description: 'He guards the bridge, demanding you solve the sine, cosine, or tangent of his giant club!',
    description_fr: 'Il garde le pont, exigeant que vous résolviez le sinus, le cosinus ou la tangente de sa massue géante !',
    monsterHP: 70, // Increased from 35
    attack: 25,
    goldReward: 16,
    xpReward: 40,
    tags: ['armored_3', 'fierce_2'],
    timerDuration: 10
  },
  t4_integration_imp: {
    id: 't4_integration_imp',
    name: 'Integration Imp',
    name_fr: 'Diablotin d’Intégration',
    description: 'It collects the area under the function. Find the total area to silence its spell!',
    description_fr: 'Il recueille l’aire sous la fonction. Trouvez l’aire totale pour faire taire son sort !',
    monsterHP: 72, // Increased from 36
    attack: 26,
    goldReward: 17,
    xpReward: 42,
    timerDuration: 10
  },
  t4_calculus_kraken: {
    id: 't4_calculus_kraken',
    name: 'Calculus Kraken',
    name_fr: 'Kraken du Calcul',
    description: 'Its tentacles shift continuously. Find the rate of change to escape its grasp!',
    description_fr: 'Ses tentacules changent continuellement. Trouvez le taux de changement pour échapper à son emprise !',
    monsterHP: 76, // Increased from 38
    attack: 30,
    goldReward: 20,
    xpReward: 45,
    tags: ['elite_2'],
    timerDuration: 10
  },
  t4_probability_phantom: {
    id: 't4_probability_phantom',
    name: 'Probability Phantom',
    name_fr: 'Fantôme de Probabilité',
    description: 'An ethereal menace that attacks based on chance. Calculate the odds of victory!',
    description_fr: 'Une menace éthérée qui attaque par hasard. Calculez les chances de victoire !',
    monsterHP: 78, // Increased from 39
    attack: 32,
    goldReward: 22,
    xpReward: 47,
    timerDuration: 10
  },
  t4_statistic_sphinx: {
    id: 't4_statistic_sphinx',
    name: 'Statistic Sphinx',
    name_fr: 'Sphinx des Statistiques',
    description: 'She poses a data puzzle. Calculate the mean, median, or mode to pass!',
    description_fr: 'Elle pose une énigme de données. Calculez la moyenne, la médiane ou le mode pour passer !',
    monsterHP: 80, // Increased from 40
    attack: 35,
    goldReward: 25,
    xpReward: 50,
    timerDuration: 10
  },
  t4_matrix_minotaur: {
    id: 't4_matrix_minotaur',
    name: 'Matrix Minotaur',
    name_fr: 'Minotaure Matrice',
    description: 'The labyrinth walls are lined with numbers. Multiply the arrays correctly to find the exit!',
    description_fr: 'Les murs du labyrinthe sont tapissés de chiffres. Multipliez correctement les tableaux pour trouver la sortie !',
    monsterHP: 150, // Increased from 45
    attack: 40, // Capped at 40 (was 40)
    goldReward: 30,
    xpReward: 55,
    tags: ['elite_3', 'wealthy_2'],
    type: 'boss',
    timerDuration: 12
  },

  // --- Tome 5: Chaos (Levels 9-10) ---
  // HP increased by ~150% (x2.5). Attack capped at 50.
  t5_eigenvalue_elemental: {
    id: 't5_eigenvalue_elemental',
    name: 'Eigenvalue Elemental',
    name_fr: 'Élémentaire de Valeur Propre',
    description: 'A creature only defeated by its primary scaling factor. Find the eigenvalue!',
    description_fr: 'Une créature vaincue uniquement par son facteur d’échelle principal. Trouvez la valeur propre !',
    monsterHP: 120, // Increased from 48
    attack: 42, // Capped at 50
    goldReward: 32,
    xpReward: 57,
    tags: ['armored_4'],
    timerDuration: 12
  },
  t5_permutation_puck: {
    id: 't5_permutation_puck',
    name: 'Permutation Puck',
    name_fr: 'Lutin de Permutation',
    description: 'A mischievous creature that scrambles paths. Order the possibilities to corner it!',
    description_fr: 'Une créature espiègle qui brouille les chemins. Ordonnez les possibilités pour la coincer !',
    monsterHP: 125, // Increased from 50
    attack: 45, // Capped at 50
    goldReward: 35,
    xpReward: 60,
    timerDuration: 12
  },
  t5_limit_leviathan: {
    id: 't5_limit_leviathan',
    name: 'Limit Leviathan',
    name_fr: 'Léviathan Limite',
    description: 'It approaches infinity! Determine what value it never quite reaches to harm it!',
    description_fr: 'Il approche l’infini ! Déterminez la valeur qu’il n’atteint jamais tout à fait pour le blesser !',
    monsterHP: 130, // Increased from 52
    attack: 47, // Capped at 50
    goldReward: 37,
    xpReward: 63,
    tags: ['fierce_3'],
    timerDuration: 12
  },
  t5_set_theory_serpent: {
    id: 't5_set_theory_serpent',
    name: 'Set Theory Serpent',
    name_fr: 'Serpent de la Théorie des Ensembles',
    description: 'It creates overlapping rings of confusion. Find the correct intersection or union to strike!',
    description_fr: 'Il crée des anneaux de confusion qui se chevauchent. Trouvez la bonne intersection ou union pour frapper !',
    monsterHP: 138, // Increased from 55
    attack: 50, // Capped at 50 (was 50)
    goldReward: 40,
    xpReward: 70,
    timerDuration: 12
  },
  t5_series_sorcerer: {
    id: 't5_series_sorcerer',
    name: 'Series Sorcerer',
    name_fr: 'Sorcier des Séries',
    description: 'He casts endless spells. Calculate if the infinite sum converges or diverges to counter!',
    description_fr: 'Il lance des sorts sans fin. Calculez si la somme infinie converge ou diverge pour contrer !',
    monsterHP: 145, // Increased from 58
    attack: 50, // Capped at 50 (was 55)
    goldReward: 45,
    xpReward: 75,
    tags: ['elite_4'],
    timerDuration: 12
  },
  t5_quadric_quest: {
    id: 't5_quadric_quest',
    name: 'Quadric Quest',
    name_fr: 'Quête Quadratique',
    description: 'The path splits into a parabolic curve. Use the quadratic formula to find the two roots!',
    description_fr: 'Le chemin se divise en une courbe parabolique. Utilisez la formule quadratique pour trouver les deux racines !',
    monsterHP: 150, // Increased from 60
    attack: 50, // Capped at 50 (was 60)
    goldReward: 50,
    xpReward: 80,
    timerDuration: 12
  },
  t5_pi_phantom: {
    id: 't5_pi_phantom',
    name: 'Pi Phantom',
    name_fr: 'Fantôme de Pi',
    description: 'An endless, non-repeating sequence of terror! Recite the correct digits to banish it!',
    description_fr: 'Une séquence de terreur infinie et non répétitive ! Récitez les chiffres corrects pour le bannir !',
    monsterHP: 225, // Increased from 65
    attack: 50, // Capped at 50 (was 70)
    goldReward: 60,
    xpReward: 90,
    tags: ['elite_5', 'fierce_5'],
    type: 'boss',
    timerDuration: 12
  }
};
