
import React, { useState } from 'react';
import { GameView, PlayerStats, Tome, Encounter, GameConfig, Item, HomeLayoutProps } from '../types';
import PlayerProfileModal from '../components/PlayerProfileModal';
import BlackMirrorModal from '../components/BlackMirrorModal';
import { useLocalization } from '../localization';
import { playMenuOpenSound } from '../services/audioService';
import { useDeviceType } from '../hooks/useDeviceType';
import HomeMobile from './HomeMobile';
import HomeTablet from './HomeTablet';
import HomeDesktop from './HomeDesktop';

interface HomeProps {
  onViewChange: (view: GameView) => void;
  player: PlayerStats;
  onUpdatePlayerProfile: (updates: Partial<PlayerStats>) => void;
  onOpenTomes: () => void;
  activeTome?: Tome;
  activeEncounter: Encounter | null;
  isInfinite: boolean;
  lang: string;
  activeConfig: GameConfig;
  onStartRecherche: (cost: number) => void;
  isAdmin: boolean;
  onLogout: () => void;
  onUpdateInventory: (inventory: Item[], equipped: Item[]) => void;
  onProgressTome: (steps: number, bypassEncounters?: boolean) => void;
  onConsumeItem: (index: number, source: 'inventory' | 'equipped') => void;
  onLevelUpCompanion: (id: string) => void;
  queuedEncounter: Encounter | null;
  onActivateEncounter: () => void;
  isLevelUpOpen: boolean;
}

const Home: React.FC<HomeProps> = ({ 
  onViewChange, 
  player, 
  onUpdatePlayerProfile, 
  onOpenTomes, 
  activeTome, 
  activeEncounter, 
  isInfinite, 
  lang, 
  activeConfig, 
  onStartRecherche, 
  isAdmin, 
  onLogout, 
  onUpdateInventory, 
  onProgressTome,
  onConsumeItem,
  onLevelUpCompanion,
  queuedEncounter,
  onActivateEncounter,
  isLevelUpOpen
}) => {
  // We use this state to track WHICH tab is open. If null, modal is closed.
  const [activeProfileTab, setActiveProfileTab] = useState<'stats' | 'inventory' | 'companions' | null>(null);
  
  // Track Black Mirror Modal visibility
  const [showBlackMirror, setShowBlackMirror] = useState(false);

  // Track if the quest bar is currently filling up. If so, we delay the "Encounter" lock.
  const [isPanelAnimating, setIsPanelAnimating] = useState(false);

  const { t } = useLocalization();
  const deviceType = useDeviceType();

  // Effectively hide the encounter from the UI until the animation is done
  const visibleEncounter = isPanelAnimating ? null : activeEncounter;

  const canMove = (isInfinite || !visibleEncounter) && !activeTome?.isCompleted;
  const canCombat = isInfinite || !!visibleEncounter; 

  const rechercheCost = activeConfig.recherche.baseCost + (player.researchPlayCount * activeConfig.recherche.costIncrement);
  const canAffordRecherche = player.gold >= rechercheCost;

  const handleOpenProfile = (tab: 'stats' | 'inventory' | 'companions') => {
    playMenuOpenSound();
    setActiveProfileTab(tab);
  };

  const handleOpenBlackMirror = () => {
      playMenuOpenSound();
      setActiveProfileTab(null); // Close profile
      setShowBlackMirror(true);
  };

  const handleCloseBlackMirror = () => {
      setShowBlackMirror(false);
      setActiveProfileTab('inventory');
  };

  const handleAdminAddSteps = () => {
    if (activeTome && !isInfinite && !isPanelAnimating) {
        onProgressTome(5);
    }
  };

  const handleAdminJumpToBoss = () => {
      if (activeTome && !isInfinite && !isPanelAnimating) {
          // Calculate steps needed to reach (Total Distance - 1)
          // We want to stop just before the end so one move triggers it
          const stepsNeeded = Math.max(0, activeTome.totalDistance - activeTome.currentDistance - 1);
          if (stepsNeeded > 0) {
              onProgressTome(stepsNeeded, true);
          }
      }
  };

  // Called by ActiveQuestPanel when animation finishes
  const handleAnimationComplete = () => {
      // Always signal completion so App can handle any queued events (Level Up, Enounters, etc.)
      onActivateEncounter();
  };

  // Calculate if any blocking modal is open
  const isAnyModalOpen = isLevelUpOpen || activeProfileTab !== null || showBlackMirror;

  const layoutProps: HomeLayoutProps = {
    player,
    activeTome,
    activeEncounter,
    visibleEncounter,
    isInfinite,
    lang,
    t,
    isAdmin,
    canMove,
    canCombat,
    canAffordRecherche,
    rechercheCost,
    isPanelAnimating,
    queuedEncounter,
    isAnimPaused: isAnyModalOpen,
    onAnimationComplete: handleAnimationComplete,
    onViewChange,
    onOpenTomes,
    onStartRecherche,
    onLogout,
    onOpenProfile: handleOpenProfile,
    onOpenBlackMirror: handleOpenBlackMirror,
    onAdminJumpToBoss: handleAdminJumpToBoss,
    onAdminAddSteps: handleAdminAddSteps,
    setIsPanelAnimating
  };

  return (
    <>
      {deviceType === 'mobile' && <HomeMobile {...layoutProps} />}
      {deviceType === 'tablet' && <HomeTablet {...layoutProps} />}
      {deviceType === 'desktop' && <HomeDesktop {...layoutProps} />}

      <PlayerProfileModal 
        player={player} 
        isOpen={activeProfileTab !== null} 
        initialTab={activeProfileTab || 'stats'}
        onClose={() => setActiveProfileTab(null)}
        onUpdateProfile={onUpdatePlayerProfile}
        onUpdateInventory={onUpdateInventory}
        onOpenBlackMirror={handleOpenBlackMirror}
        onConsumeItem={onConsumeItem}
        onLevelUpCompanion={onLevelUpCompanion}
      />

      <BlackMirrorModal
        player={player}
        isOpen={showBlackMirror}
        onClose={handleCloseBlackMirror}
        onUpdateProfile={onUpdatePlayerProfile}
        onUpdateInventory={onUpdateInventory}
      />
    </>
  );
};

export default Home;
