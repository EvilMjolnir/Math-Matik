
import React, { useState, useEffect } from 'react';
import { GameConfig, GameView, PlayerStats, Tome, Encounter, LootWeight, Item, StorageMode } from './types';
import { DEFAULT_CONFIG, DEFAULT_PLAYER, XP_TABLE, RARITY_WEIGHTS } from './constants';
import { ALL_TOMES } from './tomes';
import Movement from './views/Movement';
import Combat from './views/Combat';
import Recherche from './views/Recherche';
import Options from './views/Options';
import AdminPanel from './views/AdminPanel';
import Home from './views/Home';
import TomeSelectionModal from './components/TomeSelectionModal';
import Modal from './components/Modal';
import AuthScreen from './components/AuthScreen';
import { LocalizationProvider, useLocalization } from './localization';
import * as localStore from './services/storageService';
import * as cloudStore from './services/storageService_Live';
import { getAggregatedStats } from './services/statusService';

// Wrap the main app logic to provide context
const AppWrapper: React.FC = () => {
  return (
    <LocalizationProvider>
      <App />
    </LocalizationProvider>
  );
};

const App: React.FC = () => {
  const { t, lang, setLang } = useLocalization();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<GameView>(GameView.HOME);
  const [config, setConfig] = useState<GameConfig>(DEFAULT_CONFIG);
  const [storageMode, setStorageMode] = useState<StorageMode>(StorageMode.LOCAL);
  
  // Initialize with a deep copy to avoid mutating the constant
  const [player, setPlayer] = useState<PlayerStats>(JSON.parse(JSON.stringify(DEFAULT_PLAYER)));
  
  const [tomes, setTomes] = useState<Tome[]>(() => JSON.parse(JSON.stringify(ALL_TOMES)));
  const [lootWeights, setLootWeights] = useState<LootWeight[]>(RARITY_WEIGHTS);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [leveledUpTo, setLeveledUpTo] = useState(1);
  const [pendingLevelUp, setPendingLevelUp] = useState<number | null>(null);
  
  const [showTomeModal, setShowTomeModal] = useState(false);
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);

  // Initialize Admin - Check both storages or just current?
  useEffect(() => {
    const initAdmin = async () => {
      // In cloud mode, admin logic is slightly different (created on demand), but we trigger it here
      if (storageMode === StorageMode.CLOUD) {
        await cloudStore.createAdminProfile();
      } else {
        await localStore.createAdminProfile();
      }
    };
    initAdmin();
  }, [storageMode]);

  // Save on every player change
  useEffect(() => {
    if (isAuthenticated && (player.username || player.uid)) {
        const save = async () => {
            if (storageMode === StorageMode.CLOUD) {
                await cloudStore.saveUserProfile(player);
            } else {
                await localStore.saveUserProfile(player);
            }
        };
        save();
    }
  }, [player, isAuthenticated, storageMode]);

  const handleLogin = (loadedPlayer: PlayerStats, mode: StorageMode) => {
    // Ensure new fields exist on loaded data for backward compatibility
    const modernizedPlayer = {
      ...JSON.parse(JSON.stringify(DEFAULT_PLAYER)), // Deep copy default base
      ...loadedPlayer,
      equipped: loadedPlayer.equipped || [],
    };
    setStorageMode(mode);
    setPlayer(modernizedPlayer);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPlayer(JSON.parse(JSON.stringify(DEFAULT_PLAYER)));
    setCurrentView(GameView.HOME);
  };

  const handleStorageSwitch = (mode: StorageMode) => {
    if (isAuthenticated) {
        // If logged in, switching storage should log out as data context changes
        handleLogout();
    }
    setStorageMode(mode);
  };

  const handleDeleteAccount = async () => {
    if (storageMode === StorageMode.CLOUD) {
        if(player.uid) {
            await cloudStore.deleteUser(player.uid);
            handleLogout();
        }
    } else {
        await localStore.deleteUser(player.username);
        handleLogout();
    }
  };

  const handleResetProfile = async () => {
    // Revert stats to default but keep identification fields
    const resetPlayerState: PlayerStats = {
        ...DEFAULT_PLAYER, // Gets standard level 1, empty inventory etc.
        // Keep Identity
        uid: player.uid,
        username: player.username,
        email: player.email,
        password: player.password,
        photoURL: player.photoURL
    };
    
    setPlayer(resetPlayerState);
    
    // Force immediate save
    if (storageMode === StorageMode.CLOUD) {
        await cloudStore.saveUserProfile(resetPlayerState);
    } else {
        await localStore.saveUserProfile(resetPlayerState);
    }

    // Reset view state
    setActiveEncounter(null);
    setTomes(JSON.parse(JSON.stringify(ALL_TOMES))); // Reset tome progress locally
    alert(t.options.dataTab + ": Profile reset successful.");
  };

  const isAdmin = (player.username || '').toLowerCase() === 'gandalf';

  const updatePlayerProfile = (updates: Partial<PlayerStats>) => {
    setPlayer(prev => ({ ...prev, ...updates }));
  };

  const updateInventoryLoadout = (newInventory: Item[], newEquipped: Item[]) => {
      setPlayer(prev => ({
          ...prev,
          inventory: newInventory,
          equipped: newEquipped
      }));
  };

  const addExperience = (amount: number) => {
    setPlayer(prev => {
      // Calculate Bonus from Equipped Items
      const stats = getAggregatedStats(prev);
      const bonusMultiplier = stats.xpMultiplier;
      const finalAmount = Math.floor(amount * bonusMultiplier);

      const newXp = prev.currentXp + finalAmount;
      let newLevel = 1;
      for (let i = 0; i < XP_TABLE.length; i++) {
        if (newXp >= XP_TABLE[i]) {
          newLevel = i + 1;
        } else {
          break;
        }
      }

      if (newLevel > prev.level) {
        // Defer the modal, just set the state for now
        setPendingLevelUp(newLevel);
        const hpIncrease = (newLevel - prev.level) * 5;
        return {
          ...prev,
          currentXp: newXp,
          level: newLevel,
          maxHp: prev.maxHp + hpIncrease,
          currentHp: prev.currentHp + hpIncrease,
        };
      }

      return { ...prev, currentXp: newXp };
    });
  };

  const addGold = (amount: number) => {
    setPlayer(prev => {
       const stats = getAggregatedStats(prev);
       const bonusMultiplier = stats.goldMultiplier;
       const finalAmount = Math.floor(amount * bonusMultiplier);
       return {
        ...prev,
        gold: prev.gold + finalAmount
      };
    });
  };

  const spendGold = (amount: number) => {
    setPlayer(prev => ({
      ...prev,
      gold: Math.max(0, prev.gold - amount),
      researchPlayCount: prev.researchPlayCount + 1
    }));
  };
  
  const handleAddItem = (item: Item) => {
      setPlayer(prev => ({
          ...prev,
          inventory: [...(prev.inventory || []), item]
      }));
  };

  const checkPendingLevelUp = () => {
    if (pendingLevelUp) {
      setLeveledUpTo(pendingLevelUp);
      setShowLevelUp(true);
      setPendingLevelUp(null);
    }
  };

  const handleBackToHome = () => {
    setCurrentView(GameView.HOME);
    checkPendingLevelUp();
  };

  const takeDamage = (amount: number) => {
    setPlayer(prev => ({
        ...prev,
        currentHp: Math.max(0, prev.currentHp - amount)
    }));
  };

  const handleTomeProgress = (baseSteps: number) => {
    if (player.activeTomeId === 'infinite') return;

    // Apply Movement Bonuses
    const stats = getAggregatedStats(player);
    const steps = baseSteps + stats.movementBonus;

    const activeTomeIndex = tomes.findIndex(t => t.id === player.activeTomeId);
    if (activeTomeIndex === -1) return;
    
    const tome = tomes[activeTomeIndex];
    if (tome.isCompleted) return;

    const currentDist = tome.currentDistance;
    const targetDist = currentDist + steps;
    
    let stopDist = targetDist;
    let encounterToTrigger: Encounter | null = null;
    let eventDist = Infinity;

    // 1. Check for Mini-Bosses
    const miniBosses = tome.possibleEncounters.filter(e => e.type === 'miniboss' && e.triggerStep);
    for (const mb of miniBosses) {
        // If we cross the trigger step
        if (mb.triggerStep! > currentDist && mb.triggerStep! <= targetDist) {
            // Find the closest one
            if (mb.triggerStep! < eventDist) {
                eventDist = mb.triggerStep!;
                encounterToTrigger = mb;
            }
        }
    }

    // 2. Check for Boss (End of Tome)
    const isReachingEnd = targetDist >= tome.totalDistance;
    if (isReachingEnd) {
        if (tome.totalDistance < eventDist) {
            eventDist = tome.totalDistance;
            // Look for boss encounter
            const boss = tome.possibleEncounters.find(e => e.type === 'boss');
            if (boss) {
                encounterToTrigger = boss;
            } else {
                // Reaching end with no boss defined
                encounterToTrigger = null; 
            }
        }
    }

    // 3. Check for Random Encounters
    const rate = tome.encounterRate;
    const nextRandomEncounterDist = (Math.floor(currentDist / rate) + 1) * rate;
    
    if (nextRandomEncounterDist <= targetDist && nextRandomEncounterDist < tome.totalDistance) {
        if (nextRandomEncounterDist < eventDist) {
            eventDist = nextRandomEncounterDist;
            
            // Pick a random encounter that is NOT a boss or mini-boss
            const randomPool = tome.possibleEncounters.filter(e => e.type !== 'boss' && e.type !== 'miniboss');
            if (randomPool.length > 0) {
                encounterToTrigger = randomPool[Math.floor(Math.random() * randomPool.length)];
            }
        }
    }

    // Final decision on where to stop
    if (encounterToTrigger && eventDist <= targetDist) {
        stopDist = eventDist;
    } else {
        // No encounter triggered, clamp to totalDistance if reaching end
        if (stopDist > tome.totalDistance) stopDist = tome.totalDistance;
    }

    const isFinished = stopDist >= tome.totalDistance && !encounterToTrigger && !tome.possibleEncounters.some(e => e.type === 'boss');

    // Update State
    const newTomes = [...tomes];
    newTomes[activeTomeIndex] = {
        ...tome,
        currentDistance: stopDist,
        isCompleted: isFinished
    };
    
    // Unlock next tome if finished immediately (no boss case)
    if (isFinished && activeTomeIndex < newTomes.length - 1) {
        newTomes[activeTomeIndex + 1].isUnlocked = true;
    }

    setTomes(newTomes);
    
    if (encounterToTrigger) {
        setActiveEncounter(encounterToTrigger);
    }
  };

  const handleEncounterComplete = () => {
    setActiveEncounter(null);
    setCurrentView(GameView.HOME);

    // Re-check completion status now that encounter is cleared
    const activeTomeIndex = tomes.findIndex(t => t.id === player.activeTomeId);
    if (activeTomeIndex !== -1) {
        const tome = tomes[activeTomeIndex];
        // If we are at the end, mark completed
        if (tome.currentDistance >= tome.totalDistance) {
             const newTomes = [...tomes];
             newTomes[activeTomeIndex].isCompleted = true;
             // Unlock next
             if (activeTomeIndex < newTomes.length - 1) {
                newTomes[activeTomeIndex + 1].isUnlocked = true;
             }
             setTomes(newTomes);
        }
    }
    
    checkPendingLevelUp();
  };

  const handleSelectTome = (id: string) => {
    setPlayer(prev => ({ 
      ...prev, 
      activeTomeId: id,
      researchPlayCount: 0 
    }));
    setActiveEncounter(null); 
  };
  
  const handleTestEncounter = (encounter: Encounter, tomeId: string) => {
    // Switch to the tome of the encounter to ensure configs (boss timer etc) are correct
    setPlayer(prev => ({
        ...prev,
        activeTomeId: tomeId
    }));
    setActiveEncounter(encounter);
    setCurrentView(GameView.COMBAT);
  };

  const getActiveGameConfig = (): GameConfig => {
    if (player.activeTomeId === 'infinite') return config;
    const tome = tomes.find(t => t.id === player.activeTomeId);
    if (!tome || !tome.config) return DEFAULT_CONFIG;
    
    // Explicitly handle boss config merging to ensure strictly typed result
    const defaultBoss = DEFAULT_CONFIG.boss || { timerDuration: 15, actionsPerTurn: 5 };
    const tomeBoss = tome.config.boss || {};
    
    return {
      movement: { ...DEFAULT_CONFIG.movement, ...tome.config.movement },
      combat: { ...DEFAULT_CONFIG.combat, ...tome.config.combat },
      recherche: { ...DEFAULT_CONFIG.recherche, ...tome.config.recherche },
      boss: { ...defaultBoss, ...tomeBoss }
    };
  };

  const activeTome = tomes.find(t => t.id === player.activeTomeId);
  const activeConfig = getActiveGameConfig();

  const handleStartRecherche = (cost: number) => {
    if (player.gold >= cost) {
      spendGold(cost);
      setCurrentView(GameView.RECHERCHE);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen bg-parchment-900 font-sans">
            <AuthScreen 
                onLogin={handleLogin} 
                currentStorageMode={storageMode}
                onSetStorageMode={setStorageMode}
            />
        </div>
    );
  }

  const renderView = () => {
    const commonProps = {
      onBack: handleBackToHome,
      onAddXp: addExperience,
      onProgressTome: handleTomeProgress,
      onTakeDamage: takeDamage,
      onAddGold: addGold,
    };

    switch (currentView) {
      case GameView.MOVEMENT:
        return <Movement config={activeConfig.movement} {...commonProps} />;
      case GameView.COMBAT:
        return (
          <Combat 
            config={activeConfig.combat} 
            bossConfig={activeConfig.boss}
            encounter={activeEncounter || undefined} 
            onEncounterComplete={handleEncounterComplete}
            playerStats={player}
            {...commonProps} 
          />
        );
      case GameView.RECHERCHE:
        return (
          <Recherche 
            config={activeConfig.recherche} 
            playerGold={player.gold}
            playCount={player.researchPlayCount}
            lootWeights={lootWeights}
            onAddItem={handleAddItem}
            {...commonProps} 
          />
        );
      case GameView.OPTIONS:
        return (
          <Options 
            config={config} 
            setConfig={setConfig} 
            onBack={handleBackToHome} 
            isAdmin={isAdmin}
            storageMode={storageMode}
            onStorageModeChange={handleStorageSwitch}
            onDeleteAccount={handleDeleteAccount}
            onResetProfile={handleResetProfile}
          />
        );
      case GameView.ADMIN:
        return (
            <AdminPanel 
                tomes={tomes} 
                setTomes={setTomes} 
                lootWeights={lootWeights}
                setLootWeights={setLootWeights}
                onBack={handleBackToHome} 
                storageMode={storageMode}
                onTestEncounter={handleTestEncounter}
            />
        );
      default:
        return (
            <Home 
                onViewChange={setCurrentView} 
                player={player} 
                onUpdatePlayerProfile={updatePlayerProfile} 
                onOpenTomes={() => setShowTomeModal(true)}
                activeTome={activeTome}
                activeEncounter={activeEncounter}
                isInfinite={player.activeTomeId === 'infinite'}
                lang={lang}
                onToggleLang={() => setLang(lang === 'en' ? 'fr' : 'en')}
                activeConfig={activeConfig}
                onStartRecherche={handleStartRecherche}
                isAdmin={isAdmin}
                onLogout={handleLogout}
                onUpdateInventory={updateInventoryLoadout}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-parchment-900 text-parchment-100 font-sans selection:bg-purple-900 selection:text-white">
      {/* Base Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_nYUJA4pgj1i7RScDCiPZRZxfhYRaoFfI6TJxCzOy38fE-maNimckcWQnZDjPnbpyNF6UWzTHkk4gieQkPWsz82PQlAf8qJciEF_AWxfyGj3e3SblpFKISPMrRUzU8VwZK_wMa_BvCQ/s1600/Tileable+seamless+human+skin+texture+june+2013.jpg')]"></div>
      
      {currentView === GameView.HOME && (
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEguZxCB_ZgeWOwZbDYUIYGWD-jzW-y4X1V_0RXy6fKJdbOOSbAGu7DsGaE2nPXN3aEbD1oVPJsZbjZZE7aIAE7eJ0rzQGoA2ssK8UHkFhqg4y-Pc_PUaBTGnajfBqLNVBX43xORYIh4vQ/s1600/Seamless+white+crease+paper+texture.jpg')] mix-blend-overlay"></div>
      )}

      <main className="relative z-10 h-screen overflow-hidden">
        {renderView()}
      </main>

      <Modal 
        title="Level Up!" 
        actionLabel="Awesome!" 
        onAction={() => setShowLevelUp(false)} 
        isOpen={showLevelUp}
        colorClass="bg-purple-900 border-yellow-500 text-white"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 text-yellow-400 mb-4 animate-spin-slow">⭐</div>
          <p className="text-xl">You have reached Level {leveledUpTo}!</p>
          <p className="mt-2 text-yellow-200">+5 Max HP</p>
          <p className="text-yellow-200">Full Health Restored</p>
        </div>
      </Modal>

      <TomeSelectionModal 
        tomes={tomes} 
        activeTomeId={player.activeTomeId} 
        onSelectTome={handleSelectTome}
        isOpen={showTomeModal} 
        onClose={() => setShowTomeModal(false)} 
      />
    </div>
  );
};

export default AppWrapper;
