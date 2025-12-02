
import React from 'react';
import { GameConfig } from '../types';
import { ChevronLeft, Info } from 'lucide-react';
import { useLocalization } from '../localization';

interface OptionsProps {
  config: GameConfig;
  setConfig: (config: GameConfig) => void;
  onBack: () => void;
}

const Options: React.FC<OptionsProps> = ({ config, setConfig, onBack }) => {
  const { t } = useLocalization();
  
  const handleChange = (section: keyof GameConfig, field: string, value: number) => {
    setConfig({
      ...config,
      [section]: {
        ...config[section],
        [field]: value
      }
    });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fadeIn">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
          <ChevronLeft />
        </button>
        <h1 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.options}</h1>
      </div>

      <div className="bg-blue-900/40 border border-blue-500 p-4 rounded-lg flex items-start mb-6">
        <Info className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-1" />
        <p className="text-blue-100 text-sm">
          {t.home.infiniteDesc}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-2">
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
    </div>
  );
};

export default Options;
