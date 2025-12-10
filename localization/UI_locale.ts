
import { Translation } from './types';

export const UI_SOURCE = {
  titles: {
    movement: { en: "Movement", fr: "Mouvement" },
    combat: { en: "Combat", fr: "Combat" },
    recherche: { en: "Research", fr: "Recherche" },
    alchimie: { en: "Alchemy", fr: "Alchimie" },
    options: { en: "Grimoire of Settings", fr: "Grimoire des Paramètres" },
    home: { en: "Math et Matik", fr: "Math et Matik" },
    profile: { en: "Hero Profile", fr: "Profil du Héros" },
    dangerZone: { en: "Danger Zone", fr: "Zone de Danger" },
    scratchpad: { en: "Scratchpad", fr: "Brouillon" },
  },
  buttons: {
    back: { en: "Back", fr: "Retour" },
    close: { en: "Close", fr: "Fermer" },
    select: { en: "Select", fr: "Choisir" },
    details: { en: "Details", fr: "Détails" },
    returnCamp: { en: "Return to Camp", fr: "Retour au Camp" },
    playFor: { en: "Unlock for", fr: "Débloquer pour" },
    confirmLeave: { en: "Leave & Lose Gold", fr: "Quitter et Perdre l'Or" },
    stay: { en: "Stay", fr: "Rester" },
    clear: { en: "Clear Page", fr: "Effacer la Page" },
    deleteAccount: { en: "Delete Account & Data", fr: "Supprimer Compte & Données" },
    resetProfile: { en: "Reset Progress (Keep Account)", fr: "Réinitialiser Progression (Garder Compte)" },
    summon: { en: "Summon", fr: "Invoquer" },
    dismiss: { en: "Dismiss", fr: "Renvoyer" },
    melt: { en: "Melt Item", fr: "Fondre l'Objet" },
    craft: { en: "Craft", fr: "Fabriquer" },
    meltItems: { en: "Melt Items!", fr: "Fondre !" },
    exitMirror: { en: "Exit Mirror", fr: "Sortir" },
    confirm: { en: "Confirm?", fr: "Confirmer ?" },
    drink: { en: "Drink", fr: "Boire" },
  },
  tomes: {
    selectQuest: { en: "Select Your Quest", fr: "Choisissez votre Quête" },
    infiniteMode: { en: "Infinite Mode", fr: "Mode Infini" },
    infiniteDesc: { en: "Customizable difficulty via Options. No step limit.", fr: "Difficulté personnalisable. Pas de limite de pas." },
    active: { en: "ACTIVE", fr: "ACTIF" },
    progress: { en: "Progress", fr: "Progression" },
    steps: { en: "Steps", fr: "Pas" },
    locked: { en: "Locked", fr: "Verrouillé" },
  },
  combat: {
    target: { en: "Target", fr: "Cible" },
    score: { en: "Score", fr: "Score" },
    time: { en: "Time", fr: "Temps" },
    battleReport: { en: "Battle Report", fr: "Rapport de Bataille" },
    finalScore: { en: "Final Score", fr: "Score Final" },
    victory: { en: "Victory!", fr: "Victoire !" },
    defeat: { en: "Defeat", fr: "Défaite" },
    monsterHP: { en: "Monster HP", fr: "PV Monstre" },
    hpLost: { en: "HP Lost", fr: "PV Perdus" },
    encounterStart: { en: "Monster", fr: "Créature" },
    trainingMode: { en: "Training Mode", fr: "Mode Entraînement" },
    question: { en: "Question", fr: "Question" },
    pendingDamage: { en: "Pending Damage", fr: "Dégâts en Attente" },
    attackPower: { en: "Attack Power", fr: "Puissance d'Attaque" },
    attack: { en: "Attack", fr: "Attaque" },
    damageDealt: { en: "Damage Dealt", fr: "Dégâts Infligés" },
    tryAgain: { en: "Try Again", fr: "Réessayer" },
    continue: { en: "Continue Journey", fr: "Continuer l'Aventure" },
    charge: { en: "Charge", fr: "Charge" },
  },
  movement: {
    steps: { en: "Steps Taken", fr: "Pas Effectués" },
    pathCompleted: { en: "Path Completed", fr: "Chemin Parcouru" },
  },
  common: {
    xp: { en: "XP", fr: "XP" },
    hp: { en: "HP", fr: "PV" },
    gold: { en: "Gold", fr: "Or" },
    nums: { en: "Nems", fr: "Nems" },
    level: { en: "Lvl", fr: "Niv" },
    loading: { en: "Loading...", fr: "Chargement..." },
    cost: { en: "Cost", fr: "Coût" },
    notEnoughGold: { en: "Not enough Gold", fr: "Pas assez d'or" },
    notEnoughNems: { en: "Not enough Nems", fr: "Pas assez de Nems" },
    reward: { en: "Reward", fr: "Récompense" },
  },
  home: {
    subtitle: { en: "The Numerical Adventure", fr: "L'aventure Numérique" },
    currentQuest: { en: "Current Quest", fr: "Quête Actuelle" },
    infiniteMode: { en: "Infinite Mode Active", fr: "Mode Infini Actif" },
    infiniteDesc: { en: "Challenge yourself with custom difficulty settings.", fr: "Défiez-vous avec des paramètres personnalisés." },
    selectChallenge: { en: "Select a challenge to begin your journey.", fr: "Choisissez un défi pour commencer votre voyage." },
    encounterActive: { en: "Encounter!", fr: "Rencontre !" },
    encounterDesc: { en: "The path is blocked. You must fight!", fr: "Le chemin est bloqué. Vous devez combattre !" },
    menuDescMovement: { en: "Journey through the lands by solving equations.", fr: "Voyagez à travers les terres en résolvant des équations." },
    menuDescCombat: { en: "Fight enemies or test your speed.", fr: "Combattez des ennemis ou testez votre vitesse." },
    menuDescRecherche: { en: "Unlock ancient tomes to find magical items.", fr: "Déverrouillez des tomes anciens pour trouver des objets magiques." },
    menuDescAlchimie: { en: "Craft potions using Nems and Fraction math.", fr: "Créez des potions avec des Nems et des Fractions." },
  },
  recherche: {
    exitWarning: { en: "You have paid the entry fee. If you leave now, your gold will be lost. Are you sure?", fr: "Vous avez payé les frais d'entrée. Si vous partez maintenant, votre or sera perdu. Êtes-vous sûr ?" },
    entryFee: { en: "Entry Fee", fr: "Frais d'entrée" },
    entryFeeTitle: { en: "Entry Fee Paid", fr: "Frais d'entrée Payés" },
    deciphering: { en: "Deciphering", fr: "Déchiffrage" },
    toUnlock: { en: "to unlock", fr: "pour ouvrir" },
    lock: { en: "Lock", fr: "Serrure" },
    locks: { en: "Locks", fr: "Serrures" },
    lockSealed: { en: "The ancient lock remains sealed.", fr: "L'ancienne serrure reste scellée." },
  },
  alchimie: {
    selectMode: { en: "Select Method", fr: "Choisir Méthode" },
    normal: { en: "Normal", fr: "Normal" },
    flip: { en: "Clairvoyance", fr: "Clairvoyance" },
    pick: { en: "Omniscience", fr: "Omniscience" },
    brewing: { en: "Brewing...", fr: "Préparation..." },
    solveToCraft: { en: "Solve to Craft", fr: "Résoudre pour Créer" },
    uses: { en: "Uses", fr: "Usages" },
    potionCreated: { en: "Potion Created!", fr: "Potion Créée !" },
    descNormal: { en: "Pick 1 from 3 Hidden", fr: "1 au choix parmi 3 cachées" },
    descFlip: { en: "Reveal 2, Pick 1", fr: "Révélez 2, Choisissez 1" },
    descPick: { en: "Reveal All, Pick 1", fr: "Tout Révéler, Choisir 1" },
    draftFlip2: { en: "Flip 2 cards, then pick 1", fr: "Retournez 2 cartes, puis choisissez 1" },
    draftFlip1: { en: "Flip 1 to select", fr: "Retournez 1 pour choisir" },
    draftPick: { en: "Pick any card", fr: "Choisissez une carte" },
    opReduce: { en: "Reduce the Fraction", fr: "Réduire la Fraction" },
    opAdd: { en: "Addition", fr: "Addition" },
    opSub: { en: "Subtraction", fr: "Soustraction" },
    opMult: { en: "Multiplication", fr: "Multiplication" },
    shattered: { en: "The potion exploded!", fr: "La potion a explosé !" },
    unstable: { en: "Unstable! Potency reduced.", fr: "Instable ! Puissance réduite." },
  },
  auth: {
    username: { en: "Username or Email", fr: "Nom ou Email" },
    email: { en: "Email", fr: "Email" },
    password: { en: "Password", fr: "Code Secret" },
    enterRealm: { en: "Enter Realm", fr: "Entrer au Royaume" },
    createProfile: { en: "Create Profile", fr: "Créer un Profil" },
    playGuest: { en: "Play as Guest", fr: "Jouer en Invité" },
    guestWarning: { en: "(Progress will not be saved)", fr: "(Progression non sauvegardée)" },
    createNew: { en: "Create New Profile", fr: "Créer un Nouveau Profil" },
    backLogin: { en: "Back to Login", fr: "Retour Connexion" },
    secure: { en: "Secure Local Storage System", fr: "Système de Stockage Local Sécurisé" },
    welcome: { en: "Enter the realm of numbers", fr: "Entrez dans le royaume des nombres" },
    storageMode: { en: "Storage Mode", fr: "Mode de Stockage" },
    cloud: { en: "Cloud (Global)", fr: "Cloud (Global)" },
    local: { en: "Local (Device)", fr: "Local (Appareil)" },
    placeholders: {
      hero: { en: "Hero Name or Email", fr: "Nom ou Email" },
      email: { en: "name@example.com", fr: "nom@exemple.com" },
      code: { en: "Secret Code", fr: "Code Secret" }
    }
  },
  profile: {
    save: { en: "Save", fr: "Sauvegarder" },
    heroName: { en: "Hero Name", fr: "Nom du Héros" },
    photoUrl: { en: "Photo URL", fr: "URL de la Photo" },
    companions: { en: "Companions", fr: "Compagnons" },
    empty: { en: "Empty.", fr: "Vide." },
    effects: { en: "Effects", fr: "Effets" },
    noEffects: { en: "No Magical Properties", fr: "Aucune Propriété Magique" },
    clickDetails: { en: "Click to view details", fr: "Cliquez pour voir les détails" },
    activeCompanion: { en: "Active Companion", fr: "Compagnon Actif" },
    agility: { en: "Agility", fr: "Agilité" },
    blackMirror: { en: "Black Mirror of Dee", fr: "Miroir Noir de Dee" },
    meltingMode: { en: "MELTING MODE", fr: "MODE FUSION" },
    meltConfirm: { en: "Melt this item for {amount} Nems?", fr: "Fondre cet objet pour {amount} Nems ?" },
  },
  bonuses: {
    xp: { en: "+{value}% XP Gain", fr: "+{value}% Gain d'XP" },
    gold: { en: "+{value}% Gold Gain", fr: "+{value}% Gain d'Or" },
    movement: { en: "+{value}% Travel Speed", fr: "+{value}% Vitesse de Voyage" },
    combat: { en: "+{value}% Attack Power", fr: "+{value}% Puissance d'Attaque" },
    defense: { en: "+{value} Defense", fr: "+{value} Défense" },
    none: { en: "No active magical effects.", fr: "Aucun effet magique actif." },
  },
  equipment: {
    title: { en: "Active Equipment", fr: "Équipement Actif" },
    backpack: { en: "Backpack", fr: "Sac à Dos" },
    dragHint: { en: "Drag items to slots to activate bonuses", fr: "Glissez les objets dans les emplacements pour activer les bonus" },
    locked: { en: "Locked", fr: "Verrouillé" },
    reqLevel: { en: "Requires Level", fr: "Niveau Requis" },
  },
  stats: {
    vitalStats: { en: "Vital Statistics", fr: "Statistiques Vitales" },
    totalXp: { en: "Total XP:", fr: "XP Total :" },
    nextLevel: { en: "to next level", fr: "au prochain niveau" },
    defense: { en: "Defense", fr: "Défense" },
    activeEffects: { en: "Active Effects", fr: "Effets Actifs" },
    travelAlone: { en: "You travel alone...", fr: "Vous voyagez seul..." },
  },
  options: {
    gameplayTab: { en: "Gameplay & Difficulty", fr: "Jeu & Difficulté" },
    dataTab: { en: "Storage & Data", fr: "Stockage & Données" },
  },
  levelUp: {
    title: { en: "Level Up!", fr: "Niveau Supérieur !" },
    action: { en: "Awesome!", fr: "Génial !" },
    message: { en: "You have reached Level {level}!", fr: "Vous avez atteint le niveau {level} !" },
    statHp: { en: "+10 Max HP", fr: "+10 PV Max" },
    statAttack: { en: "+1 Attack Power", fr: "+1 Puissance d'Attaque" },
    statAgility: { en: "+1 Agility", fr: "+1 Agilité" },
    statDefense: { en: "+1 Defense", fr: "+1 Défense" },
  }
};

const extract = (source: any, lang: 'en' | 'fr'): any => {
  if (typeof source !== 'object' || source === null) {
    return source;
  }
  if ('en' in source && 'fr' in source) {
    return source[lang];
  }
  const result: any = {};
  for (const key in source) {
    result[key] = extract(source[key], lang);
  }
  return result;
};

export const getTranslation = (lang: 'en' | 'fr'): Translation => {
  return extract(UI_SOURCE, lang);
};