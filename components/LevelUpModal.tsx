
import React, { useEffect } from 'react';
import Modal from './Modal';
import { Translation } from '../localization/types';
import { playLevelUpSound, fadeOutCurrentSound } from '../services/audioService';
import { Heart, Sword, Footprints, Shield } from 'lucide-react';

interface LevelUpModalProps {
  isOpen: boolean;
  level: number;
  onClose: () => void;
  t: Translation;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, level, onClose, t }) => {
  useEffect(() => {
    if (isOpen) {
        // Slight delay to ensure the modal visual animation has started before audio cues
        const timer = setTimeout(() => {
            playLevelUpSound();
        }, 100);
        return () => clearTimeout(timer);
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
        <p className="text-xl mb-4">{t.levelUp.message.replace('{level}', level.toString())}</p>
        
        <div className="bg-purple-800/50 p-4 rounded-lg border border-purple-500/30 w-full space-y-3">
            
            {/* HP */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/30">
                <Heart className="w-6 h-6 text-red-500 drop-shadow-md" />
                <span className="text-yellow-200 font-bold text-lg">{t.levelUp.statHp}</span>
            </div>

            {/* Attack */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/30">
                <Sword className="w-6 h-6 text-amber-500 drop-shadow-md" />
                <span className="text-yellow-200 font-bold text-lg">{t.levelUp.statAttack}</span>
            </div>

            {/* Agility (Conditional) */}
            {isAgilityLevel && (
                <div className="flex items-center justify-between px-4 py-2 border-b border-purple-500/30 animate-pulse bg-green-900/20 rounded">
                    <Footprints className="w-6 h-6 text-green-400 drop-shadow-md" />
                    <span className="text-green-300 font-bold text-lg">{t.levelUp.statAgility}</span>
                </div>
            )}

            {/* Defense (Conditional) */}
            {isDefenseLevel && (
                <div className="flex items-center justify-between px-4 py-2 animate-pulse bg-blue-900/20 rounded">
                    <Shield className="w-6 h-6 text-blue-400 drop-shadow-md" />
                    <span className="text-blue-300 font-bold text-lg">{t.levelUp.statDefense}</span>
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default LevelUpModal;
