
import React from 'react';
import { HomeLayoutProps, GameView } from '../types';
import PlayerStatsWidget from '../components/PlayerStatsWidget';
import ActiveQuestPanel from '../components/ActiveQuestPanel';
import GameMenu from '../components/GameMenu';
import { ShieldCheck, FastForward } from 'lucide-react';
import { playMenuOpenSound } from '../services/audioService';

const HomeTablet: React.FC<HomeLayoutProps> = ({
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
  isAnimPaused,
  onAnimationComplete,
  onViewChange,
  onOpenTomes,
  onStartRecherche,
  onLogout,
  onOpenProfile,
  onAdminJumpToBoss,
  onAdminAddSteps,
  setIsPanelAnimating
}) => {
  return (
    <div className="w-full h-full overflow-hidden bg-parchment-900">
      <div 
        className="h-full flex flex-col justify-center"
        style={{ 
            transform: 'scale(0.8)', 
            width: '125%', 
            height: '125%', 
            transformOrigin: 'top left' 
        }}
      >
      <div className="flex flex-row h-full w-full">
        
        {/* Tablet Sidebar */}
        <div className="h-full z-20 flex-shrink-0">
           <PlayerStatsWidget 
              player={player} 
              onExpand={() => onOpenProfile('stats')} 
              onLogout={onLogout}
           />
        </div>

        <div className="flex-1 flex flex-col items-center relative h-full">
          
          {/* Scrollable Main Content */}
          <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center py-10 px-4">
             <div className="w-full max-w-4xl flex flex-col">
                <div className="text-center mt-4 mb-4 flex-shrink-0 z-10 w-full">
                    <h1 className="text-5xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-parchment-200 to-amber-500 mb-4 drop-shadow-md">
                    {t.titles.home}
                    </h1>
                    <p className="text-2xl text-parchment-400 tracking-widest font-serif uppercase">{t.home.subtitle}</p>
                </div>

                <div className="relative">
                  <ActiveQuestPanel 
                    activeEncounter={visibleEncounter}
                    activeTome={activeTome}
                    t={t}
                    lang={lang}
                    onAnimating={setIsPanelAnimating}
                    isPaused={isAnimPaused}
                    onAnimationComplete={onAnimationComplete}
                  />
                  
                  {isAdmin && activeTome && !isInfinite && !activeEncounter && (
                     <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                        <button 
                            onClick={onAdminJumpToBoss}
                            disabled={isPanelAnimating}
                            className={`bg-red-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center transition-opacity ${isPanelAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 cursor-pointer'}`}
                            title="Admin: Jump to Boss"
                        >
                            <FastForward className="w-3 h-3 mr-1" />
                            Boss
                        </button>
                        <button 
                            onClick={onAdminAddSteps}
                            disabled={isPanelAnimating}
                            className={`bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center transition-opacity ${isPanelAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 cursor-pointer'}`}
                            title="Admin: Advance 5 steps"
                        >
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            +5 Steps
                        </button>
                     </div>
                  )}
                </div>

                <GameMenu 
                  t={t}
                  onViewChange={onViewChange}
                  onStartRecherche={onStartRecherche}
                  canMove={canMove}
                  canCombat={canCombat}
                  canAffordRecherche={canAffordRecherche}
                  activeEncounter={!!visibleEncounter}
                  rechercheCost={rechercheCost}
                />
             </div>
          </div>

          {/* Floating UI Elements */}
          
          {/* Top Right Controls */}
          <div className="absolute top-6 right-6 flex flex-col items-end space-y-4 z-30">
             <div className="flex space-x-4">
                  <button 
                      onClick={() => { playMenuOpenSound(); onOpenTomes(); }}
                      className={`
                        p-3 bg-amber-800 rounded-full hover:bg-amber-700 transition-all shadow-lg border-2 border-amber-600 group relative
                        ${activeTome?.isCompleted ? 'animate-pulse ring-4 ring-green-500 ring-opacity-50' : ''}
                      `}
                      title={t.buttons.select}
                      >
                       <img 
                        src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_tomes.png" 
                        alt="Tomes" 
                        className="w-14 h-14 object-contain group-hover:scale-110 transition-transform"
                      />
                      {activeTome?.isCompleted && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-red-800 shadow-md whitespace-nowrap">
                              NEW
                          </div>
                      )}
                  </button>
                  <button 
                      onClick={() => { playMenuOpenSound(); onViewChange(GameView.OPTIONS); }}
                      className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
                      title={t.titles.options}
                      >
                      <img 
                        src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_gear1.png" 
                        alt="Options" 
                        className="w-14 h-14 object-contain group-hover:rotate-90 transition-transform"
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
              onClick={() => onOpenProfile('inventory')}
              className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
              title={t.equipment.title}
            >
              <img 
                src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_inventory.png" 
                alt="Inventory" 
                className="w-24 h-24 object-contain group-hover:scale-110 transition-transform"
              />
            </button>
            <button 
              onClick={() => onOpenProfile('companions')}
              className="p-3 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
              title="Companions"
            >
              <img 
                src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_companion.png" 
                alt="Friends" 
                className="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HomeTablet;
