
import React, { useState } from 'react';
import { PlayerStats, Item, EffectType } from '../types';
import { XP_TABLE, RARITY_TEXT_COLORS } from '../constants';
import { getAggregatedStats } from '../services/statusService';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { User, Heart, Coins, Shield, Crown, X, Edit2, Check, Scroll, Users, Star, Backpack, Sparkles, Lock, Footprints, Sword, Mail, Link } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound } from '../services/audioService';

interface PlayerProfileModalProps {
  player: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<PlayerStats>) => void;
  onUpdateInventory: (inventory: Item[], equipped: Item[]) => void;
}

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ player, isOpen, onClose, onUpdateProfile, onUpdateInventory }) => {
  const { t, lang } = useLocalization();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(player.username);
  const [tempPhoto, setTempPhoto] = useState(player.photoURL || '');
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'companions' | 'settings'>('stats');
  const [viewItem, setViewItem] = useState<Item | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    if (tempName.trim()) {
      onUpdateProfile({
        username: tempName,
        photoURL: tempPhoto
      });
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
      setTempName(player.username);
      setTempPhoto(player.photoURL || '');
      setIsEditing(true);
  };

  // Drag and Drop Logic
  const handleDragStart = (e: React.DragEvent, index: number, source: 'inventory' | 'equipped') => {
    e.dataTransfer.setData('sourceIndex', index.toString());
    e.dataTransfer.setData('sourceType', source);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number, targetType: 'inventory' | 'equipped') => {
    e.preventDefault();
    const sourceIndex = parseInt(e.dataTransfer.getData('sourceIndex'));
    const sourceType = e.dataTransfer.getData('sourceType') as 'inventory' | 'equipped';

    if (isNaN(sourceIndex)) return;

    const newInventory = [...(player.inventory || [])];
    const newEquipped = [...(player.equipped || [])];

    // Slot Unlocking Logic
    if (targetType === 'equipped') {
       if (targetIndex >= 3 && player.level < 5) return;
       if (targetIndex >= 4 && player.level < 10) return;
       if (targetIndex >= 5 && player.level < 15) return;
    }

    let sourceItem: Item;

    // Remove from source
    if (sourceType === 'inventory') {
        sourceItem = newInventory[sourceIndex];
        newInventory.splice(sourceIndex, 1);
    } else {
        sourceItem = newEquipped[sourceIndex];
        // Don't splice yet if swapping within same array, handle below
        if (sourceType !== targetType) {
            newEquipped[sourceIndex] = undefined as any; // Clear slot temporarily
        }
    }

    // Add to target
    if (targetType === 'inventory') {
        newInventory.push(sourceItem);
        // Clean up equipped array if moving from equipped
        if (sourceType === 'equipped') {
             newEquipped[sourceIndex] = null as any; 
        }
    } else {
        // Target is Equipped
        const existingItem = newEquipped[targetIndex];

        // If slot is occupied
        if (existingItem) {
            if (sourceType === 'inventory') {
                // Swap: Item in slot goes to inventory
                newInventory.push(existingItem);
                newEquipped[targetIndex] = sourceItem;
            } else {
                // Swap within equipment
                newEquipped[sourceIndex] = existingItem;
                newEquipped[targetIndex] = sourceItem;
            }
        } else {
            // Slot empty
            newEquipped[targetIndex] = sourceItem;
             if (sourceType === 'equipped') {
                 newEquipped[sourceIndex] = null as any;
             }
        }
    }

    // Clean up nulls in inventory (it should be a packed list)
    const cleanedInventory = newInventory.filter(Boolean);
    
    onUpdateInventory(cleanedInventory, newEquipped);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
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

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-4 h-4 text-yellow-400" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-4 h-4 text-amber-400" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-4 h-4 text-green-400" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-4 h-4 text-red-400" />;
        default: return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const renderSlot = (index: number) => {
    const item = player.equipped ? player.equipped[index] : null;
    let isLocked = false;
    let unlockLevel = 0;

    if (index === 3) { isLocked = player.level < 5; unlockLevel = 5; }
    if (index === 4) { isLocked = player.level < 10; unlockLevel = 10; }
    if (index === 5) { isLocked = player.level < 15; unlockLevel = 15; }

    // Rarity Border Logic
    let borderClass = 'border-parchment-400';
    if (item) {
        // Map text color to border color for the slot
        const rarityText = RARITY_TEXT_COLORS[item.rarity];
        // e.g., 'text-gray-400' -> 'border-gray-400'
        borderClass = rarityText.replace('text-', 'border-') + ' border-4';
    } else if (isLocked) {
        borderClass = 'border-gray-600';
    }

    return (
        <div 
            key={index}
            onDrop={(e) => !isLocked && handleDrop(e, index, 'equipped')}
            onDragOver={!isLocked ? handleDragOver : undefined}
            className={`
                relative w-full aspect-square rounded-lg flex items-center justify-center transition-all bg-parchment-100
                ${isLocked ? 'bg-gray-800' : 'hover:bg-white'}
                ${borderClass}
            `}
        >
            {isLocked ? (
                <div className="flex flex-col items-center text-gray-500">
                    <Lock className="w-6 h-6 mb-1" />
                    <span className="text-[10px] uppercase font-bold">{t.equipment.reqLevel} {unlockLevel}</span>
                </div>
            ) : item ? (
                <div 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'equipped')}
                    onClick={() => setViewItem(item)}
                    className="w-full h-full p-2 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                >
                     {item.image ? (
                        <img src={item.image} className="w-12 h-12 object-contain" alt="item" />
                     ) : (
                        <Backpack className={`w-8 h-8 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                     )}
                     <div className="text-[10px] text-center font-bold leading-tight mt-1 line-clamp-2">
                        {getItemName(item)}
                     </div>
                </div>
            ) : (
                <div className="opacity-20 text-parchment-800 font-bold text-2xl select-none">
                    {index + 1}
                </div>
            )}
        </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl bg-parchment-200 rounded-lg shadow-2xl border-4 border-parchment-800 text-parchment-900 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 border-parchment-400 bg-parchment-300/50 rounded-t-lg">
          <div className="flex items-center w-full">
             <div className="w-16 h-16 bg-parchment-100 rounded-full border-2 border-amber-600 flex items-center justify-center mr-4 overflow-hidden shrink-0">
                {player.photoURL ? (
                    <img src={player.photoURL} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-10 h-10 text-parchment-800" />
                )}
             </div>
             <div className="flex-1">
               {isEditing ? (
                 <div className="flex flex-col space-y-2 max-w-sm">
                   <div className="flex items-center">
                     <User className="w-4 h-4 mr-2 text-parchment-600" />
                     <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="flex-1 bg-parchment-100 border border-parchment-500 px-2 py-1 text-base font-serif font-bold rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                      maxLength={20}
                      placeholder="Hero Name"
                     />
                   </div>
                   <div className="flex items-center">
                      <Link className="w-4 h-4 mr-2 text-parchment-600" />
                      <input 
                        type="text" 
                        value={tempPhoto}
                        onChange={(e) => setTempPhoto(e.target.value)}
                        className="flex-1 bg-parchment-100 border border-parchment-500 px-2 py-1 text-sm font-sans rounded focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Photo URL (e.g. https://...)"
                      />
                   </div>
                   <button onClick={handleSave} className="self-end px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-bold text-sm flex items-center">
                     <Check className="w-4 h-4 mr-1" />
                     Save
                   </button>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center group">
                     <h2 className="text-3xl font-serif font-bold text-parchment-900 mr-3">{player.username}</h2>
                     <button onClick={handleEditClick} className="opacity-0 group-hover:opacity-100 text-parchment-600 hover:text-amber-700 transition-opacity">
                       <Edit2 className="w-5 h-5" />
                     </button>
                   </div>
                   <div className="text-parchment-700 font-serif flex items-center mt-1">
                     <Crown className="w-4 h-4 mr-1 text-amber-600" />
                     {t.common.level} {player.level} Mathematician
                   </div>
                   {player.email && (
                     <div className="text-parchment-500 text-sm flex items-center mt-1">
                       <Mail className="w-3 h-3 mr-1" />
                       {player.email}
                     </div>
                   )}
                 </>
               )}
             </div>
          </div>
          <button onClick={() => { playMenuBackSound(); onClose(); }} className="p-2 hover:bg-parchment-400/50 rounded-full transition-colors shrink-0 ml-4">
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
             {t.equipment.title}
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
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-parchment-200 relative">
          
          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-6 flex flex-col h-full">
              <h3 className="text-xl font-bold font-serif text-parchment-900 border-b border-parchment-400 pb-2">{t.stats.vitalStats}</h3>
              
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
                    <span className="font-mono font-bold text-sm text-parchment-600">{t.stats.totalXp} {player.currentXp}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-300 rounded-full overflow-hidden mt-1 relative">
                    <div className="h-full bg-yellow-500" style={{ width: `${xpPercentage}%` }}></div>
                  </div>
                  <div className="text-xs text-right text-parchment-600 mt-1">
                    {xpInLevel} / {xpNeededForLevel} {t.stats.nextLevel}
                  </div>
                </div>

                {/* Gold/Defense */}
                <div className="flex justify-between items-center pt-2 border-t border-parchment-300 mt-2">
                  <span className="flex items-center text-lg"><Shield className="w-5 h-5 mr-2 text-blue-600" /> {t.stats.defense}</span>
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
                  {t.stats.activeEffects}
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

          {/* INVENTORY TAB (Drag and Drop System) */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col h-full">
                <div className="text-center text-parchment-600 text-sm mb-4 italic flex items-center justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t.equipment.dragHint}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {/* Active Slots Section */}
                    <div className="bg-parchment-300/30 p-4 rounded border border-parchment-400">
                        <h3 className="text-lg font-bold font-serif mb-3 text-parchment-900 border-b border-parchment-400 pb-1">
                            {t.equipment.title}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[0, 1, 2, 3, 4, 5].map((idx) => renderSlot(idx))}
                        </div>
                    </div>

                    {/* Backpack Section */}
                    <div 
                        className="bg-parchment-100 p-4 rounded border border-parchment-400 flex flex-col h-full overflow-hidden"
                        onDrop={(e) => handleDrop(e, 0, 'inventory')}
                        onDragOver={handleDragOver}
                    >
                         <h3 className="text-lg font-bold font-serif mb-3 text-parchment-900 border-b border-parchment-300 pb-1">
                             {t.equipment.backpack}
                         </h3>
                         <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar space-y-2">
                             {player.inventory && player.inventory.length > 0 ? (
                                player.inventory.map((item, idx) => (
                                    <div 
                                        key={idx}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, idx, 'inventory')}
                                        onClick={() => setViewItem(item)}
                                        className="bg-white p-2 rounded border border-parchment-300 shadow-sm flex items-start cursor-pointer hover:bg-parchment-50 transition-colors"
                                    >
                                        <div className={`w-10 h-10 shrink-0 bg-gray-100 rounded border mr-3 flex items-center justify-center ${RARITY_TEXT_COLORS[item.rarity].replace('text-', 'border-')}`}>
                                             {item.image ? (
                                                <img src={item.image} className="w-full h-full object-contain rounded" alt="icon" />
                                             ) : (
                                                <Backpack className={`w-5 h-5 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                                             )}
                                        </div>
                                        <div>
                                            <div className={`font-bold text-sm ${RARITY_TEXT_COLORS[item.rarity]}`}>{getItemName(item)}</div>
                                            <p className="text-xs text-gray-600 italic line-clamp-1">{getItemDesc(item)}</p>
                                        </div>
                                    </div>
                                ))
                             ) : (
                                <div className="text-center py-10 text-parchment-500 italic">
                                    Empty.
                                </div>
                             )}
                         </div>
                    </div>
                </div>
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
                      <div className="text-xs text-parchment-600 uppercase tracking-wider">{comp.role} • {t.common.level} {comp.level}</div>
                    </div>
                  </div>
                ))}
                {player.companions.length === 0 && (
                   <div className="text-center py-8 text-parchment-500 italic border-2 border-dashed border-parchment-300 rounded">
                     {t.stats.travelAlone}
                   </div>
                )}
              </div>
            </div>
          )}

          {/* Item Details Overlay */}
          {viewItem && (
            <div className="absolute inset-0 bg-parchment-100/95 backdrop-blur-sm z-50 flex flex-col p-6 animate-fadeIn">
                <button 
                    onClick={() => setViewItem(null)}
                    className="absolute top-4 right-4 p-2 bg-parchment-300 rounded-full hover:bg-parchment-400 text-parchment-800"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center flex-1 justify-center">
                    <div className={`w-32 h-32 rounded-lg bg-black/10 flex items-center justify-center border-4 mb-6 shadow-xl ${RARITY_TEXT_COLORS[viewItem.rarity].replace('text-', 'border-')}`}>
                        {viewItem.image ? (
                            <img src={viewItem.image} className="w-full h-full object-contain rounded" alt={getItemName(viewItem)} />
                        ) : (
                            <Backpack className={`w-16 h-16 ${RARITY_TEXT_COLORS[viewItem.rarity]}`} />
                        )}
                    </div>
                    
                    <h3 className={`text-3xl font-serif font-bold mb-2 ${RARITY_TEXT_COLORS[viewItem.rarity]}`}>{getItemName(viewItem)}</h3>
                    <div className="px-3 py-1 rounded-full bg-black/80 text-white text-xs font-bold uppercase tracking-widest mb-6">
                        {viewItem.rarity}
                    </div>

                    <p className="text-center text-parchment-800 italic text-lg max-w-md mb-8 border-y-2 border-parchment-300 py-4">
                        "{getItemDesc(viewItem)}"
                    </p>

                    {viewItem.tags && viewItem.tags.length > 0 && (
                         <div className="w-full max-w-sm bg-white/50 p-4 rounded-lg border border-parchment-300">
                             <h4 className="font-bold text-parchment-900 mb-3 border-b border-parchment-300 pb-1">Effects</h4>
                             <div className="space-y-2">
                                {viewItem.tags.map(tag => {
                                    const effect = STATUS_EFFECTS[tag];
                                    if (!effect) return null;
                                    const effectName = (lang === 'fr' && effect.name_fr) ? effect.name_fr : effect.name;
                                    const effectDesc = (lang === 'fr' && effect.description_fr) ? effect.description_fr : effect.description;
                                    return (
                                        <div key={tag} className="flex items-start text-left bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                                           <div className="mt-1 mr-2 p-1 bg-black/50 rounded-full">
                                               {getEffectIcon(effect.type)}
                                           </div>
                                           <div>
                                               <div className="font-bold text-parchment-100 text-sm">{effectName}</div>
                                               <div className="text-xs text-parchment-400">{effectDesc}</div>
                                           </div>
                                        </div>
                                    )
                                })}
                             </div>
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
