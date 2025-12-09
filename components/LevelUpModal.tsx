




import React, { useEffect } from 'react';
import Modal from './Modal';
import { Translation } from '../localization/types';
import { playLevelUpSound, fadeOutCurrentSound } from '../services/audioService';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
  t: Translation;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, level, onClose, t }) => {
  useEffect(() => {
    if (isOpen) {
        playLevelUpSound();
    }
  }, [isOpen]);

  const handleClose = () => {
      fadeOutCurrentSound();
      onClose();
  };

  const isAgilityLevel = level % 3 === 0;
  const isDefenseLevel = level % 4 === 0;

  return (
    <Modal 
      title={t.levelUp.title}
      actionLabel={t.levelUp.action} 
      onAction={handleClose} 
      isOpen={isOpen}
      colorClass="bg-purple-900 border-yellow-500 text-white"
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 text-yellow-400 mb-4 animate-spin-slow">⭐</div>
        <p className="text-xl">{t.levelUp.message.replace('{level}', level.toString())}</p>
        <div className="mt-4 bg-purple-800/50 p-4 rounded-lg border border-purple-500/30 w-full">
            <p className="text-yellow-200 font-bold flex justify-between px-4 py-1 border-b border-purple-500/30">
                <span>{t.common.hp}</span> 
                <span>{t.levelUp.statHp}</span>
            </p>
            <p className="text-yellow-200 font-bold flex justify-between px-4 py-1 border-b border-purple-500/30">
                <span>{t.combat.attack}</span> 
                <span>{t.levelUp.statAttack}</span>
            </p>
            {isAgilityLevel && (
                <p className="text-green-300 font-bold flex justify-between px-4 py-1 animate-pulse border-b border-purple-500/30">
                    <span>{t.profile.agility}</span> 
                    <span>{t.levelUp.statAgility}</span>
                </p>
            )}
            {isDefenseLevel && (
                <p className="text-blue-300 font-bold flex justify-between px-4 py-1 animate-pulse">
                    <span>{t.stats.defense}</span> 
                    <span>{t.levelUp.statDefense}</span>
                </p>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default LevelUpModal;