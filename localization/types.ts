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
    alchimie: string;
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
    summon: string;
    dismiss: string;
    melt: string;
    craft: string;
    meltItems: string;
    exitMirror: string;
    confirm: string;
    drink: string;
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
    nums: string;
    level: string;
    loading: string;
    cost: string;
    notEnoughGold: string;
    notEnoughNems: string;
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
    menuDescAlchimie: string;
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
  alchimie: {
    selectMode: string;
    normal: string;
    flip: string;
    pick: string;
    brewing: string;
    solveToCraft: string;
    uses: string;
    potionCreated: string;
    descNormal: string;
    descFlip: string;
    descPick: string;
    draftFlip2: string;
    draftFlip1: string;
    draftPick: string;
    opReduce: string;
    opAdd: string;
    opSub: string;
    opMult: string;
    shattered: string;
    unstable: string;
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
    clickDetails: string;
    activeCompanion: string;
    agility: string;
    blackMirror: string;
    meltingMode: string;
    meltConfirm: string;
  };
  bonuses: {
    xp: string;
    gold: string;
    movement: string;
    combat: string;
    defense: string;
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
    statAgility: string;
    statDefense: string;
  };
}