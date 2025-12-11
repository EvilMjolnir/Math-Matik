
import React from 'react';
import { PlayerStats } from '../types';
import { Heart, Zap, Sword } from 'lucide-react';
import { Translation } from '../localization/types';
import { DEFAULT_USER_IMAGE } from '../constants';

interface CombatPlayerPanelProps {
  playerStats?: PlayerStats;
  isBossMode: boolean;
  actionGauge: number;
  actionsPerTurn: number;
  attackPower: number;
  t: Translation;
}

const CombatPlayerPanel: React.FC<CombatPlayerPanelProps> = ({
  playerStats,
  isBossMode,
  actionGauge,
  actionsPerTurn,
  attackPower,
  t
}) => {
  return (
    <div className="w-full md:w-1/4 bg-black/40 rounded-lg p-3 border-2 border-parchment-700 flex flex-col justify-center relative">
      <div className="flex items-center mb-2">
        <div className="w-10 h-10 rounded-full bg-parchment-300 border-2 border-amber-600 flex items-center justify-center mr-2 overflow-hidden">
            <img src={playerStats?.photoURL || DEFAULT_USER_IMAGE} alt="Hero" className="w-full h-full object-cover" />
        </div>
        <div className="overflow-hidden">
          <div className="text-parchment-100 font-bold truncate">{playerStats?.username || "Hero"}</div>
          <div className="text-xs text-parchment-400">{t.common.level} {playerStats?.level || 1}</div>
        </div>
      </div>

      {/* Player HP */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-parchment-300 mb-1">
          <span className="flex items-center"><Heart className="w-3 h-3 text-red-500 mr-1"/> {t.common.hp}</span>
          <span>{playerStats?.currentHp}/{playerStats?.maxHp}</span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
          <div 
            className="h-full bg-red-600 transition-all duration-300" 
            style={{width: `${playerStats ? (playerStats.currentHp / playerStats.maxHp) * 100 : 100}%`}}
          />
        </div>
      </div>

      {/* Stats / Action Gauge */}
      {isBossMode ? (
        <div>
          <div className="flex justify-between text-xs text-amber-400 mb-1 font-bold">
            <span className="flex items-center"><Zap className="w-3 h-3 mr-1"/> {t.combat.charge}</span>
            <span>{attackPower} Dmg</span>
          </div>
          <div className="w-full h-4 bg-gray-900 border border-amber-900/50 rounded-full overflow-hidden relative">
            {/* Segments */}
            <div className="absolute inset-0 flex">
              {Array.from({length: actionsPerTurn}).map((_, i) => (
                <div key={i} className="flex-1 border-r border-black/30 last:border-0 z-10"></div>
              ))}
            </div>
            <div 
              className="h-full bg-amber-500 transition-all duration-200" 
              style={{width: `${(actionGauge / actionsPerTurn) * 100}%`}}
            ></div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between text-parchment-300 bg-white/5 p-2 rounded">
          <span className="text-xs uppercase">{t.combat.attackPower}</span>
          <span className="font-bold flex items-center text-amber-500"><Sword className="w-4 h-4 mr-1"/> {attackPower}</span>
        </div>
      )}
    </div>
  );
};

export default CombatPlayerPanel;
