
import React, { useEffect } from 'react';
import { Encounter, EffectType } from '../types';
import { Skull, Zap, Sword, Shield, Coins, Star } from 'lucide-react';
import { EnemyStats } from '../services/statusService';
import { useLocalization } from '../localization';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { playBossIntroSound } from '../services/audioService';

interface EncounterIntroCardProps {
  encounter: Encounter;
  enemyStats: EnemyStats;
  isBossMode: boolean;
  onStart: () => void;
}

const EncounterIntroCard: React.FC<EncounterIntroCardProps> = ({ encounter, enemyStats, isBossMode, onStart }) => {
  const { t, lang } = useLocalization();

  useEffect(() => {
    if (isBossMode) {
      playBossIntroSound();
    }
  }, [isBossMode]);

  const encounterName = (lang === 'fr' && encounter.name_fr) ? encounter.name_fr : encounter.name;
  const encounterDesc = (lang === 'fr' && encounter.description_fr) ? encounter.description_fr : encounter.description;

  const effectiveMaxHp = encounter.monsterHP + enemyStats.hpBonus;
  const effectiveAttack = encounter.attack + enemyStats.damageBonus;
  const effectiveGoldReward = encounter.goldReward + enemyStats.goldRewardBonus;

  // Visual Configurations based on Type
  const cardStyles = isBossMode 
    ? "bg-slate-900 border-amber-600 shadow-[0_0_60px_rgba(168,85,247,0.5)] scale-105" 
    : "bg-red-950 border-red-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]";

  const headerStyles = isBossMode
    ? "bg-gradient-to-b from-purple-900 to-slate-900 border-b-2 border-amber-600 text-amber-500"
    : "bg-red-900/50 border-b-2 border-red-700 text-red-200";

  const imageFrameStyles = isBossMode
    ? "border-amber-600 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
    : "border-red-700 shadow-inner";

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.ENEMY_HP_BONUS: return <Shield className="w-4 h-4 text-blue-400" />;
        case EffectType.ENEMY_DAMAGE_BONUS: return <Sword className="w-4 h-4 text-red-400" />;
        case EffectType.ENEMY_GOLD_REWARD_BONUS: return <Coins className="w-4 h-4 text-amber-400" />;
        case EffectType.ENEMY_XP_REWARD_BONUS: return <Star className="w-4 h-4 text-yellow-400" />;
        default: return <Zap className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 puff-in-center relative z-10 w-full h-full overflow-y-auto custom-scrollbar">
      
      {/* Boss Ambient Glow */}
      {isBossMode && (
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[80%] bg-purple-600/20 blur-[100px] animate-pulse -z-10 rounded-full"></div>
      )}

      {/* Main Card Container */}
      <div className={`
        relative w-full max-w-[450px] min-h-[650px] rounded-xl border-[6px] flex flex-col overflow-hidden transition-all duration-500
        ${cardStyles}
      `}>
        
        {/* Holographic Reflective Overlay - BOSS ONLY */}
        {isBossMode && (
          <>
            <div className="holo-shine"></div>
            <div className="absolute inset-0 holo-rainbow opacity-40 pointer-events-none z-40"></div>
          </>
        )}

        {/* Background Texture */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] pointer-events-none"></div>

        {/* 1. TOP: Name Header */}
        <div className={`w-full py-4 px-2 text-center relative z-20 ${headerStyles}`}>
            <h2 className="text-3xl font-serif font-bold uppercase tracking-wider drop-shadow-md">
                {encounterName}
            </h2>
            <div className={`text-xs font-bold uppercase tracking-[0.3em] mt-1 ${isBossMode ? 'text-purple-400' : 'text-red-400'}`}>
                {isBossMode ? 'Boss' : t.combat.encounterStart}
            </div>
            {isBossMode && (
                <div className="absolute top-0 right-0 p-2">
                    <Skull className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
            )}
            {isBossMode && (
                <div className="absolute top-0 left-0 p-2">
                    <Skull className="w-6 h-6 text-amber-500 animate-pulse" />
                </div>
            )}
        </div>

        {/* 2. TOP SECTION: Image Frame */}
        <div className="w-full p-6 pb-2 relative z-10">
            <div className={`w-full ${isBossMode || !encounter.image ? 'aspect-square' : ''} border-4 bg-black/60 relative flex items-center justify-center overflow-hidden rounded-sm ${imageFrameStyles}`}>
                 {/* Decorative Corners for Boss */}
                 {isBossMode && (
                    <>
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500 z-20"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500 z-20"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500 z-20"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500 z-20"></div>
                    </>
                 )}

                 {encounter.image ? (
                    <img 
                        src={encounter.image} 
                        alt={encounterName} 
                        className={`w-full transition-transform duration-1000 ${isBossMode ? 'h-full object-cover hover:scale-110' : 'h-auto'}`} 
                    />
                 ) : (
                    <Skull className={`w-32 h-32 ${isBossMode ? 'text-purple-500' : 'text-red-500'} animate-pulse`} />
                 )}
            </div>
        </div>

        {/* 3. BOTTOM SECTION: Description & Details */}
        <div className="flex-1 flex flex-col p-6 pt-2 relative z-10">
            
            {/* Description */}
            <div className="mb-6 flex-grow flex items-center justify-center">
                <p className={`text-center italic font-serif text-lg leading-relaxed ${isBossMode ? 'text-purple-200' : 'text-parchment-200'}`}>
                    "{encounterDesc}"
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-8 shrink-0">
                 {/* HP */}
                 <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-parchment-400 mb-1 flex items-center">
                        <Shield className="w-3 h-3 mr-1" />
                        HP
                    </div>
                    <div className="relative">
                        <span className={`text-2xl font-bold ${isBossMode ? 'text-purple-400' : 'text-red-400'}`}>
                            {effectiveMaxHp}
                        </span>
                        {effectiveMaxHp > encounter.monsterHP && (
                            <sup className="ml-1 text-xs text-green-400 font-bold">+{enemyStats.hpBonus}</sup>
                        )}
                    </div>
                 </div>

                 {/* Attack */}
                 <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-parchment-400 mb-1 flex items-center">
                        <Sword className="w-3 h-3 mr-1" />
                        DMG
                    </div>
                    <div className="relative">
                        <span className={`text-2xl font-bold ${isBossMode ? 'text-red-500' : 'text-amber-600'}`}>
                            {effectiveAttack}
                        </span>
                        {effectiveAttack > encounter.attack && (
                            <sup className="ml-1 text-xs text-red-500 font-bold">+{enemyStats.damageBonus}</sup>
                        )}
                    </div>
                 </div>

                 {/* Reward */}
                 <div className="flex flex-col items-center justify-center p-2 bg-black/40 rounded border border-white/10">
                    <div className="text-xs uppercase tracking-widest text-parchment-400 mb-1 flex items-center">
                        <Coins className="w-3 h-3 mr-1" />
                        Gold
                    </div>
                    <div className="relative">
                        <span className="text-2xl font-bold text-yellow-500">
                            {effectiveGoldReward}
                        </span>
                        {effectiveGoldReward > encounter.goldReward && (
                            <sup className="ml-1 text-xs text-yellow-300 font-bold">+{enemyStats.goldRewardBonus}</sup>
                        )}
                    </div>
                 </div>
            </div>

            {/* Effects / Tags List */}
            {encounter.tags && encounter.tags.length > 0 && (
                <div className="w-full shrink-0 border-t border-white/10 pt-3">
                    <div className={`text-center text-xs font-bold uppercase tracking-widest mb-2 ${isBossMode ? 'text-purple-300' : 'text-red-300'}`}>
                        Active Effects
                    </div>
                    <div className="space-y-2">
                        {encounter.tags.map(tag => {
                            const effect = STATUS_EFFECTS[tag];
                            if(!effect) return null;
                            const effectName = (lang === 'fr' && effect.name_fr) ? effect.name_fr : effect.name;
                            const effectDesc = (lang === 'fr' && effect.description_fr) ? effect.description_fr : effect.description;

                            return (
                                <div key={tag} className="flex items-start text-left bg-black/30 p-2 rounded border border-white/5">
                                   <div className="mr-2 opacity-90 shrink-0 mt-0.5">
                                       {getEffectIcon(effect.type)}
                                   </div>
                                   <div className="text-xs leading-relaxed">
                                       <span className={`font-bold uppercase tracking-wide ${isBossMode ? 'text-purple-200' : 'text-red-100'}`}>
                                           {effectName}
                                       </span>
                                       <span className="mx-1 text-gray-500">:</span>
                                       <span className="text-parchment-400 italic">
                                           {effectDesc}
                                       </span>
                                   </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>

      </div>

      {/* External Action Button */}
      <button 
        onClick={onStart}
        className={`
            w-full max-w-[450px] mt-12 py-4 font-serif font-bold text-xl rounded shadow-lg transition-all transform active:scale-95 border-2
            ${isBossMode 
                ? 'bg-gradient-to-r from-purple-800 to-red-800 hover:from-purple-700 hover:to-red-700 text-white border-amber-500 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                : 'bg-red-800 hover:bg-red-700 text-white border-red-500 hover:border-red-400'
            }
        `}
    >
        {t.home.encounterActive.toUpperCase()}
    </button>
    </div>
  );
};

export default EncounterIntroCard;
