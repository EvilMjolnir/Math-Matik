
import React from 'react';
import { GameView } from '../types';
import { Footprints, Sword, Search, Coins, FlaskConical } from 'lucide-react';
import { Translation } from '../localization/types';
import { playMenuOpenSound } from '../services/audioService';

interface GameMenuProps {
  t: Translation;
  onViewChange: (view: GameView) => void;
  onStartRecherche: (cost: number) => void;
  canMove: boolean;
  canCombat: boolean;
  canAffordRecherche: boolean;
  activeEncounter: boolean;
  rechercheCost: number;
  compact?: boolean;
}

const GameMenu: React.FC<GameMenuProps> = ({ 
  t, 
  onViewChange, 
  onStartRecherche, 
  canMove, 
  canCombat, 
  canAffordRecherche, 
  activeEncounter, 
  rechercheCost,
  compact = false
}) => {
  return (
    <div className={`grid grid-cols-1 ${compact ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-4 gap-6'} w-full`}>
      <MenuCard 
        title={t.titles.movement}
        icon={<Footprints className={compact ? "w-8 h-8" : "w-12 h-12"} />} 
        description={t.home.menuDescMovement}
        onClick={() => { playMenuOpenSound(); onViewChange(GameView.MOVEMENT); }}
        color="hover:bg-green-900/90 hover:border-green-600"
        disabled={!canMove}
        compact={compact}
      />
      <MenuCard 
        title={t.titles.combat} 
        icon={<Sword className={compact ? "w-8 h-8" : "w-12 h-12"} />} 
        description={t.home.menuDescCombat}
        onClick={() => { playMenuOpenSound(); onViewChange(GameView.COMBAT); }}
        color={activeEncounter ? "bg-red-900/90 border-red-500 animate-pulse hover:bg-red-900" : "hover:bg-red-900/90 hover:border-red-600"}
        disabled={!canCombat}
        compact={compact}
      />
      <MenuCard 
        title={t.titles.recherche} 
        icon={<Search className={compact ? "w-8 h-8" : "w-12 h-12"} />} 
        description={t.home.menuDescRecherche}
        onClick={() => { playMenuOpenSound(); onStartRecherche(rechercheCost); }}
        color="hover:bg-blue-900/90 hover:border-blue-600"
        disabled={!canMove || !canAffordRecherche}
        cost={rechercheCost}
        compact={compact}
      />
      <MenuCard 
        title={t.titles.alchimie} 
        icon={<FlaskConical className={compact ? "w-8 h-8" : "w-12 h-12"} />} 
        description={t.home.menuDescAlchimie}
        onClick={() => { playMenuOpenSound(); onViewChange(GameView.ALCHIMIE); }}
        color="hover:bg-purple-900/90 hover:border-purple-600"
        disabled={!canMove} // Available when not in encounter
        compact={compact}
      />
    </div>
  );
};

interface MenuCardProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  onClick: () => void;
  color: string;
  disabled?: boolean;
  cost?: number;
  compact?: boolean;
}

const MenuCard: React.FC<MenuCardProps> = ({ title, icon, description, onClick, color, disabled, cost, compact }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center justify-center rounded-xl border-4 transition-all duration-300 group relative overflow-hidden
      ${compact 
        ? 'flex-row h-24 px-6 w-full text-left' 
        : 'flex-col h-full min-h-[250px] p-6 text-center'
      }
      ${disabled 
        ? 'bg-gray-800/80 border-gray-700 opacity-70 cursor-not-allowed grayscale' 
        : `bg-parchment-900/85 border-parchment-600 ${color} hover:scale-105 hover:shadow-2xl`
      }
    `}
  >
    {cost !== undefined && !disabled && (
      <div className="absolute top-0 right-0 bg-amber-600 text-white px-3 py-1 text-sm font-bold rounded-bl-lg flex items-center shadow-md z-10">
        <Coins className="w-3 h-3 mr-1" />
        {cost}
      </div>
    )}
    {cost !== undefined && disabled && cost > 0 && (
       <div className="absolute top-0 right-0 bg-red-800/90 text-white px-3 py-1 text-sm font-bold rounded-bl-lg flex items-center shadow-md z-10">
        <Coins className="w-3 h-3 mr-1" />
        {cost}
      </div>
    )}
    
    <div className={`transition-transform duration-300 ${compact ? 'mr-4 shrink-0' : 'mb-4'} ${disabled ? '' : 'group-hover:scale-110 group-hover:rotate-3'} text-parchment-200`}>
      {icon}
    </div>
    
    <div className="flex flex-col flex-1">
      <h2 className={`${compact ? 'text-xl' : 'text-2xl'} font-serif font-bold text-parchment-100 mb-1`}>{title}</h2>
      {!compact && <p className="text-parchment-300 text-sm font-serif">{description}</p>}
    </div>
  </button>
);

export default GameMenu;
