import React, { useEffect } from 'react';
import { Item, Rarity } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { Gift, Coins, Star, Footprints, Sword, Sparkles, AlertTriangle, Shield } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound, playItemRevealSound, playEpicRevealSound, playFlipCardSound, fadeOutCurrentSound } from '../services/audioService';

interface LootRewardCardProps {
  item: Item | null;
  onBack: () => void;
  solvedCorrectly: boolean;
  failMessage?: string;
  failImage?: string;
}

const TEXTURE_URL = "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/texture_5.jpg";

// Define specific styles for border (standard) and background (darker tint)
const RARITY_STYLES: Record<Rarity, { border: string; bg: string; text: string }> = {
  [Rarity.COMMON]: { 
    border: '#6b7280', // gray-500
    bg: '#111827',     // gray-900
    text: 'text-gray-300' 
  },
  [Rarity.RARE]: { 
    border: '#16a34a', // green-600
    bg: '#064e3b',     // green-950
    text: 'text-green-400' 
  },
  [Rarity.MAGIC]: { 
    border: '#2563eb', // blue-600
    bg: '#172554',     // blue-950
    text: 'text-blue-400' 
  },
  [Rarity.LEGENDARY]: { 
    border: '#d97706', // amber-600
    bg: '#451a03',     // amber-950
    text: 'text-amber-400' 
  },
  [Rarity.MYTHIC]: { 
    border: '#9333ea', // purple-600
    bg: '#3b0764',     // purple-950
    text: 'text-purple-400' 
  },
};

const LootRewardCard: React.FC<LootRewardCardProps> = ({ item, onBack, solvedCorrectly, failMessage, failImage }) => {
  const { t, lang } = useLocalization();

  // Play flip sound on mount (when card appears)
  useEffect(() => {
    playFlipCardSound();
  }, []);

  useEffect(() => {
    if (solvedCorrectly && item) {
        if (item.rarity === Rarity.LEGENDARY || item.rarity === Rarity.MYTHIC) {
            playEpicRevealSound();
        } else {
            playItemRevealSound();
        }
    }
  }, [solvedCorrectly, item]);

  const handleBack = () => {
      playMenuBackSound();
      fadeOutCurrentSound();
      onBack();
  };

  const getItemName = (itm: Item) => (lang === 'fr' && itm.name_fr) ? itm.name_fr : itm.name;
  const getItemDesc = (itm: Item) => (lang === 'fr' && itm.description_fr) ? itm.description_fr : itm.description;

  const getEffectIcon = (type: any) => {
    if (type === 'XP_MULTIPLIER') return <Star className="w-4 h-4 text-yellow-400" />;
    if (type === 'GOLD_MULTIPLIER') return <Coins className="w-4 h-4 text-amber-400" />;
    if (type === 'MOVEMENT_BONUS') return <Footprints className="w-4 h-4 text-green-400" />;
    if (type === 'COMBAT_SCORE_BONUS') return <Sword className="w-4 h-4 text-red-400" />;
    if (type === 'DEFENSE_BONUS') return <Shield className="w-4 h-4 text-blue-400" />;
    return <Sparkles className="w-4 h-4 text-purple-400" />;
  };

  const isHolo = item && (item.rarity === Rarity.LEGENDARY || item.rarity === Rarity.MYTHIC);
  const showTexture = item && (item.rarity === Rarity.RARE || item.rarity === Rarity.MAGIC);
  
  // Safe access to styles, fallback to Common if rarity matches nothing
  const safeRarity = (item && RARITY_STYLES[item.rarity]) ? item.rarity : Rarity.COMMON;
  const activeStyle = RARITY_STYLES[safeRarity];
  const textColorClass = activeStyle.text;

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 roll-in-blurred-top w-full overflow-y-auto custom-scrollbar">

        <div 
          className="relative rounded-xl border-[6px] flex flex-col overflow-hidden shadow-2xl transition-all duration-500 w-full max-w-[450px] min-h-[650px] text-white"
          style={{
            borderColor: solvedCorrectly && item ? activeStyle.border : '#dc2626',
            backgroundColor: solvedCorrectly && item ? activeStyle.bg : '#450a0a',
          }}
        >
           {isHolo && solvedCorrectly && (
            <>
              <div className="holo-shine"></div>
              <div className="absolute inset-0 holo-rainbow opacity-40 pointer-events-none z-40"></div>
            </>
          )}

          {/* Texture Overlay for Rare/Magic */}
          {solvedCorrectly && showTexture && (
             <div 
               className="absolute inset-0 z-0 opacity-30 pointer-events-none mix-blend-overlay"
               style={{ 
                 backgroundImage: `url('${TEXTURE_URL}')`,
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
               }}
             />
           )}

          {solvedCorrectly && item ? (
            <>
               {/* 
                 TOP SECTION: Image Frame (increased to 40% of the card height)
               */}
               <div className="h-[40%] w-full flex items-center justify-center p-6 bg-black/20 relative z-10 border-b border-white/10 shrink-0">
                   {/* The Square Frame */}
                   <div 
                      className="aspect-square h-full rounded-lg border-4 bg-black/50 flex items-center justify-center overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] relative"
                      style={{ borderColor: activeStyle.border }}
                   >
                        {item.image ? (
                            <img src={item.image} alt={getItemName(item)} className="w-full h-full object-contain hover:scale-110 transition-transform duration-500" />
                        ) : (
                            <Gift className={`w-1/2 h-1/2 ${textColorClass}`} />
                        )}
                        
                        {/* Usage Overlay */}
                        {item.uses && item.uses > 1 && (
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-lg font-bold px-3 py-1 rounded-lg border border-white/20 shadow-md backdrop-blur-sm">
                                {item.uses}x
                            </div>
                        )}
                   </div>

                    {(!item.uses) && (
                        <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-black/60 border border-white/10 text-white shadow backdrop-blur-sm">
                            {item.rarity}
                        </div>
                    )}
               </div>

               {/* 
                 BOTTOM SECTION: Content (Rest of the space)
               */}
               <div className="flex-1 flex flex-col p-6 relative z-10 overflow-hidden">
                  <h3 className={`text-3xl font-serif font-bold mb-3 text-center leading-tight ${textColorClass} drop-shadow-md`}>
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
                        <div className="space-y-2">
                            {item.tags.map(tag => {
                            const effect = STATUS_EFFECTS[tag];
                            if (!effect) return null;
                            const effectName = (lang === 'fr' && effect.name_fr) ? effect.name_fr : effect.name;
                            const effectDesc = (lang === 'fr' && effect.description_fr) ? effect.description_fr : effect.description;

                            return (
                                <div key={tag} className="flex items-center text-left">
                                    <div className="mr-2 opacity-90 shrink-0">
                                        {getEffectIcon(effect.type)}
                                    </div>
                                    <div className="text-xs leading-relaxed flex items-center">
                                        <span className={`font-bold uppercase tracking-wide ${textColorClass} mr-1`}>
                                            {effectName}
                                        </span>
                                        <span className="text-gray-500 mr-1">:</span>
                                        <span className="text-gray-400 italic">
                                            {effectDesc}
                                        </span>
                                    </div>
                                </div>
                            );
                            })}
                        </div>
                        ) : (
                        <div className="text-center text-xs text-gray-600 uppercase tracking-widest py-2">{t.profile.noEffects}</div>
                        )}
                    </div>
                  </div>
               </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center z-10 relative">
               {failImage ? (
                   <div className="w-56 h-56 mb-6 rounded-lg border-4 border-red-900/50 bg-black/30 flex items-center justify-center shadow-lg overflow-hidden">
                       <img src={failImage} alt="Failed" className="w-full h-full object-contain" />
                   </div>
               ) : (
                   <AlertTriangle className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
               )}
               <h2 className="text-3xl font-serif font-bold mb-4">{t.combat.defeat}</h2>
               <p className="text-red-200 text-lg leading-relaxed">
                   {failMessage || t.recherche.lockSealed}
               </p>
            </div>
          )}
        </div>

        <button 
            onClick={handleBack}
            className="mt-8 px-12 py-4 bg-parchment-200 text-parchment-900 font-serif font-bold rounded-full shadow-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 border-4 border-parchment-500 flex items-center text-xl"
        >
            {t.buttons.back}
        </button>
    </div>
  );
};

export default LootRewardCard;