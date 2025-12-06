


import React, { useState, useEffect } from 'react';
import { GameConfig, MathProblem, Rarity, Item, Card, MinigameProps, EffectType } from '../types';
import { generateDivision } from '../services/mathService';
import { generateLootItem } from '../services/lootService';
import { STATUS_EFFECTS } from '../data/statusEffects';
import Keypad from '../components/Keypad';
import ScratchpadModal from '../components/ScratchpadModal';
import { RARITY_COLORS, RARITY_TEXT_COLORS } from '../constants';
import { ChevronLeft, Gift, Search, Loader2, Coins, AlertTriangle, Sparkles, Footprints, Sword, Star, PencilLine, CheckCircle, XCircle, Lock } from 'lucide-react';
import { useLocalization } from '../localization';
import Modal from '../components/Modal';

interface RechercheProps extends MinigameProps {
  config: GameConfig['recherche'];
  onAddItem: (item: Item) => void;
}

const XP_REWARD = 10;

const DIFFICULTY_CONFIG: Record<Rarity, { steps: number; wins: number }> = {
  [Rarity.COMMON]: { steps: 1, wins: 1 },
  [Rarity.RARE]: { steps: 3, wins: 2 },
  [Rarity.MAGIC]: { steps: 3, wins: 2 },
  [Rarity.LEGENDARY]: { steps: 5, wins: 3 },
  [Rarity.MYTHIC]: { steps: 5, wins: 3 },
};

const Recherche: React.FC<RechercheProps> = ({ config, onBack, onAddXp, onProgressTome, onAddItem, playerGold = 0, lootWeights = [] }) => {
  const { t, lang } = useLocalization();
  const [phase, setPhase] = useState<'select' | 'solve' | 'result'>('select');
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  
  // Gameplay State
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong'>('none');
  
  // Multi-step Logic
  const [totalSteps, setTotalSteps] = useState(1);
  const [winsNeeded, setWinsNeeded] = useState(1);
  const [currentWins, setCurrentWins] = useState(0);
  const [currentLosses, setCurrentLosses] = useState(0);

  // Result State
  const [item, setItem] = useState<Item | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [solvedCorrectly, setSolvedCorrectly] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);
  const [isScratchpadOpen, setIsScratchpadOpen] = useState(false);

  useEffect(() => {
    const newCards = Array.from({ length: 3 }).map((_, i) => ({
      id: `card-${i}`,
      rarity: getRandomRarity(),
      color: '', 
    })).map(c => ({
      ...c,
      color: RARITY_COLORS[c.rarity]
    }));
    setCards(newCards);
  }, [lootWeights]);

  const getRandomRarity = (): Rarity => {
    const weights = lootWeights.length > 0 ? lootWeights : [{rarity: Rarity.COMMON, weight: 100}];
    const totalWeight = weights.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const { rarity, weight } of weights) {
      if (random < weight) return rarity;
      random -= weight;
    }
    return Rarity.COMMON;
  };

  const handleCardSelect = (card: Card) => {
    setSelectedCard(card);
    
    // Initialize Difficulty
    const diff = DIFFICULTY_CONFIG[card.rarity] || { steps: 1, wins: 1 };
    setTotalSteps(diff.steps);
    setWinsNeeded(diff.wins);
    setCurrentWins(0);
    setCurrentLosses(0);
    
    setProblem(generateDivision(config.divisionMaxDividend));
    setPhase('solve');
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

  const handleValidate = async () => {
    if (!problem || !selectedCard || feedback !== 'none') return;
    const answer = parseInt(userInput);
    
    const isCorrect = answer === problem.answer;
    
    // Visual Feedback Phase
    setFeedback(isCorrect ? 'correct' : 'wrong');

    // Logic Delay
    setTimeout(async () => {
      const newWins = isCorrect ? currentWins + 1 : currentWins;
      const newLosses = isCorrect ? currentLosses : currentLosses + 1;
      
      setCurrentWins(newWins);
      setCurrentLosses(newLosses);

      // 1. WIN CONDITION: Met required wins
      if (newWins >= winsNeeded) {
        finishGame(true);
        return;
      }

      // 2. LOSS CONDITION: Cannot possibly catch up
      // Example: 3 steps, 2 wins needed. If 2 losses, max wins is 1. 1 < 2. Fail.
      // (Total - Needed) is the buffer. If Losses > Buffer, fail.
      if (newLosses > (totalSteps - winsNeeded)) {
        finishGame(false);
        return;
      }

      // 3. CONTINUE: Generate next problem
      setProblem(generateDivision(config.divisionMaxDividend));
      setUserInput('');
      setFeedback('none');

    }, 1000);
  };

  const finishGame = async (isSuccess: boolean) => {
    setSolvedCorrectly(isSuccess);
    
    if (isSuccess && selectedCard) {
      setIsLoadingItem(true);
      setPhase('result');
      onAddXp(XP_REWARD);
      onProgressTome(1);
      const loot = await generateLootItem(selectedCard.rarity);
      setItem(loot);
      onAddItem(loot); 
      setIsLoadingItem(false);
    } else {
      setPhase('result');
      setItem(null);
    }
  };

  const handleBackAttempt = () => {
    if (phase === 'select') {
      setShowExitWarning(true);
    } else {
      onBack();
    }
  };

  const getItemName = (itm: Item) => (lang === 'fr' && itm.name_fr) ? itm.name_fr : itm.name;
  const getItemDesc = (itm: Item) => (lang === 'fr' && itm.description_fr) ? itm.description_fr : itm.description;

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-4 h-4 text-yellow-400" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-4 h-4 text-amber-400" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-4 h-4 text-green-400" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-4 h-4 text-red-400" />;
        default: return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  const getCardStyle = (rarity: Rarity) => {
      switch(rarity) {
          case Rarity.MYTHIC:
              return "bg-gradient-to-b from-purple-900 to-black border-purple-400 shadow-[0_0_50px_rgba(168,85,247,0.6)]";
          case Rarity.LEGENDARY:
              return "bg-gradient-to-b from-amber-900 to-black border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)]";
          case Rarity.MAGIC:
              return "bg-gradient-to-b from-blue-900 to-black border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.4)]";
          case Rarity.RARE:
              return "bg-gradient-to-b from-green-900 to-black border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
          default:
              return "bg-gradient-to-b from-gray-800 to-black border-gray-500 shadow-xl";
      }
  };

  // --- Render Select Phase ---
  if (phase === 'select') {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
                <button onClick={handleBackAttempt} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
                    <ChevronLeft />
                </button>
                <h2 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.recherche}</h2>
            </div>
            
            <div className="bg-parchment-900/80 px-4 py-2 rounded-full border border-amber-600 flex items-center shadow-lg">
                <Coins className="w-5 h-5 text-amber-500 mr-2" />
                <span className="text-amber-100 font-bold">{playerGold}</span>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 items-center">
          {cards.map((card) => {
            const diff = DIFFICULTY_CONFIG[card.rarity];
            return (
              <button
                key={card.id}
                onClick={() => handleCardSelect(card)}
                className={`
                  h-64 rounded-xl border-4 shadow-lg transform transition-all relative overflow-hidden flex flex-col items-center justify-center p-4
                  ${card.color}
                  hover:scale-105
                `}
              >
                <div className="absolute inset-0 bg-black/20" />
                <Search className="w-16 h-16 text-white/80 z-10 mb-4" />
                <span className="z-10 text-white font-serif font-bold text-xl uppercase tracking-wider shadow-black drop-shadow-md">
                  {card.rarity}
                </span>
                <div className="z-10 mt-2 text-white/70 text-xs font-bold flex items-center bg-black/40 px-3 py-1 rounded-full">
                   <Lock className="w-3 h-3 mr-1" />
                   {diff.wins} {diff.wins > 1 ? 'Locks' : 'Lock'}
                </div>
              </button>
            );
          })}
        </div>

        <Modal
          title={t.recherche.entryFee}
          isOpen={showExitWarning}
          actionLabel={t.buttons.confirmLeave}
          onAction={onBack}
          colorClass="bg-red-950 text-white border-red-500"
        >
          <div className="flex flex-col items-center text-center">
             <AlertTriangle className="w-16 h-16 text-red-500 mb-4 animate-pulse" />
             <p className="text-lg">{t.recherche.exitWarning}</p>
             <button 
               onClick={() => setShowExitWarning(false)}
               className="mt-6 text-parchment-300 underline hover:text-white"
             >
               {t.buttons.stay}
             </button>
          </div>
        </Modal>
      </div>
    );
  }

  // --- Render Solve Phase ---
  if (phase === 'solve') {
    return (
      <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
        
        {/* Progress Header */}
        <div className="mb-6 flex flex-col items-center">
           <div className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 ${selectedCard ? RARITY_TEXT_COLORS[selectedCard.rarity] : 'text-white'} bg-black/40 border border-white/20`}>
             Deciphering {selectedCard?.rarity} Cache
           </div>
           
           <div className="flex items-center space-x-2">
              {Array.from({ length: totalSteps }).map((_, idx) => {
                 let icon = <div className="w-4 h-4 rounded-full bg-parchment-800/50 border border-parchment-600" />; // Default: Pending
                 
                 // If this step is a Win
                 if (idx < currentWins) {
                    icon = <CheckCircle className="w-6 h-6 text-green-500" />;
                 } 
                 // If we have losses, show them at the end (simplification for visualization)
                 else if (idx >= totalSteps - currentLosses) {
                    icon = <XCircle className="w-6 h-6 text-red-500" />;
                 }
                 // If this is the current active step (and no result yet)
                 else if (idx === (currentWins + currentLosses)) {
                    icon = <div className="w-5 h-5 rounded-full border-2 border-amber-500 animate-pulse bg-amber-500/20" />;
                 }

                 return <div key={idx}>{icon}</div>;
              })}
           </div>
           <div className="text-xs text-parchment-400 mt-1">
             {currentWins} / {winsNeeded} to unlock
           </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
           {problem && (
            <div className="relative">
              <div className={`
                 p-8 rounded-xl mb-8 border-4 shadow-xl transition-all duration-300
                 ${feedback === 'correct' ? 'border-green-500 bg-green-100' : ''}
                 ${feedback === 'wrong' ? 'border-red-500 bg-red-100' : 'border-parchment-300 bg-parchment-200'}
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
               {/* Mobile Position */}
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
        
        <div className="mt-auto mb-12">
          <Keypad 
            onInput={handleInput} 
            onDelete={handleDelete} 
            onValidate={handleValidate}
            disabled={feedback !== 'none'} 
          />
        </div>

        <ScratchpadModal 
          isOpen={isScratchpadOpen} 
          onClose={() => setIsScratchpadOpen(false)} 
        />
      </div>
    );
  }

  // --- Render Result Phase ---
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 max-w-lg mx-auto animate-fadeIn">
      {isLoadingItem ? (
        <div className="flex flex-col items-center">
          <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
          <h2 className="text-2xl font-serif font-bold text-parchment-200">{t.common.loading}</h2>
        </div>
      ) : (
        <div className={`
           w-full relative rounded-2xl border-4 p-1
           ${solvedCorrectly && item ? getCardStyle(item.rarity) : 'bg-red-950 border-red-600 text-white'}
        `}>
          {solvedCorrectly && item ? (
            <div className="relative z-10 flex flex-col items-center p-6 text-center">
              
              {/* Rarity Header */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 px-6 py-1 rounded-full border-2 border-current text-sm font-bold uppercase tracking-[0.2em] shadow-lg" style={{color: RARITY_COLORS[item.rarity].split(' ')[0].replace('bg-', '') === 'bg-gray-500' ? '#9ca3af' : 'inherit', borderColor: 'currentColor'}}>
                  <span className={RARITY_TEXT_COLORS[item.rarity]}>{item.rarity}</span>
              </div>

              {/* Item Image / Icon */}
              <div className={`w-32 h-32 mb-6 mt-4 relative flex items-center justify-center rounded-full bg-black/30 border-4 shadow-inner ${RARITY_TEXT_COLORS[item.rarity].replace('text-', 'border-')}`}>
                  {(item.rarity === Rarity.LEGENDARY || item.rarity === Rarity.MYTHIC) && (
                      <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse"></div>
                  )}
                  
                  {item.image ? (
                      <img src={item.image} alt={getItemName(item)} className="w-full h-full object-cover rounded-full p-1 animate-fadeIn" />
                  ) : (
                      <Gift className={`w-16 h-16 ${RARITY_TEXT_COLORS[item.rarity]} animate-bounce drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`} />
                  )}
              </div>

              {/* Title & Desc */}
              <h3 className={`text-3xl font-serif font-bold mb-2 ${RARITY_TEXT_COLORS[item.rarity]} drop-shadow-md`}>
                {getItemName(item)}
              </h3>
              <p className="text-parchment-200 italic mb-6 border-b border-white/20 pb-4 w-full">"{getItemDesc(item)}"</p>
              
              {/* Rewards Summary */}
              <div className="flex justify-center space-x-4 mb-6">
                 <div className="bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                    <span className="block text-xl font-bold text-yellow-400">+{XP_REWARD}</span>
                    <span className="text-[10px] uppercase font-bold text-parchment-300">{t.common.xp}</span>
                 </div>
              </div>

              {/* Status Effects List */}
              {item.tags && item.tags.length > 0 && (
                <div className="w-full bg-black/40 rounded-lg p-3 backdrop-blur-md border border-white/10">
                  <p className="text-xs uppercase font-bold text-parchment-400 mb-2 tracking-wider text-left pl-1">Bonus Effects</p>
                  <div className="space-y-2">
                    {item.tags.map(tag => {
                      const effect = STATUS_EFFECTS[tag];
                      if (!effect) return null;
                      
                      const effectName = (lang === 'fr' && effect.name_fr) ? effect.name_fr : effect.name;
                      const effectDesc = (lang === 'fr' && effect.description_fr) ? effect.description_fr : effect.description;

                      return (
                        <div key={tag} className="flex items-start text-left bg-white/5 p-2 rounded hover:bg-white/10 transition-colors">
                           <div className="mt-1 mr-2 p-1 bg-black/50 rounded-full">
                               {getEffectIcon(effect.type)}
                           </div>
                           <div>
                               <div className="font-bold text-parchment-100 text-sm">{effectName}</div>
                               <div className="text-xs text-parchment-400">{effectDesc}</div>
                           </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center p-8">
               <div className="mb-6 flex justify-center">
                 <AlertTriangle className="w-24 h-24 text-red-500 mb-4" />
               </div>
               <h2 className="text-3xl font-serif font-bold mb-4">{t.combat.defeat}</h2>
               <p className="text-red-200 mb-6 text-center">The ancient lock remains sealed. Too many incorrect calculations.</p>
            </div>
          )}

          {/* Action Button */}
          <div className="p-4 bg-black/20 mt-4 rounded-b-xl">
             <button 
                onClick={onBack}
                className="w-full py-3 bg-parchment-100 text-parchment-900 font-serif font-bold rounded shadow-lg hover:bg-white transition-all transform active:scale-95"
            >
                {t.buttons.back}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recherche;