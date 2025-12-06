
import React from 'react';
import { Item, Rarity } from '../types';
import { RARITY_COLORS, RARITY_TEXT_COLORS } from '../constants';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { Gift, Sparkles, Coins, Star, Footprints, Sword, AlertTriangle } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound } from '../services/audioService';

interface LootRewardCardProps {
  item: Item | null;
  xpReward: number;
  onBack: () => void;
  solvedCorrectly: boolean;
}

const LootRewardCard: React.FC<LootRewardCardProps> = ({ item, xpReward, onBack, solvedCorrectly }) => {
  const { t, lang } = useLocalization();

  const getItemName = (itm: Item) => (lang === 'fr' && itm.name_fr) ? itm.name_fr : itm.name;
  const getItemDesc = (itm: Item) => (lang === 'fr' && itm.description_fr) ? itm.description_fr : itm.description;

  const getEffectIcon = (type: any) => {
    if (type === 'XP_MULTIPLIER') return <Star className="w-4 h-4 text-yellow-400" />;
    if (type === 'GOLD_MULTIPLIER') return <Coins className="w-4 h-4 text-amber-400" />;
    if (type === 'MOVEMENT_BONUS') return <Footprints className="w-4 h-4 text-green-400" />;
    if (type === 'COMBAT_SCORE_BONUS') return <Sword className="w-4 h-4 text-red-400" />;
    return <Sparkles className="w-4 h-4 text-purple-400" />;
  };

  const getCardStyle = (rarity: Rarity) => {
      switch(rarity) {
          case Rarity.MYTHIC:
              return "bg-slate-900 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.6)]";
          case Rarity.LEGENDARY:
              return "bg-slate-900 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.5)]";
          case Rarity.MAGIC:
              return "bg-slate-900 border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]";
          case Rarity.RARE:
              return "bg-slate-900 border-green-600 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
          default:
              return "bg-slate-800 border-gray-400 shadow-xl";
      }
  };

  const getRarityPillStyle = (rarity: Rarity) => {
     const colorString = RARITY_COLORS[rarity];
     if (!colorString) {
         return { color: 'inherit', borderColor: 'currentColor' };
     }
     
     const bgClass = colorString.split(' ')[0] || '';
     const isGray = bgClass === 'bg-gray-500' || bgClass.includes('gray');
     
     return {
        color: isGray ? '#d1d5db' : 'inherit',
        borderColor: 'currentColor'
     };
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 animate-fadeIn">
        {/* Card Container - Fixed size close to a large playing card (e.g. Tarot) for readability */}
        <div className={`
           w-[300px] h-[450px] relative rounded-xl border-[6px] flex flex-col overflow-hidden shadow-2xl transition-all duration-500
           ${solvedCorrectly && item ? getCardStyle(item.rarity) : 'bg-red-950 border-red-600 text-white'}
        `}>
          {solvedCorrectly && item ? (
            <>
               {/* 1. Image Frame - Top 1/3 of the card */}
               <div className="w-full h-[33%] bg-black/50 relative border-b-2 border-inherit flex items-center justify-center overflow-hidden">
                  
                  {/* Rarity Label */}
                  <div 
                    className="absolute top-2 right-2 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest z-20 border shadow-sm backdrop-blur-sm" 
                    style={getRarityPillStyle(item.rarity)}
                  >
                      <span className={RARITY_TEXT_COLORS[item.rarity]}>{item.rarity}</span>
                  </div>

                  {item.image ? (
                      <img src={item.image} alt={getItemName(item)} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  ) : (
                      <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Gift className={`w-16 h-16 ${RARITY_TEXT_COLORS[item.rarity]} drop-shadow-md`} />
                      </div>
                  )}
               </div>

               {/* 2. Content Body */}
               <div className="flex-1 flex flex-col p-4 bg-gradient-to-b from-black/20 to-black/60 relative">
                  
                  <h3 className={`text-xl font-serif font-bold mb-2 text-center leading-tight ${RARITY_TEXT_COLORS[item.rarity]} drop-shadow-sm`}>
                    {getItemName(item)}
                  </h3>
                  
                  <div className="w-full h-px bg-white/10 mb-3"></div>

                  <p className="text-parchment-200 text-xs italic text-center mb-4 leading-relaxed line-clamp-3">
                    "{getItemDesc(item)}"
                  </p>

                  {/* Effects Section */}
                  <div className="mt-auto w-full overflow-y-auto custom-scrollbar pr-1" style={{ maxHeight: '140px' }}>
                    {item.tags && item.tags.length > 0 ? (
                      <div className="space-y-3">
                        {item.tags.map(tag => {
                          const effect = STATUS_EFFECTS[tag];
                          if (!effect) return null;
                          const effectName = (lang === 'fr' && effect.name_fr) ? effect.name_fr : effect.name;
                          const effectDesc = (lang === 'fr' && effect.description_fr) ? effect.description_fr : effect.description;

                          return (
                            <div key={tag} className="flex flex-col text-left">
                               <div className="flex items-center mb-1">
                                   <div className="mr-2 opacity-90">
                                       {getEffectIcon(effect.type)}
                                   </div>
                                   <div className="text-xs font-bold text-parchment-100 uppercase tracking-wide">
                                       {effectName}
                                   </div>
                               </div>
                               <div className="ml-6 text-[10px] text-parchment-400 italic leading-tight">
                                   {effectDesc}
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                       <div className="text-center text-[10px] text-gray-500 mt-2 uppercase tracking-widest opacity-50">No Effects</div>
                    )}
                  </div>
               </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
               <AlertTriangle className="w-16 h-16 text-red-500 mb-6 animate-pulse" />
               <h2 className="text-2xl font-serif font-bold mb-3">{t.combat.defeat}</h2>
               <p className="text-red-200 text-sm leading-relaxed">The ancient lock remains sealed.</p>
            </div>
          )}
        </div>

        {/* External Back Button */}
        <button 
            onClick={() => { playMenuBackSound(); onBack(); }}
            className="mt-6 px-8 py-3 bg-parchment-100 text-parchment-900 font-serif font-bold rounded shadow-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 border-2 border-parchment-400 flex items-center"
        >
            {t.buttons.back}
        </button>
    </div>
  );
};

export default LootRewardCard;
