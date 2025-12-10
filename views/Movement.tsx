
import React, { useState, useEffect } from 'react';
import { GameConfig, MathProblem, MinigameProps } from '../types';
import { generateAdditionSubtraction } from '../services/mathService';
import Keypad from '../components/Keypad';
import Modal from '../components/Modal';
import ScratchpadModal from '../components/ScratchpadModal';
import { ChevronLeft, Footprints, PencilLine, ShieldCheck, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound } from '../services/audioService';

interface MovementProps extends MinigameProps {
  config: GameConfig['movement'];
}

type SegmentStatus = 'empty' | 'correct' | 'wrong';

const XP_PER_CORRECT = 4;

const Movement: React.FC<MovementProps> = ({ config, onBack, onAddXp, onProgressTome, isAdmin }) => {
  const { t } = useLocalization();
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [segmentResults, setSegmentResults] = useState<SegmentStatus[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [userInput, setUserInput] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [stepsTaken, setStepsTaken] = useState(0);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  useEffect(() => {
    setSegmentResults(Array(config.targetSegments).fill('empty'));
    generateNewProblem();
  }, [config.targetSegments]);

  const generateNewProblem = () => {
    setProblem(generateAdditionSubtraction(config.minVal, config.maxVal));
    setUserInput('');
    setFeedback('none');
  };

  const handleInput = (num: number | string) => {
    if (typeof num === 'string') return;
    if (userInput.length < 5) setUserInput(prev => prev + num.toString());
  };

  const handleDelete = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleValidate = () => {
    if (!problem || currentSegmentIndex >= config.targetSegments) return;
    
    const answer = parseInt(userInput);
    const isCorrect = answer === problem.answer;
    
    processResult(isCorrect);
  };

  const processResult = (isCorrect: boolean) => {
    if (currentSegmentIndex >= config.targetSegments) return;

    const newStatus = isCorrect ? 'correct' : 'wrong';

    setSegmentResults(prev => {
      const newResults = [...prev];
      newResults[currentSegmentIndex] = newStatus;
      return newResults;
    });

    setFeedback(newStatus);

    setTimeout(() => {
      const nextIndex = currentSegmentIndex + 1;
      
      if (nextIndex >= config.targetSegments) {
        finishGame();
      } else {
        setCurrentSegmentIndex(nextIndex);
        generateNewProblem();
      }
    }, 1000);
  };

  const adminWin = () => {
    processResult(true);
  };

  const adminFail = () => {
    processResult(false);
  };

  const finishGame = () => {
    setSegmentResults(prev => {
       const correctCount = prev.filter(s => s === 'correct').length;
       setStepsTaken(correctCount);
       
       if (correctCount > 0) {
         onProgressTome(correctCount);
         onAddXp(correctCount * XP_PER_CORRECT);
       }
       setShowSuccess(true);
       return prev;
    });
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 relative">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => { playMenuBackSound(); onBack(); }} className="p-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
          <ChevronLeft />
        </button>
        <h2 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.movement}</h2>
        <div className="w-10"></div>
      </div>

      <div className="w-full h-8 mb-8 flex space-x-1">
         {segmentResults.map((status, i) => {
           let bgColor = 'bg-parchment-900/50';
           if (status === 'correct') bgColor = 'bg-green-600 shadow-[0_0_10px_rgba(22,163,74,0.6)]';
           if (status === 'wrong') bgColor = 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.6)]';
           if (i === currentSegmentIndex && status === 'empty') bgColor = 'bg-parchment-700 animate-pulse';

           return (
             <div 
                key={i} 
                className={`flex-1 rounded border-2 border-parchment-800 transition-all duration-300 ${bgColor}`} 
             />
           );
         })}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative">
        {problem && (
          <div className="relative">
            <div className={`p-8 rounded-xl mb-8 border-4 transition-colors duration-300 bg-parchment-200
              ${feedback === 'correct' ? 'border-green-500 bg-green-100' : ''}
              ${feedback === 'wrong' ? 'border-red-500 bg-red-100' : 'border-parchment-300'}
            `}>
              <div className="text-5xl font-serif font-bold text-parchment-900 mb-4 text-center">
                {problem.question}
              </div>
              <div className="text-4xl font-mono text-center h-12 text-parchment-800 border-b-2 border-dashed border-parchment-400 w-32 mx-auto">
                {userInput}
              </div>
            </div>

            {/* Scratchpad Button */}
            <button 
              onClick={() => setIsScratchpadOpen(true)}
              className="absolute -right-16 top-1/2 transform -translate-y-1/2 p-3 bg-amber-600 text-white rounded-full shadow-lg border-2 border-amber-800 hover:bg-amber-700 hover:scale-110 transition-all z-10 hidden md:flex"
              title={t.titles.scratchpad}
            >
              <PencilLine className="w-6 h-6" />
            </button>
             {/* Mobile Position for Scratchpad Button */}
             <button 
              onClick={() => setIsScratchpadOpen(true)}
              className="md:hidden absolute -right-2 -bottom-2 p-3 bg-amber-600 text-white rounded-full shadow-lg border-2 border-amber-800 z-10"
              title={t.titles.scratchpad}
            >
              <PencilLine className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {isAdmin && (
         <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-50">
             <div className="text-xs text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center">
                 <ShieldCheck className="w-3 h-3 mr-1" />
                 Admin
             </div>
             <button 
                onClick={adminWin}
                className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-500"
                title="Force Step Success"
             >
                 <ThumbsUp className="w-4 h-4" />
             </button>
             <button 
                onClick={adminFail}
                className="bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-500"
                title="Force Step Failure"
             >
                 <ThumbsDown className="w-4 h-4" />
             </button>
         </div>
      )}

      <div className="mt-auto mb-12">
        <Keypad 
          onInput={handleInput} 
          onDelete={handleDelete} 
          onValidate={handleValidate} 
          disabled={feedback !== 'none' || showSuccess}
        />
      </div>

      <Modal 
        title={t.movement.pathCompleted}
        actionLabel={t.buttons.back}
        onAction={() => { playMenuBackSound(); onBack(); }}
        isOpen={showSuccess}
      >
        <div className="flex flex-col items-center">
          <Footprints className="w-16 h-16 text-parchment-800 mb-4" />
          <div className="mt-4 flex items-center justify-center space-x-4">
             <div className="text-center">
               <div className="text-3xl font-bold text-green-700">{stepsTaken}</div>
               <div className="text-sm font-bold text-parchment-700 uppercase">{t.movement.steps}</div>
             </div>
             <div className="text-center">
               <div className="text-3xl font-bold text-yellow-700">+{stepsTaken * XP_PER_CORRECT}</div>
               <div className="text-sm font-bold text-parchment-700 uppercase">{t.common.xp}</div>
             </div>
          </div>
        </div>
      </Modal>

      <ScratchpadModal 
        isOpen={isScratchpadOpen} 
        onClose={() => setIsScratchpadOpen(false)} 
      />
    </div>
  );
};

export default Movement;
