

import React, { useState, useEffect } from 'react';
import { Tome, Encounter, LootWeight, Rarity, PlayerStats, GameConfig, EncounterType, Item, StorageMode } from '../types';
import { ChevronLeft, Edit3, Trash2, Sliders, Users, Key, Crown, Coins, Download, Copy, Plus, Activity, Box, Database, Cloud } from 'lucide-react';
import * as localStore from '../services/storageService';
import * as cloudStore from '../services/storageService_Live';
import { lootData } from '../data/loot';
import { RARITY_TEXT_COLORS, RARITY_COLORS } from '../constants';
import ItemDetailOverlay from '../components/ItemDetailOverlay';

interface AdminPanelProps {
  tomes: Tome[];
  setTomes: (tomes: Tome[]) => void;
  lootWeights: LootWeight[];
  setLootWeights: (weights: LootWeight[]) => void;
  onBack: () => void;
  storageMode: StorageMode;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tomes, setTomes, lootWeights, setLootWeights, onBack, storageMode }) => {
  const [activeTab, setActiveTab] = useState<'tomes' | 'loot' | 'users' | 'items'>('tomes');
  const [editingTomeId, setEditingTomeId] = useState<string | null>(null);
  const [users, setUsers] = useState<PlayerStats[]>([]);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);

  useEffect(() => {
    if (activeTab === 'users') {
      refreshUsers();
    }
  }, [activeTab, storageMode]);

  const refreshUsers = async () => {
    let u: PlayerStats[] = [];
    if (storageMode === StorageMode.CLOUD) {
      u = await cloudStore.getAllUsers();
    } else {
      u = await localStore.getAllUsers();
    }
    setUsers(u);
  };

  const handleDeleteUser = async (user: PlayerStats) => {
    const id = storageMode === StorageMode.CLOUD ? user.uid : user.username;
    if (!id) return;

    if (window.confirm(`Are you sure you want to banish ${user.username} from the realm?`)) {
      if (storageMode === StorageMode.CLOUD) {
        await cloudStore.deleteUser(id);
      } else {
        await localStore.deleteUser(id);
      }
      refreshUsers();
    }
  };

  // --- Tome Handlers ---
  const updateTome = (id: string, field: keyof Tome, value: any) => {
    setTomes(tomes.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const updateTomeConfig = (tomeId: string, section: keyof GameConfig, field: string, value: number) => {
    setTomes(tomes.map(t => {
      if (t.id !== tomeId) return t;
      
      // Ensure config structure exists
      const currentConfig = t.config || {};
      const sectionConfig = currentConfig[section] || {};

      return {
        ...t,
        config: {
          ...currentConfig,
          [section]: {
            ...sectionConfig,
            [field]: value
          }
        }
      };
    }));
  };

  // --- Encounter Handlers ---
  const updateEncounter = (tomeId: string, encounterId: string, field: keyof Encounter, value: any) => {
    setTomes(tomes.map(t => {
      if (t.id !== tomeId) return t;
      const updatedEncounters = t.possibleEncounters.map(e => 
        e.id === encounterId ? { ...e, [field]: value } : e
      );
      return { ...t, possibleEncounters: updatedEncounters };
    }));
  };

  const addEncounter = (tomeId: string) => {
    setTomes(tomes.map(t => {
      if (t.id !== tomeId) return t;
      const newEncounter: Encounter = {
        id: `enc_${Date.now()}`,
        name: 'New Enemy',
        description: 'A new challenger appears.',
        threshold: 10,
        hpLoss: 5,
        goldReward: 10,
        xpReward: 20,
        type: 'normal'
      };
      return { ...t, possibleEncounters: [...t.possibleEncounters, newEncounter] };
    }));
  };

  const removeEncounter = (tomeId: string, encounterId: string) => {
    if(!window.confirm("Are you sure you want to remove this enemy?")) return;
    setTomes(tomes.map(t => {
      if (t.id !== tomeId) return t;
      return { ...t, possibleEncounters: t.possibleEncounters.filter(e => e.id !== encounterId) };
    }));
  };

  // --- Loot Handlers ---
  const updateLootWeight = (rarity: Rarity, weight: number) => {
    setLootWeights(lootWeights.map(lw => 
      lw.rarity === rarity ? { ...lw, weight: weight } : lw
    ));
  };

  // --- Export / Import Utils ---
  const generateTsContent = (tome: Tome) => {
    // Basic formatting to make it look like source code
    return `import { Tome } from '../types';\n\nexport const ${tome.id}: Tome = ${JSON.stringify(tome, null, 2)};`;
  };

  const handleDownloadTome = (tome: Tome) => {
    const content = generateTsContent(tome);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tome.id}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = (tome: Tome) => {
    const content = generateTsContent(tome);
    navigator.clipboard.writeText(content).then(() => {
      alert("Tome configuration copied to clipboard!");
    });
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-parchment-900/80 p-4 rounded-lg border border-purple-500">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
            <ChevronLeft />
          </button>
          <div className="flex flex-col">
             <h1 className="text-3xl font-serif font-bold text-purple-300">Gandalf's Administration</h1>
             <span className="flex items-center text-xs text-parchment-400">
                 {storageMode === StorageMode.CLOUD ? <Cloud className="w-3 h-3 mr-1" /> : <Database className="w-3 h-3 mr-1" />}
                 Connected to {storageMode} Database
             </span>
          </div>
        </div>
        <div className="flex space-x-2">
            <button 
                onClick={() => setActiveTab('tomes')}
                className={`px-4 py-2 rounded font-bold flex items-center ${activeTab === 'tomes' ? 'bg-purple-600 text-white' : 'bg-parchment-800 text-gray-400'}`}
            >
                <Edit3 className="w-4 h-4 mr-2" />
                Tomes
            </button>
            <button 
                onClick={() => setActiveTab('items')}
                className={`px-4 py-2 rounded font-bold flex items-center ${activeTab === 'items' ? 'bg-purple-600 text-white' : 'bg-parchment-800 text-gray-400'}`}
            >
                <Box className="w-4 h-4 mr-2" />
                Items
            </button>
            <button 
                onClick={() => setActiveTab('loot')}
                className={`px-4 py-2 rounded font-bold flex items-center ${activeTab === 'loot' ? 'bg-purple-600 text-white' : 'bg-parchment-800 text-gray-400'}`}
            >
                <Sliders className="w-4 h-4 mr-2" />
                Loot
            </button>
            <button 
                onClick={() => setActiveTab('users')}
                className={`px-4 py-2 rounded font-bold flex items-center ${activeTab === 'users' ? 'bg-purple-600 text-white' : 'bg-parchment-800 text-gray-400'}`}
            >
                <Users className="w-4 h-4 mr-2" />
                Users
            </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        
        {/* --- TOMES EDITOR --- */}
        {activeTab === 'tomes' && (
          <div className="space-y-6">
            {tomes.map(tome => (
              <div key={tome.id} className="bg-parchment-200 text-parchment-900 rounded-lg shadow-lg border-2 border-parchment-400 overflow-hidden">
                <div 
                    className="p-4 bg-parchment-300 flex justify-between items-center cursor-pointer hover:bg-parchment-350"
                    onClick={() => setEditingTomeId(editingTomeId === tome.id ? null : tome.id)}
                >
                    <div className="flex items-center">
                        <Edit3 className="w-5 h-5 mr-3 text-parchment-700" />
                        <span className="font-bold text-xl">{tome.title}</span>
                    </div>
                    <span className="text-sm bg-parchment-800 text-white px-2 py-1 rounded">
                        {editingTomeId === tome.id ? 'Close' : 'Edit'}
                    </span>
                </div>

                {editingTomeId === tome.id && (
                    <div className="p-6 border-t border-parchment-400">
                        {/* Tome Basic Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block font-bold text-sm">Title (EN)</label>
                                <input 
                                    className="w-full p-2 border border-parchment-500 rounded bg-white text-gray-900"
                                    value={tome.title}
                                    onChange={(e) => updateTome(tome.id, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm">Image URL</label>
                                <input 
                                    className="w-full p-2 border border-parchment-500 rounded bg-white text-gray-900"
                                    value={tome.image || ''}
                                    placeholder="https://..."
                                    onChange={(e) => updateTome(tome.id, 'image', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm">Total Distance (Steps)</label>
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-parchment-500 rounded bg-white text-gray-900"
                                    value={tome.totalDistance}
                                    onChange={(e) => updateTome(tome.id, 'totalDistance', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block font-bold text-sm">Description</label>
                                <textarea 
                                    className="w-full p-2 border border-parchment-500 rounded bg-white text-gray-900"
                                    value={tome.description}
                                    onChange={(e) => updateTome(tome.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Minigame Configs */}
                        <div className="mb-6 bg-parchment-100 p-4 rounded border border-parchment-300">
                            <h3 className="font-serif font-bold text-lg mb-3 text-parchment-800 border-b border-parchment-300 pb-1 flex items-center">
                                <Activity className="w-4 h-4 mr-2"/> Minigame Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Movement */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm text-green-700">Movement</h4>
                                    <div className="flex space-x-2">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold block">Min</label>
                                            <input type="number" className="w-full p-1 border rounded bg-white text-gray-900" 
                                                value={tome.config?.movement?.minVal} 
                                                onChange={(e) => updateTomeConfig(tome.id, 'movement', 'minVal', parseInt(e.target.value))} />
                                        </div>
                                        <div className="flex-1">
                                            <label className="text-xs font-bold block">Max</label>
                                            <input type="number" className="w-full p-1 border rounded bg-white text-gray-900" 
                                                value={tome.config?.movement?.maxVal} 
                                                onChange={(e) => updateTomeConfig(tome.id, 'movement', 'maxVal', parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                </div>
                                {/* Combat */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm text-red-700">Combat</h4>
                                    <div>
                                        <label className="text-xs font-bold block">Max Multiplier</label>
                                        <input type="number" className="w-full p-1 border rounded bg-white text-gray-900" 
                                            value={tome.config?.combat?.multiplicationMax} 
                                            onChange={(e) => updateTomeConfig(tome.id, 'combat', 'multiplicationMax', parseInt(e.target.value))} />
                                    </div>
                                </div>
                                {/* Recherche */}
                                <div className="space-y-2">
                                    <h4 className="font-bold text-sm text-blue-700">Recherche</h4>
                                    <div>
                                        <label className="text-xs font-bold block">Max Dividend</label>
                                        <input type="number" className="w-full p-1 border rounded bg-white text-gray-900" 
                                            value={tome.config?.recherche?.divisionMaxDividend} 
                                            onChange={(e) => updateTomeConfig(tome.id, 'recherche', 'divisionMaxDividend', parseInt(e.target.value))} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Encounters */}
                        <div className="flex justify-between items-center mb-2 border-b border-parchment-500 pb-1">
                            <h3 className="font-serif font-bold text-lg text-red-800 flex items-center">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Enemies List
                            </h3>
                            <button 
                                onClick={() => addEncounter(tome.id)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center"
                            >
                                <Plus className="w-3 h-3 mr-1"/> Add Enemy
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            {tome.possibleEncounters.map(encounter => (
                                <div 
                                    key={encounter.id} 
                                    className={`bg-white p-4 rounded shadow-sm relative group
                                        ${encounter.type === 'boss' || encounter.type === 'miniboss' ? 'border-4 border-yellow-500' : 'border border-parchment-300'}
                                    `}
                                >
                                     <button 
                                        onClick={() => removeEncounter(tome.id, encounter.id)}
                                        className="absolute top-2 right-2 p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                                        title="Remove Enemy"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    
                                    <div className="flex justify-between mb-2 mr-6">
                                        <input 
                                            className="font-bold text-red-900 bg-transparent border-b border-dashed border-gray-300 focus:border-red-500 outline-none w-full"
                                            value={encounter.name}
                                            onChange={(e) => updateEncounter(tome.id, encounter.id, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                        <div>
                                            <label className="text-xs font-bold block text-gray-600">Win Score</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded bg-white text-gray-900"
                                                value={encounter.threshold}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'threshold', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold block text-gray-600">HP Damage</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded bg-white text-gray-900"
                                                value={encounter.hpLoss}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'hpLoss', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold block text-gray-600">Gold Reward</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded bg-white text-gray-900"
                                                value={encounter.goldReward}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'goldReward', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold block text-gray-600">XP Reward</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded bg-white text-gray-900"
                                                value={encounter.xpReward || 0}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'xpReward', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    
                                    {/* Type Selector */}
                                    <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                                        <div className="flex-1">
                                            <label className="text-xs font-bold block text-gray-600">Type</label>
                                            <select 
                                                className="w-full p-1 border rounded bg-white text-gray-900"
                                                value={encounter.type || 'normal'}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'type', e.target.value as EncounterType)}
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="boss">Boss (End of Tome)</option>
                                                <option value="miniboss">Mini-Boss</option>
                                            </select>
                                        </div>
                                        {encounter.type === 'miniboss' && (
                                            <div className="flex-1">
                                                <label className="text-xs font-bold block text-gray-600">Trigger Step</label>
                                                <input 
                                                    type="number"
                                                    placeholder="Step count..."
                                                    className="w-full p-1 border rounded bg-white text-gray-900"
                                                    value={encounter.triggerStep || 0}
                                                    onChange={(e) => updateEncounter(tome.id, encounter.id, 'triggerStep', parseInt(e.target.value))}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {tome.possibleEncounters.length === 0 && (
                                <p className="text-center text-gray-500 italic text-sm">No enemies in this tome.</p>
                            )}
                        </div>

                        {/* Export Actions */}
                        <div className="mt-6 flex justify-end space-x-2 border-t border-parchment-400 pt-4">
                            <button 
                                onClick={() => handleCopyToClipboard(tome)}
                                className="flex items-center px-3 py-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700 text-sm"
                            >
                                <Copy className="w-4 h-4 mr-2" />
                                Copy Code
                            </button>
                             <button 
                                onClick={() => handleDownloadTome(tome)}
                                className="flex items-center px-3 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 text-sm"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export .ts
                            </button>
                        </div>
                    </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* --- ITEM VIEWER --- */}
        {activeTab === 'items' && (
           <div className="space-y-6">
             {Object.entries(lootData).map(([rarity, items]) => (
                <div key={rarity} className="bg-parchment-200 rounded-lg shadow-lg border-2 border-parchment-400 overflow-hidden">
                   <div className={`p-3 font-bold text-lg uppercase tracking-widest border-b border-parchment-400 ${RARITY_TEXT_COLORS[rarity as Rarity]}`}>
                      {rarity} Items
                   </div>
                   <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {items.map((item, idx) => (
                         <button 
                            key={idx}
                            onClick={() => setPreviewItem({...item, rarity: rarity as Rarity})}
                            className="flex flex-col items-center p-3 bg-white rounded border border-parchment-300 hover:shadow-lg hover:scale-105 transition-all"
                         >
                            <div className="w-12 h-12 mb-2">
                               {item.image ? (
                                   <img src={item.image} className="w-full h-full object-contain" alt={item.name}/>
                               ) : (
                                   <Box className={`w-full h-full ${RARITY_TEXT_COLORS[rarity as Rarity]}`} />
                               )}
                            </div>
                            <span className="text-xs font-bold text-center leading-tight line-clamp-2">{item.name}</span>
                         </button>
                      ))}
                   </div>
                </div>
             ))}
           </div>
        )}

        {/* --- LOOT EDITOR --- */}
        {activeTab === 'loot' && (
          <div className="bg-parchment-200 p-6 rounded-lg shadow-lg border-2 border-parchment-400 text-parchment-900">
             <h3 className="text-2xl font-serif font-bold mb-4 flex items-center">
                 <Sliders className="w-6 h-6 mr-2" />
                 Loot Rarity Probability Weights
             </h3>
             <p className="mb-6 italic text-parchment-700">Higher numbers mean the rarity is more likely to appear.</p>
             
             <div className="space-y-6">
                {lootWeights.map((lw) => (
                    <div key={lw.rarity} className="flex items-center space-x-4">
                        <div className="w-32 font-bold font-serif text-lg">{lw.rarity}</div>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={lw.weight}
                            onChange={(e) => updateLootWeight(lw.rarity, parseInt(e.target.value))}
                            className="flex-1 h-2 bg-parchment-400 rounded-lg appearance-none cursor-pointer accent-amber-600"
                        />
                        <input 
                            type="number"
                            value={lw.weight}
                            onChange={(e) => updateLootWeight(lw.rarity, parseInt(e.target.value))}
                            className="w-20 p-2 border border-parchment-500 rounded font-mono font-bold bg-white text-gray-900"
                        />
                    </div>
                ))}
             </div>
          </div>
        )}

        {/* --- USERS EDITOR --- */}
        {activeTab === 'users' && (
          <div className="bg-parchment-200 p-6 rounded-lg shadow-lg border-2 border-parchment-400 text-parchment-900">
             <h3 className="text-2xl font-serif font-bold mb-4 flex items-center">
                 <Users className="w-6 h-6 mr-2" />
                 Grimoire of Souls
             </h3>
             <p className="mb-6 italic text-parchment-700">A registry of all adventurers who have entered the realm.</p>

             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-parchment-400 text-parchment-900">
                     <th className="p-3 font-serif font-bold border border-parchment-500">Username</th>
                     <th className="p-3 font-serif font-bold border border-parchment-500">Level</th>
                     <th className="p-3 font-serif font-bold border border-parchment-500">Gold</th>
                     <th className="p-3 font-serif font-bold border border-parchment-500">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {users.map((user) => (
                     <tr key={user.uid || user.username} className="bg-parchment-100 border border-parchment-300 hover:bg-white transition-colors">
                       <td className="p-3 border border-parchment-300 font-bold">{user.username}</td>
                       <td className="p-3 border border-parchment-300">
                          <span className="flex items-center"><Crown className="w-3 h-3 mr-1 text-amber-600"/> {user.level}</span>
                       </td>
                       <td className="p-3 border border-parchment-300">
                          <span className="flex items-center"><Coins className="w-3 h-3 mr-1 text-amber-500"/> {user.gold}</span>
                       </td>
                       <td className="p-3 border border-parchment-300 text-center">
                         {user.username !== 'Gandalf' && (
                           <button 
                             onClick={() => handleDeleteUser(user)}
                             className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-600 hover:text-white transition-colors"
                             title="Banish User"
                           >
                             <Trash2 className="w-4 h-4" />
                           </button>
                         )}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        )}

      </div>

      <ItemDetailOverlay item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
};

export default AdminPanel;
