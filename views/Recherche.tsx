
import React, { useState, useEffect } from 'react';
import { GameConfig, MathProblem, Rarity, Item, Card, MinigameProps } from '../types';
import { generateDivision } from '../services/mathService';
import { generateLootItem } from '../services/lootService';
import Keypad from '../components/Keypad';
import ScratchpadModal from '../components/ScratchpadModal';
import LootRewardCard from '../components/LootRewardCard';
import { RARITY_COLORS, RARITY_TEXT_COLORS } from '../constants';
import { ChevronLeft, Search, Loader2, Coins, AlertTriangle, CheckCircle, XCircle, Lock, PencilLine, ShieldCheck, Key } from 'lucide-react';
import { useLocalization } from '../localization';
import Modal from '../components/Modal';
import { playMenuOpenSound, playMenuBackSound, fadeOutCurrentSound } from '../services/audioService';

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

const CHEST_IMAGES: Record<Rarity, string> = {
  [Rarity.COMMON]: 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/containers/common.png',
  [Rarity.RARE]: 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/containers/rare.png',
  [Rarity.MAGIC]: 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/containers/magic2.png',
  [Rarity.LEGENDARY]: 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/containers/legendary.png',
  [Rarity.MYTHIC]: 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/containers/Mythic.png',
};

const Recherche: React.FC<RechercheProps> = ({ config, onBack, onAddXp, onAddItem, playerGold = 0, lootWeights = [], isAdmin }) => {
  const { t } = useLocalization();
  const [phase, setPhase] = useState<'select' | 'solve' | 'result'>('select');
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [animatingCardId, setAnimatingCardId] = useState<string | null>(null);
  
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
    if (animatingCardId) return; // Prevent double clicks
    setAnimatingCardId(card.id);
    playMenuOpenSound();

    // Delay the transition to allow the animation to play
    setTimeout(() => {
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
      setAnimatingCardId(null);
    }, 600); // 0.6s match animation duration approx
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

  const adminWin = () => {
      finishGame(true);
  };

  const finishGame = async (isSuccess: boolean) => {
    setSolvedCorrectly(isSuccess);
    
    if (isSuccess && selectedCard) {
      setIsLoadingItem(true);
      setPhase('result');
      onAddXp(XP_REWARD);
      // Removed onProgressTome(1) - Recherche no longer grants steps
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
      playMenuOpenSound();
      setShowExitWarning(true);
    } else {
      playMenuBackSound();
      fadeOutCurrentSound();
      onBack();
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
                disabled={!!animatingCardId}
                className={`
                  h-80 rounded-xl border-4 shadow-lg transform transition-all relative overflow-hidden flex flex-col items-center p-0
                  ${card.color}
                  ${animatingCardId === card.id ? 'slide-out-blurred-top' : (!animatingCardId ? 'hover:scale-105' : '')}
                `}
              >
                <div className="w-full h-3/5 relative bg-black/20 overflow-hidden flex items-center justify-center border-b border-black/10">
                   {/* Fallback Icon behind image */}
                   <Search className="w-16 h-16 text-white/20 absolute z-0" />
                   
                   <img 
                      src={CHEST_IMAGES[card.rarity]} 
                      alt={`${card.rarity} Chest`}
                      className="w-full h-full object-cover z-10 relative"
                      onError={(e) => e.currentTarget.style.opacity = '0'} 
                   />
                </div>
                
                <div className="w-full h-2/5 flex flex-col items-center justify-center bg-black/30 p-2">
                    <span className="text-white font-serif font-bold text-xl uppercase tracking-wider shadow-black drop-shadow-md">
                    {card.rarity}
                    </span>
                    <div className="mt-2 text-white/90 text-xs font-bold flex items-center bg-black/50 px-3 py-1 rounded-full border border-white/10">
                        <Lock className="w-3 h-3 mr-1" />
                        {diff.wins} {diff.wins > 1 ? t.recherche.locks : t.recherche.lock}
                    </div>
                </div>
              </button>
            );
          })}
        </div>

        <Modal
          title={t.recherche.entryFee}
          isOpen={showExitWarning}
          actionLabel={t.buttons.confirmLeave}
          onAction={() => { playMenuBackSound(); fadeOutCurrentSound(); onBack(); }}
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
             {t.recherche.deciphering} {selectedCard?.rarity} Cache
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
             {currentWins} / {winsNeeded} {t.recherche.toUnlock}
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
        
        {isAdmin && (
         <div className="absolute bottom-4 left-4 flex flex-col space-y-2 z-50">
             <div className="text-xs text-purple-300 font-bold uppercase tracking-wider mb-1 flex items-center">
                 <ShieldCheck className="w-3 h-3 mr-1" />
                 Admin
             </div>
             <button 
                onClick={adminWin}
                className="bg-green-600 text-white p-2 rounded-full shadow hover:bg-green-500"
                title="Instant Unlock"
             >
                 <Key className="w-4 h-4" />
             </button>
         </div>
        )}

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
  if (isLoadingItem) {
    return (
        <div className="flex flex-col h-full items-center justify-center p-4 max-w-lg mx-auto animate-fadeIn">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-4" />
            <h2 className="text-2xl font-serif font-bold text-parchment-200">{t.common.loading}</h2>
        </div>
    );
  }

  return (
    <LootRewardCard 
      item={item}
      onBack={() => { playMenuBackSound(); fadeOutCurrentSound(); onBack(); }}
      solvedCorrectly={solvedCorrectly}
    />
  );
};

export default Recherche;
