
import React, { useState } from 'react';
import { GameConfig, StorageMode } from '../types';
import { ChevronLeft, Info, Cloud, Database, Trash2, Gamepad2, Server, RefreshCw, Settings, Check, Globe } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound } from '../services/audioService';

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
  const [activeTab, setActiveTab] = useState<'general' | 'gameplay' | 'data'>('general');
  
  const handleChange = (section: keyof GameConfig, field: string, value: number) => {
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
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="flex items-center mb-6">
        <button onClick={() => { playMenuBackSound(); onBack(); }} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
          <ChevronLeft />
        </button>
        <h1 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.options}</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-parchment-900/50 rounded-lg p-1 mb-6 border border-parchment-700">
        <button 
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-3 px-4 rounded font-serif font-bold flex items-center justify-center transition-all ${
            activeTab === 'general' 
              ? 'bg-parchment-200 text-parchment-900 shadow-md' 
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-parchment-800'
          }`}
        >
          <Settings className="w-5 h-5 mr-2" />
          General
        </button>
        <button 
          onClick={() => setActiveTab('gameplay')}
          className={`flex-1 py-3 px-4 rounded font-serif font-bold flex items-center justify-center transition-all ${
            activeTab === 'gameplay' 
              ? 'bg-parchment-200 text-parchment-900 shadow-md' 
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-parchment-800'
          }`}
        >
          <Gamepad2 className="w-5 h-5 mr-2" />
          {t.options.gameplayTab}
        </button>
        <button 
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-3 px-4 rounded font-serif font-bold flex items-center justify-center transition-all ${
            activeTab === 'data' 
              ? 'bg-parchment-200 text-parchment-900 shadow-md' 
              : 'text-parchment-400 hover:text-parchment-200 hover:bg-parchment-800'
          }`}
        >
          <Server className="w-5 h-5 mr-2" />
          {t.options.dataTab}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        
        {activeTab === 'general' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Language Settings */}
            <section className="bg-parchment-900/50 p-6 rounded-lg border-2 border-parchment-800">
               <h2 className="text-2xl font-serif text-parchment-300 mb-4 flex items-center">
                 <Globe className="w-6 h-6 mr-2" />
                 Language / Langue
               </h2>
               <div className="space-y-2">
                 {[
                   { code: 'en', label: 'English', flag: '🇬🇧' },
                   { code: 'fr', label: 'Français', flag: '🇫🇷' }
                 ].map((opt) => (
                   <button
                    key={opt.code}
                    onClick={() => setLang(opt.code as 'en' | 'fr')}
                    className={`w-full p-4 rounded-lg border-2 flex items-center justify-between transition-all ${
                      lang === opt.code 
                        ? 'bg-parchment-200 border-amber-500 text-parchment-900 shadow-md' 
                        : 'bg-parchment-800/50 border-parchment-700 text-parchment-400 hover:bg-parchment-800'
                    }`}
                   >
                     <div className="flex items-center">
                       <span className="text-2xl mr-4">{opt.flag}</span>
                       <span className="font-bold text-lg">{opt.label}</span>
                     </div>
                     {lang === opt.code && <Check className="w-6 h-6 text-green-600" />}
                   </button>
                 ))}
               </div>
            </section>
          </div>
        )}

        {activeTab === 'data' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Storage Settings */}
            <section className="bg-parchment-900/50 p-6 rounded-lg border-2 border-parchment-800">
               <h2 className="text-2xl font-serif text-parchment-300 mb-4">{t.auth.storageMode}</h2>
               <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <button 
                    onClick={() => onStorageModeChange(StorageMode.LOCAL)}
                    className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center transition-all ${storageMode === StorageMode.LOCAL ? 'bg-parchment-700 border-parchment-400' : 'bg-parchment-900 border-parchment-800 opacity-50 hover:opacity-100'}`}
                  >
                      <Database className="w-6 h-6 mr-3 text-parchment-300" />
                      <span className="font-bold">{t.auth.local}</span>
                  </button>
                  <button 
                    onClick={() => onStorageModeChange(StorageMode.CLOUD)}
                    className={`flex-1 p-4 rounded-lg border-2 flex items-center justify-center transition-all ${storageMode === StorageMode.CLOUD ? 'bg-blue-900 border-blue-500' : 'bg-parchment-900 border-parchment-800 opacity-50 hover:opacity-100'}`}
                  >
                      <Cloud className="w-6 h-6 mr-3 text-blue-300" />
                      <span className="font-bold">{t.auth.cloud}</span>
                  </button>
               </div>
               
               <p className="text-xs text-parchment-500 mt-2 italic text-center">Switching modes will return you to the login screen.</p>
            </section>

            {/* Danger Zone */}
            <section className="bg-red-950/30 p-6 rounded-lg border-2 border-red-900/50 mt-8 mb-8">
                <h2 className="text-2xl font-serif text-red-400 mb-4 flex items-center">
                    <Trash2 className="w-6 h-6 mr-2" />
                    {t.titles.dangerZone}
                </h2>
                
                {/* Reset Progress */}
                <div className="mb-8 border-b border-red-900/30 pb-6">
                     <p className="text-parchment-300 text-sm mb-3 italic">
                        Reset your level, gold, and items to zero. Your account and login credentials will remain active.
                     </p>
                     <button 
                        onClick={handleResetClick}
                        className="w-full py-3 bg-amber-900/30 hover:bg-amber-800 text-amber-200 rounded border border-amber-700/50 transition-colors font-bold flex items-center justify-center"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        {t.buttons.resetProfile}
                    </button>
                </div>

                {/* Full Delete */}
                <div>
                    <p className="text-red-300/70 text-sm mb-3 italic">
                      Permanently remove your hero profile, login credentials, and all data from the {storageMode} database.
                    </p>
                    <button 
                        onClick={handleDeleteClick}
                        className="w-full py-3 bg-red-900/50 hover:bg-red-800 text-red-200 rounded border border-red-700 transition-colors font-bold flex items-center justify-center"
                    >
                        <Trash2 className="w-5 h-5 mr-2" />
                        {t.buttons.deleteAccount}
                    </button>
                </div>
            </section>
          </div>
        )}

        {activeTab === 'gameplay' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-blue-900/40 border border-blue-500 p-4 rounded-lg flex items-start">
                <Info className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
                <p className="text-blue-100 text-sm">
                {t.home.infiniteDesc}
                </p>
            </div>

            {/* Mouvement Settings */}
            <section className="bg-parchment-900/50 p-6 rounded-lg border-2 border-parchment-800">
              <h2 className="text-2xl font-serif text-parchment-300 mb-4">{t.titles.movement}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-parchment-200">Min Equation Value</label>
                  <input 
                    type="number" 
                    value={config.movement.minVal}
                    onChange={(e) => handleChange('movement', 'minVal', parseInt(e.target.value) || 0)}
                    className="w-24 p-2 bg-parchment-800 text-white border border-parchment-600 rounded"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <label className="text-parchment-200">Max Equation Value</label>
                  <input 
                    type="number" 
                    value={config.movement.maxVal}
                    onChange={(e) => handleChange('movement', 'maxVal', parseInt(e.target.value) || 0)}
                    className="w-24 p-2 bg-parchment-800 text-white border border-parchment-600 rounded"
                  />
                </div>
              </div>
            </section>

            {/* Combat Settings */}
            <section className="bg-parchment-900/50 p-6 rounded-lg border-2 border-parchment-800">
              <h2 className="text-2xl font-serif text-parchment-300 mb-4">{t.titles.combat}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-parchment-200">Multiplication Max Factor</label>
                  <input 
                    type="number" 
                    value={config.combat.multiplicationMax}
                    onChange={(e) => handleChange('combat', 'multiplicationMax', parseInt(e.target.value) || 1)}
                    className="w-24 p-2 bg-parchment-800 text-white border border-parchment-600 rounded"
                  />
                </div>
                 <div className="flex justify-between items-center">
                  <label className="text-parchment-200">Questions Count</label>
                  <input 
                    type="number" 
                    value={config.combat.questionsCount}
                    onChange={(e) => handleChange('combat', 'questionsCount', parseInt(e.target.value) || 1)}
                    className="w-24 p-2 bg-parchment-800 text-white border border-parchment-600 rounded"
                  />
                </div>
              </div>
            </section>

            {/* Recherche Settings */}
            <section className="bg-parchment-900/50 p-6 rounded-lg border-2 border-parchment-800">
              <h2 className="text-2xl font-serif text-parchment-300 mb-4">{t.titles.recherche}</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-parchment-200">Max Dividend Value</label>
                  <input 
                    type="number" 
                    value={config.recherche.divisionMaxDividend}
                    onChange={(e) => handleChange('recherche', 'divisionMaxDividend', parseInt(e.target.value) || 10)}
                    className="w-24 p-2 bg-parchment-800 text-white border border-parchment-600 rounded"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

      </div>
    </div>
  );
};

export default Options;
