
import React from 'react';
import { Tome, Encounter } from '../types';
import { Skull, Map, Infinity as InfinityIcon } from 'lucide-react';
import { Translation } from '../localization/types';

interface ActiveQuestPanelProps {
  activeEncounter: Encounter | null;
  activeTome?: Tome;
  t: Translation;
  lang: string;
}

const ActiveQuestPanel: React.FC<ActiveQuestPanelProps> = ({ activeEncounter, activeTome, t, lang }) => {
  const getTomeTitle = (tome: Tome) => (lang === 'fr' && tome.title_fr) ? tome.title_fr : tome.title;
  const getTomeDesc = (tome: Tome) => (lang === 'fr' && tome.description_fr) ? tome.description_fr : tome.description;

  return (
    <div className={`w-full p-6 mb-16 backdrop-blur-sm min-h-[120px] flex flex-col justify-center transition-all duration-500
      ${activeEncounter 
        ? 'rounded-lg border-2 bg-red-900/80 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
        : 'border-bevel'
      }
    `}>
      {activeEncounter ? (
        <div className="flex flex-col items-center animate-pulse">
          <div className="flex items-center text-red-400 font-bold text-3xl mb-1">
            <Skull className="w-10 h-10 mr-2" />
            {t.home.encounterActive}
          </div>
          <p className="text-parchment-200 text-lg">{t.home.encounterDesc}</p>
          {activeEncounter.type === 'boss' && <span className="text-red-500 font-bold uppercase tracking-widest mt-2 border border-red-500 px-2 py-1 rounded">BOSS BATTLE</span>}
          {activeEncounter.type === 'miniboss' && <span className="text-amber-500 font-bold uppercase tracking-widest mt-2 border border-amber-500 px-2 py-1 rounded">MINI-BOSS</span>}
        </div>
      ) : activeTome ? (
        <div className="flex flex-col md:flex-row items-center gap-6 w-full">
          {activeTome.image && (
            <div className="relative shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-amber-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden bg-black/50">
                <img src={activeTome.image} alt="Quest Location" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>
            </div>
          )}
          <div className="flex-1 w-full">
            <div className="flex justify-between items-center mb-3">
              <span className="text-parchment-300 font-serif flex items-center text-xl">
                <Map className="w-6 h-6 mr-2" />
                {t.home.currentQuest}: <span className="text-amber-400 font-bold ml-2">{getTomeTitle(activeTome)}</span>
              </span>
              <span className="text-sm text-parchment-400 font-bold">{Math.floor(activeTome.currentDistance)} / {activeTome.totalDistance}</span>
            </div>
            <div className="w-full h-5 bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative">
              <div 
                className="h-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-1000"
                style={{ width: `${(activeTome.currentDistance / activeTome.totalDistance) * 100}%` }}
              />
            </div>
            <p className="text-base text-parchment-500 mt-2 italic">{getTomeDesc(activeTome)}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-parchment-400">
          <div className="flex items-center text-3xl font-serif font-bold text-mythic mb-2">
            <InfinityIcon className="w-10 h-10 mr-2" />
            {t.home.infiniteMode}
          </div>
          <p className="text-lg italic">{t.home.infiniteDesc}</p>
        </div>
      )}
    </div>
  );
};

export default ActiveQuestPanel;
