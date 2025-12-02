
import React, { useState, useEffect } from 'react';
import { GameConfig, MathProblem, Rarity, Item, Card, MinigameProps, LootWeight } from '../types';
import { generateDivision } from '../services/mathService';
import { generateLootItem } from '../services/lootService';
import Keypad from '../components/Keypad';
import { RARITY_COLORS, RARITY_TEXT_COLORS } from '../constants';
import { ChevronLeft, Gift, Search, Loader2, Coins, AlertTriangle } from 'lucide-react';
import { useLocalization } from '../localization';
import Modal from '../components/Modal';

interface RechercheProps extends MinigameProps {
  config: GameConfig['recherche'];
}

const XP_REWARD = 15;

const Recherche: React.FC<RechercheProps> = ({ config, onBack, onAddXp, onProgressTome, playerGold = 0, lootWeights = [] }) => {
  const { t } = useLocalization();
  const [phase, setPhase] = useState<'select' | 'solve' | 'result'>('select');
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [userInput, setUserInput] = useState('');
  const [item, setItem] = useState<Item | null>(null);
  const [isLoadingItem, setIsLoadingItem] = useState(false);
  const [solvedCorrectly, setSolvedCorrectly] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

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
    // Use passed props or empty array fallback
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
    setProblem(generateDivision(config.divisionMaxDividend));
    setPhase('solve');
    setUserInput('');
  };

  const handleInput = (num: number) => {
    if (userInput.length < 5) setUserInput(prev => prev + num.toString());
  };

  const handleDelete = () => {
    setUserInput(prev => prev.slice(0, -1));
  };

  const handleValidate = async () => {
    if (!problem || !selectedCard) return;
    const answer = parseInt(userInput);
    
    const isCorrect = answer === problem.answer;
    setSolvedCorrectly(isCorrect);
    
    if (isCorrect) {
      setIsLoadingItem(true);
      setPhase('result');
      onAddXp(XP_REWARD);
      onProgressTome(1);
      const loot = await generateLootItem(selectedCard.rarity);
      setItem(loot);
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
          {cards.map((card) => (
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
            </button>
          ))}
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

  if (phase === 'solve') {
    return (
      <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
        <div className="flex-1 flex flex-col items-center justify-center">
           {problem && (
            <div className={`p-8 rounded-xl mb-8 border-4 border-parchment-300 bg-parchment-200 shadow-xl`}>
              <div className="text-5xl font-serif font-bold text-parchment-900 mb-4 text-center">
                {problem.question}
              </div>
              <div className="text-4xl font-mono text-center h-12 text-parchment-800 border-b-2 border-dashed border-parchment-400 w-32 mx-auto">
                {userInput}
              </div>
            </div>
          )}
        </div>
        <Keypad onInput={handleInput} onDelete={handleDelete} onValidate={handleValidate} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 max-w-md mx-auto">
      <div className="bg-parchment-200 border-4 border-parchment-800 p-8 rounded-lg shadow-2xl w-full text-center">
        {isLoadingItem ? (
           <div className="flex flex-col items-center py-12">
             <Loader2 className="w-12 h-12 text-parchment-800 animate-spin mb-4" />
             <p className="text-parchment-800 font-serif text-xl">{t.common.loading}</p>
           </div>
        ) : (
          <>
            {solvedCorrectly && item ? (
              <div className="animate-fadeIn">
                <h2 className="text-3xl font-serif font-bold text-parchment-900 mb-2">{t.combat.victory}</h2>
                <div className={`text-sm font-bold uppercase tracking-widest mb-6 ${RARITY_TEXT_COLORS[item.rarity]}`}>
                  {item.rarity}
                </div>
                
                <div className="bg-parchment-100 p-6 rounded border-2 border-parchment-300 mb-8">
                   <Gift className={`w-12 h-12 mx-auto mb-4 ${RARITY_TEXT_COLORS[item.rarity]}`} />
                   <h3 className="text-xl font-bold text-parchment-900 mb-2">{item.name}</h3>
                   <p className="text-parchment-700 italic font-serif">"{item.description}"</p>
                </div>
                <div className="mb-6 text-yellow-600 font-bold">+{XP_REWARD} {t.common.xp}</div>
              </div>
            ) : (
              <div className="py-12">
                <h2 className="text-3xl font-serif font-bold text-red-800 mb-4">{t.combat.defeat}</h2>
              </div>
            )}
            
            <button
              onClick={onBack}
              className="w-full px-6 py-3 bg-parchment-800 text-parchment-100 font-serif font-bold text-xl rounded hover:bg-parchment-900 transition-colors"
            >
              {t.buttons.returnCamp}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Recherche;
