
import React, { useState } from 'react';
import { GameView, PlayerStats, Tome, Encounter, GameConfig, Item } from '../types';
import PlayerStatsWidget from '../components/PlayerStatsWidget';
import ActiveQuestPanel from '../components/ActiveQuestPanel';
import GameMenu from '../components/GameMenu';
import PlayerProfileModal from '../components/PlayerProfileModal';
import { Settings, BookOpen, ShieldCheck, Footprints } from 'lucide-react';
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
  onToggleLang: () => void;
  activeConfig: GameConfig;
  onStartRecherche: (cost: number) => void;
  isAdmin: boolean;
  onLogout: () => void;
  onUpdateInventory: (inventory: Item[], equipped: Item[]) => void;
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
  onToggleLang, 
  activeConfig, 
  onStartRecherche, 
  isAdmin, 
  onLogout, 
  onUpdateInventory
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { t } = useLocalization();

  const canMove = isInfinite || !activeEncounter;
  const canCombat = isInfinite || !!activeEncounter; 

  const rechercheCost = activeConfig.recherche.baseCost + (player.researchPlayCount * activeConfig.recherche.costIncrement);
  const canAffordRecherche = player.gold >= rechercheCost;

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="flex flex-col md:flex-row h-full w-full">
        
        <div className="hidden md:block h-full z-20 flex-shrink-0">
           <PlayerStatsWidget 
              player={player} 
              onExpand={() => { playMenuOpenSound(); setIsProfileOpen(true); }} 
              onLogout={onLogout}
           />
        </div>

        <div className="flex-1 flex flex-col items-center relative overflow-y-auto custom-scrollbar">
          
          <button 
            onClick={() => { playMenuOpenSound(); setIsProfileOpen(true); }}
            className="md:hidden absolute top-6 left-6 p-3 bg-parchment-800 rounded-full border-2 border-parchment-600 shadow-lg z-30"
          >
            <Footprints className="w-6 h-6 text-parchment-200" />
          </button>

          <div className="absolute top-6 right-6 flex flex-col items-end space-y-4 z-30">
             <div className="flex space-x-4">
                  <button 
                      onClick={() => { playMenuOpenSound(); onOpenTomes(); }}
                      className="p-3 bg-amber-800 rounded-full hover:bg-amber-700 transition-all shadow-lg border-2 border-amber-600 group"
                      title={t.buttons.select}
                      >
                      <BookOpen className="w-8 h-8 text-parchment-200 group-hover:scale-110 transition-transform" />
                  </button>
                  <button 
                      onClick={() => { playMenuOpenSound(); onViewChange(GameView.OPTIONS); }}
                      className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 hover:rotate-90 transition-all shadow-lg border-2 border-parchment-600"
                      title={t.titles.options}
                      >
                      <Settings className="w-8 h-8 text-parchment-200" />
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

          <div className="absolute bottom-6 right-6 z-30">
            <button 
              onClick={onToggleLang}
              className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 font-bold font-serif w-12 h-12 flex items-center justify-center text-lg"
              title="Switch Language"
            >
              {lang.toUpperCase()}
            </button>
          </div>
         
          <div className="text-center mt-4 pt-16 flex-shrink-0 z-10 w-full">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-parchment-200 to-amber-500 mb-4 drop-shadow-md">
              {t.titles.home}
            </h1>
            <p className="text-2xl text-parchment-400 tracking-widest font-serif uppercase">{t.home.subtitle}</p>
          </div>

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
        onUpdateProfile={onUpdatePlayerProfile}
        onUpdateInventory={onUpdateInventory}
      />
    </div>
  );
};

export default Home;
