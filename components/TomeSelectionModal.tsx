
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

const TOME_BG_IMAGES: Record<string, string> = {
  'tome_1': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome1%28noCharacter%29.png',
  'tome_2': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome2%28noCharacter%29.png',
  'tome_3': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome3%28hood%29.png',
  'tome_4': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome4%28noCharacter%29.png',
  'tome_5': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome5%28noCharacter%29.png',
};

const TomeSelectionModal: React.FC<TomeSelectionModalProps> = ({ tomes, activeTomeId, onSelectTome, isOpen, onClose }) => {
  const { lang, t } = useLocalization();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-parchment-200 rounded-lg shadow-2xl border-4 border-parchment-800 text-parchment-900 flex flex-col max-h-[90vh]">
        
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
          {/* Tome List */}
          <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col space-y-4">
              {tomes.map((tome) => {
                const isActive = tome.id === activeTomeId;
                const progressPercent = (tome.currentDistance / tome.totalDistance) * 100;
                const isClickable = tome.isUnlocked && !tome.isCompleted;
                const bgImage = TOME_BG_IMAGES[tome.id];

                // Localization Logic
                const title = (lang === 'fr' && tome.title_fr) ? tome.title_fr : tome.title;
                const description = (lang === 'fr' && tome.description_fr) ? tome.description_fr : tome.description;

                // Define styling based on state
                let borderStyles = "";
                let overlayClass = "bg-black/70";
                
                if (!tome.isUnlocked) {
                   // Locked State
                   borderStyles = "border-stone-700 opacity-80 cursor-not-allowed grayscale";
                   overlayClass = "bg-black/80";
                } else if (tome.isCompleted) {
                   // Completed State
                   borderStyles = isActive
                     ? "border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)] ring-2 ring-amber-400"
                     : "border-green-800 opacity-90 cursor-default";
                   overlayClass = isActive ? "bg-amber-900/60" : "bg-black/70";
                } else if (isActive) {
                   // Active State
                   borderStyles = "border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)] ring-2 ring-amber-400";
                   overlayClass = "bg-amber-900/50";
                } else {
                   // Available State
                   borderStyles = "border-parchment-600 hover:border-parchment-400 hover:shadow-xl";
                   overlayClass = "bg-black/70 hover:bg-black/60";
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
                      relative flex flex-col p-6 rounded-xl border-[3px] text-left transition-all duration-300 w-full min-h-[160px] overflow-hidden group
                      ${borderStyles}
                    `}
                  >
                    {/* Background Image Layer */}
                    {bgImage && (
                        <div 
                            className="absolute inset-0 bg-cover bg-center z-0 transition-transform duration-1000 group-hover:scale-110"
                            style={{ backgroundImage: `url('${bgImage}')` }}
                        />
                    )}
                    
                    {/* Dark Overlay for Text Readability */}
                    <div className={`absolute inset-0 z-0 transition-colors duration-300 ${overlayClass}`} />

                    {/* Content Layer */}
                    <div className="relative z-10 w-full h-full flex flex-col text-parchment-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className={`text-2xl font-bold font-serif mb-1 text-white drop-shadow-md ${isActive ? 'text-amber-200' : ''}`}>{title}</h3>
                                <p className="text-sm text-parchment-200 max-w-[80%] drop-shadow-sm">{description}</p>
                            </div>
                            
                            {/* Status Icons */}
                            <div className="flex items-center space-x-2">
                                {!tome.isUnlocked && <Lock className="w-8 h-8 text-stone-400" />}
                                {tome.isCompleted && <CheckCircle className="w-8 h-8 text-green-400 bg-black/50 rounded-full" />}
                            </div>
                        </div>
                        
                        <div className="mt-auto pt-6 w-full">
                            <div className="flex justify-between text-xs font-bold uppercase mb-1 text-parchment-300 tracking-wider">
                                <span>{t.tomes.progress}</span>
                                <span>{Math.floor(tome.currentDistance)} / {tome.totalDistance} {t.tomes.steps}</span>
                            </div>
                            <div className="w-full h-3 rounded-full overflow-hidden border border-white/20 bg-black/50">
                                <div 
                                className={`h-full shadow-[0_0_10px_rgba(255,255,255,0.3)] ${tome.isCompleted ? 'bg-green-500' : 'bg-blue-500'}`} 
                                style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        {isActive && (
                            <div className="absolute top-0 left-0 bg-amber-600 text-white text-[10px] font-bold px-3 py-1 rounded-br-lg shadow-md border-r border-b border-amber-400 z-20 uppercase tracking-widest">
                                {t.tomes.active}
                            </div>
                        )}
                    </div>
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
