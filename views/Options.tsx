
import React, { useState } from 'react';
import { GameConfig, StorageMode } from '../types';
import { ChevronLeft, Info, Cloud, Database, Trash2, Gamepad2, Server, RefreshCw, Settings, Check, Globe, AlignJustify, AlignCenter, BookOpen, Scroll } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound } from '../services/audioService';
import { MarkdownLite } from '../components/MarkdownLite';

interface OptionsProps {
  config: GameConfig;
  setConfig: (config: GameConfig) => void;
  onBack: () => void;
  isAdmin: boolean;
  storageMode: StorageMode;
  onStorageModeChange: (mode: StorageMode) => void;
  onDeleteAccount: () => void;
  onResetProfile: () => void;
}

const Options: React.FC<OptionsProps> = ({ config, setConfig, onBack, storageMode, onStorageModeChange, onDeleteAccount, onResetProfile }) => {
  const { t, lang, setLang } = useLocalization();
  const [activeTab, setActiveTab] = useState<'general' | 'gameplay' | 'data' | 'tutorials'>('general');
  const [activeTutorial, setActiveTutorial] = useState<'basics' | 'pillars' | 'growth' | 'advanced'>('basics');
  
  const handleChange = (section: keyof GameConfig, field: string, value: number | boolean) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    });
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone and all progress will be lost forever.")) {
        onDeleteAccount();
    }
  };

  const handleResetClick = () => {
    if (window.confirm("Are you sure you want to reset your progress? You will keep your account but lose all gold, experience, and items.")) {
        onResetProfile();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-4 animate-fadeIn">
      <div className="flex items-center mb-6">
        <button onClick={() => { playMenuBackSound(); onBack(); }} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
          <ChevronLeft />
        </button>
        <h1 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.options}</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">
        
        {/* Sidebar Tabs */}
        <div className="w-full md:w-1/4 flex flex-col space-y-2 shrink-0">
            <button 
                onClick={() => setActiveTab('general')}
                className={`p-4 rounded-lg font-serif font-bold flex items-center transition-all text-left ${
                    activeTab === 'general' 
                    ? 'bg-parchment-200 text-parchment-900 shadow-md border-l-4 border-amber-500' 
                    : 'bg-parchment-900/50 text-parchment-400 hover:bg-parchment-800 hover:text-parchment-200'
                }`}
            >
                <Settings className="w-5 h-5 mr-3" />
                General
            </button>
            <button 
                onClick={() => setActiveTab('tutorials')}
                className={`p-4 rounded-lg font-serif font-bold flex items-center transition-all text-left ${
                    activeTab === 'tutorials' 
                    ? 'bg-parchment-200 text-parchment-900 shadow-md border-l-4 border-amber-500' 
                    : 'bg-parchment-900/50 text-parchment-400 hover:bg-parchment-800 hover:text-parchment-200'
                }`}
            >
                <BookOpen className="w-5 h-5 mr-3" />
                {t.options.tutorialsTab}
            </button>
            <button 
                onClick={() => setActiveTab('gameplay')}
                className={`p-4 rounded-lg font-serif font-bold flex items-center transition-all text-left ${
                    activeTab === 'gameplay' 
                    ? 'bg-parchment-200 text-parchment-900 shadow-md border-l-4 border-amber-500' 
                    : 'bg-parchment-900/50 text-parchment-400 hover:bg-parchment-800 hover:text-parchment-200'
                }`}
            >
                <Gamepad2 className="w-5 h-5 mr-3" />
                {t.options.gameplayTab}
            </button>
            <button 
                onClick={() => setActiveTab('data')}
                className={`p-4 rounded-lg font-serif font-bold flex items-center transition-all text-left ${
                    activeTab === 'data' 
                    ? 'bg-parchment-200 text-parchment-900 shadow-md border-l-4 border-amber-500' 
                    : 'bg-parchment-900/50 text-parchment-400 hover:bg-parchment-800 hover:text-parchment-200'
                }`}
            >
                <Server className="w-5 h-5 mr-3" />
                {t.options.dataTab}
            </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-parchment-900/30 rounded-xl border border-parchment-800 overflow-y-auto custom-scrollbar p-1">
            
            {activeTab === 'general' && (
            <div className="space-y-6 animate-fadeIn p-4">
                {/* Language Settings */}
                <section className="bg-parchment-200 p-6 rounded-lg border-2 border-parchment-400 shadow-lg text-parchment-900">
                    <h2 className="text-2xl font-serif mb-4 flex items-center border-b border-parchment-400 pb-2">
                        <Globe className="w-6 h-6 mr-2" />
                        Language / Langue
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                        { code: 'en', label: 'English', flag: '🇬🇧' },
                        { code: 'fr', label: 'Français', flag: '🇫🇷' }
                        ].map((opt) => (
                        <button
                            key={opt.code}
                            onClick={() => setLang(opt.code as 'en' | 'fr')}
                            className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center transition-all ${
                            lang === opt.code 
                                ? 'bg-amber-100 border-amber-500 shadow-inner' 
                                : 'bg-white border-parchment-300 hover:bg-parchment-50'
                            }`}
                        >
                            <span className="text-3xl mb-2">{opt.flag}</span>
                            <span className="font-bold">{opt.label}</span>
                            {lang === opt.code && <Check className="w-5 h-5 text-green-600 mt-1" />}
                        </button>
                        ))}
                    </div>
                </section>

                {/* UI Settings */}
                <section className="bg-parchment-200 p-6 rounded-lg border-2 border-parchment-400 shadow-lg text-parchment-900">
                    <h2 className="text-2xl font-serif mb-4 flex items-center border-b border-parchment-400 pb-2">
                        <Settings className="w-6 h-6 mr-2" />
                        Interface
                    </h2>
                    <div className="flex items-center justify-between bg-white p-4 rounded border border-parchment-300">
                        <div className="flex items-center">
                            {config.ui.verticalMath ? <AlignJustify className="w-8 h-8 mr-3 text-parchment-600" /> : <AlignCenter className="w-8 h-8 mr-3 text-parchment-600" />}
                            <div>
                                <div className="font-bold text-lg">Vertical Math Layout</div>
                                <div className="text-sm text-parchment-600">Stack numbers vertically (e.g. 1 + 2) instead of horizontally (1 + 2 = 3).</div>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => handleChange('ui', 'verticalMath', !config.ui.verticalMath)}
                            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors ${config.ui.verticalMath ? 'bg-green-600' : 'bg-gray-400'}`}
                        >
                            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${config.ui.verticalMath ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </section>
            </div>
            )}

            {/* TUTORIALS TAB */}
            {activeTab === 'tutorials' && (
                <div className="flex flex-col h-full animate-fadeIn p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {[
                            { id: 'basics', label: 'Basics' },
                            { id: 'pillars', label: 'Game Modes' },
                            { id: 'growth', label: 'Growth' },
                            { id: 'advanced', label: 'Advanced' }
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTutorial(item.id as any)}
                                className={`px-4 py-2 rounded-full font-bold text-sm transition-colors border-2
                                    ${activeTutorial === item.id 
                                        ? 'bg-amber-600 text-white border-amber-400' 
                                        : 'bg-parchment-300 text-parchment-900 border-parchment-400 hover:bg-parchment-400'}
                                `}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className="bg-parchment-100 p-6 rounded-lg border-2 border-parchment-400 shadow-md text-parchment-900 flex-1 overflow-y-auto">
                        <div className="flex items-center mb-4 border-b-2 border-parchment-300 pb-2">
                            <Scroll className="w-6 h-6 mr-2 text-amber-700" />
                            <h2 className="text-2xl font-serif font-bold text-amber-800">
                                {activeTutorial === 'basics' && t.tutorial.basicsTitle}
                                {activeTutorial === 'pillars' && t.tutorial.pillarsTitle}
                                {activeTutorial === 'growth' && t.tutorial.growthTitle}
                                {activeTutorial === 'advanced' && t.tutorial.advancedTitle}
                            </h2>
                        </div>
                        <div className="text-lg">
                            <MarkdownLite content={
                                activeTutorial === 'basics' ? t.tutorial.basicsBody :
                                activeTutorial === 'pillars' ? t.tutorial.pillarsBody :
                                activeTutorial === 'growth' ? t.tutorial.growthBody :
                                t.tutorial.advancedBody
                            } />
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'data' && (
            <div className="space-y-6 animate-fadeIn p-4">
                {/* Storage Settings */}
                <section className="bg-parchment-200 p-6 rounded-lg border-2 border-parchment-400 shadow-lg text-parchment-900">
                <h2 className="text-2xl font-serif mb-4 flex items-center border-b border-parchment-400 pb-2">
                    <Database className="w-6 h-6 mr-2" />
                    {t.auth.storageMode}
                </h2>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <button 
                        onClick={() => onStorageModeChange(StorageMode.LOCAL)}
                        className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center transition-all ${storageMode === StorageMode.LOCAL ? 'bg-parchment-100 border-amber-500 shadow-inner' : 'bg-white border-parchment-300 opacity-60 hover:opacity-100'}`}
                    >
                        <Database className="w-6 h-6 mr-3 text-parchment-600" />
                        <span className="font-bold">{t.auth.local}</span>
                    </button>
                    <button 
                        onClick={() => onStorageModeChange(StorageMode.CLOUD)}
                        className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center transition-all ${storageMode === StorageMode.CLOUD ? 'bg-blue-50 border-blue-500 shadow-inner' : 'bg-white border-parchment-300 opacity-60 hover:opacity-100'}`}
                    >
                        <Cloud className="w-6 h-6 mr-3 text-blue-500" />
                        <span className="font-bold">{t.auth.cloud}</span>
                    </button>
                </div>
                
                <p className="text-xs text-parchment-600 mt-2 italic text-center">Switching modes will return you to the login screen.</p>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-50 p-6 rounded-lg border-2 border-red-200 shadow-lg mt-8 mb-8 text-red-900">
                    <h2 className="text-2xl font-serif text-red-700 mb-4 flex items-center border-b border-red-200 pb-2">
                        <Trash2 className="w-6 h-6 mr-2" />
                        {t.titles.dangerZone}
                    </h2>
                    
                    {/* Reset Progress */}
                    <div className="mb-6 border-b border-red-200 pb-6">
                        <div className="flex justify-between items-center mb-3">
                            <div className="font-bold text-lg">Reset Progress</div>
                            <button 
                                onClick={handleResetClick}
                                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold flex items-center shadow-sm"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                {t.buttons.resetProfile}
                            </button>
                        </div>
                        <p className="text-red-700/70 text-sm italic">
                            Reset your level, gold, and items to zero. Your account and login credentials will remain active.
                        </p>
                    </div>

                    {/* Full Delete */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <div className="font-bold text-lg">Delete Account</div>
                            <button 
                                onClick={handleDeleteClick}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-bold flex items-center shadow-sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t.buttons.deleteAccount}
                            </button>
                        </div>
                        <p className="text-red-700/70 text-sm italic">
                        Permanently remove your hero profile, login credentials, and all data from the {storageMode} database.
                        </p>
                    </div>
                </section>
            </div>
            )}

            {activeTab === 'gameplay' && (
            <div className="space-y-6 animate-fadeIn p-4">
                <div className="bg-blue-900/40 border border-blue-500 p-4 rounded-lg flex items-start">
                    <Info className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                    <p className="text-blue-100 text-sm">
                    {t.home.infiniteDesc}
                    </p>
                </div>

                {/* Mouvement Settings */}
                <section className="bg-parchment-200 p-6 rounded-lg border-2 border-parchment-400 shadow-lg text-parchment-900">
                <h2 className="text-2xl font-serif text-parchment-800 mb-4 border-b border-parchment-400 pb-2">{t.titles.movement}</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                    <label className="font-bold text-parchment-700">Min Equation Value</label>
                    <input 
                        type="number" 
                        value={config.movement.minVal}
                        onChange={(e) => handleChange('movement', 'minVal', parseInt(e.target.value) || 0)}
                        className="w-24 p-2 bg-white border border-parchment-400 rounded text-center font-mono"
                    />
                    </div>
                    <div className="flex justify-between items-center">
                    <label className="font-bold text-parchment-700">Max Equation Value</label>
                    <input 
                        type="number" 
                        value={config.movement.maxVal}
                        onChange={(e) => handleChange('movement', 'maxVal', parseInt(e.target.value) || 0)}
                        className="w-24 p-2 bg-white border border-parchment-400 rounded text-center font-mono"
                    />
                    </div>
                </div>
                </section>

                {/* Combat Settings */}
                <section className="bg-parchment-200 p-6 rounded-lg border-2 border-parchment-400 shadow-lg text-parchment-900">
                <h2 className="text-2xl font-serif text-parchment-800 mb-4 border-b border-parchment-400 pb-2">{t.titles.combat}</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                    <label className="font-bold text-parchment-700">Multiplication Max Factor</label>
                    <input 
                        type="number" 
                        value={config.combat.multiplicationMax}
                        onChange={(e) => handleChange('combat', 'multiplicationMax', parseInt(e.target.value) || 1)}
                        className="w-24 p-2 bg-white border border-parchment-400 rounded text-center font-mono"
                    />
                    </div>
                    <div className="flex justify-between items-center">
                    <label className="font-bold text-parchment-700">Questions Count</label>
                    <input 
                        type="number" 
                        value={config.combat.questionsCount}
                        onChange={(e) => handleChange('combat', 'questionsCount', parseInt(e.target.value) || 1)}
                        className="w-24 p-2 bg-white border border-parchment-400 rounded text-center font-mono"
                    />
                    </div>
                </div>
                </section>

                {/* Recherche Settings */}
                <section className="bg-parchment-200 p-6 rounded-lg border-2 border-parchment-400 shadow-lg text-parchment-900">
                <h2 className="text-2xl font-serif text-parchment-800 mb-4 border-b border-parchment-400 pb-2">{t.titles.recherche}</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                    <label className="font-bold text-parchment-700">Max Dividend Value</label>
                    <input 
                        type="number" 
                        value={config.recherche.divisionMaxDividend}
                        onChange={(e) => handleChange('recherche', 'divisionMaxDividend', parseInt(e.target.value) || 10)}
                        className="w-24 p-2 bg-white border border-parchment-400 rounded text-center font-mono"
                    />
                    </div>
                </div>
                </section>
            </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default Options;
