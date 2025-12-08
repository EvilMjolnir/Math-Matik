
import React, { useState, useEffect } from 'react';
import { Tome, Encounter, LootWeight, Rarity, PlayerStats, GameConfig, EncounterType, Item, StorageMode, EffectType } from '../types';
import { ChevronLeft, Edit3, Trash2, Sliders, Users, Crown, Coins, Download, Copy, Plus, Activity, Box, Database, Cloud, Sword, TestTube, X, Gift, Sparkles, Star, Footprints, Shield } from 'lucide-react';
import * as localStore from '../services/storageService';
import * as cloudStore from '../services/storageService_Live';
import { lootData } from '../data/loot';
import { STATUS_EFFECTS } from '../data/statusEffects';
import { RARITY_TEXT_COLORS } from '../constants';
import ItemDetailOverlay from '../components/ItemDetailOverlay';
import EncounterIntroCard from '../components/EncounterIntroCard';
import LootRewardCard from '../components/LootRewardCard';
import { playMenuBackSound } from '../services/audioService';
import { getEnemyStats } from '../services/statusService';

interface AdminPanelProps {
  tomes: Tome[];
  setTomes: (tomes: Tome[]) => void;
  lootWeights: LootWeight[];
  setLootWeights: (weights: LootWeight[]) => void;
  onBack: () => void;
  storageMode: StorageMode;
  onTestEncounter: (encounter: Encounter, tomeId: string) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ tomes, setTomes, lootWeights, setLootWeights, onBack, storageMode, onTestEncounter }) => {
  const [activeTab, setActiveTab] = useState<'tomes' | 'loot' | 'users' | 'items' | 'uilab' | 'effects'>('tomes');
  const [editingTomeId, setEditingTomeId] = useState<string | null>(null);
  const [users, setUsers] = useState<PlayerStats[]>([]);
  const [previewItem, setPreviewItem] = useState<Item | null>(null);
  
  // UI Lab State
  const [testView, setTestView] = useState<'none' | 'intro' | 'loot'>('none');
  const [testData, setTestData] = useState<any>(null);

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
        monsterHP: 10,
        attack: 5,
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

  // --- UI Lab Handlers ---
  const handleTestIntro = (encounterType: 'wolf' | 'boss') => {
      const dummyEncounter: Encounter = encounterType === 'wolf' ? {
          id: 'test_wolf',
          name: 'Timber Wolf',
          description: 'A test wolf for UI calibration.',
          monsterHP: 10,
          attack: 5,
          goldReward: 5,
          xpReward: 10,
          type: 'normal',
          image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/timber_wolf.png" // Theoretical placeholder
      } : {
          id: 'test_boss',
          name: 'The Root Keeper',
          description: 'The big bad boss test.',
          monsterHP: 100,
          attack: 20,
          goldReward: 50,
          xpReward: 200,
          type: 'boss',
          tags: ['mon_elite', 'mon_fierce'],
          image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/encounters/monsters/root_keeper.png" // Theoretical placeholder
      };
      
      setTestData({ encounter: dummyEncounter });
      setTestView('intro');
  };

  const handleTestLoot = (rarity: Rarity) => {
      const items = lootData[rarity];
      let item: Item;

      if (items && items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          const randomSource = items[randomIndex];
          
          item = {
              name: randomSource.name,
              name_fr: randomSource.name_fr,
              description: randomSource.description,
              description_fr: randomSource.description_fr,
              tags: randomSource.tags,
              rarity: rarity,
              image: (randomSource as any).image
          };
      } else {
          item = { 
            name: 'Test Item', 
            description: 'Test Desc', 
            rarity: rarity 
          };
      }
      
      setTestData({ item, xpReward: 50 });
      setTestView('loot');
  };

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-5 h-5 text-yellow-500" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-5 h-5 text-amber-500" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-5 h-5 text-green-500" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-5 h-5 text-red-500" />;
        case EffectType.ENEMY_HP_BONUS: return <Shield className="w-5 h-5 text-blue-500" />;
        case EffectType.ENEMY_DAMAGE_BONUS: return <Sword className="w-5 h-5 text-red-600" />;
        case EffectType.ENEMY_GOLD_REWARD_BONUS: return <Coins className="w-5 h-5 text-amber-600" />;
        case EffectType.ENEMY_XP_REWARD_BONUS: return <Star className="w-5 h-5 text-yellow-600" />;
        default: return <Sparkles className="w-5 h-5 text-purple-500" />;
    }
  };

  const NavButton = ({ tab, icon, label }: { tab: typeof activeTab, icon: React.ReactNode, label: string }) => (
      <button 
        onClick={() => setActiveTab(tab)}
        className={`
            w-full px-4 py-3 rounded-lg font-bold flex items-center justify-start transition-all border-2
            ${activeTab === tab 
                ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_10px_rgba(147,51,234,0.4)]' 
                : 'bg-parchment-800 text-gray-400 border-transparent hover:bg-parchment-700 hover:text-gray-200'
            }
        `}
    >
        <span className="mr-3">{icon}</span>
        {label}
    </button>
  );

  // --- Render Overlays ---
  if (testView === 'intro' && testData) {
      return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="w-full max-w-4xl h-full relative">
                  <button 
                      onClick={() => setTestView('none')}
                      className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full text-black hover:bg-gray-200"
                  >
                      <X className="w-6 h-6" />
                  </button>
                  <EncounterIntroCard 
                    encounter={testData.encounter} 
                    enemyStats={getEnemyStats(testData.encounter)} 
                    isBossMode={testData.encounter.type === 'boss'} 
                    onStart={() => setTestView('none')} 
                  />
              </div>
          </div>
      );
  }

  if (testView === 'loot' && testData) {
      return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
               <div className="w-full max-w-4xl h-full relative flex items-center justify-center">
                  <button 
                      onClick={() => setTestView('none')}
                      className="absolute top-4 right-4 z-50 p-2 bg-white rounded-full text-black hover:bg-gray-200"
                  >
                      <X className="w-6 h-6" />
                  </button>
                  <LootRewardCard 
                      item={testData.item}
                      onBack={() => setTestView('none')}
                      solvedCorrectly={true}
                  />
               </div>
          </div>
      )
  }

  return (
    <div className="flex flex-col h-full max-w-7xl mx-auto p-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 bg-parchment-900/80 p-4 rounded-lg border border-purple-500 shrink-0 shadow-lg">
        <div className="flex items-center">
          <button onClick={() => { playMenuBackSound(); onBack(); }} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700 border border-parchment-600">
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
      </div>

      <div className="flex flex-1 overflow-hidden gap-6">
        {/* Left Sidebar Navigation */}
        <nav className="w-48 flex flex-col space-y-3 shrink-0 py-2">
            <NavButton tab="tomes" icon={<Edit3 className="w-5 h-5"/>} label="Tomes" />
            <NavButton tab="items" icon={<Box className="w-5 h-5"/>} label="Items" />
            <NavButton tab="loot" icon={<Sliders className="w-5 h-5"/>} label="Loot" />
            <NavButton tab="effects" icon={<Sparkles className="w-5 h-5"/>} label="Effects" />
            <NavButton tab="users" icon={<Users className="w-5 h-5"/>} label="Users" />
            <NavButton tab="uilab" icon={<TestTube className="w-5 h-5"/>} label="UI Lab" />
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
            
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
                                        <div className="absolute top-2 right-2 flex space-x-1">
                                        <button
                                            onClick={() => onTestEncounter(encounter, tome.id)}
                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                                            title="Test Battle"
                                        >
                                            <Sword className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => removeEncounter(tome.id, encounter.id)}
                                            className="p-1 text-red-400 hover:text-red-700 hover:bg-red-100 rounded transition-colors"
                                            title="Remove Enemy"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        </div>
                                        
                                        <div className="flex justify-between mb-2 mr-16">
                                            <input 
                                                className="font-bold text-red-900 bg-transparent border-b border-dashed border-gray-300 focus:border-red-500 outline-none w-full"
                                                value={encounter.name}
                                                onChange={(e) => updateEncounter(tome.id, encounter.id, 'name', e.target.value)}
                                            />
                                        </div>
                                        
                                        {/* Image Input */}
                                        <div className="mb-2">
                                            <label className="text-xs font-bold block text-gray-600">Image URL</label>
                                            <div className="flex gap-2">
                                                <input 
                                                    className="w-full p-1 border rounded bg-white text-gray-900 text-sm"
                                                    value={encounter.image || ''}
                                                    placeholder="https://... (Optional)"
                                                    onChange={(e) => updateEncounter(tome.id, encounter.id, 'image', e.target.value)}
                                                />
                                                {encounter.image && (
                                                    <div className="w-10 h-10 shrink-0 border border-gray-300 rounded overflow-hidden bg-gray-100">
                                                        <img src={encounter.image} alt="Preview" className="w-full h-full object-cover" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 mb-2">
                                            <div>
                                                <label className="text-xs font-bold block text-gray-600">Monster HP</label>
                                                <input 
                                                    type="number"
                                                    className="w-full p-1 border rounded bg-white text-gray-900"
                                                    value={encounter.monsterHP}
                                                    onChange={(e) => updateEncounter(tome.id, encounter.id, 'monsterHP', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold block text-gray-600">Attack</label>
                                                <input 
                                                    type="number"
                                                    className="w-full p-1 border rounded bg-white text-gray-900"
                                                    value={encounter.attack}
                                                    onChange={(e) => updateEncounter(tome.id, encounter.id, 'attack', parseInt(e.target.value))}
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
                                {(item as any).image ? (
                                    <img src={(item as any).image} className="w-full h-full object-contain" alt={item.name}/>
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

            {/* --- EFFECTS VIEWER --- */}
            {activeTab === 'effects' && (
                <div className="bg-parchment-200 p-6 rounded-lg shadow-lg border-2 border-parchment-400 text-parchment-900">
                    <h3 className="text-2xl font-serif font-bold mb-4 flex items-center">
                        <Sparkles className="w-6 h-6 mr-2" />
                        Status Effects Registry
                    </h3>
                    <p className="mb-6 italic text-parchment-700">All registered buffs and debuffs available in the realm.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.values(STATUS_EFFECTS).map(effect => (
                           <div key={effect.id} className="bg-white p-4 rounded border border-parchment-300 shadow-sm relative overflow-hidden">
                               <div className="flex items-center mb-2 border-b border-parchment-200 pb-2">
                                   <div className="p-2 bg-parchment-100 rounded-full mr-3 border border-parchment-200">
                                       {getEffectIcon(effect.type)}
                                   </div>
                                   <div>
                                       <div className="font-bold text-lg leading-none">{effect.name}</div>
                                       <div className="text-xs text-gray-500 italic">{effect.name_fr}</div>
                                   </div>
                               </div>
                               
                               <div className="space-y-2 text-sm">
                                   <div className="flex justify-between">
                                       <span className="font-bold text-gray-600">ID:</span>
                                       <span className="font-mono text-xs bg-gray-100 px-1 rounded">{effect.id}</span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span className="font-bold text-gray-600">Type:</span>
                                       <span className="text-xs text-right max-w-[150px]">{effect.type}</span>
                                   </div>
                                   <div className="flex justify-between">
                                       <span className="font-bold text-gray-600">Value:</span>
                                       <span className="font-bold">{effect.value}</span>
                                   </div>
                                   
                                   <div className="mt-2 pt-2 border-t border-parchment-100">
                                       <p className="text-gray-800">{effect.description}</p>
                                       <p className="text-gray-500 text-xs italic">{effect.description_fr}</p>
                                   </div>
                               </div>
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

            {/* --- UI LAB --- */}
            {activeTab === 'uilab' && (
                <div className="space-y-6">
                    <div className="bg-parchment-200 p-6 rounded-lg shadow-lg border-2 border-parchment-400 text-parchment-900">
                        <h3 className="text-2xl font-serif font-bold mb-4 flex items-center">
                            <TestTube className="w-6 h-6 mr-2" />
                            Component Laboratory
                        </h3>
                        <p className="mb-6 italic text-parchment-700">Test individual UI components in isolation to verify formatting and animations.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Encounter Cards */}
                            <div className="bg-parchment-300 p-4 rounded border border-parchment-500">
                                <h4 className="font-bold text-lg mb-4 flex items-center"><Sword className="w-4 h-4 mr-2"/> Encounter Intros</h4>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => handleTestIntro('wolf')}
                                        className="w-full py-2 bg-red-800 text-white rounded hover:bg-red-700 font-bold"
                                    >
                                        Test Normal Enemy (Wolf)
                                    </button>
                                    <button 
                                        onClick={() => handleTestIntro('boss')}
                                        className="w-full py-2 bg-yellow-700 text-white rounded hover:bg-yellow-600 font-bold border-2 border-yellow-500"
                                    >
                                        Test Boss Intro
                                    </button>
                                </div>
                            </div>

                            {/* Loot Cards */}
                            <div className="bg-parchment-300 p-4 rounded border border-parchment-500">
                                <h4 className="font-bold text-lg mb-4 flex items-center"><Gift className="w-4 h-4 mr-2"/> Loot Rewards</h4>
                                <div className="space-y-2">
                                    <button 
                                        onClick={() => handleTestLoot(Rarity.COMMON)}
                                        className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-500 font-bold"
                                    >
                                        Test Common Reward
                                    </button>
                                    <button 
                                        onClick={() => handleTestLoot(Rarity.RARE)}
                                        className="w-full py-2 bg-green-700 text-white rounded hover:bg-green-600 font-bold"
                                    >
                                        Test Rare Reward
                                    </button>
                                    <button 
                                        onClick={() => handleTestLoot(Rarity.MAGIC)}
                                        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-500 font-bold"
                                    >
                                        Test Magic Reward
                                    </button>
                                    <button 
                                        onClick={() => handleTestLoot(Rarity.LEGENDARY)}
                                        className="w-full py-2 bg-amber-600 text-white rounded hover:bg-amber-500 font-bold"
                                    >
                                        Test Legendary Reward
                                    </button>
                                    <button 
                                        onClick={() => handleTestLoot(Rarity.MYTHIC)}
                                        className="w-full py-2 bg-purple-700 text-white rounded hover:bg-purple-600 font-bold border-2 border-purple-400"
                                    >
                                        Test Mythic Reward
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
      </div>

      <ItemDetailOverlay item={previewItem} onClose={() => setPreviewItem(null)} />
    </div>
  );
};

export default AdminPanel;
