
import React from 'react';
import { PlayerStats } from '../types';
import { XP_TABLE } from '../constants';
import { User, Heart, Coins, Shield, Crown, Maximize2, Star, LogOut } from 'lucide-react';
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

  return (
    <div className="bg-parchment-800/90 border-r-4 border-parchment-600 p-4 h-full w-full max-w-[280px] flex flex-col items-center shadow-2xl relative">
      {/* Logout Section */}
      <div className="w-full border-b border-parchment-600 pb-2 mb-4 px-2">
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 text-parchment-400 hover:text-red-400 transition-colors py-1 group"
          title="Logout"
        >
          <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
        </button>
      </div>

      {/* Header / Avatar */}
      <div className="w-24 h-24 bg-parchment-200 rounded-full border-4 border-amber-600 flex items-center justify-center mb-4 shadow-inner">
        <User className="w-14 h-14 text-parchment-800" />
      </div>
      
      <div className="text-center mb-6 w-full">
        <h3 className="font-serif font-bold text-amber-500 text-lg truncate px-2">{player.username}</h3>
        <div className="flex items-center justify-center text-parchment-300 text-sm">
           <Crown className="w-4 h-4 mr-1 text-yellow-500" />
           <span>{t.common.level} {player.level}</span>
        </div>
      </div>

      {/* Stats Compact */}
      <div className="w-full space-y-4 mb-8">
        {/* HP */}
        <div>
          <div className="flex justify-between text-xs text-parchment-300 mb-1">
            <span className="flex items-center"><Heart className="w-3 h-3 mr-1 text-red-500" /> {t.common.hp}</span>
            <span>{player.currentHp}/{player.maxHp}</span>
          </div>
          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-red-700" 
              style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* XP */}
        <div>
           <div className="flex justify-between text-xs text-parchment-300 mb-1">
            <span className="flex items-center"><Star className="w-3 h-3 mr-1 text-yellow-500" /> {t.common.xp}</span>
            <span>{Math.floor(xpPercentage)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
            <div 
              className="h-full bg-yellow-600" 
              style={{ width: `${xpPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Defense & Gold Row */}
        <div className="flex justify-between pt-2">
            <div className="flex items-center text-parchment-200" title="Defense">
                <Shield className="w-4 h-4 mr-1 text-blue-400" />
                <span className="font-bold">{player.defense}</span>
            </div>
             <div className="flex items-center text-parchment-200" title="Gold">
                <Coins className="w-4 h-4 mr-1 text-amber-400" />
                <span className="font-bold">{player.gold}</span>
            </div>
        </div>
      </div>

      <div className="mt-auto w-full">
        <button 
          onClick={onExpand}
          className="w-full py-2 bg-parchment-700 hover:bg-parchment-600 text-parchment-100 rounded flex items-center justify-center transition-colors border border-parchment-500"
        >
          <Maximize2 className="w-4 h-4 mr-2" />
          {t.buttons.details}
        </button>
      </div>
    </div>
  );
};

export default PlayerStatsWidget;
