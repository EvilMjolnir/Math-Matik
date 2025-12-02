
import React, { useState, useEffect, useRef } from 'react';
import { GameConfig, MathProblem, MinigameProps } from '../types';
import { generateMultiplication } from '../services/mathService';
import Keypad from '../components/Keypad';
import Modal from '../components/Modal';
import { useLocalization } from '../localization';
import { ChevronLeft, Timer, ShieldAlert, Skull, Trophy, Coins } from 'lucide-react';

interface CombatProps extends MinigameProps {
  config: GameConfig['combat'];
}

const MAX_TIME = 15;

const Combat: React.FC<CombatProps> = ({ 
  config, 
  onBack, 
  onAddXp, 
  onAddGold,
  onProgressTome, 
  encounter, 
  onEncounterComplete,
  onTakeDamage
}) => {
  const { t, lang } = useLocalization();
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isVictory, setIsVictory] = useState(false);
  
  const timerRef = useRef<number | null>(null);

  // Initialize
  useEffect(() => {
    const newProblems = Array.from({ length: config.questionsCount }).map(() => 
      generateMultiplication(config.multiplicationMax)
    );
    setProblems(newProblems);
    // If no encounter, skip intro
    if (!encounter) {
      setGameState('playing');
    }
  }, [config, encounter]);

  // Timer Logic
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && feedback === 'none') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0 && feedback === 'none') {
       handleTimeExpire();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft, feedback]);

  const handleTimeExpire = () => {
    setFeedback('wrong');
    setTimeout(nextQuestion, 1000);
  };

  const nextQuestion = () => {
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setTimeLeft(MAX_TIME);
      setUserInput('');
      setFeedback('none');
    } else {
      finishGame();
    }
  };

  const finishGame = () => {
    setGameState('finished');
    
    // Encounter Logic
    if (encounter) {
      if (score >= encounter.threshold) {
        setIsVictory(true);
        // Note: We do NOT call onEncounterComplete here. We wait for user to click button in modal.
        const xpEarned = score * 3;
        onAddXp(xpEarned);
        if (onAddGold && encounter.goldReward) {
          onAddGold(encounter.goldReward);
        }
      } else {
        setIsVictory(false);
        if (onTakeDamage) onTakeDamage(encounter.hpLoss);
      }
    } else {
      // Normal Mode Logic
      setIsVictory(true); // Always "win" in practice, just score matters
      const xpEarned = score * 2;
      if (xpEarned > 0) {
        onAddXp(xpEarned);
        onProgressTome(Math.floor(score / 5)); 
      }
    }
  };

  const handleModalAction = () => {
    if (encounter && isVictory && onEncounterComplete) {
      onEncounterComplete();
    } else {
      onBack();
    }
  };

  const handleInput = (num: number) => {
    if (userInput.length < 5) setUserInput(prev => prev + num.toString());
  };

  const handleDelete = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleValidate = () => {
    if (!problems[currentIdx] || feedback !== 'none') return;

    const answer = parseInt(userInput);
    const correctAnswer = problems[currentIdx].answer;

    if (answer === correctAnswer) {
      setFeedback('correct');
      // Calculate score
      let points = 0;
      if (timeLeft > 7.5) points = 3;
      else if (timeLeft > 5) points = 2;
      else if (timeLeft > 0) points = 1;
      
      setScore(prev => prev + points);
      setTimeout(nextQuestion, 500);
    } else {
      setFeedback('wrong');
      setTimeLeft(prev => Math.max(0, prev - 1));
      setUserInput('');
      setTimeout(() => setFeedback('none'), 500);
    }
  };

  const getTimerColor = () => {
    if (timeLeft > 7.5) return 'text-green-500 border-green-500';
    if (timeLeft > 5) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  // Encounter Intro Screen
  if (gameState === 'intro' && encounter) {
    const encounterName = (lang === 'fr' && encounter.name_fr) ? encounter.name_fr : encounter.name;
    const encounterDesc = (lang === 'fr' && encounter.description_fr) ? encounter.description_fr : encounter.description;

    return (
      <div className="flex flex-col h-full items-center justify-center p-6 animate-fadeIn">
        <div className="bg-red-900/40 p-8 rounded-xl border-4 border-red-600 max-w-lg w-full text-center shadow-[0_0_30px_rgba(220,38,38,0.5)]">
           <Skull className="w-20 h-20 mx-auto text-red-500 mb-4 animate-pulse" />
           <h2 className="text-4xl font-serif font-bold text-white mb-2">{t.combat.encounterStart}</h2>
           <h3 className="text-2xl font-serif text-red-300 mb-4">{encounterName}</h3>
           <p className="text-parchment-200 italic mb-8">"{encounterDesc}"</p>
           
           <div className="flex justify-center space-x-8 mb-8">
             <div className="text-center">
               <div className="text-4xl font-bold text-yellow-500">{encounter.threshold}</div>
               <div className="text-xs uppercase tracking-widest text-parchment-400">{t.combat.threshold}</div>
             </div>
             <div className="text-center">
               <div className="text-4xl font-bold text-red-500">-{encounter.hpLoss}</div>
               <div className="text-xs uppercase tracking-widest text-parchment-400">{t.combat.hpLost}</div>
             </div>
             {encounter.goldReward > 0 && (
                <div className="text-center">
                  <div className="text-4xl font-bold text-amber-500">+{encounter.goldReward}</div>
                  <div className="text-xs uppercase tracking-widest text-parchment-400">{t.common.reward}</div>
                </div>
             )}
           </div>

           <button 
             onClick={() => setGameState('playing')}
             className="w-full py-4 bg-red-700 hover:bg-red-600 text-white font-serif font-bold text-xl rounded border-2 border-red-400 shadow-lg"
           >
             FIGHT!
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4 relative">
      <div className="flex items-center justify-between mb-4">
        {/* Hide back button during encounter to force fight */}
        {!encounter ? (
          <button onClick={onBack} className="p-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
            <ChevronLeft />
          </button>
        ) : <div className="w-10"></div>}
        
        <h2 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.combat}</h2>
        
        <div className="flex items-center space-x-2 text-parchment-300">
          <ShieldAlert className="w-6 h-6" />
          <span className="text-xl font-bold">{score} pts</span>
          {encounter && <span className="text-sm text-parchment-500">/ {encounter.threshold}</span>}
        </div>
      </div>

      <div className="flex justify-between items-center mb-8 px-4">
         <div className="text-parchment-400 text-sm">{t.combat.target}: {currentIdx + 1} / {problems.length}</div>
         <div className={`flex items-center justify-center w-20 h-20 rounded-full border-4 ${getTimerColor()} bg-gray-900 transition-colors duration-500`}>
           <div className="flex flex-col items-center">
             <Timer className="w-6 h-6 mb-1" />
             <span className="text-2xl font-bold">{timeLeft}s</span>
           </div>
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        {problems[currentIdx] && (
          <div className={`p-8 rounded-xl mb-8 border-4 transition-all duration-200 bg-parchment-200 w-full max-w-sm
             ${feedback === 'correct' ? 'border-green-500 scale-105' : ''}
             ${feedback === 'wrong' ? 'border-red-500 rotate-2' : 'border-parchment-800'}
          `}>
            <div className="text-5xl font-serif font-bold text-parchment-900 mb-4 text-center">
              {problems[currentIdx].question}
            </div>
             <div className="text-4xl font-mono text-center h-12 text-parchment-800 border-b-2 border-dashed border-parchment-400 w-32 mx-auto">
              {userInput}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto">
        <Keypad 
          onInput={handleInput} 
          onDelete={handleDelete} 
          onValidate={handleValidate}
          disabled={feedback === 'correct' || gameState === 'finished'} 
        />
      </div>

      <Modal 
        title={t.combat.battleReport}
        actionLabel={isVictory ? (encounter ? "Continue Journey" : t.buttons.back) : "Try Again"}
        onAction={handleModalAction} 
        isOpen={gameState === 'finished'}
        colorClass={isVictory ? "bg-parchment-200" : "bg-red-950 text-white border-red-500"}
      >
        <div className="space-y-4 flex flex-col items-center w-full">
          {isVictory ? (
            <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
          ) : (
            <Skull className="w-16 h-16 text-red-500 mb-2" />
          )}
          
          <p className="text-2xl font-serif font-bold">
            {isVictory ? t.combat.victory : t.combat.defeat}
          </p>
          
          <div className="bg-parchment-100/10 p-4 rounded-lg border border-parchment-400/30 w-full mb-2">
            <div className="flex justify-between items-end mb-2 border-b border-parchment-400/30 pb-2">
              <span className="text-sm uppercase tracking-widest opacity-80">{t.combat.finalScore}</span>
              <div className="text-2xl font-bold">
                {score}
                {encounter && <span className="opacity-70 text-lg"> / {encounter.threshold}</span>}
              </div>
            </div>
            
            {encounter && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm uppercase tracking-widest opacity-80">{t.combat.hpLost}</span>
                <span className={`font-bold text-xl ${isVictory ? 'text-green-500' : 'text-red-500'}`}>
                   {isVictory ? '0' : `-${encounter.hpLoss}`}
                </span>
              </div>
            )}

            {isVictory && encounter && encounter.goldReward > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm uppercase tracking-widest opacity-80">{t.common.gold}</span>
                    <span className="font-bold text-xl text-amber-500">
                        +{encounter.goldReward}
                    </span>
                </div>
            )}
          </div>

          {isVictory && (
             <p className="text-lg font-bold text-yellow-500">
               +{score * (encounter ? 3 : 2)} {t.common.xp}
             </p>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Combat;
