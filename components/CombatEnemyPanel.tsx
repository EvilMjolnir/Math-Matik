
import React from 'react';
import { Encounter } from '../types';
import { Skull, Sword, Shield } from 'lucide-react';
import { Translation } from '../localization/types';

interface CombatEnemyPanelProps {
  encounter?: Encounter; // Optional to handle "Training Mode"
  isBossMode: boolean;
  currentHp: number;     // Boss HP or Encounter Damage Dealt
  maxHp: number;         // Effective Max HP
  attackPower: number;   // Effective Attack
  t: Translation;
  lang: string;
  score?: number;        // For Training Mode display
}

const CombatEnemyPanel: React.FC<CombatEnemyPanelProps> = ({
  encounter,
  isBossMode,
  currentHp,
  maxHp,
  attackPower,
  t,
  lang,
  score
}) => {
  if (!encounter) {
    return (
      <div className="hidden md:flex w-1/4 flex-col justify-center items-center opacity-30">
        <Shield className="w-16 h-16 text-parchment-500 mb-2" />
        <p className="text-parchment-500 text-center text-sm">{t.combat.trainingMode}</p>
        <div className="mt-4 text-2xl font-bold text-amber-500">{score} pts</div>
      </div>
    );
  }

  const name = (lang === 'fr' && encounter.name_fr) ? encounter.name_fr : encounter.name;

  // Calculate Bar Width
  let barWidth = 100;
  if (isBossMode) {
      // Boss: Starts full, goes to 0. currentHp is remaining HP.
      barWidth = (currentHp / maxHp) * 100;
  } else {
      // Normal: currentHp is Damage Dealt (starts 0, goes to maxHp).
      // We want bar to start full and deplete.
      barWidth = Math.max(0, ((maxHp - currentHp) / maxHp) * 100);
  }

  return (
    <div className="w-full md:w-1/4 bg-red-950/40 rounded-lg p-3 border-2 border-red-800/60 flex flex-col justify-center relative">
      
      {/* Image Frame */}
      <div className={`w-full aspect-square bg-black/40 rounded border-2 mb-3 flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] ${isBossMode ? 'border-purple-800/60' : 'border-red-900/50'}`}>
          {encounter.image ? (
              <img src={encounter.image} alt={name} className="w-full h-full object-cover" />
          ) : (
              <Skull className="w-24 h-24 text-red-900/30" />
          )}
          {isBossMode && (
             <div className="absolute inset-0 border-4 border-purple-500/30 rounded pointer-events-none"></div>
          )}
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between mb-2">
        <div className="overflow-hidden w-full">
          <div className="text-red-200 font-bold truncate text-lg">{name}</div>
          <div className={`text-xs uppercase tracking-wider font-bold ${isBossMode ? 'text-purple-400' : 'text-red-400'}`}>
            {encounter.type === 'boss' ? 'Boss' : t.combat.encounterStart}
          </div>
        </div>
      </div>

      {/* Enemy HP / Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-red-300 mb-1 font-bold">
          <span>{t.common.hp}</span>
          <span>
            {isBossMode ? currentHp : Math.max(0, maxHp - currentHp)}/{maxHp}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
          <div 
            className={`h-full transition-all duration-300 ${isBossMode ? 'bg-purple-600' : 'bg-blue-600'}`} 
            style={{width: `${barWidth}%`}}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-red-200 bg-white/5 p-2 rounded border border-red-900/30">
          <span className="text-xs uppercase font-bold">{t.combat.attack}</span>
          <span className="font-bold flex items-center text-red-500 text-lg">
            <Sword className="w-5 h-5 mr-1"/> {attackPower}
          </span>
        </div>
        {encounter.tags && encounter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-start">
            {encounter.tags.map(tag => (
              <span key={tag} className="text-[10px] bg-red-900 text-red-200 px-1.5 py-0.5 rounded border border-red-700 font-bold uppercase">
                {tag.replace('mon_', '')}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatEnemyPanel;
