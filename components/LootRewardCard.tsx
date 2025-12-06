import React from 'react';
import { Item, Rarity } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { Gift, Coins, Star, Footprints, Sword, Sparkles, AlertTriangle } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound } from '../services/audioService';

interface LootRewardCardProps {
  item: Item | null;
  onBack: () => void;
  solvedCorrectly: boolean;
}

const RARITY_BG_CLASSES: Record<Rarity, string> = {
  [Rarity.COMMON]: 'bg-slate-900',
  [Rarity.RARE]: 'bg-green-950',
  [Rarity.MAGIC]: 'bg-blue-950',
  [Rarity.LEGENDARY]: 'bg-amber-950',
  [Rarity.MYTHIC]: 'bg-purple-950',
};

const RARITY_BORDER_CLASSES: Record<Rarity, string> = {
  [Rarity.COMMON]: 'border-gray-500',
  [Rarity.RARE]: 'border-green-600',
  [Rarity.MAGIC]: 'border-blue-500',
  [Rarity.LEGENDARY]: 'border-amber-500',
  [Rarity.MYTHIC]: 'border-purple-500',
};

const RARITY_TEXT_CLASSES: Record<Rarity, string> = {
  [Rarity.COMMON]: 'text-gray-300',
  [Rarity.RARE]: 'text-green-400',
  [Rarity.MAGIC]: 'text-blue-400',
  [Rarity.LEGENDARY]: 'text-amber-400',
  [Rarity.MYTHIC]: 'text-purple-400',
};

const LootRewardCard: React.FC<LootRewardCardProps> = ({ item, onBack, solvedCorrectly }) => {
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

  const isHolo = item && (item.rarity === Rarity.LEGENDARY || item.rarity === Rarity.MYTHIC);

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 animate-fadeIn w-full overflow-y-auto custom-scrollbar">

        <div className={`
           relative rounded-xl border-[6px] flex flex-col overflow-hidden shadow-2xl transition-all duration-500
           w-full max-w-[450px] min-h-[650px]
           ${solvedCorrectly && item ? `${RARITY_BG_CLASSES[item.rarity]} ${RARITY_BORDER_CLASSES[item.rarity]}` : 'bg-red-950 border-red-600 text-white'}
        `}>
           {isHolo && (
            <>
              <div className="holo-shine"></div>
              <div className="absolute inset-0 holo-rainbow opacity-40 pointer-events-none z-40"></div>
            </>
          )}

          {solvedCorrectly && item ? (
            <>
               {/* 
                 TOP SECTION: Image Frame (1/2)
               */}
               <div className="h-1/2 w-full flex items-center justify-center p-6 bg-black/20 relative z-10 border-b border-white/10 shrink-0">
                   {/* The Square Frame */}
                   <div className={`aspect-square h-full rounded-lg border-4 bg-black/50 flex items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] ${RARITY_BORDER_CLASSES[item.rarity]}`}>
                        {item.image ? (
                            <img src={item.image} alt={getItemName(item)} className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <Gift className={`w-1/2 h-1/2 ${RARITY_TEXT_CLASSES[item.rarity]}`} />
                        )}
                   </div>

                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-black/60 border border-white/10 text-white shadow backdrop-blur-sm">
                        {item.rarity}
                    </div>
               </div>

               {/* 
                 BOTTOM SECTION: Content (1/2)
               */}
               <div className="flex-1 flex flex-col p-6 relative z-10 overflow-hidden h-1/2">
                  <h3 className={`text-3xl font-serif font-bold mb-3 text-center leading-tight ${RARITY_TEXT_CLASSES[item.rarity]} drop-shadow-md`}>
                    {getItemName(item)}
                  </h3>
                  
                  <div className={`w-16 h-1 mx-auto mb-5 rounded-full opacity-50 bg-white/20`}></div>

                  <p className="text-parchment-200 text-base italic text-center mb-6 leading-relaxed flex-grow overflow-y-auto custom-scrollbar px-2">
                    "{getItemDesc(item)}"
                  </p>

                  <div className="w-full bg-black/30 rounded-lg p-4 border border-white/5 shadow-inner shrink-0">
                    <h4 className="text-xs uppercase font-bold text-gray-400 mb-3 tracking-widest border-b border-white/5 pb-1">
                      Properties
                    </h4>
                    <div className="max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
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
                                    <div className={`text-xs font-bold uppercase tracking-wide ${RARITY_TEXT_CLASSES[item.rarity]}`}>
                                        {effectName}
                                    </div>
                                </div>
                                <div className="ml-6 text-[11px] text-gray-400 italic leading-tight">
                                    {effectDesc}
                                </div>
                                </div>
                            );
                            })}
                        </div>
                        ) : (
                        <div className="text-center text-xs text-gray-600 uppercase tracking-widest py-2">No Magical Properties</div>
                        )}
                    </div>
                  </div>
               </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
               <AlertTriangle className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
               <h2 className="text-3xl font-serif font-bold mb-4">{t.combat.defeat}</h2>
               <p className="text-red-200 text-lg leading-relaxed">The ancient lock remains sealed.</p>
            </div>
          )}
        </div>

        <button 
            onClick={() => { playMenuBackSound(); onBack(); }}
            className="mt-8 px-12 py-4 bg-parchment-200 text-parchment-900 font-serif font-bold rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 border-4 border-parchment-500 flex items-center text-xl"
        >
            {t.buttons.back}
        </button>
    </div>
  );
};

export default LootRewardCard;