
import React, { useState } from 'react';
import { PlayerStats, Item } from '../types';
import { XP_TABLE, RARITY_TEXT_COLORS } from '../constants';
import { getAggregatedStats } from '../services/statusService';
import { User, Heart, Coins, Shield, Crown, X, Edit2, Check, Scroll, Users, Star, Backpack, Sparkles } from 'lucide-react';
import { useLocalization } from '../localization';

interface PlayerProfileModalProps {
  player: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
  onUpdateName: (name: string) => void;
}

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, isOpen, onClose, onUpdateName }) => {
  const { t, lang } = useLocalization();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(player.username);
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'companions'>('stats');

  if (!isOpen) return null;

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateName(tempName);
      setIsEditing(false);
    }
  };

  // XP Calculations
  const currentLevelBaseXp = XP_TABLE[player.level - 1] || 0;
  const nextLevelXp = XP_TABLE[player.level] || (XP_TABLE[XP_TABLE.length - 1] + 100);
  const xpInLevel = player.currentXp - currentLevelBaseXp;
  const xpNeededForLevel = nextLevelXp - currentLevelBaseXp;
  const xpPercentage = Math.min(100, Math.max(0, (xpInLevel / xpNeededForLevel) * 100));

  // Calc Stats
  const activeStats = getAggregatedStats(player);
  
  // Helper to format descriptions based on activeStats
  const getEffectsList = () => {
    const list: string[] = [];
    if (activeStats.xpMultiplier > 1.0) {
      const val = Math.round((activeStats.xpMultiplier - 1) * 100);
      list.push(t.bonuses.xp.replace('{value}', val.toString()));
    }
    if (activeStats.goldMultiplier > 1.0) {
      const val = Math.round((activeStats.goldMultiplier - 1) * 100);
      list.push(t.bonuses.gold.replace('{value}', val.toString()));
    }
    if (activeStats.movementBonus > 0) {
      list.push(t.bonuses.movement.replace('{value}', activeStats.movementBonus.toString()));
    }
    if (activeStats.combatScoreBonus > 0) {
      list.push(t.bonuses.combat.replace('{value}', activeStats.combatScoreBonus.toString()));
    }
    return list;
  };

  const effectsList = getEffectsList();

  const getItemName = (item: Item) => (lang === 'fr' && item.name_fr) ? item.name_fr : item.name;
  const getItemDesc = (item: Item) => (lang === 'fr' && item.description_fr) ? item.description_fr : item.description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-parchment-200 rounded-lg shadow-2xl border-4 border-parchment-800 text-parchment-900 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-parchment-400 bg-parchment-300/50 rounded-t-lg">
          <div className="flex items-center">
             <div className="w-16 h-16 bg-parchment-100 rounded-full border-2 border-amber-600 flex items-center justify-center mr-4">
                <User className="w-10 h-10 text-parchment-800" />
             </div>
             <div>
               {isEditing ? (
                 <div className="flex items-center">
                   <input 
                    type="text" 
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="bg-parchment-100 border border-parchment-500 px-2 py-1 text-lg font-serif font-bold rounded mr-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    maxLength={20}
                   />
                   <button onClick={handleSaveName} className="p-1 bg-green-600 text-white rounded hover:bg-green-700">
                     <Check className="w-5 h-5" />
                   </button>
                 </div>
               ) : (
                 <div className="flex items-center group">
                   <h2 className="text-3xl font-serif font-bold text-parchment-900 mr-3">{player.username}</h2>
                   <button onClick={() => { setIsEditing(true); setTempName(player.username); }} className="opacity-0 group-hover:opacity-100 text-parchment-600 hover:text-amber-700 transition-opacity">
                     <Edit2 className="w-5 h-5" />
                   </button>
                 </div>
               )}
               <div className="text-parchment-700 font-serif flex items-center mt-1">
                 <Crown className="w-4 h-4 mr-1 text-amber-600" />
                 Level {player.level} Mathematician
               </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-parchment-400/50 rounded-full transition-colors">
            <X className="w-8 h-8 text-parchment-800" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-parchment-800 text-parchment-200">
           <button 
             onClick={() => setActiveTab('stats')}
             className={`flex-1 py-3 font-serif font-bold flex items-center justify-center ${activeTab === 'stats' ? 'bg-parchment-200 text-parchment-900' : 'hover:bg-parchment-700'}`}
           >
             <Scroll className="w-5 h-5 mr-2" />
             Stats
           </button>
           <button 
             onClick={() => setActiveTab('inventory')}
             className={`flex-1 py-3 font-serif font-bold flex items-center justify-center ${activeTab === 'inventory' ? 'bg-parchment-200 text-parchment-900' : 'hover:bg-parchment-700'}`}
           >
             <Backpack className="w-5 h-5 mr-2" />
             Inventory ({player.inventory ? player.inventory.length : 0})
           </button>
           <button 
             onClick={() => setActiveTab('companions')}
             className={`flex-1 py-3 font-serif font-bold flex items-center justify-center ${activeTab === 'companions' ? 'bg-parchment-200 text-parchment-900' : 'hover:bg-parchment-700'}`}
           >
             <Users className="w-5 h-5 mr-2" />
             Companions
           </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-parchment-200">
          
          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold font-serif text-parchment-900 border-b border-parchment-400 pb-2">Vital Statistics</h3>
              
              <div className="bg-parchment-100 p-4 rounded border border-parchment-300 shadow-sm space-y-4">
                {/* HP */}
                <div className="flex justify-between items-center">
                  <span className="flex items-center text-lg"><Heart className="w-5 h-5 mr-2 text-red-600" /> {t.common.hp}</span>
                  <span className="font-mono font-bold text-xl">{player.currentHp} / {player.maxHp}</span>
                </div>
                <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden">
                  <div className="h-full bg-red-600" style={{ width: `${(player.currentHp / player.maxHp) * 100}%` }}></div>
                </div>

                {/* XP */}
                <div className="pt-2">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center text-lg"><Star className="w-5 h-5 mr-2 text-yellow-600" /> {t.common.xp}</span>
                    <span className="font-mono font-bold text-sm text-parchment-600">Total: {player.currentXp}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mt-1 relative">
                    <div className="h-full bg-yellow-500" style={{ width: `${xpPercentage}%` }}></div>
                  </div>
                  <div className="text-xs text-right text-parchment-600 mt-1">
                    {xpInLevel} / {xpNeededForLevel} next level
                  </div>
                </div>

                {/* Gold/Defense */}
                <div className="flex justify-between items-center pt-2 border-t border-parchment-300 mt-2">
                  <span className="flex items-center text-lg"><Shield className="w-5 h-5 mr-2 text-blue-600" /> Defense</span>
                  <span className="font-mono font-bold text-xl">{player.defense}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="flex items-center text-lg"><Coins className="w-5 h-5 mr-2 text-amber-600" /> {t.common.gold}</span>
                  <span className="font-mono font-bold text-xl text-amber-700">{player.gold}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-parchment-900 border-b border-parchment-400 pb-2 mt-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  Active Effects
                </h3>
                {effectsList.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {effectsList.map((desc, idx) => (
                      <li key={idx} className="bg-purple-100 text-purple-900 px-3 py-2 rounded border border-purple-200 font-bold text-sm flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        {desc}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="italic text-parchment-600">{t.bonuses.none}</p>
                )}
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {player.inventory && player.inventory.length > 0 ? (
                 player.inventory.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded border border-parchment-300 shadow-sm flex flex-col">
                       <div className="flex justify-between items-start mb-1">
                          <span className={`font-bold ${RARITY_TEXT_COLORS[item.rarity]}`}>{getItemName(item)}</span>
                          <span className="text-xs uppercase tracking-widest text-gray-500">{item.rarity}</span>
                       </div>
                       <p className="text-sm text-gray-600 italic mb-2">"{getItemDesc(item)}"</p>
                       {item.tags && item.tags.length > 0 && (
                         <div className="mt-auto flex flex-wrap gap-1">
                           {item.tags.map(tag => (
                              <span key={tag} className="text-[10px] bg-gray-100 text-gray-600 px-1 rounded border border-gray-200">
                                {tag.toUpperCase()}
                              </span>
                           ))}
                         </div>
                       )}
                    </div>
                 ))
               ) : (
                  <div className="col-span-2 text-center py-10 text-parchment-500 italic">
                    Your backpack is empty. Go exploring in the Research lab!
                  </div>
               )}
            </div>
          )}

          {/* COMPANIONS TAB */}
          {activeTab === 'companions' && (
            <div>
              <div className="mt-4 space-y-3">
                {player.companions.map((comp, idx) => (
                  <div key={idx} className="flex items-center bg-parchment-100 p-3 rounded border border-parchment-300 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-10 h-10 bg-parchment-300 rounded-full flex items-center justify-center mr-3 border border-parchment-400 font-serif font-bold text-parchment-800">
                      {comp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-parchment-900">{comp.name}</div>
                      <div className="text-xs text-parchment-600 uppercase tracking-wider">{comp.role} • Lvl {comp.level}</div>
                    </div>
                  </div>
                ))}
                {player.companions.length === 0 && (
                   <div className="text-center py-8 text-parchment-500 italic border-2 border-dashed border-parchment-300 rounded">
                     You travel alone...
                   </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;