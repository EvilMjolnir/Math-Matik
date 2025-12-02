
export interface Translation {
  titles: {
    movement: string;
    combat: string;
    recherche: string;
    options: string;
    home: string;
    profile: string;
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
  };
  combat: {
    target: string;
    score: string;
    time: string;
    battleReport: string;
    finalScore: string;
    victory: string;
    defeat: string;
    threshold: string;
    hpLost: string;
    encounterStart: string;
  };
  movement: {
    steps: string;
    pathCompleted: string;
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
  };
  recherche: {
    exitWarning: string;
    entryFee: string;
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
    placeholders: {
      hero: string;
      code: string;
    }
  };
}
