import React, { useState, useEffect, useRef } from 'react';
import { GameConfig, MathProblem, MinigameProps, PlayerStats } from '../types';
import { generateMultiplication, generateBossProblem } from '../services/mathService';
import { getEnemyStats, getAggregatedStats } from '../services/statusService';
import Keypad from '../components/Keypad';
import Modal from '../components/Modal';
import ScratchpadModal from '../components/ScratchpadModal';
import EncounterIntroCard from '../components/EncounterIntroCard';
import { useLocalization } from '../localization';
import { ChevronLeft, Timer, Skull, Trophy, PencilLine, Zap, Sword, Heart, User, Shield, ShieldCheck, Check, X } from 'lucide-react';
import { playMenuBackSound } from '../services/audioService';

interface CombatProps extends MinigameProps {
  config: GameConfig['combat'];
  bossConfig?: GameConfig['boss'];
  playerStats?: PlayerStats;
}

const DEFAULT_NORMAL_TIME = 15;
const TURN_ACTIONS = 3;

const Combat: React.FC<CombatProps> = ({ 
  config, 
  bossConfig,
  onBack, 
  onAddXp, 
  onAddGold,
  onProgressTome, 
  encounter, 
  onEncounterComplete,
  onTakeDamage,
  playerStats,
  isAdmin
}) => {
  const { t, lang } = useLocalization();
  
  // -- General State --
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'finished'>('intro');
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  const [isVictory, setIsVictory] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);
  
  // -- Normal Combat State --
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_NORMAL_TIME);
  const [score, setScore] = useState(0); // For infinite mode
  const [encounterScore, setEncounterScore] = useState(0); // Tracks damage dealt to monster
  const scoreRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  
  // New Normal Encounter Mechanics
  const [turnActionIndex, setTurnActionIndex] = useState(0); // 0 to 2
  const [pendingTurnDamage, setPendingTurnDamage] = useState(0); // Accumulates during the 3 actions

  // -- Boss Combat State --
  const [bossProblem, setBossProblem] = useState<MathProblem | null>(null);
  const [bossHp, setBossHp] = useState(0);
  const [bossTimer, setBossTimer] = useState(0); // Counts down
  const [actionGauge, setActionGauge] = useState(0); // 0 to actionsPerTurn
  
  // Check Mode
  const isBossMode = encounter && (encounter.type === 'boss' || encounter.type === 'miniboss');
  const activeBossConfig = bossConfig || { timerDuration: 15, actionsPerTurn: 5 };
  const normalMaxTime = encounter?.timerDuration || DEFAULT_NORMAL_TIME;

  // Calculate Modified Stats based on Enemy Tags
  const enemyStats = encounter ? getEnemyStats(encounter) : { hpBonus: 0, damageBonus: 0, goldRewardBonus: 0, xpRewardBonus: 0 };
  
  const effectiveMaxHp = encounter ? encounter.monsterHP + enemyStats.hpBonus : 0;
  const effectiveAttack = encounter ? encounter.attack + enemyStats.damageBonus : 0;
  const effectiveGoldReward = encounter ? encounter.goldReward + enemyStats.goldRewardBonus : 0;
  const effectiveXpReward = encounter ? (encounter.xpReward || 0) + enemyStats.xpRewardBonus : 0;

  // Player Attack Power
  const playerAggrStats = playerStats ? getAggregatedStats(playerStats) : { totalAttack: 1 };
  const playerAttackPower = playerAggrStats.totalAttack;

  // Initialize
  useEffect(() => {
    if (!encounter) {
      // Normal Infinite Mode
      const newProblems = Array.from({ length: config.questionsCount }).map(() => 
        generateMultiplication(config.multiplicationMax)
      );
      setProblems(newProblems);
      setGameState('playing');
    } else {
      // Encounter Mode
      if (isBossMode) {
        setBossHp(effectiveMaxHp);
        setBossTimer(activeBossConfig.timerDuration);
        setActionGauge(0);
        setBossProblem(generateBossProblem(config.multiplicationMax));
      } else {
        // Normal Enemy
        // Generate infinite stream of problems essentially, but we batch them
        const newProblems = Array.from({ length: config.questionsCount * 3 }).map(() => 
          generateMultiplication(config.multiplicationMax)
        );
        setProblems(newProblems);
        setTimeLeft(normalMaxTime);
        setTurnActionIndex(0);
        setPendingTurnDamage(0);
      }
    }
  }, [config, encounter, isBossMode, effectiveMaxHp, normalMaxTime]);

  // --- Normal Mode Timer Logic ---
  useEffect(() => {
    if (isBossMode) return; // Skip for Boss

    if (gameState === 'playing' && timeLeft > 0 && feedback === 'none') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (timeLeft === 0 && feedback === 'none') {
       handleTimeExpireNormal();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, timeLeft, feedback, isBossMode]);

  // --- Boss Mode Timer Logic ---
  useEffect(() => {
    if (!isBossMode || gameState !== 'playing' || feedback !== 'none') return;

    timerRef.current = window.setInterval(() => {
        setBossTimer(prev => {
            if (prev <= 1) {
                // Timer Expired: Boss Attacks
                handleBossAttack();
                return activeBossConfig.timerDuration; // Reset timer
            }
            return prev - 1;
        });
    }, 1000);

    return () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, feedback, isBossMode, activeBossConfig.timerDuration]);

  // --- Logic Handlers ---

  const handleBossAttack = () => {
     if (onTakeDamage) onTakeDamage(effectiveAttack);
     
     // Visual Shake or Red Flash could go here
     const root = document.getElementById('root');
     if(root) {
         root.classList.add('animate-shake');
         setTimeout(() => root.classList.remove('animate-shake'), 500);
     }
  };

  const handleTimeExpireNormal = () => {
    setFeedback('wrong');
    // In encounter mode, time expire = wrong answer
    if (encounter) {
      if (onTakeDamage) onTakeDamage(effectiveAttack);
      // Pending damage for this turn slot is 0
    }
    setTimeout(nextQuestionNormal, 1000);
  };

  const nextQuestionNormal = () => {
    // Check if we need to generate more problems
    if (currentIdx >= problems.length - 2) {
        const moreProblems = Array.from({ length: 10 }).map(() => generateMultiplication(config.multiplicationMax));
        setProblems(prev => [...prev, ...moreProblems]);
    }

    // Logic for Turn Cycle in Encounter
    if (encounter) {
        const nextActionIndex = turnActionIndex + 1;
        
        if (nextActionIndex >= TURN_ACTIONS) {
            // End of Turn: Apply Damage
            const totalDmg = pendingTurnDamage;
            const newScore = encounterScore + totalDmg;
            setEncounterScore(newScore);
            setPendingTurnDamage(0);
            setTurnActionIndex(0);

            // Check Win Condition
            if (newScore >= effectiveMaxHp) {
                finishGameNormal(true); // Victory
                return;
            }
        } else {
            setTurnActionIndex(nextActionIndex);
        }
    }

    // Advance Problem
    if (currentIdx < problems.length - 1) {
      setCurrentIdx(prev => prev + 1);
      // Reset timer per question in Encounter mode
      setTimeLeft(encounter ? normalMaxTime : DEFAULT_NORMAL_TIME);
      setUserInput('');
      setFeedback('none');
    } else {
      finishGameNormal(true);
    }
  };

  const finishGameNormal = (victory: boolean = true) => {
    setGameState('finished');
    const finalScore = scoreRef.current;
    
    // Encounter Logic
    if (encounter) {
      if (victory || encounterScore >= effectiveMaxHp) {
        setIsVictory(true);
        const xpEarned = effectiveXpReward > 0 ? effectiveXpReward : (finalScore * 3);
        onAddXp(xpEarned);
        if (onAddGold && effectiveGoldReward > 0) {
          onAddGold(effectiveGoldReward);
        }
      } else {
        setIsVictory(false);
        // Damage was applied during turns, no extra damage here unless we want punishment for retreating
      }
    } else {
      // Infinite Mode Logic
      setIsVictory(true);
      const xpEarned = finalScore * 2;
      if (xpEarned > 0) {
        onAddXp(xpEarned);
        onProgressTome(Math.floor(finalScore / 5)); 
      }
    }
  };

  const handlePlayerAttackBoss = () => {
      const newHp = Math.max(0, bossHp - playerAttackPower);
      setBossHp(newHp);
      setActionGauge(0);
      
      // Visual Feedback
      setFeedback('correct'); // Re-use correct visual briefly for attack impact?

      if (newHp === 0) {
          setTimeout(() => {
             setGameState('finished');
             setIsVictory(true);
             if (onAddXp) onAddXp(effectiveXpReward);
             if (onAddGold) onAddGold(effectiveGoldReward);
          }, 1000);
      }
  };

  // --- Unified Answer Handlers (Used by Validation & Admin) ---

  const handleCorrectAnswerBoss = () => {
      setFeedback('correct');
      // Add time bonus (capped at max)
      setBossTimer(prev => Math.min(activeBossConfig.timerDuration, prev + 2));
      
      // Fill Gauge
      const newGauge = actionGauge + 1;
      
      setTimeout(() => {
        if (newGauge >= activeBossConfig.actionsPerTurn) {
            // Attack!
            handlePlayerAttackBoss();
        } else {
            setActionGauge(newGauge);
        }
        
        // Next Problem
        setBossProblem(generateBossProblem(config.multiplicationMax));
        setUserInput('');
        setFeedback('none');
      }, 800);
  };

  const handleWrongAnswerBoss = () => {
      setFeedback('wrong');
      // Penalty: Remove time
      setBossTimer(prev => Math.max(1, prev - 3));
      
      setTimeout(() => {
         setBossProblem(generateBossProblem(config.multiplicationMax));
         setUserInput('');
         setFeedback('none');
      }, 800);
  };

  const handleCorrectAnswerNormal = () => {
    setFeedback('correct');
    // Calculate score / damage
    
    if (encounter) {
        // New Encounter Logic
        const timeElapsed = normalMaxTime - timeLeft;
        let atkBonus = 0;
        
        // Gold: First 2 seconds
        if (timeElapsed <= 2) {
            atkBonus = 2;
        } 
        // Green: More than 5 seconds left
        else if (timeLeft > 5) {
            atkBonus = 1;
        }
        // Red: Last 5 seconds -> Bonus 0
        
        const totalDmg = playerAttackPower + atkBonus;
        setPendingTurnDamage(prev => prev + totalDmg);
    } else {
        // Infinite Mode Scoring
        let points = 0;
        if (timeLeft > 7.5) points = 3;
        else if (timeLeft > 5) points = 2;
        else if (timeLeft > 0) points = 1;
        
        setScore(prev => prev + points);
        scoreRef.current += points; 
    }
    
    setTimeout(nextQuestionNormal, 500);
  };

  const handleWrongAnswerNormal = () => {
    setFeedback('wrong');
    
    if (encounter) {
        // Encounter: Immediate Damage to Player
        if (onTakeDamage) onTakeDamage(effectiveAttack);
        // Zero damage to monster for this action
        setTimeout(nextQuestionNormal, 500);
    } else {
        // Infinite Mode: Penalty time
        setTimeLeft(prev => Math.max(0, prev - 1));
        setUserInput('');
        setTimeout(() => setFeedback('none'), 500);
    }
  };

  // --- Validation ---

  const handleValidate = () => {
    if (isBossMode) {
        validateBoss();
    } else {
        validateNormal();
    }
  };

  const validateBoss = () => {
      if (!bossProblem || feedback !== 'none') return;
      
      const isCorrect = userInput.toString() === bossProblem.answer.toString();

      if (isCorrect) {
          handleCorrectAnswerBoss();
      } else {
          handleWrongAnswerBoss();
      }
  };

  const validateNormal = () => {
    if (!problems[currentIdx] || feedback !== 'none') return;

    const answer = parseInt(userInput);
    const correctAnswer = problems[currentIdx].answer;

    if (answer === correctAnswer) {
      handleCorrectAnswerNormal();
    } else {
      handleWrongAnswerNormal();
    }
  };

  const handleInput = (num: number | string) => {
    if (userInput.length < 5) setUserInput(prev => prev + num.toString());
  };

  const handleDelete = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleModalAction = () => {
    playMenuBackSound();
    if (encounter && isVictory && onEncounterComplete) {
      onEncounterComplete();
    } else {
      onBack();
    }
  };

  // --- Admin Controls ---
  const adminWin = () => {
      if (gameState === 'finished') return;
      if (isBossMode) {
          handleCorrectAnswerBoss();
      } else {
          handleCorrectAnswerNormal();
      }
  };

  const adminFail = () => {
      if (gameState === 'finished') return;
      if (isBossMode) {
          handleWrongAnswerBoss();
      } else {
          handleWrongAnswerNormal();
      }
  };

  // --- Render Helpers ---

  const getTimerColor = (time: number, max: number) => {
    if (encounter && !isBossMode) {
        // Special Logic for Normal Encounter
        const elapsed = max - time;
        if (elapsed <= 2) return 'text-yellow-400 border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.8)]'; // Gold
        if (time <= 5) return 'text-red-500 border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'; // Red
        return 'text-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]'; // Green
    }

    // Default Logic
    const pct = time / max;
    if (pct > 0.5) return 'text-green-500 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]';
    if (pct > 0.25) return 'text-yellow-500 border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.4)]';
    return 'text-red-500 border-red-500 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]';
  };

  // --- Intro Screen ---
  if (gameState === 'intro' && encounter) {
    return (
      <EncounterIntroCard 
        encounter={encounter}
        enemyStats={enemyStats}
        isBossMode={!!isBossMode}
        onStart={() => setGameState('playing')}
      />
    );
  }

  // --- Render Game ---
  
  const currentProblem = isBossMode ? bossProblem : problems[currentIdx];

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        {!encounter ? (
          <button onClick={() => { playMenuBackSound(); onBack(); }} className="p-2 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
            <ChevronLeft />
          </button>
        ) : <div className="w-10"></div>}
        
        <h2 className="text-2xl font-serif font-bold text-parchment-200">{t.titles.combat}</h2>
        <div className="w-10"></div>
      </div>

      {/* COMBAT ARENA */}
      <div className="flex-1 flex flex-col md:flex-row items-stretch justify-center gap-4 mb-4">
        
        {/* LEFT: PLAYER STATS */}
        <div className="w-full md:w-1/4 bg-black/40 rounded-lg p-3 border-2 border-parchment-700 flex flex-col justify-center relative">
           <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-parchment-300 border-2 border-amber-600 flex items-center justify-center mr-2">
                 <User className="w-6 h-6 text-parchment-900" />
              </div>
              <div className="overflow-hidden">
                 <div className="text-parchment-100 font-bold truncate">{playerStats?.username || "Hero"}</div>
                 <div className="text-xs text-parchment-400">{t.common.level} {playerStats?.level || 1}</div>
              </div>
           </div>

           {/* Player HP */}
           <div className="mb-3">
              <div className="flex justify-between text-xs text-parchment-300 mb-1">
                 <span className="flex items-center"><Heart className="w-3 h-3 text-red-500 mr-1"/> {t.common.hp}</span>
                 <span>{playerStats?.currentHp}/{playerStats?.maxHp}</span>
              </div>
              <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                 <div 
                    className="h-full bg-red-600 transition-all duration-300" 
                    style={{width: `${playerStats ? (playerStats.currentHp / playerStats.maxHp) * 100 : 100}%`}}
                 />
              </div>
           </div>

           {/* Stats / Action Gauge */}
           {isBossMode ? (
              <div>
                  <div className="flex justify-between text-xs text-amber-400 mb-1 font-bold">
                      <span className="flex items-center"><Zap className="w-3 h-3 mr-1"/> {t.combat.charge}</span>
                      <span>{playerAttackPower} Dmg</span>
                  </div>
                  <div className="w-full h-4 bg-gray-900 border border-amber-900/50 rounded-full overflow-hidden relative">
                      {/* Segments */}
                      <div className="absolute inset-0 flex">
                         {Array.from({length: activeBossConfig.actionsPerTurn}).map((_, i) => (
                           <div key={i} className="flex-1 border-r border-black/30 last:border-0 z-10"></div>
                         ))}
                      </div>
                      <div 
                        className="h-full bg-amber-500 transition-all duration-200" 
                        style={{width: `${(actionGauge / activeBossConfig.actionsPerTurn) * 100}%`}}
                      ></div>
                  </div>
              </div>
           ) : (
              <div className="flex items-center justify-between text-parchment-300 bg-white/5 p-2 rounded">
                 <span className="text-xs uppercase">{t.combat.attackPower}</span>
                 <span className="font-bold flex items-center text-amber-500"><Sword className="w-4 h-4 mr-1"/> {playerAttackPower}</span>
              </div>
           )}
        </div>

        {/* CENTER: ARENA (Problem & Timer) */}
        <div className="flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
           
           {/* Normal Encounter: 3-Segment Action Bar */}
           {encounter && !isBossMode && (
             <div className="w-32 h-3 bg-gray-900 border border-gray-600 rounded-full mb-4 flex overflow-hidden">
                {[0, 1, 2].map((idx) => {
                    let bgColor = 'bg-gray-800';
                    if (idx < turnActionIndex) bgColor = 'bg-amber-500';
                    if (idx === turnActionIndex) bgColor = 'bg-amber-500 animate-pulse';
                    return (
                        <div key={idx} className={`flex-1 border-r border-gray-900 last:border-0 ${bgColor} transition-colors duration-300`} />
                    )
                })}
             </div>
           )}

           {/* BIG CENTERED TIMER */}
           <div className={`mb-8 flex items-center justify-center w-24 h-24 rounded-full border-4 bg-gray-900 transition-all duration-500 shadow-xl
                ${isBossMode 
                    ? getTimerColor(bossTimer, activeBossConfig.timerDuration) 
                    : getTimerColor(timeLeft, encounter ? normalMaxTime : DEFAULT_NORMAL_TIME)}
           `}>
                <div className="flex flex-col items-center">
                    <Timer className="w-6 h-6 mb-1 opacity-80" />
                    <span className="text-4xl font-bold font-mono tracking-tighter">
                        {isBossMode ? bossTimer : timeLeft}
                    </span>
                </div>
           </div>

           {/* PROBLEM CARD */}
           {currentProblem && (
            <div className="relative w-full flex justify-center z-10">
                <div className={`
                    p-6 md:p-8 rounded-xl border-4 transition-all duration-200 bg-parchment-200 w-full max-w-sm shadow-2xl
                    ${feedback === 'correct' ? 'border-green-500 scale-105 shadow-[0_0_20px_rgba(34,197,94,0.5)]' : ''}
                    ${feedback === 'wrong' ? 'border-red-500 rotate-2 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'border-parchment-800'}
                `}>
                <div className="text-4xl md:text-5xl font-serif font-bold text-parchment-900 mb-6 text-center">
                    {currentProblem.question}
                </div>
                <div className="text-4xl font-mono text-center h-12 text-parchment-800 border-b-2 border-dashed border-parchment-400 w-40 mx-auto">
                    {userInput}
                </div>
                </div>
                <button 
                    onClick={() => setIsScratchpadOpen(true)}
                    className="absolute -right-2 top-0 p-2 bg-amber-600 text-white rounded-full shadow-lg border-2 border-amber-800 hover:bg-amber-700 hover:scale-110 transition-all"
                    title={t.titles.scratchpad}
                >
                    <PencilLine className="w-5 h-5" />
                </button>
            </div>
           )}

           {!encounter && !isBossMode && (
               <div className="absolute top-0 right-0 text-parchment-500 font-bold text-sm">
                   {t.combat.question} {currentIdx + 1} / {problems.length}
               </div>
           )}

           {/* Normal Encounter Pending Damage */}
           {encounter && !isBossMode && (
               <div className="mt-4 flex flex-col items-center">
                   <div className="text-xs text-parchment-400 uppercase tracking-widest mb-1">{t.combat.pendingDamage}</div>
                   <div className="text-2xl font-bold text-red-400">-{pendingTurnDamage}</div>
               </div>
           )}
        </div>

        {/* RIGHT: ENEMY STATS */}
        {encounter ? (
            <div className="w-full md:w-1/4 bg-red-950/40 rounded-lg p-3 border-2 border-red-800/60 flex flex-col justify-center">
                <div className="flex items-center justify-end mb-2">
                    <div className="text-right overflow-hidden mr-2">
                        <div className="text-red-200 font-bold truncate">{(lang === 'fr' && encounter.name_fr) ? encounter.name_fr : encounter.name}</div>
                        <div className="text-xs text-red-400 uppercase tracking-wider">{encounter.type === 'boss' ? 'Boss' : t.combat.encounterStart}</div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-red-900 border-2 border-red-500 flex items-center justify-center overflow-hidden">
                        {encounter.image ? (
                           <img src={encounter.image} alt="enemy" className="w-full h-full object-cover" />
                        ) : (
                           <Skull className="w-6 h-6 text-red-200" />
                        )}
                    </div>
                </div>

                {/* Enemy HP / Progress */}
                <div className="mb-3">
                    <div className="flex justify-between text-xs text-red-300 mb-1">
                        <span>{isBossMode ? t.common.hp : t.combat.damageDealt}</span>
                        <span>
                            {isBossMode ? bossHp : encounterScore}/{effectiveMaxHp}
                        </span>
                    </div>
                    <div className="w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                        <div 
                            className={`h-full transition-all duration-300 ${isBossMode ? 'bg-purple-600' : 'bg-blue-600'}`} 
                            style={{width: `${isBossMode ? (bossHp / effectiveMaxHp) * 100 : (encounterScore / effectiveMaxHp) * 100}%`}}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-red-200 bg-white/5 p-2 rounded">
                        <span className="text-xs uppercase">{t.combat.attack}</span>
                        <span className="font-bold flex items-center text-red-500">
                            <Sword className="w-4 h-4 mr-1"/> {effectiveAttack}
                        </span>
                    </div>
                    {encounter.tags && encounter.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-end">
                             {encounter.tags.map(tag => (
                                 <span key={tag} className="text-[10px] bg-red-900 text-red-200 px-1 rounded border border-red-700">
                                     {tag.replace('mon_', '')}
                                 </span>
                             ))}
                        </div>
                    )}
                </div>
            </div>
        ) : (
             <div className="hidden md:flex w-1/4 flex-col justify-center items-center opacity-30">
                 <Shield className="w-16 h-16 text-parchment-500 mb-2" />
                 <p className="text-parchment-500 text-center text-sm">{t.combat.trainingMode}</p>
                 <div className="mt-4 text-2xl font-bold text-amber-500">{score} pts</div>
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
                title="Force Action Success"
             >
                 <Check className="w-4 h-4" />
             </button>
             <button 
                onClick={adminFail}
                className="bg-red-600 text-white p-2 rounded-full shadow hover:bg-red-500"
                title="Force Action Failure"
             >
                 <X className="w-4 h-4" />
             </button>
         </div>
      )}

      <div className="mt-auto">
        <Keypad 
          onInput={handleInput} 
          onDelete={handleDelete} 
          onValidate={handleValidate}
          disabled={feedback === 'correct' || gameState === 'finished'}
          mode={isBossMode && currentProblem?.type === 'operator' ? 'operator' : 'number'}
        />
      </div>

      <Modal 
        title={t.combat.battleReport}
        actionLabel={isVictory ? (encounter ? t.combat.continue : t.buttons.back) : t.combat.tryAgain}
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
            {!encounter && (
                <div className="flex justify-between items-end mb-2 border-b border-parchment-400/30 pb-2">
                <span className="text-sm uppercase tracking-widest opacity-80">{t.combat.finalScore}</span>
                <div className="text-2xl font-bold">
                    {score}
                </div>
                </div>
            )}
            
            {encounter && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm uppercase tracking-widest opacity-80">{t.combat.hpLost}</span>
                <span className={`font-bold text-xl ${isVictory ? 'text-green-500' : 'text-red-500'}`}>
                   {isVictory && !isBossMode ? '0' : (isBossMode && isVictory ? 'Victory' : `-${effectiveAttack}`)}
                </span>
              </div>
            )}

            {isVictory && encounter && effectiveGoldReward > 0 && (
                <div className="flex justify-between items-center">
                    <span className="text-sm uppercase tracking-widest opacity-80">{t.common.gold}</span>
                    <span className="font-bold text-xl text-amber-500">
                        +{effectiveGoldReward}
                    </span>
                </div>
            )}
          </div>

          {isVictory && (
             <p className="text-lg font-bold text-yellow-500">
               +{encounter ? (effectiveXpReward > 0 ? effectiveXpReward : score * 3) : score * 2} {t.common.xp}
             </p>
          )}
        </div>
      </Modal>

      <ScratchpadModal 
        isOpen={isScratchpadOpen} 
        onClose={() => setIsScratchpadOpen(false)} 
      />
    </div>
  );
};

export default Combat;