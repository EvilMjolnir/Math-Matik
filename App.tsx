
import React, { useState, useEffect } from 'react';
import { GameConfig, GameView, PlayerStats, Tome, Encounter, LootWeight, Item, StorageMode, EffectType, TomeProgress } from './types';
import { DEFAULT_CONFIG, DEFAULT_PLAYER, XP_TABLE, RARITY_WEIGHTS, COMPANION_LEVEL_COSTS } from './constants';
import { ALL_TOMES } from './tomes';
import Movement from './views/Movement';
import Combat from './views/Combat';
import Recherche from './views/Recherche';
import Alchimie from './views/Alchimie';
import Options from './views/Options';
import AdminPanel from './views/AdminPanel';
import Home from './views/Home';
import TomeSelectionModal from './components/TomeSelectionModal';
import LevelUpModal from './components/LevelUpModal';
import AuthScreen from './components/AuthScreen';
import { LocalizationProvider, useLocalization } from './localization';
import * as localStore from './services/storageService';
import * as cloudStore from './services/storageService_Live';
import { getAggregatedStats } from './services/statusService';
import { STATUS_EFFECTS } from './data/statusEffects';
import { playLevelUpSound } from './services/audioService';

const GameContent: React.FC = () => {
  const { t, lang } = useLocalization();
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
  const [pendingLevelUpStats, setPendingLevelUpStats] = useState<Partial<PlayerStats> | null>(null);
  
  const [showTomeModal, setShowTomeModal] = useState(false);
  const [activeEncounter, setActiveEncounter] = useState<Encounter | null>(null);
  
  // New state to hold encounter pending animation
  const [queuedEncounter, setQueuedEncounter] = useState<Encounter | null>(null);

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
      agility: loadedPlayer.agility !== undefined ? loadedPlayer.agility : Math.floor((loadedPlayer.level || 1) / 3), // Backfill agility based on level if missing
      defense: loadedPlayer.defense !== undefined ? loadedPlayer.defense : Math.floor((loadedPlayer.level || 1) / 4), // Backfill defense based on level
      nums: loadedPlayer.nums !== undefined ? loadedPlayer.nums : 0, // Backfill nums
      tomeProgress: loadedPlayer.tomeProgress || {} // Ensure this exists
    };

    // Rehydrate Tomes from Player Data
    if (modernizedPlayer.tomeProgress) {
        const restoredTomes = ALL_TOMES.map(t => {
            const saved = modernizedPlayer.tomeProgress[t.id];
            if (saved) {
                return { 
                    ...t, 
                    currentDistance: saved.currentDistance, 
                    isUnlocked: saved.isUnlocked, 
                    isCompleted: saved.isCompleted 
                };
            }
            return t;
        });
        setTomes(restoredTomes);
    } else {
        // Fallback reset if no progress
        setTomes(JSON.parse(JSON.stringify(ALL_TOMES)));
    }

    setStorageMode(mode);
    setPlayer(modernizedPlayer);
    setIsAuthenticated(true);
  };

  // Sync Tome Changes to Player State for Persistence
  useEffect(() => {
      if(!isAuthenticated) return;

      const currentProgressStr = JSON.stringify(player.tomeProgress || {});
      
      const newProgress: Record<string, TomeProgress> = {};
      tomes.forEach(t => {
          newProgress[t.id] = {
              id: t.id,
              currentDistance: t.currentDistance,
              isUnlocked: t.isUnlocked,
              isCompleted: t.isCompleted
          };
      });
      const newProgressStr = JSON.stringify(newProgress);

      if (currentProgressStr !== newProgressStr) {
          setPlayer(prev => ({
              ...prev,
              tomeProgress: newProgress
          }));
      }
  }, [tomes, isAuthenticated, player.tomeProgress]);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPlayer(JSON.parse(JSON.stringify(DEFAULT_PLAYER)));
    
    // Reset World State to prevent progress bleeding between sessions
    setTomes(JSON.parse(JSON.stringify(ALL_TOMES)));
    setActiveEncounter(null);
    setQueuedEncounter(null);
    
    // Clear animation cache for progress bars
    Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith('quest_progress_')) {
            sessionStorage.removeItem(key);
        }
    });

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
    setQueuedEncounter(null);
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
        // Calculate new stats but do NOT apply them to the player yet.
        // We only update XP so the bar fills up. The rest is pending.
        const levelDiff = newLevel - prev.level;
        const hpIncrease = levelDiff * 10;
        const attackIncrease = levelDiff * 1;
        // Agility increases by 1 every 3 levels (Level 3, 6, 9...)
        const newAgility = Math.floor(newLevel / 3);
        // Defense increases by 1 every 4 levels (Level 4, 8, 12...)
        const newDefense = Math.floor(newLevel / 4);
        
        const newMaxHp = prev.maxHp + hpIncrease;

        const pendingStats = {
          level: newLevel,
          maxHp: newMaxHp,
          currentHp: newMaxHp, // Heal completely on level up
          attack: (prev.attack || 5) + attackIncrease,
          agility: newAgility,
          defense: newDefense
        };

        // Queue the pending stats. Using setTimeout to break out of the reducer render cycle.
        setTimeout(() => setPendingLevelUpStats(pendingStats), 0);

        return { ...prev, currentXp: newXp };
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

  const spendNems = (amount: number) => {
      setPlayer(prev => ({
          ...prev,
          nums: Math.max(0, prev.nums - amount)
      }));
  };
  
  const handleAddItem = (item: Item) => {
      setPlayer(prev => ({
          ...prev,
          inventory: [...(prev.inventory || []), item]
      }));
  };

  const handleLevelUpCompanion = (companionId: string) => {
      setPlayer(prev => {
          if (!prev.companions) return prev;
          
          const compIndex = prev.companions.findIndex(c => c.id === companionId);
          if (compIndex === -1) return prev;
          
          const companion = prev.companions[compIndex];
          const currentLevel = companion.level;
          const cost = COMPANION_LEVEL_COSTS[currentLevel - 1]; // Index 0 is cost for lvl 2
          
          if (!cost || prev.gold < cost) return prev; // Cannot afford or max level

          // Upgrade Logic
          const nextLevel = currentLevel + 1;
          const newTags = (companion.tags || []).map(tag => {
              // Try to find the base ID and increment suffix
              // Assumes tags are like "scholar_1", "fighter_2" etc.
              const match = tag.match(/^([a-z]+)_(\d)$/);
              if (match) {
                  const base = match[1];
                  const newTagId = `${base}_${nextLevel}`;
                  // Only update if the next tag exists in definitions
                  if (STATUS_EFFECTS[newTagId]) {
                      return newTagId;
                  }
              }
              return tag;
          });

          const updatedCompanion = {
              ...companion,
              level: nextLevel,
              tags: newTags
          };

          const newCompanions = [...prev.companions];
          newCompanions[compIndex] = updatedCompanion;

          playLevelUpSound();

          return {
              ...prev,
              gold: prev.gold - cost,
              companions: newCompanions
          };
      });
  };

  // Called when closing the Level Up Modal
  const handleDismissLevelUp = () => {
      setShowLevelUp(false);
      
      // If we have a queued encounter, trigger it now that level up is done
      if (queuedEncounter) {
          setActiveEncounter(queuedEncounter);
          setQueuedEncounter(null);
      }
  };

  const handleBackToHome = () => {
    setCurrentView(GameView.HOME);
  };

  // Helper to consume potion charges after an encounter
  const consumePotions = () => {
      setPlayer(prev => {
          const newEquipped = [...(prev.equipped || [])];
          let updated = false;
          
          for (let i = 0; i < newEquipped.length; i++) {
              const item = newEquipped[i];
              // Check if item exists and has 'uses' (is a potion)
              if (item && typeof item.uses === 'number') {
                  updated = true;
                  const newUses = item.uses - 1;
                  if (newUses <= 0) {
                      newEquipped[i] = undefined as any; // Remove
                  } else {
                      newEquipped[i] = { ...item, uses: newUses };
                  }
              }
          }

          if (updated) {
              return { ...prev, equipped: newEquipped };
          }
          return prev;
      });
  };

  // Triggered manually from Inventory
  const handleConsumeItem = (index: number, source: 'inventory' | 'equipped') => {
      setPlayer(prev => {
          // Identify source array
          const items = source === 'inventory' ? [...(prev.inventory || [])] : [...(prev.equipped || [])];
          const item = items[index];

          if (!item || typeof item.uses !== 'number') return prev;

          // Apply Effects
          let healedAmount = 0;
          if (item.tags) {
              item.tags.forEach(tagId => {
                  const effect = STATUS_EFFECTS[tagId];
                  if (effect && effect.type === EffectType.INSTANT_HEAL) {
                      healedAmount += effect.value;
                  }
              });
          }

          let newHp = prev.currentHp;
          if (healedAmount > 0) {
              newHp = Math.min(prev.maxHp, prev.currentHp + healedAmount);
          }

          // Decrement Uses
          const newUses = item.uses - 1;
          
          if (newUses <= 0) {
              // Remove Item
              if (source === 'inventory') {
                  items.splice(index, 1);
              } else {
                  items[index] = undefined as any;
              }
          } else {
              // Update Item
              items[index] = { ...item, uses: newUses };
          }

          if (source === 'inventory') {
              return { ...prev, inventory: items, currentHp: newHp };
          } else {
              return { ...prev, equipped: items, currentHp: newHp };
          }
      });
  };

  const takeDamage = (amount: number) => {
    setPlayer(prev => {
        const stats = getAggregatedStats(prev);
        // Min damage 1 to prevent invincibility
        const effectiveDamage = Math.max(1, amount - stats.totalDefense);
        return {
            ...prev,
            currentHp: Math.max(0, prev.currentHp - effectiveDamage)
        }
    });
  };

  const handlePlayerDefeat = () => {
      // 1. Calculate Penalty and Update Player
      setPlayer(prev => {
          const goldPenalty = Math.floor(prev.gold * 0.1);
          const newHp = Math.floor(prev.maxHp * 0.5); // Restore to 50%
          
          return {
              ...prev,
              gold: Math.max(0, prev.gold - goldPenalty),
              currentHp: newHp
          };
      });

      // 2. Handle Tome Progress
      if (activeEncounter) {
          setTomes(prevTomes => {
              const newTomes = [...prevTomes];
              const activeIndex = newTomes.findIndex(t => t.id === player.activeTomeId);
              
              if (activeIndex > -1) {
                  const currentTome = newTomes[activeIndex];
                  
                  if (activeEncounter.type === 'boss') {
                      // Boss Defeat: Reset the active tome's progress to 0
                      newTomes[activeIndex] = {
                          ...currentTome,
                          currentDistance: 0
                      };
                  } else {
                      // Normal Defeat: Push back 10 steps (clamped to 0) to prevent skipping
                      newTomes[activeIndex] = {
                          ...currentTome,
                          currentDistance: Math.max(0, currentTome.currentDistance - 10)
                      };
                  }
              }
              return newTomes;
          });
      }

      // 3. Clear Encounter and Return Home
      setActiveEncounter(null);
      setQueuedEncounter(null);
      setCurrentView(GameView.HOME);
  };

  const handleTomeProgress = (baseSteps: number, bypassEncounters: boolean = false) => {
    if (player.activeTomeId === 'infinite') return;

    // Apply Movement Bonuses
    const agilityBonus = (player.agility || 0) * baseSteps;
    const totalBaseSteps = baseSteps + agilityBonus;
    
    const stats = getAggregatedStats(player);
    const steps = bypassEncounters ? baseSteps : Math.floor(totalBaseSteps * stats.movementMultiplier);

    const activeTomeIndex = tomes.findIndex(t => t.id === player.activeTomeId);
    if (activeTomeIndex === -1) return;
    
    const tome = tomes[activeTomeIndex];
    if (tome.isCompleted) return;

    const currentDist = tome.currentDistance;
    const targetDist = currentDist + steps;
    
    let stopDist = targetDist;
    let encounterToTrigger: Encounter | null = null;
    let eventDist = Infinity;

    if (!bypassEncounters) {
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

      // 3. Check for random encounters
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
        // IMPORTANT: We queue the encounter here instead of setting active immediately.
        // This allows the animation to play out first.
        setQueuedEncounter(encounterToTrigger);
    }

    // If progress was made, this counts as a "minigame play" for potion consumption
    if (stopDist > currentDist) {
        consumePotions();
    }
  };

  // Called by Home after animation completes
  const handleAnimationSequenceComplete = () => {
      // 1. PRIORITY: Check for Pending Level Up first
      if (pendingLevelUpStats) {
          // Apply pending stats (Healing and Level Increase happens NOW)
          setPlayer(prev => ({
              ...prev,
              ...pendingLevelUpStats
          }));
          setLeveledUpTo(pendingLevelUpStats.level || (player.level + 1));
          setShowLevelUp(true);
          setPendingLevelUpStats(null);
          // Return immediately. Don't trigger encounter yet.
          // Encounter will be triggered in handleDismissLevelUp
          return;
      }

      // 2. Trigger Encounter if queued (and no level up pending)
      if (queuedEncounter) {
          setActiveEncounter(queuedEncounter);
          setQueuedEncounter(null);
      }
  };

  const handleEncounterComplete = () => {
    consumePotions(); // Consume potion charges after encounter
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
  };

  const handleSelectTome = (id: string) => {
    setPlayer(prev => ({ 
      ...prev, 
      activeTomeId: id,
      researchPlayCount: 0 
    }));
    setActiveEncounter(null); 
    setQueuedEncounter(null);
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
    
    // Merge UI preferences from main config into active config so minigames get it
    // The main config holds the UI prefs (verticalMath)
    return {
      ui: config.ui, // Inherit global UI settings
      movement: { ...DEFAULT_CONFIG.movement, ...tome.config.movement },
      combat: { ...DEFAULT_CONFIG.combat, ...tome.config.combat },
      recherche: { ...DEFAULT_CONFIG.recherche, ...tome.config.recherche },
      alchimie: { ...DEFAULT_CONFIG.alchimie, ...tome.config.alchimie },
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
      onPlayerDefeat: handlePlayerDefeat,
      isAdmin: isAdmin,
      verticalMath: activeConfig.ui.verticalMath, 
      keypadConfig: activeConfig.ui.keypad, // Pass Keypad Config
    };

    switch (currentView) {
      case GameView.MOVEMENT:
        return <Movement config={activeConfig.movement} playerStats={player} {...commonProps} />;
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
      case GameView.ALCHIMIE:
        return (
            <Alchimie 
                config={activeConfig.alchimie}
                onAddItem={handleAddItem}
                playerNems={player.nums}
                onSpendNems={spendNems}
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
                activeConfig={activeConfig}
                onStartRecherche={handleStartRecherche}
                isAdmin={isAdmin}
                onLogout={handleLogout}
                onUpdateInventory={updateInventoryLoadout}
                onProgressTome={handleTomeProgress}
                onConsumeItem={handleConsumeItem}
                onLevelUpCompanion={handleLevelUpCompanion}
                queuedEncounter={queuedEncounter}
                onActivateEncounter={handleAnimationSequenceComplete}
                isLevelUpOpen={showLevelUp}
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

      <LevelUpModal 
        isOpen={showLevelUp} 
        level={leveledUpTo} 
        onClose={handleDismissLevelUp}
        t={t}
      />

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

const App: React.FC = () => {
  return (
    <LocalizationProvider>
      <GameContent />
    </LocalizationProvider>
  );
};

export default App;
