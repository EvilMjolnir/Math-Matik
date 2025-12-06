
import React from 'react';
import { GameView } from '../types';
import { Footprints, Sword, Search, Coins } from 'lucide-react';
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
}

const GameMenu: React.FC<GameMenuProps> = ({ 
  t, 
  onViewChange, 
  onStartRecherche, 
  canMove, 
  canCombat, 
  canAffordRecherche, 
  activeEncounter, 
  rechercheCost 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
      <MenuCard 
        title={t.titles.movement}
        icon={<Footprints className="w-14 h-14" />} 
        description={t.home.menuDescMovement}
        onClick={() => { playMenuOpenSound(); onViewChange(GameView.MOVEMENT); }}
        color="hover:bg-green-900/90 hover:border-green-600"
        disabled={!canMove}
      />
      <MenuCard 
        title={t.titles.combat} 
        icon={<Sword className="w-14 h-14" />} 
        description={t.home.menuDescCombat}
        onClick={() => { playMenuOpenSound(); onViewChange(GameView.COMBAT); }}
        color={activeEncounter ? "bg-red-900/90 border-red-500 animate-pulse hover:bg-red-900" : "hover:bg-red-900/90 hover:border-red-600"}
        disabled={!canCombat}
      />
      <MenuCard 
        title={t.titles.recherche} 
        icon={<Search className="w-14 h-14" />} 
        description={t.home.menuDescRecherche}
        onClick={() => { playMenuOpenSound(); onStartRecherche(rechercheCost); }}
        color="hover:bg-blue-900/90 hover:border-blue-600"
        disabled={!canMove || !canAffordRecherche}
        cost={rechercheCost}
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
}

const MenuCard: React.FC<MenuCardProps> = ({ title, icon, description, onClick, color, disabled, cost }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`
      flex flex-col items-center justify-center p-8 rounded-xl border-4 transition-all duration-300 group relative overflow-hidden h-full
      ${disabled 
        ? 'bg-gray-800/80 border-gray-700 opacity-70 cursor-not-allowed grayscale' 
        : `bg-parchment-900/85 border-parchment-600 ${color} hover:scale-105 hover:shadow-2xl`
      }
    `}
  >
    {cost !== undefined && !disabled && (
      <div className="absolute top-0 right-0 bg-amber-600 text-white px-4 py-1 text-base font-bold rounded-bl-lg flex items-center shadow-md z-10">
        <Coins className="w-4 h-4 mr-1" />
        {cost}
      </div>
    )}
    {cost !== undefined && disabled && cost > 0 && (
       <div className="absolute top-0 right-0 bg-red-800/90 text-white px-4 py-1 text-base font-bold rounded-bl-lg flex items-center shadow-md z-10">
        <Coins className="w-4 h-4 mr-1" />
        {cost}
      </div>
    )}
    <div className={`mb-4 transition-transform duration-300 ${disabled ? '' : 'group-hover:scale-110 group-hover:rotate-3'} text-parchment-200`}>
      {icon}
    </div>
    <h2 className="text-3xl font-serif font-bold text-parchment-100 mb-2">{title}</h2>
    <p className="text-center text-parchment-300 text-base font-serif">{description}</p>
  </button>
);

export default GameMenu;
