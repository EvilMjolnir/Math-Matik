import React from 'react';
import Modal from './Modal';
import { Translation } from '../localization/types';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
  t: Translation;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, level, onClose, t }) => {
  return (
    <Modal 
      title={t.levelUp.title}
      actionLabel={t.levelUp.action} 
      onAction={onClose} 
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
            <p className="text-yellow-200 font-bold flex justify-between px-4 py-1">
                <span>{t.combat.attack}</span> 
                <span>{t.levelUp.statAttack}</span>
            </p>
        </div>
      </div>
    </Modal>
  );
};

export default LevelUpModal;