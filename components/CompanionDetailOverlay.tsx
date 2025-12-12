
import React from 'react';
import { Companion, EffectType } from '../types';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { COMPANION_LEVEL_COSTS } from '../constants';
import { useLocalization } from '../localization';
import { X, Star, Coins, Footprints, Sword, Sparkles, UserPlus, UserMinus, User, ChevronUp, BicepsFlexed, ChevronLeft } from 'lucide-react';
import { playMenuBackSound, playMenuOpenSound } from '../services/audioService';
import { useDeviceType } from '../hooks/useDeviceType';

interface CompanionDetailOverlayProps {
  companion: Companion | null;
  isActive: boolean;
  onClose: () => void;
  onToggleActive: (id: string) => void;
  playerGold?: number;
  onLevelUp?: (id: string) => void;
}

const CompanionDetailOverlay: React.FC<CompanionDetailOverlayProps> = ({ companion, isActive, onClose, onToggleActive, playerGold = 0, onLevelUp }) => {
  const { t, lang } = useLocalization();
  const deviceType = useDeviceType();

  if (!companion) return null;

  const getCompanionName = (comp: Companion) => comp.name;
  const getCompanionDesc = (comp: Companion) => (lang === 'fr' && comp.description_fr) ? comp.description_fr : (comp.description || "A loyal friend.");

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-4 h-4 text-yellow-400" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-4 h-4 text-amber-400" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-4 h-4 text-green-400" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-4 h-4 text-red-400" />;
        case EffectType.DEFENSE_BONUS: return <BicepsFlexed className="w-4 h-4 text-blue-400" />;
        default: return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleToggle = () => {
    playMenuOpenSound();
    onToggleActive(companion.id);
    onClose();
  };

  const cost = COMPANION_LEVEL_COSTS[companion.level - 1]; // level 1 uses index 0 (cost to level 2)
  const canAfford = playerGold >= cost;
  const isMaxLevel = companion.level >= 5;
  const isDesktop = deviceType === 'desktop';

  return (
    <div className="fixed inset-0 bg-parchment-100/95 backdrop-blur-sm z-50 flex flex-col p-6 animate-fadeIn items-center justify-center">
        <button 
            onClick={() => { playMenuBackSound(); onClose(); }}
            className="absolute top-1 left-1 md:top-4 md:right-4 p-1 md:p-2 bg-parchment-300 rounded-full hover:bg-parchment-400 text-parchment-800"
        >
            {isDesktop ? <X className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
        </button>

        <div className="flex flex-col items-center flex-1 justify-center max-w-lg w-full">
            <div className={`w-64 h-64 rounded-full bg-parchment-300 flex items-center justify-center border-4 mb-6 shadow-xl ${isActive ? 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.5)]' : 'border-parchment-600'}`}>
                {companion.image ? (
                    <img src={companion.image} className="w-full h-full object-cover rounded-full" alt={getCompanionName(companion)} />
                ) : (
                    <User className="w-32 h-32 text-parchment-600" />
                )}
            </div>
            
            <h3 className="text-4xl font-serif font-bold mb-2 text-center text-parchment-900">{getCompanionName(companion)}</h3>
            <div className="px-3 py-1 rounded-full bg-parchment-800 text-parchment-100 text-xs font-bold uppercase tracking-widest mb-6">
                {t.common.level} {companion.level} {companion.role}
            </div>

            <p className="text-center text-parchment-800 italic text-xl max-w-md mb-8 border-y-2 border-parchment-300 py-6">
                "{getCompanionDesc(companion)}"
            </p>

            {companion.tags && companion.tags.length > 0 && (
                <div className="w-full max-w-sm bg-white/50 p-4 rounded-lg border border-parchment-300 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-3 border-b border-parchment-300 pb-1">
                        <h4 className="font-bold text-parchment-900 flex items-center">
                            <Sparkles className="w-4 h-4 mr-2 text-purple-600"/> 
                            {t.profile.effects}
                        </h4>
                        {!isMaxLevel && onLevelUp && (
                            <button
                                onClick={() => canAfford && onLevelUp(companion.id)}
                                disabled={!canAfford}
                                className={`
                                    flex items-center text-xs font-bold px-2 py-1 rounded-full transition-all border
                                    ${canAfford 
                                        ? 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200' 
                                        : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
                                    }
                                `}
                            >
                                <ChevronUp className="w-3 h-3 mr-1" />
                                <Coins className="w-3 h-3 mr-1 text-amber-500" />
                                {cost}
                            </button>
                        )}
                    </div>
                    
                    <div className="space-y-2">
                    {companion.tags.map(tag => {
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

            <button 
                onClick={handleToggle}
                className={`
                    px-8 py-3 rounded-full font-serif font-bold text-lg shadow-lg flex items-center transition-all transform hover:scale-105 active:scale-95 border-2
                    ${isActive 
                        ? 'bg-red-800 text-white border-red-600 hover:bg-red-700' 
                        : 'bg-green-700 text-white border-green-500 hover:bg-green-600'
                    }
                `}
            >
                {isActive ? (
                    <>
                        <UserMinus className="w-5 h-5 mr-2" />
                        {t.buttons.dismiss}
                    </>
                ) : (
                    <>
                        <UserPlus className="w-5 h-5 mr-2" />
                        {t.buttons.summon}
                    </>
                )}
            </button>
        </div>
    </div>
  );
};

export default CompanionDetailOverlay;
