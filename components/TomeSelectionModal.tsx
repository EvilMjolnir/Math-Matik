import React from 'react';
import { Tome } from '../types';
import { Book, Lock, CheckCircle } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuOpenSound, playMenuBackSound } from '../services/audioService';

interface TomeSelectionModalProps {
  tomes: Tome[];
  activeTomeId: string;
  onSelectTome: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const TomeSelectionModal: React.FC<TomeSelectionModalProps> = ({ tomes, activeTomeId, onSelectTome, isOpen, onClose }) => {
  const { lang, t } = useLocalization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-5xl bg-parchment-200 rounded-lg shadow-2xl border-4 border-parchment-800 text-parchment-900 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b-2 border-parchment-400 bg-parchment-300/50 rounded-t-lg">
          <h2 className="text-3xl font-serif font-bold text-parchment-900 flex items-center">
            <Book className="w-8 h-8 mr-3 text-parchment-800" />
            {t.tomes.selectQuest}
          </h2>
          <button onClick={() => { playMenuBackSound(); onClose(); }} className="px-4 py-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-900 font-bold font-serif">
            {t.buttons.close}
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Infinite Mode Sidebar - Temporarily Disabled
          <div className="w-1/4 min-w-[200px] border-r-2 border-parchment-400 bg-parchment-200 p-4 flex flex-col">
            <button
                onClick={() => {
                   playMenuOpenSound();
                   onSelectTome('infinite');
                   onClose();
                }}
                className={`
                  flex flex-col items-center justify-center p-6 rounded-lg border-2 text-center transition-all duration-300 h-full
                  ${activeTomeId === 'infinite'
                    ? 'bg-purple-100 border-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.3)] ring-2 ring-purple-500' 
                    : 'bg-parchment-100 border-parchment-400 hover:border-parchment-600 hover:shadow-lg'
                  }
                `}
              >
                <Infinity className={`w-12 h-12 mb-4 ${activeTomeId === 'infinite' ? 'text-purple-700' : 'text-parchment-700'}`} />
                <h3 className="text-xl font-bold font-serif mb-2">{t.tomes.infiniteMode}</h3>
                <p className="text-sm text-parchment-700">
                  {t.tomes.infiniteDesc}
                </p>
                {activeTomeId === 'infinite' && (
                  <div className="mt-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                     {t.tomes.active}
                   </div>
                )}
            </button>
          </div>
          */}

          {/* Tome Grid */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tomes.map((tome) => {
                const isActive = tome.id === activeTomeId;
                const progressPercent = (tome.currentDistance / tome.totalDistance) * 100;
                const isClickable = tome.isUnlocked && !tome.isCompleted;

                // Localization Logic
                const title = (lang === 'fr' && tome.title_fr) ? tome.title_fr : tome.title;
                const description = (lang === 'fr' && tome.description_fr) ? tome.description_fr : tome.description;

                // Define styling based on state
                let cardStyles = "";
                let textColor = "text-parchment-700";
                let titleColor = "text-parchment-900";
                let progressBarBg = "bg-gray-300";
                let progressBarFill = tome.isCompleted ? 'bg-green-600' : 'bg-blue-600';

                if (!tome.isUnlocked) {
                   // Locked State - Dark contrasting colors
                   cardStyles = "bg-stone-900 border-stone-700 opacity-90 cursor-not-allowed";
                   textColor = "text-stone-500";
                   titleColor = "text-stone-400";
                   progressBarBg = "bg-stone-800";
                   progressBarFill = "bg-stone-700";
                } else if (tome.isCompleted) {
                   // Completed State
                   cardStyles = isActive
                     ? "bg-amber-100 border-amber-600 shadow-sm ring-2 ring-amber-500 cursor-default opacity-90"
                     : "bg-parchment-100 border-parchment-400 cursor-default opacity-75";
                } else if (isActive) {
                   // Active State
                   cardStyles = "bg-amber-100 border-amber-600 shadow-[0_0_15px_rgba(217,119,6,0.3)] ring-2 ring-amber-500";
                } else {
                   // Available State
                   cardStyles = "bg-parchment-100 border-parchment-400 hover:border-parchment-600 hover:shadow-lg";
                }

                return (
                  <button
                    key={tome.id}
                    disabled={!isClickable}
                    onClick={() => {
                      if (isClickable) {
                        playMenuOpenSound();
                        onSelectTome(tome.id);
                        onClose();
                      }
                    }}
                    className={`
                      relative flex flex-col p-6 rounded-lg border-2 text-left transition-all duration-300 h-full
                      ${cardStyles}
                    `}
                  >
                    {!tome.isUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10 rounded-lg">
                        <Lock className="w-12 h-12 text-stone-500" />
                      </div>
                    )}
                    
                    {tome.isCompleted && (
                      <div className="absolute top-4 right-4 z-20">
                        <CheckCircle className="w-6 h-6 text-green-600 bg-white rounded-full" />
                      </div>
                    )}

                    <h3 className={`text-xl font-bold font-serif mb-2 ${titleColor}`}>{title}</h3>
                    <p className={`text-sm mb-4 flex-1 ${textColor}`}>{description}</p>
                    
                    <div className="mt-auto pt-4 w-full">
                      <div className={`flex justify-between text-xs font-bold uppercase mb-1 ${textColor}`}>
                        <span>{t.tomes.progress}</span>
                        <span>{Math.floor(tome.currentDistance)} / {tome.totalDistance} {t.tomes.steps}</span>
                      </div>
                      <div className={`w-full h-3 rounded-full overflow-hidden border border-opacity-30 ${progressBarBg}`}>
                        <div 
                          className={`h-full ${progressBarFill}`} 
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {isActive && (
                      <div className="absolute -top-3 -left-3 bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md border border-amber-800 z-20">
                        {t.tomes.active}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TomeSelectionModal;