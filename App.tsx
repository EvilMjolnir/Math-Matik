
import React, { useState, useEffect } from 'react';
import { GameConfig, GameView, PlayerStats, Tome, Encounter, LootWeight, Item } from './types';
import { DEFAULT_CONFIG, DEFAULT_PLAYER, XP_TABLE, RARITY_WEIGHTS } from './constants';
import { ALL_TOMES } from './tomes';
import Movement from './views/Movement';
import Combat from './views/Combat';
import Recherche from './views/Recherche';
import Options from './views/Options';
import AdminPanel from './views/AdminPanel';
import PlayerStatsWidget from './components/PlayerStatsWidget';
import PlayerProfileModal from './components/PlayerProfileModal';
import TomeSelectionModal from './components/TomeSelectionModal';
import ActiveQuestPanel from './components/ActiveQuestPanel';
import GameMenu from './components/GameMenu';
import Modal from './components/Modal';
import AuthScreen from './components/AuthScreen';
import { Settings, BookOpen, ShieldCheck, Footprints } from 'lucide-react';
import { LocalizationProvider, useLocalization } from './localization';
import { saveUserProfile, createAdminProfile } from './services/storageService';
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
  const [player, setPlayer] = useState<PlayerStats>(DEFAULT_PLAYER);
  const [tomes, setTomes] = useState<Tome[]>(ALL_TOMES);
  const [lootWeights, setLootWeights] = useState<LootWeight[]>(RARITY_WEIGHTS);
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [leveledUpTo, setLeveledUpTo] = useState(1);
  const [pendingLevelUp, setPendingLevelUp] = useState<number | null>(null);
  
  const [showTomeModal, setShowTomeModal] = useState(false);
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);

  // Initialize Admin
  useEffect(() => {
    createAdminProfile();
  }, []);

  // Save on every player change
  useEffect(() => {
    if (isAuthenticated && player.username) {
        saveUserProfile(player);
    }
  }, [player, isAuthenticated]);

  const handleLogin = (loadedPlayer: PlayerStats) => {
    // Ensure new fields exist on loaded data for backward compatibility
    const modernizedPlayer = {
      ...DEFAULT_PLAYER,
      ...loadedPlayer,
      equipped: loadedPlayer.equipped || [],
    };
    setPlayer(modernizedPlayer);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPlayer(DEFAULT_PLAYER);
    setCurrentView(GameView.HOME);
  };

  const isAdmin = player.username === 'Gandalf' && player.password === 'YouShallNotPass';

  const updatePlayerName = (name: string) => {
    setPlayer(prev => ({ ...prev, username: name }));
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
    let eventType: 'miniboss' | 'boss' | 'random' | 'none' = 'none';
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
                eventType = 'miniboss';
            }
        }
    }

    // 2. Check for Boss (End of Tome)
    const isReachingEnd = targetDist >= tome.totalDistance;
    if (isReachingEnd) {
        // Boss stops us exactly at totalDistance
        // It takes precedence if it happens before or at the same time as other events (since it's the end)
        // But if a mini-boss is BEFORE the end, mini-boss comes first.
        if (tome.totalDistance < eventDist) {
            eventDist = tome.totalDistance;
            // Look for boss encounter
            const boss = tome.possibleEncounters.find(e => e.type === 'boss');
            if (boss) {
                encounterToTrigger = boss;
                eventType = 'boss';
            } else {
                // Reaching end with no boss defined
                encounterToTrigger = null; 
                eventType = 'none'; // Just finish
            }
        }
    }

    // 3. Check for Random Encounters
    // Only if we haven't already found a closer fixed event
    const rate = tome.encounterRate;
    const nextRandomEncounterDist = (Math.floor(currentDist / rate) + 1) * rate;
    
    if (nextRandomEncounterDist <= targetDist && nextRandomEncounterDist < tome.totalDistance) {
        if (nextRandomEncounterDist < eventDist) {
            eventDist = nextRandomEncounterDist;
            
            // Pick a random encounter that is NOT a boss or mini-boss
            const randomPool = tome.possibleEncounters.filter(e => e.type !== 'boss' && e.type !== 'miniboss');
            if (randomPool.length > 0) {
                encounterToTrigger = randomPool[Math.floor(Math.random() * randomPool.length)];
                eventType = 'random';
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
      // Reset research cost counter when switching tomes (optional game design choice, kept persistent per tome for now)
      researchPlayCount: 0 
    }));
    setActiveEncounter(null); // Reset encounter if switching tomes
  };

  const getActiveGameConfig = (): GameConfig => {
    if (player.activeTomeId === 'infinite') return config;
    const tome = tomes.find(t => t.id === player.activeTomeId);
    if (!tome || !tome.config) return DEFAULT_CONFIG;
    return {
      movement: { ...DEFAULT_CONFIG.movement, ...tome.config.movement },
      combat: { ...DEFAULT_CONFIG.combat, ...tome.config.combat },
      recherche: { ...DEFAULT_CONFIG.recherche, ...tome.config.recherche },
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
            <AuthScreen onLogin={handleLogin} />
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
            encounter={activeEncounter || undefined} 
            onEncounterComplete={handleEncounterComplete}
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
        return <Options config={config} setConfig={setConfig} onBack={handleBackToHome} />;
      case GameView.ADMIN:
        return (
            <AdminPanel 
                tomes={tomes} 
                setTomes={setTomes} 
                lootWeights={lootWeights}
                setLootWeights={setLootWeights}
                onBack={handleBackToHome} 
            />
        );
      default:
        return (
            <Home 
                onViewChange={setCurrentView} 
                player={player} 
                onUpdatePlayerName={updatePlayerName} 
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
      {/* Base Texture (Dark Leather) */}
      <div className="fixed inset-0 pointer-events-none opacity-10 bg-[url('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_nYUJA4pgj1i7RScDCiPZRZxfhYRaoFfI6TJxCzOy38fE-maNimckcWQnZDjPnbpyNF6UWzTHkk4gieQkPWsz82PQlAf8qJciEF_AWxfyGj3e3SblpFKISPMrRUzU8VwZK_wMa_BvCQ/s1600/Tileable+seamless+human+skin+texture+june+2013.jpg')]"></div>
      
      {/* Home Specific Texture (Crumpled Paper) */}
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
          {/* Use imported lucide icon if needed or keep existing SVG */}
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

interface HomeProps {
  onViewChange: (view: GameView) => void;
  player: PlayerStats;
  onUpdatePlayerName: (name: string) => void;
  onOpenTomes: () => void;
  activeTome?: Tome;
  activeEncounter: Encounter | null;
  isInfinite: boolean;
  lang: string;
  onToggleLang: () => void;
  activeConfig: GameConfig;
  onStartRecherche: (cost: number) => void;
  isAdmin: boolean;
  onLogout: () => void;
  onUpdateInventory: (inventory: Item[], equipped: Item[]) => void;
}

const Home: React.FC<HomeProps> = ({ 
  onViewChange, player, onUpdatePlayerName, onOpenTomes, activeTome, activeEncounter, isInfinite, lang, onToggleLang, activeConfig, onStartRecherche, isAdmin, onLogout, onUpdateInventory
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useLocalization();

  // Button State Logic
  const canMove = isInfinite || !activeEncounter;
  // Combat is open if Infinite mode OR if there IS an active encounter
  const canCombat = isInfinite || !!activeEncounter; 

  // Recherche Cost logic
  const rechercheCost = activeConfig.recherche.baseCost + (player.researchPlayCount * activeConfig.recherche.costIncrement);
  const canAffordRecherche = player.gold >= rechercheCost;

  return (
    <div className="h-full flex flex-col justify-center">
      {/* Centered layout container - FULL WIDTH */}
      <div className="flex flex-col md:flex-row h-full w-full">
        
        {/* Player Stats - Sidebar on Desktop */}
        <div className="hidden md:block h-full z-20 flex-shrink-0">
           <PlayerStatsWidget 
              player={player} 
              onExpand={() => setIsProfileOpen(true)} 
              onLogout={onLogout}
           />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col items-center relative overflow-y-auto custom-scrollbar">
          
          {/* Mobile Profile Toggle */}
          <button 
            onClick={() => setIsProfileOpen(true)}
            className="md:hidden absolute top-6 left-6 p-3 bg-parchment-800 rounded-full border-2 border-parchment-600 shadow-lg z-30"
          >
            <Footprints className="w-6 h-6 text-parchment-200" />
          </button>

          {/* Top Right Controls */}
          <div className="absolute top-6 right-6 flex flex-col items-end space-y-4 z-30">
             <div className="flex space-x-4">
                  <button 
                      onClick={onOpenTomes}
                      className="p-3 bg-amber-800 rounded-full hover:bg-amber-700 transition-all shadow-lg border-2 border-amber-600 group"
                      title={t.buttons.select}
                      >
                      <BookOpen className="w-8 h-8 text-parchment-200 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                      onClick={() => onViewChange(GameView.OPTIONS)}
                      className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 hover:rotate-90 transition-all shadow-lg border-2 border-parchment-600"
                      title={t.titles.options}
                      >
                      <Settings className="w-8 h-8 text-parchment-200" />
                  </button>
              </div>
              {isAdmin && (
                  <button 
                      onClick={() => onViewChange(GameView.ADMIN)}
                      className="p-3 bg-purple-900 rounded-full hover:bg-purple-700 transition-all shadow-lg border-2 border-purple-500 animate-pulse"
                      title="Admin Panel"
                  >
                      <ShieldCheck className="w-8 h-8 text-purple-200" />
                  </button>
              )}
          </div>

          <div className="absolute bottom-6 right-6 z-30">
            <button 
              onClick={onToggleLang}
              className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 font-bold font-serif w-12 h-12 flex items-center justify-center text-lg"
              title="Switch Language"
            >
              {lang.toUpperCase()}
            </button>
          </div>
         
          {/* Game Title - Anchored Top */}
          <div className="text-center mt-4 pt-16 flex-shrink-0 z-10 w-full">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-parchment-200 to-amber-500 mb-4 drop-shadow-md">
              {t.titles.home}
            </h1>
            <p className="text-2xl text-parchment-400 tracking-widest font-serif uppercase">{t.home.subtitle}</p>
          </div>

          {/* Center Content: Quest & Buttons */}
          <div className="flex-1 flex flex-col justify-center items-center w-full z-10 py-12 px-6">
              <div className="w-full max-w-6xl flex flex-col">
                <ActiveQuestPanel 
                  activeEncounter={activeEncounter}
                  activeTome={activeTome}
                  t={t}
                  lang={lang}
                />

                <GameMenu 
                  t={t}
                  onViewChange={onViewChange}
                  onStartRecherche={onStartRecherche}
                  canMove={canMove}
                  canCombat={canCombat}
                  canAffordRecherche={canAffordRecherche}
                  activeEncounter={!!activeEncounter}
                  rechercheCost={rechercheCost}
                />
              </div>
          </div>
        </div>
      </div>

      <PlayerProfileModal 
        player={player} 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)}
        onUpdateName={onUpdatePlayerName}
        onUpdateInventory={onUpdateInventory}
      />
    </div>
  );
};

export default AppWrapper;
