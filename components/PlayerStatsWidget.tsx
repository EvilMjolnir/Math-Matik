
import React from 'react';
import { PlayerStats, EffectType } from '../types';
import { XP_TABLE } from '../constants';
import { getAggregatedStats } from '../services/statusService';
import { User, Heart, Coins, Shield, Crown, Maximize2, Star, LogOut, Footprints, Sword, Sparkles } from 'lucide-react';
import { useLocalization } from '../localization';

interface PlayerStatsWidgetProps {
  player: PlayerStats;
  onExpand: () => void;
  onLogout: () => void;
}

const PlayerStatsWidget: React.FC<PlayerStatsWidgetProps> = ({ player, onExpand, onLogout }) => {
  const { t } = useLocalization();
  // Calculate XP progress for current level
  const currentLevelBaseXp = XP_TABLE[player.level - 1] || 0;
  const nextLevelXp = XP_TABLE[player.level] || (XP_TABLE[XP_TABLE.length - 1] + 100);
  const xpInLevel = player.currentXp - currentLevelBaseXp;
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const xpPercentage = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

  const stats = getAggregatedStats(player);
  const hasBonuses = stats.xpMultiplier > 1 || stats.goldMultiplier > 1 || stats.movementBonus > 0 || stats.combatScoreBonus > 0;

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
      <div className="w-28 h-28 bg-parchment-200 rounded-full border-4 border-amber-600 flex items-center justify-center mb-4 shadow-inner">
        <User className="w-16 h-16 text-parchment-800" />
      </div>
      
      <div className="text-center mb-6 w-full">
        <h3 className="font-serif font-bold text-amber-500 text-2xl truncate px-2 mb-1">{player.username}</h3>
        <div className="flex items-center justify-center text-parchment-200 text-base">
           <Crown className="w-5 h-5 mr-1 text-yellow-500" />
           <span>{t.common.level} {player.level}</span>
        </div>
      </div>

      {/* Stats Compact */}
      <div className="w-full space-y-5 mb-4">
        {/* HP */}
        <div>
          <div className="flex justify-between text-sm text-parchment-200 mb-1 font-bold">
            <span className="flex items-center"><Heart className="w-4 h-4 mr-1 text-red-500" /> {t.common.hp}</span>
            <span>{player.currentHp}/{player.maxHp}</span>
          </div>
          <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-red-700" 
              style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* XP */}
        <div>
           <div className="flex justify-between text-sm text-parchment-200 mb-1 font-bold">
            <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-500" /> {t.common.xp}</span>
            <span>{Math.floor(xpPercentage)}%</span>
          </div>
          <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-yellow-600" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Defense & Gold Row */}
        <div className="flex justify-between pt-3 px-2">
            <div className="flex items-center text-parchment-100 text-lg" title="Defense">
                <Shield className="w-6 h-6 mr-2 text-blue-400" />
                <span className="font-bold">{player.defense}</span>
            </div>
             <div className="flex items-center text-parchment-100 text-lg" title="Gold">
                <Coins className="w-6 h-6 mr-2 text-amber-400" />
                <span className="font-bold">{player.gold}</span>
            </div>
        </div>
      </div>

      {/* Active Effects Section */}
      {hasBonuses && (
        <div className="w-full mt-4 bg-black/20 rounded p-3 border border-parchment-600/30">
          <div className="flex items-center mb-2 text-purple-300 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3 h-3 mr-1" />
            Active Bonuses
          </div>
          <div className="space-y-1 text-sm font-mono text-parchment-200">
             {stats.xpMultiplier > 1 && (
                <div className="flex justify-between">
                  <span>XP</span>
                  <span className="text-yellow-400">x{stats.xpMultiplier.toFixed(2)}</span>
                </div>
             )}
             {stats.goldMultiplier > 1 && (
                <div className="flex justify-between">
                  <span>Gold</span>
                  <span className="text-amber-400">x{stats.goldMultiplier.toFixed(2)}</span>
                </div>
             )}
             {stats.movementBonus > 0 && (
                <div className="flex justify-between">
                  <span className="flex items-center"><Footprints className="w-3 h-3 mr-1"/> Step</span>
                  <span className="text-green-400">+{stats.movementBonus}</span>
                </div>
             )}
             {stats.combatScoreBonus > 0 && (
                <div className="flex justify-between">
                  <span className="flex items-center"><Sword className="w-3 h-3 mr-1"/> Atk</span>
                  <span className="text-red-400">+{stats.combatScoreBonus}</span>
                </div>
             )}
          </div>
        </div>
      )}

      <div className="mt-auto w-full pt-4">
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
