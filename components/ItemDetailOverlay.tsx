
import React from 'react';
import { Item, EffectType } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { RARITY_TEXT_COLORS } from '../constants';
import { useLocalization } from '../localization';
import { X, Backpack, Star, Coins, Footprints, Sword, Sparkles } from 'lucide-react';
import { playMenuBackSound } from '../services/audioService';

interface ItemDetailOverlayProps {
  item: Item | null;
  onClose: () => void;
}

const ItemDetailOverlay: React.FC<ItemDetailOverlayProps> = ({ item, onClose }) => {
  const { lang } = useLocalization();

  if (!item) return null;

  const getItemName = (itm: Item) => (lang === 'fr' && itm.name_fr) ? itm.name_fr : itm.name;
  const getItemDesc = (itm: Item) => (lang === 'fr' && itm.description_fr) ? itm.description_fr : itm.description;

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-4 h-4 text-yellow-400" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-4 h-4 text-amber-400" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-4 h-4 text-green-400" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-4 h-4 text-red-400" />;
        default: return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-parchment-100/95 backdrop-blur-sm z-50 flex flex-col p-6 animate-fadeIn items-center justify-center">
        <button 
            onClick={() => { playMenuBackSound(); onClose(); }}
            className="absolute top-4 right-4 p-2 bg-parchment-300 rounded-full hover:bg-parchment-400 text-parchment-800"
        >
            <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center flex-1 justify-center max-w-lg w-full">
            <div className={`w-32 h-32 rounded-lg bg-black/10 flex items-center justify-center border-4 mb-6 shadow-xl ${RARITY_TEXT_COLORS[item.rarity].replace('text-', 'border-')}`}>
                {item.image ? (
                    <img src={item.image} className="w-full h-full object-contain rounded" alt={getItemName(item)} />
                ) : (
                    <Backpack className={`w-16 h-16 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                )}
            </div>
            
            <h3 className={`text-4xl font-serif font-bold mb-2 text-center ${RARITY_TEXT_COLORS[item.rarity]}`}>{getItemName(item)}</h3>
            <div className="px-3 py-1 rounded-full bg-black/80 text-white text-xs font-bold uppercase tracking-widest mb-6 border border-white/20">
                {item.rarity}
            </div>

            <p className="text-center text-parchment-800 italic text-xl max-w-md mb-8 border-y-2 border-parchment-300 py-6">
                "{getItemDesc(item)}"
            </p>

            {item.tags && item.tags.length > 0 && (
                    <div className="w-full max-w-sm bg-white/50 p-4 rounded-lg border border-parchment-300 shadow-sm">
                        <h4 className="font-bold text-parchment-900 mb-3 border-b border-parchment-300 pb-1 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-purple-600"/> 
                            Magical Effects
                        </h4>
                        <div className="space-y-2">
                        {item.tags.map(tag => {
                            const effect = STATUS_EFFECTS[tag];
                            if (!effect) return null;
                            const effectName = (lang === 'fr' && effect.name_fr) ? effect.name_fr : effect.name;
                            const effectDesc = (lang === 'fr' && effect.description_fr) ? effect.description_fr : effect.description;
                            return (
                                <div key={tag} className="flex items-center text-sm p-2 bg-parchment-100 rounded">
                                    <div className="mr-3 p-1 bg-white rounded-full border border-parchment-300 shadow-sm">
                                        {getEffectIcon(effect.type)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-parchment-800">{effectName}</div>
                                        <div className="text-xs text-parchment-600">{effectDesc}</div>
                                    </div>
                                </div>
                            )
                        })}
                        </div>
                    </div>
            )}
        </div>
    </div>
  );
};

export default ItemDetailOverlay;
