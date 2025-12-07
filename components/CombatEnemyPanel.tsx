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

  return (
    <div className="w-full md:w-1/4 bg-red-950/40 rounded-lg p-3 border-2 border-red-800/60 flex flex-col justify-center">
      <div className="flex items-center justify-end mb-2">
        <div className="text-right overflow-hidden mr-2">
          <div className="text-red-200 font-bold truncate">{name}</div>
          <div className="text-xs text-red-400 uppercase tracking-wider">{encounter.type === 'boss' ? 'Boss' : t.combat.encounterStart}</div>
        </div>
        <div className="w-10 h-10 rounded-full bg-red-900 border-2 border-red-500 flex items-center justify-center overflow-hidden">
          {encounter.image ? (
            <img src={encounter.image} alt="enemy" className="w-full h-full object-cover" />
          ) : (
            <Skull className="w-6 h-6 text-red-200" />
          )}
        </div>
      </div>

      {/* Enemy HP / Progress */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-red-300 mb-1">
          <span>{isBossMode ? t.common.hp : t.combat.damageDealt}</span>
          <span>
            {currentHp}/{maxHp}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
          <div 
            className={`h-full transition-all duration-300 ${isBossMode ? 'bg-purple-600' : 'bg-blue-600'}`} 
            style={{width: `${(currentHp / maxHp) * 100}%`}}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-red-200 bg-white/5 p-2 rounded">
          <span className="text-xs uppercase">{t.combat.attack}</span>
          <span className="font-bold flex items-center text-red-500">
            <Sword className="w-4 h-4 mr-1"/> {attackPower}
          </span>
        </div>
        {encounter.tags && encounter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 justify-end">
            {encounter.tags.map(tag => (
              <span key={tag} className="text-[10px] bg-red-900 text-red-200 px-1 rounded border border-red-700">
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