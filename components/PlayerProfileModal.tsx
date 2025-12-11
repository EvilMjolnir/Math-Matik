


import React, { useState, useEffect } from 'react';
import { PlayerStats, Item, EffectType, Companion } from '../types';
import { XP_TABLE, RARITY_TEXT_COLORS, DEFAULT_USER_IMAGE } from '../constants';
import { getAggregatedStats } from '../services/statusService';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { User, Heart, Coins, Shield, Crown, X, Edit2, Check, Star, Backpack, Sparkles, Lock, Footprints, Sword, Link, Info, Sigma, Flame, ExternalLink, Zap, BicepsFlexed, Skull, Sprout } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound, playMenuOpenSound, playItemRevealSound } from '../services/audioService';
import CompanionDetailOverlay from './CompanionDetailOverlay';

interface PlayerProfileModalProps {
  player: PlayerStats;
  isOpen: boolean;
  onClose: () => void;
  onUpdateProfile: (updates: Partial<PlayerStats>) => void;
  onUpdateInventory: (inventory: Item[], equipped: Item[]) => void;
  onOpenBlackMirror: () => void;
  onConsumeItem?: (index: number, source: 'inventory' | 'equipped') => void;
  onLevelUpCompanion?: (id: string) => void;
  initialTab?: 'stats' | 'inventory' | 'companions';
}

const ICON_INVENTORY = "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_inventory.png";
const ICON_COMPANIONS = "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/icons/icon_companion.png";

const PlayerProfileModal: React.FC<PlayerProfileModalProps> = ({ 
  player, 
  isOpen, 
  onClose, 
  onUpdateProfile, 
  onUpdateInventory,
  onOpenBlackMirror,
  onConsumeItem,
  onLevelUpCompanion,
  initialTab = 'stats'
}) => {
  const { t, lang } = useLocalization();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(player.username);
  const [tempPhoto, setTempPhoto] = useState(player.photoURL || '');
  const [activeTab, setActiveTab] = useState<'stats' | 'inventory' | 'companions' | 'settings'>('stats');
  
  // Track View Item state, including source for consumption logic
  const [viewItem, setViewItem] = useState<Item | null>(null);
  const [viewItemIndex, setViewItemIndex] = useState<number>(-1);
  const [viewItemSource, setViewItemSource] = useState<'inventory' | 'equipped'>('inventory');
  const [isAnimatingDestroy, setIsAnimatingDestroy] = useState(false);

  const [viewCompanion, setViewCompanion] = useState<Companion | null>(null);
  
  // Sync activeTab with initialTab when modal opens
  useEffect(() => {
    if (isOpen) {
        setActiveTab(initialTab);
        setViewItem(null); 
        setViewCompanion(null);
        setIsAnimatingDestroy(false);
        
        // Reset editing state on open
        setIsEditing(false);
        setTempName(player.username);
        setTempPhoto(player.photoURL || '');
    }
  }, [isOpen, initialTab, player.username, player.photoURL]);

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

  const handleItemClick = (item: Item, index: number, source: 'inventory' | 'equipped') => {
      setViewItem(item);
      setViewItemIndex(index);
      setViewItemSource(source);
      setIsAnimatingDestroy(false);
  };

  const handleDrink = () => {
      if (!viewItem || !onConsumeItem || viewItemIndex === -1) return;

      const currentUses = viewItem.uses || 0;
      
      // If this is the last use, trigger animation then consume
      if (currentUses <= 1) {
          playItemRevealSound(); // Use sound for feedback
          setIsAnimatingDestroy(true);
          setTimeout(() => {
              onConsumeItem(viewItemIndex, viewItemSource);
              setViewItem(null);
              setIsAnimatingDestroy(false);
          }, 600); // Wait for slide-out animation (approx 0.6s)
      } else {
          // Just consume and update local view state to reflect changes immediately if needed
          // Ideally Player stats update comes from parent prop, so we close or update
          onConsumeItem(viewItemIndex, viewItemSource);
          // Manually update the viewItem locally to show decremented uses immediately while open
          setViewItem(prev => prev ? ({...prev, uses: (prev.uses || 1) - 1}) : null);
      }
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
        if (sourceType !== targetType) {
            newEquipped[sourceIndex] = undefined as any; 
        }
    }

    // Add to target
    if (targetType === 'inventory') {
        newInventory.push(sourceItem);
        if (sourceType === 'equipped') {
             newEquipped[sourceIndex] = null as any; 
        }
    } else {
        // Target is Equipped
        const existingItem = newEquipped[targetIndex];

        if (existingItem) {
            if (sourceType === 'inventory') {
                newInventory.push(existingItem);
                newEquipped[targetIndex] = sourceItem;
            } else {
                newEquipped[sourceIndex] = existingItem;
                newEquipped[targetIndex] = sourceItem;
            }
        } else {
            newEquipped[targetIndex] = sourceItem;
             if (sourceType === 'equipped') {
                 newEquipped[sourceIndex] = null as any;
             }
        }
    }

    const cleanedInventory = newInventory.filter(Boolean);
    onUpdateInventory(cleanedInventory, newEquipped);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Calc Stats
  const activeStats = getAggregatedStats(player);
  
  const getItemName = (item: Item) => (lang === 'fr' && item.name_fr) ? item.name_fr : item.name;
  const getItemDesc = (item: Item) => (lang === 'fr' && item.description_fr) ? item.description_fr : item.description;

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-4 h-4 text-yellow-400" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-4 h-4 text-amber-400" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-4 h-4 text-green-400" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-4 h-4 text-red-400" />;
        case EffectType.DEFENSE_BONUS: return <BicepsFlexed className="w-4 h-4 text-blue-400" />;
        case EffectType.HEAL_TURN: return <Sprout className="w-4 h-4 text-pink-400" />;
        case EffectType.WEAKEN_ENEMY: return <Skull className="w-4 h-4 text-purple-400" />;
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

    let borderClass = 'border-parchment-400';
    if (item) {
        const rarityText = RARITY_TEXT_COLORS[item.rarity];
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
                relative w-full aspect-square rounded-lg flex items-center justify-center transition-all overflow-hidden
                ${isLocked ? 'bg-gray-800' : (item ? 'bg-gray-700 shadow-inner' : 'bg-parchment-100')} 
                ${!isLocked && !item ? 'hover:bg-white' : ''}
                ${borderClass}
            `}
        >
            {isLocked ? (
                <div className="flex flex-col items-center text-gray-500">
                    <Lock className="w-6 h-6 mb-1" />
                    <span className="text-xs uppercase font-bold">{t.equipment.reqLevel} {unlockLevel}</span>
                </div>
            ) : item ? (
                <div 
                    draggable
                    onDragStart={(e) => handleDragStart(e, index, 'equipped')}
                    onClick={() => handleItemClick(item, index, 'equipped')}
                    className={`absolute inset-0 w-full h-full flex flex-col cursor-grab active:cursor-grabbing hover:scale-105 transition-transform`}
                >
                     <div className="flex-1 w-full flex items-center justify-center p-1 min-h-0 bg-gradient-to-b from-white/5 to-transparent">
                        {item.image ? (
                            <img src={item.image} className="w-full h-full object-contain drop-shadow-md" alt="item" />
                        ) : (
                            <Backpack className={`w-2/3 h-2/3 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                        )}
                     </div>
                     <div className="w-full bg-black/60 backdrop-blur-[2px] py-1 px-1 shrink-0 border-t border-white/10 flex justify-between items-center">
                        <div className={`text-center w-full text-[9px] font-bold leading-tight truncate ${RARITY_TEXT_COLORS[item.rarity]}`}>
                            {getItemName(item)}
                        </div>
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

  const handleToggleCompanion = (id: string) => {
    const newId = player.activeCompanionId === id ? undefined : id;
    onUpdateProfile({ activeCompanionId: newId });
    if (newId) {
        onClose();
    }
  };

  // Determine Header Icon and Styling based on Tab
  let headerImgSrc = player.photoURL || DEFAULT_USER_IMAGE;
  let headerContainerClass = "w-16 h-16 bg-parchment-100 rounded-full border-2 border-amber-600 flex items-center justify-center mr-4 overflow-hidden shrink-0";
  let imgClass = "w-full h-full object-cover";

  if (activeTab === 'inventory') {
      headerImgSrc = ICON_INVENTORY;
      headerContainerClass = "w-20 h-20 mr-4 flex items-center justify-center shrink-0";
      imgClass = "w-full h-full object-contain";
  } else if (activeTab === 'companions') {
      headerImgSrc = ICON_COMPANIONS;
      headerContainerClass = "w-16 h-16 mr-4 flex items-center justify-center shrink-0";
      imgClass = "w-full h-full object-contain";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-6xl bg-parchment-200 rounded-lg shadow-2xl border-4 border-parchment-800 transition-colors duration-500 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b-2 rounded-t-lg bg-parchment-300/50 border-parchment-400">
          <div className="flex items-center w-full">
             <div className={headerContainerClass}>
                <img src={headerImgSrc} alt="Header Icon" className={imgClass} />
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
                      className="flex-1 bg-parchment-100 border border-parchment-500 px-2 py-1 text-base font-serif font-bold rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-parchment-900"
                      maxLength={20}
                      placeholder={t.profile.heroName}
                     />
                   </div>
                   <div className="flex items-center">
                      <Link className="w-4 h-4 mr-2 text-parchment-600" />
                      <input 
                        type="text" 
                        value={tempPhoto}
                        onChange={(e) => setTempPhoto(e.target.value)}
                        className="flex-1 bg-parchment-100 border border-parchment-500 px-2 py-1 text-sm font-sans rounded focus:outline-none focus:ring-2 focus:ring-amber-500 text-parchment-900"
                        placeholder={t.profile.photoUrl}
                      />
                   </div>
                   <button onClick={handleSave} className="self-end px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 font-bold text-sm flex items-center">
                     <Check className="w-4 h-4 mr-1" />
                     {t.profile.save}
                   </button>
                 </div>
               ) : (
                 <>
                   <div className="flex items-center group">
                     <h2 className="text-3xl font-serif font-bold mr-3">
                        {activeTab === 'inventory' ? t.equipment.title : activeTab === 'companions' ? t.profile.companions : player.username}
                     </h2>
                     {activeTab === 'stats' && (
                        <button onClick={handleEditClick} className="opacity-0 group-hover:opacity-100 text-parchment-600 hover:text-amber-700 transition-opacity">
                            <Edit2 className="w-5 h-5" />
                        </button>
                     )}
                   </div>
                   <div className="font-serif flex items-center mt-1 opacity-80">
                     <Crown className="w-4 h-4 mr-1 text-amber-600" />
                     {t.common.level} {player.level} Mathematician
                   </div>
                 </>
               )}
             </div>
          </div>
          <button onClick={() => { playMenuBackSound(); onClose(); }} className="p-2 hover:bg-white/20 rounded-full transition-colors shrink-0 ml-4">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-parchment-200 relative">
          
          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="space-y-6 flex flex-col h-full animate-fadeIn">
              <h3 className="text-xl font-bold font-serif text-parchment-900 border-b border-parchment-400 pb-2">{t.stats.vitalStats}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Heart className="w-5 h-5 mr-3 text-red-600" />
                          {t.common.hp}
                      </div>
                      <div className="font-mono font-bold text-xl text-parchment-900">{player.currentHp} / {player.maxHp}</div>
                  </div>
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Sword className="w-5 h-5 mr-3 text-red-600" />
                          {t.combat.attack}
                      </div>
                      <div className="font-mono font-bold text-xl text-parchment-900">{activeStats.totalAttack}</div>
                  </div>
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Shield className="w-5 h-5 mr-3 text-blue-600" />
                          {t.stats.defense}
                      </div>
                      <div className="font-mono font-bold text-xl text-parchment-900">{activeStats.totalDefense}</div>
                  </div>
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Footprints className="w-5 h-5 mr-3 text-green-600" />
                          {t.profile.agility}
                      </div>
                      <div className="font-mono font-bold text-xl text-parchment-900">{player.agility || 0}</div>
                  </div>
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Coins className="w-5 h-5 mr-3 text-amber-600" />
                          {t.common.gold}
                      </div>
                      <div className="font-mono font-bold text-xl text-amber-700">{player.gold}</div>
                  </div>
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Sigma className="w-5 h-5 mr-3 text-cyan-600" />
                          {t.common.nums}
                      </div>
                      <div className="font-mono font-bold text-xl text-cyan-700">{player.nums}</div>
                  </div>
                  <div className="bg-parchment-100/50 p-3 rounded-lg border border-parchment-300 flex items-center justify-between col-span-1 md:col-span-2">
                      <div className="flex items-center text-parchment-800 font-bold uppercase tracking-wider text-sm">
                          <Star className="w-5 h-5 mr-3 text-yellow-500" />
                          {t.stats.totalXp}
                      </div>
                      <div className="font-mono font-bold text-xl text-parchment-900">
                          {player.currentXp}
                          <span className="text-xs text-parchment-500 ml-2 font-normal">
                              ({(player.currentXp - (XP_TABLE[player.level - 1] || 0))} / {(XP_TABLE[player.level] || (XP_TABLE[XP_TABLE.length - 1] + 100)) - (XP_TABLE[player.level - 1] || 0)} {t.stats.nextLevel})
                          </span>
                      </div>
                  </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-serif text-parchment-900 border-b border-parchment-400 pb-2 mt-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                  {t.stats.activeEffects}
                </h3>
                {activeStats.effectDetails.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {activeStats.effectDetails.map((detail, idx) => {
                      const desc = (lang === 'fr' && detail.description_fr) ? detail.description_fr : detail.description;
                      const source = (lang === 'fr' && detail.sourceName_fr) ? detail.sourceName_fr : detail.sourceName;
                      
                      return (
                        <li key={idx} className="bg-purple-100 text-purple-900 px-3 py-2 rounded border border-purple-200 text-sm flex flex-col">
                            <div className="flex items-center font-bold">
                                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 shrink-0"></div>
                                {desc}
                            </div>
                            <div className="text-xs text-purple-600 ml-4 mt-0.5 italic">
                                From: {source}
                            </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="italic text-parchment-600">{t.bonuses.none}</p>
                )}
              </div>
            </div>
          )}

          {/* INVENTORY TAB */}
          {activeTab === 'inventory' && (
            <div className="flex flex-col h-full animate-fadeIn relative">
                <div className="absolute top-0 right-0 z-10">
                    <button 
                        onClick={onOpenBlackMirror}
                        className="flex items-center px-4 py-2 rounded-full text-xs font-bold transition-all shadow-md bg-slate-900 text-purple-300 border border-purple-500 hover:bg-slate-800 hover:text-white"
                    >
                        <Flame className="w-3 h-3 mr-2 text-purple-500" />
                        {t.profile.blackMirror}
                        <ExternalLink className="w-3 h-3 ml-2" />
                    </button>
                </div>

                <div className="text-center text-sm mb-4 italic flex items-center justify-center text-parchment-600">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t.equipment.dragHint}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    {/* Active Slots Section */}
                    <div className="p-4 rounded border bg-parchment-300/30 border-parchment-400">
                        <h3 className="text-lg font-bold font-serif mb-3 text-parchment-900 border-b border-parchment-400 pb-1">
                            {t.equipment.title}
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {[0, 1, 2, 3, 4, 5].map((idx) => renderSlot(idx))}
                        </div>
                    </div>

                    {/* Backpack Section */}
                    <div 
                        className="p-4 rounded border flex flex-col h-full overflow-hidden bg-parchment-100 border-parchment-400"
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
                                        onClick={() => handleItemClick(item, idx, 'inventory')}
                                        className="p-2 rounded border shadow-sm flex items-start transition-all cursor-grab bg-white border-parchment-300 hover:bg-parchment-50"
                                    >
                                        <div className={`w-10 h-10 shrink-0 bg-gray-100 rounded border mr-3 flex items-center justify-center ${RARITY_TEXT_COLORS[item.rarity].replace('text-', 'border-')}`}>
                                             {item.image ? (
                                                <img src={item.image} className="w-full h-full object-contain rounded" alt="icon" />
                                             ) : (
                                                <Backpack className={`w-5 h-5 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                                             )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div className={`font-bold text-sm ${RARITY_TEXT_COLORS[item.rarity]}`}>{getItemName(item)}</div>
                                            </div>
                                            <p className="text-xs text-gray-600 italic line-clamp-1">{getItemDesc(item)}</p>
                                            {item.uses !== undefined && (
                                                <div className="mt-1">
                                                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full border border-blue-200">
                                                        {item.uses}/{item.maxUses} Uses
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                             ) : (
                                <div className="text-center py-10 text-parchment-500 italic">
                                    {t.profile.empty}
                                </div>
                             )}
                         </div>
                    </div>
                </div>
            </div>
          )}

          {/* COMPANIONS TAB */}
          {activeTab === 'companions' && (
            <div className="animate-fadeIn">
              <div className="mt-2 mb-4 text-center text-sm text-parchment-600 italic">
                  {t.profile.clickDetails}
              </div>
              <div className="space-y-3">
                {player.companions.map((comp) => {
                  const isActive = player.activeCompanionId === comp.id;
                  return (
                    <button 
                        key={comp.id} 
                        onClick={() => { playMenuOpenSound(); setViewCompanion(comp); }}
                        className={`
                            w-full flex items-center p-3 rounded border shadow-sm transition-all text-left group
                            ${isActive ? 'bg-amber-100 border-amber-500 ring-1 ring-amber-400' : 'bg-parchment-100 border-parchment-300 hover:bg-white hover:shadow-md'}
                        `}
                    >
                        <div className={`
                            w-12 h-12 rounded-full flex items-center justify-center mr-4 border-2 overflow-hidden
                            ${isActive ? 'border-amber-600 bg-amber-200' : 'border-parchment-400 bg-parchment-300'}
                        `}>
                            {comp.image ? (
                                <img src={comp.image} className="w-full h-full object-cover" alt="comp" />
                            ) : (
                                <span className="font-serif font-bold text-lg text-parchment-800">{comp.name.charAt(0)}</span>
                            )}
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center">
                                <span className="font-bold text-parchment-900 text-lg">{comp.name}</span>
                                {isActive && (
                                    <span className="ml-2 px-2 py-0.5 bg-amber-600 text-white text-[10px] font-bold uppercase rounded-full">
                                        {t.tomes.active}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-parchment-600 uppercase tracking-wider">{comp.role} • {t.common.level} {comp.level}</div>
                        </div>

                        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-parchment-500">
                             <Info className="w-5 h-5" />
                        </div>
                    </button>
                  );
                })}
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
                    <div className={`w-32 h-32 rounded-lg bg-black/10 flex items-center justify-center border-4 mb-6 shadow-xl ${RARITY_TEXT_COLORS[viewItem.rarity].replace('text-', 'border-')} ${isAnimatingDestroy ? 'slide-out-blurred-top' : ''}`}>
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

                    {/* Drink Button for Potions */}
                    {viewItem.uses !== undefined && viewItem.uses > 0 && onConsumeItem && (
                        <button 
                            onClick={handleDrink}
                            disabled={isAnimatingDestroy}
                            className="mb-6 bg-pink-700 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-serif font-bold text-lg shadow-lg border-2 border-pink-500 flex items-center transition-transform transform active:scale-95 hover:scale-105"
                        >
                            <Zap className="w-5 h-5 mr-2 text-yellow-300" />
                            {t.buttons.drink} 
                            <span className="ml-2 text-xs bg-black/30 px-2 py-0.5 rounded">
                                ({viewItem.uses})
                            </span>
                        </button>
                    )}

                    {viewItem.tags && viewItem.tags.length > 0 && (
                         <div className="w-full max-w-sm bg-white/50 p-4 rounded-lg border border-parchment-300">
                             <h4 className="font-bold text-parchment-900 mb-3 border-b border-parchment-300 pb-1">{t.profile.effects}</h4>
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
          
          {/* Companion Details Overlay */}
          <CompanionDetailOverlay 
             companion={viewCompanion}
             isActive={viewCompanion?.id === player.activeCompanionId}
             onClose={() => setViewCompanion(null)}
             onToggleActive={handleToggleCompanion}
             playerGold={player.gold}
             onLevelUp={onLevelUpCompanion}
          />

        </div>
      </div>
    </div>
  );
};

export default PlayerProfileModal;
