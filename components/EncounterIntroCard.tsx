
import React from 'react';
import { Encounter } from '../types';
import { Skull, Zap } from 'lucide-react';
import { EnemyStats } from '../services/statusService';
import { useLocalization } from '../localization';

interface EncounterIntroCardProps {
  encounter: Encounter;
  enemyStats: EnemyStats;
  isBossMode: boolean;
  onStart: () => void;
}

const EncounterIntroCard: React.FC<EncounterIntroCardProps> = ({ encounter, enemyStats, isBossMode, onStart }) => {
  const { t, lang } = useLocalization();

  const encounterName = (lang === 'fr' && encounter.name_fr) ? encounter.name_fr : encounter.name;
  const encounterDesc = (lang === 'fr' && encounter.description_fr) ? encounter.description_fr : encounter.description;

  const effectiveMaxHp = encounter.monsterHP + enemyStats.hpBonus;
  const effectiveAttack = encounter.attack + enemyStats.damageBonus;
  const effectiveGoldReward = encounter.goldReward + enemyStats.goldRewardBonus;

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 animate-fadeIn">
      <div className="bg-red-950/90 p-8 rounded-xl border-4 border-red-600 max-w-lg w-full text-center shadow-[0_0_30px_rgba(220,38,38,0.5)] relative overflow-hidden">
         {/* Background Texture */}
         <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
         
         <div className="relative z-10">
           {encounter.image ? (
             <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-red-500 overflow-hidden shadow-lg bg-black/50">
                <img src={encounter.image} alt={encounterName} className="w-full h-full object-cover" />
             </div>
           ) : (
             <Skull className="w-20 h-20 mx-auto text-red-500 mb-4 animate-pulse" />
           )}
           
           <h2 className="text-4xl font-serif font-bold text-white mb-2">{t.combat.encounterStart}</h2>
           <h3 className="text-2xl font-serif text-red-300 mb-4 flex items-center justify-center gap-2">
              {encounterName}
              {encounter.tags && encounter.tags.length > 0 && <Zap className="w-5 h-5 text-yellow-400" />}
           </h3>
           <p className="text-parchment-200 italic mb-8">"{encounterDesc}"</p>
           
           <div className="flex justify-center space-x-8 mb-8">
             <div className="text-center relative">
               {effectiveMaxHp > encounter.monsterHP && (
                   <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-1 rounded-full animate-bounce">
                       +{enemyStats.hpBonus}
                   </div>
               )}
               <div className="text-4xl font-bold text-yellow-500">{effectiveMaxHp}</div>
               <div className="text-xs uppercase tracking-widest text-parchment-400">{isBossMode ? 'HP' : t.combat.monsterHP}</div>
             </div>
             
             <div className="text-center relative">
               {effectiveAttack > encounter.attack && (
                   <div className="absolute -top-3 -right-3 bg-red-600 text-white text-xs font-bold px-1 rounded-full animate-bounce">
                       +{enemyStats.damageBonus}
                   </div>
               )}
               <div className="text-4xl font-bold text-red-500">{isBossMode ? effectiveAttack : `-${effectiveAttack}`}</div>
               <div className="text-xs uppercase tracking-widest text-parchment-400">{isBossMode ? 'DPS' : t.combat.hpLost}</div>
             </div>

             {effectiveGoldReward > 0 && (
                <div className="text-center relative">
                  <div className="text-4xl font-bold text-amber-500">+{effectiveGoldReward}</div>
                  <div className="text-xs uppercase tracking-widest text-parchment-400">{t.common.reward}</div>
                </div>
             )}
           </div>

           <button 
             onClick={onStart}
             className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-serif font-bold text-xl rounded border-2 border-red-400 shadow-lg transition-transform active:scale-95"
           >
             FIGHT!
           </button>
         </div>
      </div>
    </div>
  );
};

export default EncounterIntroCard;
