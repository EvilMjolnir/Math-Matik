

export interface Translation {
  titles: {
    movement: string;
    combat: string;
    recherche: string;
    options: string;
    home: string;
    profile: string;
    scratchpad: string;
    dangerZone: string;
  };
  buttons: {
    back: string;
    close: string;
    select: string;
    details: string;
    returnCamp: string;
    playFor: string;
    confirmLeave: string;
    stay: string;
    clear: string;
    deleteAccount: string;
    resetProfile: string;
  };
  tomes: {
    selectQuest: string;
    infiniteMode: string;
    infiniteDesc: string;
    active: string;
    progress: string;
    steps: string;
    locked: string;
  };
  combat: {
    target: string;
    score: string;
    time: string;
    battleReport: string;
    finalScore: string;
    victory: string;
    defeat: string;
    monsterHP: string;
    hpLost: string;
    encounterStart: string;
    trainingMode: string;
    question: string;
    pendingDamage: string;
    attackPower: string;
    attack: string;
    damageDealt: string;
    tryAgain: string;
    continue: string;
    charge: string;
  };
  movement: {
    steps: string;
    pathCompleted: string;
    title?: string;
  };
  common: {
    xp: string;
    hp: string;
    gold: string;
    level: string;
    loading: string;
    cost: string;
    notEnoughGold: string;
    reward: string;
  };
  home: {
    subtitle: string;
    currentQuest: string;
    infiniteMode: string;
    infiniteDesc: string;
    selectChallenge: string;
    encounterActive: string;
    encounterDesc: string;
    menuDescMovement: string;
    menuDescCombat: string;
    menuDescRecherche: string;
  };
  recherche: {
    exitWarning: string;
    entryFee: string;
    entryFeeTitle: string;
    deciphering: string;
    toUnlock: string;
    lock: string;
    locks: string;
    lockSealed: string;
  };
  auth: {
    username: string;
    password: string;
    enterRealm: string;
    createProfile: string;
    playGuest: string;
    guestWarning: string;
    createNew: string;
    backLogin: string;
    secure: string;
    welcome: string;
    storageMode: string;
    cloud: string;
    local: string;
    placeholders: {
      hero: string;
      code: string;
    }
  };
  profile: {
    save: string;
    heroName: string;
    photoUrl: string;
    companions: string;
    empty: string;
    effects: string;
    noEffects: string;
  };
  bonuses: {
    xp: string;
    gold: string;
    movement: string;
    combat: string;
    none: string;
  };
  equipment: {
    title: string;
    backpack: string;
    dragHint: string;
    locked: string;
    reqLevel: string;
  };
  stats: {
    vitalStats: string;
    totalXp: string;
    nextLevel: string;
    defense: string;
    activeEffects: string;
    travelAlone: string;
  };
  options: {
    gameplayTab: string;
    dataTab: string;
  };
  levelUp: {
    title: string;
    action: string;
    message: string;
    statHp: string;
    statAttack: string;
  };
}