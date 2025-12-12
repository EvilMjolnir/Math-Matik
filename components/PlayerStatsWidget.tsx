
import React, { useState, useEffect, useRef } from 'react';
import { PlayerStats } from '../types';
import { XP_TABLE, DEFAULT_USER_IMAGE, LEVEL_TIERS } from '../constants';
import { getAggregatedStats } from '../services/statusService';
import { Heart, Coins, Shield, Crown, Maximize2, Star, LogOut, Footprints, Sword, Sparkles, Sigma, BicepsFlexed } from 'lucide-react';
import { useLocalization } from '../localization';

interface PlayerStatsWidgetProps {
  player: PlayerStats;
  onExpand: () => void;
  onLogout: () => void;
}

const PlayerStatsWidget: React.FC<PlayerStatsWidgetProps> = ({ player, onExpand, onLogout }) => {
  const { t } = useLocalization();
  const [animateBonus, setAnimateBonus] = useState(false);
  
  // Calculate XP progress for current level
  const currentLevelBaseXp = XP_TABLE[player.level - 1] || 0;
  const nextLevelXp = XP_TABLE[player.level] || (XP_TABLE[XP_TABLE.length - 1] + 100);
  const xpInLevel = player.currentXp - currentLevelBaseXp;
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const xpPercentage = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

  const stats = getAggregatedStats(player);
  const hasBonuses = stats.xpMultiplier > 1 || stats.goldMultiplier > 1 || stats.movementMultiplier > 1 || stats.attackMultiplier > 0 || stats.totalDefense > player.defense;
  
  const activeCompanion = player.companions?.find(c => c.id === player.activeCompanionId);

  // Generate a signature string for active effects to detect changes
  const effectsSignature = JSON.stringify(stats.effectDetails.map(e => e.id).sort());
  const prevEffectsRef = useRef<string>('');

  // Calculate Title Tier for Crown Color
  const currentTier = LEVEL_TIERS.find(t => player.level <= t.maxLevel) || LEVEL_TIERS[LEVEL_TIERS.length - 1];

  useEffect(() => {
    // Check if effects changed from previous render
    if (prevEffectsRef.current !== '' && prevEffectsRef.current !== effectsSignature) {
        setAnimateBonus(true);
        const timer = setTimeout(() => setAnimateBonus(false), 1500); // Pulse for 1.5s
        return () => clearTimeout(timer);
    }
    prevEffectsRef.current = effectsSignature;
  }, [effectsSignature]);

  return (
    <div className="bg-parchment-800/95 border-4 border-double border-parchment-400 p-4 h-full w-full max-w-[300px] flex flex-col items-center shadow-2xl relative">
      {/* Logout Section */}
      <div className="w-full border-b-2 border-parchment-600 pb-2 mb-4 px-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 text-parchment-300 hover:text-red-400 transition-colors py-1 group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>

      {/* Header / Avatar */}
      <div className="relative mb-2">
        <div className="w-28 h-28 flex items-center justify-center overflow-hidden">
            <img 
                src={player.photoURL || DEFAULT_USER_IMAGE} 
                alt="Hero" 
                className="w-full h-full object-contain drop-shadow-lg" 
            />
        </div>
        
        {/* Active Companion Bubble */}
        {activeCompanion && (
            <div 
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-parchment-300 rounded-full border-2 border-amber-500 flex items-center justify-center shadow-md overflow-hidden z-10"
                title={activeCompanion.name}
            >
                {activeCompanion.image ? (
                    <img src={activeCompanion.image} alt={activeCompanion.name} className="w-full h-full object-cover" />
                ) : (
                    <span className="text-parchment-900 font-serif font-bold">{activeCompanion.name.charAt(0)}</span>
                )}
            </div>
        )}
      </div>
      
      <div className="text-center w-full mb-2">
        <h3 className="font-serif font-bold text-amber-500 text-2xl truncate px-2 mb-1">{player.username}</h3>
        <div className="flex items-center justify-center text-parchment-200 text-base mb-2">
           <Crown className={`w-5 h-5 mr-1 ${currentTier.color}`} />
           <span>{t.common.level} {player.level}</span>
        </div>

        {/* XP Bar moved here */}
        <div className="w-full px-2">
           <div className="flex justify-between text-[10px] text-parchment-400 mb-1 font-bold uppercase tracking-wider">
             <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-500" /> {t.common.xp}</span>
             <span>{Math.floor(xpPercentage)}%</span>
           </div>
           <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
             <div 
               className="h-full bg-yellow-600" 
               style={{ width: `${xpPercentage}%` }}
             ></div>
           </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-full border-b border-parchment-600/50 mb-4 mt-2 mx-4" />

      {/* Stats Compact */}
      <div className="w-full space-y-4 mb-4">
        {/* HP */}
        <div>
          <div className="flex justify-between text-sm text-parchment-200 mb-1 font-bold">
            <span className="flex items-center"><Heart className="w-4 h-4 mr-1 text-red-500" /> {t.common.hp}</span>
            <span>{player.currentHp}/{player.maxHp}</span>
          </div>
          <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-red-600" 
              style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>
        
        {/* 3 Main Stats in semi-transparent frame */}
        <div className="bg-black/20 rounded-lg p-3 border border-parchment-600/30 backdrop-blur-sm shadow-inner">
            <div className="flex justify-between items-center text-parchment-100 text-lg px-1">
                <div className="flex flex-col items-center w-1/3" title={t.combat.attack}>
                    <Sword className="w-5 h-5 mb-1 text-red-500" />
                    <span className="font-bold text-lg">{stats.totalAttack}</span>
                </div>
                <div className="w-px h-8 bg-parchment-600/30"></div>
                <div className="flex flex-col items-center w-1/3" title={t.stats.defense}>
                    <Shield className="w-5 h-5 mb-1 text-blue-400" />
                    <span className="font-bold text-lg">{stats.totalDefense}</span>
                </div>
                <div className="w-px h-8 bg-parchment-600/30"></div>
                <div className="flex flex-col items-center w-1/3" title={t.profile.agility}>
                    <Footprints className="w-5 h-5 mb-1 text-green-400" />
                    <span className="font-bold text-lg">{player.agility || 0}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Active Effects Section */}
      {hasBonuses && (
        <div className={`w-full mt-2 bg-black/20 rounded p-3 border border-parchment-600/30 transition-all duration-300 ${animateBonus ? 'ring-2 ring-yellow-400 animate-pulse' : ''}`}>
          <div className="flex items-center mb-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3 h-3 mr-1" />
            Active Bonuses
          </div>
          <div className="space-y-1 text-sm font-mono text-parchment-200">
             {stats.xpMultiplier > 1 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><Star className="w-3 h-3 text-yellow-500 mr-1" /> XP</span>
                  <span className="text-yellow-400">+{Math.round((stats.xpMultiplier - 1) * 100)}%</span>
                </div>
             )}
             {stats.goldMultiplier > 1 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><Coins className="w-3 h-3 text-amber-500 mr-1" /> Gold</span>
                  <span className="text-amber-400">+{Math.round((stats.goldMultiplier - 1) * 100)}%</span>
                </div>
             )}
             {stats.movementMultiplier > 1 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><Footprints className="w-3 h-3 mr-1"/> Speed</span>
                  <span className="text-green-400">+{Math.round((stats.movementMultiplier - 1) * 100)}%</span>
                </div>
             )}
             {stats.attackMultiplier > 0 && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><Sword className="w-3 h-3 mr-1"/> Atk</span>
                  <span className="text-red-400">+{Math.round(stats.attackMultiplier * 100)}%</span>
                </div>
             )}
             {stats.totalDefense > player.defense && (
                <div className="flex justify-between items-center">
                  <span className="flex items-center"><BicepsFlexed className="w-3 h-3 text-blue-400 mr-1" /> Defense</span>
                  <span className="text-blue-400">+{stats.totalDefense - player.defense}</span>
                </div>
             )}
          </div>
        </div>
      )}

      {/* Bottom Section: Currency & Details */}
      <div className="mt-auto w-full">
        {/* Gold & Nums Row */}
        <div className="flex justify-center items-center py-3 px-2 border-t border-parchment-600/50 mt-4 mb-2 space-x-6">
             <div className="flex items-center text-parchment-100 text-lg" title={t.common.gold}>
                <Coins className="w-6 h-6 mr-2 text-amber-400" />
                <span className="font-bold">{player.gold}</span>
            </div>
            <div className="flex items-center text-parchment-100 text-lg" title={t.common.nums}>
                <Sigma className="w-6 h-6 mr-2 text-cyan-400" />
                <span className="font-bold">{player.nums}</span>
            </div>
        </div>

        <button 
          onClick={onExpand}
          className="w-full py-3 bg-parchment-700 hover:bg-parchment-600 text-parchment-100 rounded flex items-center justify-center transition-colors border-2 border-parchment-500 text-lg font-bold"
        >
          <Maximize2 className="w-5 h-5 mr-2" />
          {t.buttons.details}
        </button>
      </div>
    </div>
  );
};

export default PlayerStatsWidget;
