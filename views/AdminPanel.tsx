
import React, { useState, useEffect } from 'react';
import { Tome, Encounter, LootWeight, Rarity, PlayerStats } from '../types';
import { ChevronLeft, Save, Edit3, Trash2, Plus, Sliders, Users, Key, Crown, Coins } from 'lucide-react';
import { getAllUsers, deleteUser } from '../services/storageService';

interface AdminPanelProps {
  tomes: Tome[];
  setTomes: (tomes: Tome[]) => void;
  lootWeights: LootWeight[];
  setLootWeights: (weights: LootWeight[]) => void;
  onBack: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tomes, setTomes, lootWeights, setLootWeights, onBack }) => {
  const [activeTab, setActiveTab] = useState<'tomes' | 'loot' | 'users'>('tomes');
  const [editingTomeId, setEditingTomeId] = useState<string | null>(null);
  const [users, setUsers] = useState<PlayerStats[]>([]);

  useEffect(() => {
    if (activeTab === 'users') {
      refreshUsers();
    }
  }, [activeTab]);

  const refreshUsers = () => {
    setUsers(getAllUsers());
  };

  const handleDeleteUser = (username: string) => {
    if (window.confirm(`Are you sure you want to banish ${username} from the realm?`)) {
      deleteUser(username);
      refreshUsers();
    }
  };

  // --- Tome Handlers ---
  const updateTome = (id: string, field: keyof Tome, value: any) => {
    setTomes(tomes.map(t => t.id === id ? { ...t, [field]: value } : t));
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

  // --- Loot Handlers ---
  const updateLootWeight = (rarity: Rarity, weight: number) => {
    setLootWeights(lootWeights.map(lw => 
      lw.rarity === rarity ? { ...lw, weight: weight } : lw
    ));
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 bg-parchment-900/80 p-4 rounded-lg border border-purple-500">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
            <ChevronLeft />
          </button>
          <h1 className="text-3xl font-serif font-bold text-purple-300">Gandalf's Administration</h1>
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
                        {/* Tome Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block font-bold text-sm">Title (EN)</label>
                                <input 
                                    className="w-full p-2 border border-parchment-500 rounded bg-white"
                                    value={tome.title}
                                    onChange={(e) => updateTome(tome.id, 'title', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm">Image URL</label>
                                <input 
                                    className="w-full p-2 border border-parchment-500 rounded bg-white"
                                    value={tome.image || ''}
                                    placeholder="https://..."
                                    onChange={(e) => updateTome(tome.id, 'image', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block font-bold text-sm">Total Distance (Steps)</label>
                                <input 
                                    type="number"
                                    className="w-full p-2 border border-parchment-500 rounded bg-white"
                                    value={tome.totalDistance}
                                    onChange={(e) => updateTome(tome.id, 'totalDistance', parseInt(e.target.value))}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block font-bold text-sm">Description</label>
                                <textarea 
                                    className="w-full p-2 border border-parchment-500 rounded bg-white"
                                    value={tome.description}
                                    onChange={(e) => updateTome(tome.id, 'description', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Encounters */}
                        <h3 className="font-serif font-bold text-lg mb-2 border-b border-parchment-500 pb-1 text-red-800 flex items-center">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Enemies
                        </h3>
                        <div className="space-y-4">
                            {tome.possibleEncounters.map(encounter => (
                                <div key={encounter.id} className="bg-white/50 p-4 rounded border border-parchment-300">
                                    <div className="flex justify-between mb-2">
                                        <h4 className="font-bold text-red-700">{encounter.name}</h4>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div>
                                            <label className="text-xs font-bold block">Win Score</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded"
                                                value={encounter.threshold}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'threshold', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold block">HP Damage</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded"
                                                value={encounter.hpLoss}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'hpLoss', parseInt(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold block">Gold Reward</label>
                                            <input 
                                                type="number"
                                                className="w-full p-1 border rounded"
                                                value={encounter.goldReward}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'goldReward', parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
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
                            className="w-20 p-2 border border-parchment-500 rounded font-mono font-bold"
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
                     <th className="p-3 font-serif font-bold border border-parchment-500">Password</th>
                     <th className="p-3 font-serif font-bold border border-parchment-500">Level</th>
                     <th className="p-3 font-serif font-bold border border-parchment-500">Gold</th>
                     <th className="p-3 font-serif font-bold border border-parchment-500">Action</th>
                   </tr>
                 </thead>
                 <tbody>
                   {users.map((user) => (
                     <tr key={user.username} className="bg-parchment-100 border border-parchment-300 hover:bg-white transition-colors">
                       <td className="p-3 border border-parchment-300 font-bold">{user.username}</td>
                       <td className="p-3 border border-parchment-300 font-mono text-sm text-gray-600 flex items-center">
                          <Key className="w-3 h-3 mr-1 opacity-50"/> 
                          {user.password || <span className="italic opacity-50">Guest</span>}
                       </td>
                       <td className="p-3 border border-parchment-300">
                          <span className="flex items-center"><Crown className="w-3 h-3 mr-1 text-amber-600"/> {user.level}</span>
                       </td>
                       <td className="p-3 border border-parchment-300">
                          <span className="flex items-center"><Coins className="w-3 h-3 mr-1 text-amber-500"/> {user.gold}</span>
                       </td>
                       <td className="p-3 border border-parchment-300 text-center">
                         {user.username !== 'Gandalf' && (
                           <button 
                             onClick={() => handleDeleteUser(user.username)}
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
    </div>
  );
};

export default AdminPanel;