
import React from 'react';
import { HomeLayoutProps, GameView } from '../types';
import ActiveQuestPanel from '../components/ActiveQuestPanel';
import GameMenu from '../components/GameMenu';
import { ShieldCheck, Footprints, FastForward } from 'lucide-react';
import { playMenuOpenSound } from '../services/audioService';

const HomeMobile: React.FC<HomeLayoutProps> = ({
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
  onOpenProfile,
  onAdminJumpToBoss,
  onAdminAddSteps,
  setIsPanelAnimating
}) => {
  return (
    <div className="h-full flex flex-col items-center relative">
      {/* Mobile-specific: Widget is hidden, accessed via button */}
      
      {/* Scrollable Main Content */}
      <div className="w-full h-full overflow-y-auto custom-scrollbar flex flex-col items-center py-8 px-4 pb-24">
         <div className="w-full max-w-md flex flex-col">
            <div className="text-center mt-2 mb-4 flex-shrink-0 z-10 w-full">
                <h1 className="text-4xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-parchment-200 to-amber-500 mb-2 drop-shadow-md">
                {t.titles.home}
                </h1>
                <p className="text-xl text-parchment-400 tracking-widest font-serif uppercase">{t.home.subtitle}</p>
            </div>

            <div className="relative mb-6">
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
                 <div className="absolute -bottom-10 right-0 flex space-x-2 z-10">
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
      
      {/* Mobile Profile Toggle */}
      <button 
        onClick={() => onOpenProfile('stats')}
        className="absolute top-4 left-4 p-3 bg-parchment-800 rounded-full border-2 border-parchment-600 shadow-lg z-30"
      >
        <Footprints className="w-6 h-6 text-parchment-200" />
      </button>

      {/* Top Right Controls */}
      <div className="absolute top-4 right-4 flex flex-col items-end space-y-4 z-30">
         <div className="flex space-x-2">
              <button 
                  onClick={() => { playMenuOpenSound(); onOpenTomes(); }}
                  className={`
                    p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition-all shadow-lg border-2 border-amber-600 group relative
                    ${activeTome?.isCompleted ? 'animate-pulse ring-4 ring-green-500 ring-opacity-50' : ''}
                  `}
                  title={t.buttons.select}
                  >
                   <img 
                    src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_tomes.png" 
                    alt="Tomes" 
                    className="w-12 h-12 object-contain"
                  />
                  {activeTome?.isCompleted && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full border border-red-800 shadow-md whitespace-nowrap">
                          NEW
                      </div>
                  )}
              </button>
              <button 
                  onClick={() => { playMenuOpenSound(); onViewChange(GameView.OPTIONS); }}
                  className="p-2 bg-parchment-800 rounded-full hover:bg-parchment-700 transition-all shadow-lg border-2 border-parchment-600 group"
                  title={t.titles.options}
                  >
                  <img 
                    src="https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_gear1.png" 
                    alt="Options" 
                    className="w-12 h-12 object-contain"
                  />
              </button>
          </div>
          {isAdmin && (
              <button 
                  onClick={() => { playMenuOpenSound(); onViewChange(GameView.ADMIN); }}
                  className="p-2 bg-purple-900 rounded-full hover:bg-purple-700 transition-all shadow-lg border-2 border-purple-500 animate-pulse"
                  title="Admin Panel"
              >
                  <ShieldCheck className="w-6 h-6 text-purple-200" />
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
            className="w-20 h-20 object-contain"
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
            className="w-16 h-16 object-contain"
          />
        </button>
      </div>
    </div>
  );
};

export default HomeMobile;
