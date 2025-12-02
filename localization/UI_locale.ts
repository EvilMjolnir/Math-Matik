
import { Translation } from './types';

export const UI_SOURCE = {
  titles: {
    movement: { en: "Movement", fr: "Mouvement" },
    combat: { en: "Combat", fr: "Combat" },
    recherche: { en: "Research", fr: "Recherche" },
    options: { en: "Grimoire of Settings", fr: "Grimoire des Paramètres" },
    home: { en: "Math et Matik", fr: "Math et Matik" },
    profile: { en: "Hero Profile", fr: "Profil du Héros" },
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
  },
  combat: {
    target: { en: "Target", fr: "Cible" },
    score: { en: "Score", fr: "Score" },
    time: { en: "Time", fr: "Temps" },
    battleReport: { en: "Battle Report", fr: "Rapport de Bataille" },
    finalScore: { en: "Final Score", fr: "Score Final" },
    victory: { en: "Victory!", fr: "Victoire !" },
    defeat: { en: "Defeat", fr: "Défaite" },
    threshold: { en: "Goal", fr: "Objectif" },
    hpLost: { en: "HP Lost", fr: "PV Perdus" },
    encounterStart: { en: "Enemy Approaches!", fr: "Un Ennemi Approche !" },
  },
  movement: {
    steps: { en: "Steps Taken", fr: "Pas Effectués" },
    pathCompleted: { en: "Path Completed", fr: "Chemin Parcouru" },
  },
  common: {
    xp: { en: "XP", fr: "XP" },
    hp: { en: "HP", fr: "PV" },
    gold: { en: "Gold", fr: "Or" },
    level: { en: "Lvl", fr: "Niv" },
    loading: { en: "Loading...", fr: "Chargement..." },
    cost: { en: "Cost", fr: "Coût" },
    notEnoughGold: { en: "Not enough Gold", fr: "Pas assez d'or" },
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
  },
  recherche: {
    exitWarning: { en: "You have paid the entry fee. If you leave now, your gold will be lost. Are you sure?", fr: "Vous avez payé les frais d'entrée. Si vous partez maintenant, votre or sera perdu. Êtes-vous sûr ?" },
    entryFee: { en: "Entry Fee", fr: "Frais d'entrée" },
  },
  auth: {
    username: { en: "Username", fr: "Nom" },
    password: { en: "Password", fr: "Code Secret" },
    enterRealm: { en: "Enter Realm", fr: "Entrer au Royaume" },
    createProfile: { en: "Create Profile", fr: "Créer un Profil" },
    playGuest: { en: "Play as Guest", fr: "Jouer en Invité" },
    guestWarning: { en: "(Progress will not be saved)", fr: "(Progression non sauvegardée)" },
    createNew: { en: "Create New Profile", fr: "Créer un Nouveau Profil" },
    backLogin: { en: "Back to Login", fr: "Retour Connexion" },
    secure: { en: "Secure Local Storage System", fr: "Système de Stockage Local Sécurisé" },
    welcome: { en: "Enter the realm of numbers", fr: "Entrez dans le royaume des nombres" },
    placeholders: {
      hero: { en: "Hero Name", fr: "Nom du Personnage" },
      code: { en: "Secret Code", fr: "Code Secret" }
    }
  }
};

export const getTranslation = (lang: 'en' | 'fr'): Translation => {
  return {
    titles: {
      movement: UI_SOURCE.titles.movement[lang],
      combat: UI_SOURCE.titles.combat[lang],
      recherche: UI_SOURCE.titles.recherche[lang],
      options: UI_SOURCE.titles.options[lang],
      home: UI_SOURCE.titles.home[lang],
      profile: UI_SOURCE.titles.profile[lang],
    },
    buttons: {
      back: UI_SOURCE.buttons.back[lang],
      close: UI_SOURCE.buttons.close[lang],
      select: UI_SOURCE.buttons.select[lang],
      details: UI_SOURCE.buttons.details[lang],
      returnCamp: UI_SOURCE.buttons.returnCamp[lang],
      playFor: UI_SOURCE.buttons.playFor[lang],
      confirmLeave: UI_SOURCE.buttons.confirmLeave[lang],
      stay: UI_SOURCE.buttons.stay[lang],
    },
    combat: {
      target: UI_SOURCE.combat.target[lang],
      score: UI_SOURCE.combat.score[lang],
      time: UI_SOURCE.combat.time[lang],
      battleReport: UI_SOURCE.combat.battleReport[lang],
      finalScore: UI_SOURCE.combat.finalScore[lang],
      victory: UI_SOURCE.combat.victory[lang],
      defeat: UI_SOURCE.combat.defeat[lang],
      threshold: UI_SOURCE.combat.threshold[lang],
      hpLost: UI_SOURCE.combat.hpLost[lang],
      encounterStart: UI_SOURCE.combat.encounterStart[lang],
    },
    movement: {
      steps: UI_SOURCE.movement.steps[lang],
      pathCompleted: UI_SOURCE.movement.pathCompleted[lang],
    },
    common: {
      xp: UI_SOURCE.common.xp[lang],
      hp: UI_SOURCE.common.hp[lang],
      gold: UI_SOURCE.common.gold[lang],
      level: UI_SOURCE.common.level[lang],
      loading: UI_SOURCE.common.loading[lang],
      cost: UI_SOURCE.common.cost[lang],
      notEnoughGold: UI_SOURCE.common.notEnoughGold[lang],
      reward: UI_SOURCE.common.reward[lang],
    },
    home: {
      subtitle: UI_SOURCE.home.subtitle[lang],
      currentQuest: UI_SOURCE.home.currentQuest[lang],
      infiniteMode: UI_SOURCE.home.infiniteMode[lang],
      infiniteDesc: UI_SOURCE.home.infiniteDesc[lang],
      selectChallenge: UI_SOURCE.home.selectChallenge[lang],
      encounterActive: UI_SOURCE.home.encounterActive[lang],
      encounterDesc: UI_SOURCE.home.encounterDesc[lang],
    },
    recherche: {
      exitWarning: UI_SOURCE.recherche.exitWarning[lang],
      entryFee: UI_SOURCE.recherche.entryFee[lang],
    },
    auth: {
      username: UI_SOURCE.auth.username[lang],
      password: UI_SOURCE.auth.password[lang],
      enterRealm: UI_SOURCE.auth.enterRealm[lang],
      createProfile: UI_SOURCE.auth.createProfile[lang],
      playGuest: UI_SOURCE.auth.playGuest[lang],
      guestWarning: UI_SOURCE.auth.guestWarning[lang],
      createNew: UI_SOURCE.auth.createNew[lang],
      backLogin: UI_SOURCE.auth.backLogin[lang],
      secure: UI_SOURCE.auth.secure[lang],
      welcome: UI_SOURCE.auth.welcome[lang],
      placeholders: {
        hero: UI_SOURCE.auth.placeholders.hero[lang],
        code: UI_SOURCE.auth.placeholders.code[lang],
      }
    }
  };
};
