
import React, { useState } from 'react';
import { GameView, PlayerStats, Tome, Encounter, GameConfig, Item } from '../types';
import PlayerStatsWidget from '../components/PlayerStatsWidget';
import ActiveQuestPanel from '../components/ActiveQuestPanel';
import GameMenu from '../components/GameMenu';
import PlayerProfileModal from '../components/PlayerProfileModal';
import { ShieldCheck, Footprints } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuOpenSound } from '../services/audioService';

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
  onProgressTome: (steps: number) => void;
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
  onProgressTome
}) => {
  // We use this state to track WHICH tab is open. If null, modal is closed.
  const [activeProfileTab, setActiveProfileTab] = useState<'stats' | 'inventory' | 'companions' | null>(null);
  const { t } = useLocalization();

  const canMove = isInfinite || !activeEncounter;
  const canCombat = isInfinite || !!activeEncounter; 

  const rechercheCost = activeConfig.recherche.baseCost + (player.researchPlayCount * activeConfig.recherche.costIncrement);
  const canAffordRecherche = player.gold >= rechercheCost;

  const handleOpenProfile = (tab: 'stats' | 'inventory' | 'companions') => {
    playMenuOpenSound();
    setActiveProfileTab(tab);
  };

  const handleAdminAddSteps = () => {
    if (activeTome && !isInfinite) {
        onProgressTome(5);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="flex flex-col md:flex-row h-full w-full">
        
        <div className="hidden md:block h-full z-20 flex-shrink-0">
           <PlayerStatsWidget 
              player={player} 
              onExpand={() => handleOpenProfile('stats')} 
              onLogout={onLogout}
           />
        </div>

        <div className="flex-1 flex flex-col items-center relative h-full">
          
          {/* Scrollable Main Content */}
          <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center py-12 px-6">
             <div className="w-full max-w-6xl flex flex-col">
                <div className="text-center mt-4 mb-4 flex-shrink-0 z-10 w-full">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-parchment-200 to-amber-500 mb-4 drop-shadow-md">
                    {t.titles.home}
                    </h1>
                    <p className="text-2xl text-parchment-400 tracking-widest font-serif uppercase">{t.home.subtitle}</p>
                </div>

                <div className="relative">
                  <ActiveQuestPanel 
                    activeEncounter={activeEncounter}
                    activeTome={activeTome}
                    t={t}
                    lang={lang}
                  />
                  
                  {isAdmin && activeTome && !isInfinite && !activeEncounter && (
                     <button 
                        onClick={handleAdminAddSteps}
                        className="absolute bottom-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg hover:bg-purple-500 flex items-center z-10"
                        title="Admin: Advance 5 steps"
                     >
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        +5 Steps
                     </button>
                  )}
                </div>

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

          {/* Floating UI Elements (Fixed relative to the flex-1 container) */}
          
          {/* Mobile Profile Toggle (opens Stats by default) */}
          <button 
            onClick={() => handleOpenProfile('stats')}
            className="md:hidden absolute top-6 left-6 p-3 bg-parchment-800 rounded-full border-2 border-parchment-600 shadow-lg z-30"
          >
            <Footprints className="w-6 h-6 text-parchment-200" />
          </button>

          {/* Top Right Controls */}
          <div className="absolute top-6 right-6 flex flex-col items-end space-y-4 z-30">
             <div className="flex space-x-4">
                  <button 
                      onClick={() => { playMenuOpenSound(); onOpenTomes(); }}
                      className="p-3 bg-amber-800 rounded-full hover:bg-amber-700 transition-all shadow-lg border-2 border-amber-600 group"
                      title={t.buttons.select}
                      >
                       <img 
                        src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_tomes.png" 
                        alt="Tomes" 
                        className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
                      />
                  </button>
                  <button 
                      onClick={() => { playMenuOpenSound(); onViewChange(GameView.OPTIONS); }}
                      className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
                      title={t.titles.options}
                      >
                      <img 
                        src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_gear1.png" 
                        alt="Options" 
                        className="w-16 h-16 object-contain group-hover:rotate-90 transition-transform"
                      />
                  </button>
              </div>
              {isAdmin && (
                  <button 
                      onClick={() => { playMenuOpenSound(); onViewChange(GameView.ADMIN); }}
                      className="p-3 bg-purple-900 rounded-full hover:bg-purple-700 transition-all shadow-lg border-2 border-purple-500 animate-pulse"
                      title="Admin Panel"
                  >
                      <ShieldCheck className="w-8 h-8 text-purple-200" />
                  </button>
              )}
          </div>

          {/* Bottom Left Controls (Inventory & Companions) */}
          <div className="absolute bottom-6 left-6 z-30 flex items-end space-x-4">
            <button 
              onClick={() => handleOpenProfile('inventory')}
              className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
              title={t.equipment.title}
            >
              {/* Inventory icon 15% bigger than others (w-12 vs w-10) */}
              <img 
                src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_inventory.png" 
                alt="Inventory" 
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
              />
            </button>
            <button 
              onClick={() => handleOpenProfile('companions')}
              className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
              title="Companions"
            >
              <img 
                src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_friends.png" 
                alt="Friends" 
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>

      <PlayerProfileModal 
        player={player} 
        isOpen={activeProfileTab !== null} 
        initialTab={activeProfileTab || 'stats'}
        onClose={() => setActiveProfileTab(null)}
        onUpdateProfile={onUpdatePlayerProfile}
        onUpdateInventory={onUpdateInventory}
      />
    </div>
  );
};

export default Home;
