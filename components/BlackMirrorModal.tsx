
import React, { useState } from 'react';
import { PlayerStats, Item } from '../types';
import { RARITY_TEXT_COLORS } from '../constants';
import { X, Flame, Sigma, Backpack, Check, AlertTriangle } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound, playMeltingSound } from '../services/audioService';

interface BlackMirrorModalProps {
  player: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<PlayerStats>) => void;
  onUpdateInventory: (inventory: Item[], equipped: Item[]) => void;
}

const BlackMirrorModal: React.FC<BlackMirrorModalProps> = ({ 
  player, 
  isOpen, 
  onClose, 
  onUpdateProfile, 
  onUpdateInventory 
}) => {
  const { t, lang } = useLocalization();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [isConfirming, setIsConfirming] = useState(false);

  if (!isOpen) return null;

  const getNemsValue = (rarity: string) => {
      switch(rarity) {
          case 'Common': return 1;
          case 'Rare': return 2;
          case 'Magic': return 2;
          case 'Legendary': return 4;
          case 'Mythic': return 5;
          default: return 1;
      }
  };

  const getItemName = (item: Item) => (lang === 'fr' && item.name_fr) ? item.name_fr : item.name;

  const handleItemClick = (index: number) => {
      // Reset confirmation state if selection changes
      setIsConfirming(false);
      
      setSelectedIndices(prev => {
          if (prev.includes(index)) {
              return prev.filter(i => i !== index);
          } else {
              return [...prev, index];
          }
      });
  };

  const handleMelt = () => {
      if (selectedIndices.length === 0) return;

      // 1st Click: Enter confirmation state
      if (!isConfirming) {
          setIsConfirming(true);
          return;
      }

      // 2nd Click: Execute Logic
      let totalValue = 0;
      selectedIndices.forEach(idx => {
          if (player.inventory && player.inventory[idx]) {
              totalValue += getNemsValue(player.inventory[idx].rarity);
          }
      });

      playMeltingSound(); 
      
      // Filter out melted items
      const newInv = (player.inventory || []).filter((_, idx) => !selectedIndices.includes(idx));
      
      // Add Nems
      const currentNems = player.nums || 0;
      
      // Update State
      onUpdateProfile({ nums: currentNems + totalValue });
      onUpdateInventory(newInv, player.equipped || []);
      
      // Cleanup
      setSelectedIndices([]);
      setIsConfirming(false);
  };

  const handleClose = () => {
      playMenuBackSound();
      setSelectedIndices([]);
      setIsConfirming(false);
      onClose();
  };

  const totalSelectedValue = selectedIndices.reduce((acc, idx) => {
      const item = player.inventory[idx];
      return acc + (item ? getNemsValue(item.rarity) : 0);
  }, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-xl shadow-[0_0_50px_rgba(147,51,234,0.3)] border-4 border-purple-900 flex flex-col max-h-[90vh] overflow-hidden text-slate-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-purple-800 bg-slate-950">
          <div className="flex items-center">
             <div className="p-3 bg-purple-900/50 rounded-full border border-purple-500 mr-4 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                <Flame className="w-8 h-8 text-purple-400 animate-pulse" />
             </div>
             <div>
                 <h2 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                    {t.profile.blackMirror}
                 </h2>
                 <p className="text-purple-400/60 text-sm font-serif italic">The sacrifice of matter yields power.</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex items-center bg-black/50 px-4 py-2 rounded-full border border-purple-800">
                  <Sigma className="w-5 h-5 text-cyan-400 mr-2" />
                  <span className="font-bold text-cyan-100 text-xl">{player.nums}</span>
              </div>
              <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                <X className="w-8 h-8" />
              </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            
            {player.inventory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-600">
                    <Backpack className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-xl font-serif">Your backpack is empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {player.inventory.map((item, idx) => {
                        const isSelected = selectedIndices.includes(idx);
                        const nemsVal = getNemsValue(item.rarity);
                        
                        return (
                            <button
                                key={idx}
                                onClick={() => handleItemClick(idx)}
                                className={`
                                    relative p-3 rounded-lg border-2 flex flex-col items-center transition-all duration-200 group
                                    ${isSelected 
                                        ? 'bg-red-900/30 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)] scale-[1.02]' 
                                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-purple-500/50'
                                    }
                                `}
                            >
                                <div className={`w-16 h-16 mb-3 rounded-md flex items-center justify-center bg-black/40 border border-white/5 relative overflow-hidden`}>
                                    {item.image ? (
                                        <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
                                    ) : (
                                        <Backpack className={`w-8 h-8 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                                    )}
                                    {/* Value Badge */}
                                    <div className="absolute top-1 right-1 bg-black/80 text-[10px] text-cyan-300 px-1.5 rounded border border-cyan-900/50">
                                        +{nemsVal}
                                    </div>
                                </div>

                                <div className={`font-serif font-bold text-sm mb-1 text-center truncate w-full ${RARITY_TEXT_COLORS[item.rarity]}`}>
                                    {getItemName(item)}
                                </div>
                                <div className="text-[10px] text-slate-500 uppercase tracking-widest">{item.rarity}</div>

                                {isSelected && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg pointer-events-none">
                                        <Check className="w-12 h-12 text-red-500 drop-shadow-lg" />
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Footer Action Bar */}
        <div className="p-6 bg-slate-950 border-t border-purple-900 flex justify-between items-center">
            <div className="text-slate-400 text-sm">
                Selected: <span className="text-white font-bold">{selectedIndices.length}</span> items
            </div>

            <button
                onClick={handleMelt}
                disabled={selectedIndices.length === 0}
                className={`
                    px-8 py-3 rounded-lg font-serif font-bold text-lg flex items-center transition-all shadow-lg
                    ${selectedIndices.length > 0 
                        ? (isConfirming 
                            ? 'bg-red-600 text-white hover:bg-red-700 border border-red-500 animate-shake' 
                            : 'bg-gradient-to-r from-red-700 to-orange-700 text-white hover:from-red-600 hover:to-orange-600 border border-orange-500')
                        : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                    }
                `}
            >
                {isConfirming ? (
                    <>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        {t.buttons.confirm}
                    </>
                ) : (
                    <>
                        <Flame className={`w-5 h-5 mr-2 ${selectedIndices.length > 0 ? 'text-yellow-300' : ''}`} />
                        {t.buttons.meltItems} 
                    </>
                )}
                {selectedIndices.length > 0 && <span className="ml-2 bg-black/30 px-2 rounded text-yellow-200">+{totalSelectedValue}</span>}
            </button>
        </div>

      </div>
    </div>
  );
};

export default BlackMirrorModal;
