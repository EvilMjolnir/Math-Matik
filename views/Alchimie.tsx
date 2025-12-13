
import React, { useState } from 'react';
import { MinigameProps, Rarity, Item, MathProblem, EffectType, GameConfig } from '../types';
import { generateFractionProblem } from '../services/mathService';
import { STATUS_EFFECTS } from '../data/statusEffects';
import Keypad from '../components/Keypad';
import LootRewardCard from '../components/LootRewardCard';
import ItemDetailOverlay from '../components/ItemDetailOverlay';
import { ChevronLeft, FlaskConical, Sigma, Sparkles, Eye, Star, Coins, Footprints, Sword, Heart, Hand, AlertTriangle, BicepsFlexed, Skull, Sprout } from 'lucide-react';
import { useLocalization } from '../localization';
import { playMenuBackSound, playFlipCardSound, playDamageSound, playGlassBreakSound, playCorrectSound, playWrongSound } from '../services/audioService';
import { useDeviceType } from '../hooks/useDeviceType';
import MathProblemDisplay from '../components/MathProblemDisplay';
import { useKeyboardInput } from '../hooks/useKeyboardInput';

interface AlchimieProps extends MinigameProps {
  onAddItem: (item: Item) => void;
  playerNems: number;
  onSpendNems: (amount: number) => void;
  config: GameConfig['alchimie'];
}

type AlchimiePhase = 'select' | 'draft' | 'craft' | 'result';

const POTION_SIZES = {
  small: { uses: 1, label: 'Small' },
  medium: { uses: 3, label: 'Medium' },
  large: { uses: 5, label: 'Large' },
};

const CARD_BACK_URL = "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/card_back.png";
const FAILED_POTION_IMG = "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/items/potions/failed_craft.png";

// Styles matching LootRewardCard
const RARITY_STYLES: Record<Rarity, { border: string; bg: string; text: string }> = {
  [Rarity.COMMON]: { 
    border: '#6b7280', 
    bg: '#111827',     
    text: 'text-gray-300' 
  },
  [Rarity.RARE]: { 
    border: '#16a34a', 
    bg: '#064e3b',     
    text: 'text-green-400' 
  },
  [Rarity.MAGIC]: { 
    border: '#2563eb', 
    bg: '#172554',     
    text: 'text-blue-400' 
  },
  [Rarity.LEGENDARY]: { 
    border: '#d97706', 
    bg: '#451a03',     
    text: 'text-amber-400' 
  },
  [Rarity.MYTHIC]: { 
    border: '#9333ea', 
    bg: '#3b0764',     
    text: 'text-purple-400' 
  },
};

const Alchimie: React.FC<AlchimieProps> = ({ onBack, onAddXp, onAddItem, playerNems, onSpendNems, isAdmin, config, keypadConfig }) => {
  const { t, lang } = useLocalization();
  const deviceType = useDeviceType();
  const [phase, setPhase] = useState<AlchimiePhase>('select');
  const [selectedMode, setSelectedMode] = useState<number | null>(null); // 1, 3, or 5 nems
  
  // Draft State
  const [draftCards, setDraftCards] = useState<Item[]>([]);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false]);
  const [selectedPotion, setSelectedPotion] = useState<Item | null>(null);
  const [zoomedItem, setZoomedItem] = useState<Item | null>(null);

  // Crafting State
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [userInputNum, setUserInputNum] = useState('');
  const [userInputDen, setUserInputDen] = useState('');
  const [activeInput, setActiveInput] = useState<'num' | 'den' | 'whole'>('whole'); 
  const [feedback, setFeedback] = useState<'none' | 'correct' | 'wrong' | 'unstable'>('none');
  const [craftedItem, setCraftedItem] = useState<Item | null>(null);

  const getEffectIcon = (type: EffectType) => {
    switch (type) {
        case EffectType.XP_MULTIPLIER: return <Star className="w-3 h-3 text-yellow-400" />;
        case EffectType.GOLD_MULTIPLIER: return <Coins className="w-3 h-3 text-amber-400" />;
        case EffectType.MOVEMENT_BONUS: return <Footprints className="w-3 h-3 text-green-400" />;
        case EffectType.COMBAT_SCORE_BONUS: return <Sword className="w-3 h-3 text-red-400" />;
        case EffectType.DEFENSE_BONUS: return <BicepsFlexed className="w-3 h-3 text-blue-400" />;
        case EffectType.HEAL_TURN: return <Sprout className="w-3 h-3 text-pink-400" />;
        case EffectType.INSTANT_HEAL: return <Heart className="w-3 h-3 text-red-500" />;
        case EffectType.WEAKEN_ENEMY: return <Skull className="w-3 h-3 text-purple-400" />;
        default: return <Sparkles className="w-3 h-3 text-purple-400" />;
    }
  };

  const getOperationText = (question: string) => {
      if (question.includes('+')) return t.alchimie.opAdd;
      if (question.includes('-')) return t.alchimie.opSub;
      if (question.includes('×')) return t.alchimie.opMult;
      return t.alchimie.opReduce;
  };

  // Generate random potion based on RNG
  const generateRandomPotion = (): Item => {
    const rRarity = Math.random();
    let rarity = Rarity.COMMON;
    if (rRarity > 0.95) rarity = Rarity.MYTHIC;
    else if (rRarity > 0.85) rarity = Rarity.LEGENDARY;
    else if (rRarity > 0.60) rarity = Rarity.MAGIC;
    else if (rRarity > 0.30) rarity = Rarity.RARE;

    const rSize = Math.random();
    let size = POTION_SIZES.small;
    if (rSize > 0.8) size = POTION_SIZES.large;
    else if (rSize > 0.5) size = POTION_SIZES.medium;

    // Determine Effects based on specs
    const tags: string[] = [];
    const effectPool = Object.values(STATUS_EFFECTS);
    
    // Bias towards potion-suitable effects
    const potionEffects = effectPool.filter(e => 
        e.type === 'HEAL_TURN' || 
        e.type === 'WEAKEN_ENEMY' || 
        e.type === 'COMBAT_SCORE_BONUS' || 
        e.type === 'DEFENSE_BONUS' ||
        e.type === 'INSTANT_HEAL'
    );
    const allEffects = effectPool;

    const pickEffect = (tierMin: number, tierMax: number) => {
        // 15% chance to force an Instant Heal effect if available in tier range
        if (Math.random() < 0.15) {
            const healEffects = effectPool.filter(e => e.type === EffectType.INSTANT_HEAL);
            const validHeals = healEffects.filter(e => {
                const tier = parseInt(e.id.split('_')[1]);
                return tier >= tierMin && tier <= tierMax;
            });
            if (validHeals.length > 0) {
                return validHeals[Math.floor(Math.random() * validHeals.length)].id;
            }
        }

        const pool = Math.random() > 0.5 ? potionEffects : allEffects;
        const valid = pool.filter(e => {
            const tier = parseInt(e.id.split('_')[1]);
            return tier >= tierMin && tier <= tierMax;
        });
        if (valid.length === 0) return pool[0].id;
        return valid[Math.floor(Math.random() * valid.length)].id;
    };

    if (rarity === Rarity.MAGIC || rarity === Rarity.RARE || rarity === Rarity.COMMON) {
        tags.push(pickEffect(1, 3));
    } else if (rarity === Rarity.LEGENDARY) {
        if (Math.random() > 0.5) {
            tags.push(pickEffect(4, 5));
        } else {
            tags.push(pickEffect(1, 3));
            tags.push(pickEffect(1, 3));
        }
    } else if (rarity === Rarity.MYTHIC) {
        if (Math.random() > 0.5) {
            tags.push(pickEffect(5, 5));
        } else {
            tags.push(pickEffect(3, 4));
            tags.push(pickEffect(3, 4));
        }
    }

    // Determine Image based on Rarity
    // Rare/Magic/Common: P1 to P12
    // Legendary/Mythic: P13 to P24
    let imgNum = 1;
    if (rarity === Rarity.LEGENDARY || rarity === Rarity.MYTHIC) {
        imgNum = Math.floor(Math.random() * 12) + 13; // 13 to 24
    } else {
        imgNum = Math.floor(Math.random() * 12) + 1; // 1 to 12
    }

    return {
        name: `${rarity} Potion`,
        name_fr: `Potion ${rarity}`,
        description: `A ${size.label.toLowerCase()} potion with magical properties.`,
        description_fr: `Une potion (${size.label.toLowerCase()}) aux propriétés magiques.`,
        rarity: rarity,
        tags: tags,
        uses: size.uses,
        maxUses: size.uses,
        image: `https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/items/potions/p${imgNum}.png`
    };
  };

  const initDraft = (mode: number) => {
      if (playerNems < mode && !isAdmin) return;
      if (!isAdmin) onSpendNems(mode);
      
      setSelectedMode(mode);
      const cards = [generateRandomPotion(), generateRandomPotion(), generateRandomPotion()];
      setDraftCards(cards);
      
      if (mode === 5) {
          setFlippedCards([true, true, true]);
      } else {
          setFlippedCards([false, false, false]);
      }
      setPhase('draft');
  };

  const handleCardInteraction = (index: number) => {
      // If card is already flipped, clicking it opens zoom
      if (flippedCards[index]) {
          setZoomedItem(draftCards[index]);
          return;
      }

      // If card is hidden, check if we can flip it
      const flippedCount = flippedCards.filter(Boolean).length;
      let canFlip = false;

      if (selectedMode === 5) canFlip = false; // Already all flipped
      else if (selectedMode === 3) canFlip = flippedCount < 2;
      else if (selectedMode === 1) canFlip = flippedCount < 1;

      if (canFlip) {
          const newFlipped = [...flippedCards];
          newFlipped[index] = true;
          setFlippedCards(newFlipped);
          playFlipCardSound(1.2); // Play 20% faster
      }
  };

  const handlePickPotion = (index: number) => {
      startCrafting(draftCards[index]);
  };

  const startCrafting = (potion: Item) => {
      setSelectedPotion(potion);
      
      // Generate problems based on rarity
      let count = 3;
      if (potion.rarity === Rarity.MAGIC) count = 4;
      if (potion.rarity === Rarity.LEGENDARY) count = 5;
      if (potion.rarity === Rarity.MYTHIC) count = 6;

      const newProblems = Array.from({length: count}).map(() => generateFractionProblem(config));
      setProblems(newProblems);
      setCurrentProblemIndex(0);
      resetInput(newProblems[0]);
      setPhase('craft');
  };

  const resetInput = (prob: MathProblem) => {
      setUserInputNum('');
      setUserInputDen('');
      setFeedback('none');
      // Set active input based on type
      if (prob.type === 'number') setActiveInput('whole');
      else setActiveInput('num');
  };

  const handleKeypadInput = (val: number | string) => {
      if (typeof val === 'string') return; // Operators handled separately if needed, but here simple nums
      
      if (activeInput === 'whole') {
          if (userInputNum.length < 5) setUserInputNum(prev => prev + val);
      } else if (activeInput === 'num') {
          if (userInputNum.length < 3) setUserInputNum(prev => prev + val);
      } else {
          if (userInputDen.length < 3) setUserInputDen(prev => prev + val);
      }
  };

  const handleKeypadDelete = () => {
      if (activeInput === 'whole' || activeInput === 'num') {
          setUserInputNum(prev => prev.slice(0, -1));
      } else {
          setUserInputDen(prev => prev.slice(0, -1));
      }
  };

  const handleKeypadValidate = () => {
      const prob = problems[currentProblemIndex];
      let isCorrect = false;

      if (prob.type === 'number') {
          isCorrect = parseInt(userInputNum) === prob.answer;
      } else if (prob.type === 'fraction') {
          // Check fraction answer
          if (prob.fractionAnswer) {
              const uNum = parseInt(userInputNum);
              const uDen = parseInt(userInputDen);
              isCorrect = uNum === prob.fractionAnswer.num && uDen === prob.fractionAnswer.den;
          }
      }

      if (isCorrect) {
          playCorrectSound();
          setFeedback('correct');
          setTimeout(() => {
              if (currentProblemIndex < problems.length - 1) {
                  setCurrentProblemIndex(prev => prev + 1);
                  resetInput(problems[currentProblemIndex + 1]);
              } else {
                  finishCrafting();
              }
          }, 800);
      } else {
          setFeedback('wrong');
          playWrongSound();
          
          let isShattering = false;
          if (selectedPotion) {
             const uses = selectedPotion.uses || 1;
             // Logic mirrors penalty logic: 5->3, 3->1, 1->0
             if (uses <= 1) isShattering = true;
          }

          if (isShattering) {
              playGlassBreakSound();
          } else {
              playDamageSound();
          }
          
          setTimeout(() => {
              if (!selectedPotion) return;

              let newUses = selectedPotion.uses || 1;
              let hasShattered = false;

              // Penalty Logic
              // 5 (Large) -> 3 (Medium)
              // 3 (Medium) -> 1 (Small)
              // 1 (Small) -> 0 (Shatter)
              
              if (newUses >= 5) newUses = 3;
              else if (newUses >= 3) newUses = 1;
              else {
                  newUses = 0;
                  hasShattered = true;
              }

              if (hasShattered) {
                  // FAIL STATE
                  setCraftedItem(null); 
                  setPhase('result');
              } else {
                  // DOWNGRADE STATE
                  setSelectedPotion({...selectedPotion, uses: newUses});
                  setFeedback('unstable');
                  setTimeout(() => {
                      setFeedback('none');
                      resetInput(problems[currentProblemIndex]);
                  }, 1000);
              }
          }, 1000);
      }
  };

  const finishCrafting = () => {
      setCraftedItem(selectedPotion);
      if (selectedPotion) {
          onAddItem(selectedPotion);
          onAddXp(20 * (problems.length)); // XP based on difficulty
      }
      setPhase('result');
  };

  // Keyboard Support
  useKeyboardInput({
    onInput: handleKeypadInput,
    onDelete: handleKeypadDelete,
    onValidate: handleKeypadValidate,
    disabled: feedback !== 'none' || phase !== 'craft'
  });

  // UI Helpers
  const renderFractionInput = () => {
      const prob = problems[currentProblemIndex];
      
      if (prob.type === 'number') {
          return (
              <div 
                className={`text-5xl font-mono font-bold text-white text-center h-20 w-40 border-b-4 border-dashed flex items-center justify-center cursor-pointer transition-colors ${activeInput === 'whole' ? 'border-amber-500 bg-white/10' : 'border-slate-500'}`}
                onClick={() => setActiveInput('whole')}
              >
                  {userInputNum}
              </div>
          );
      }

      return (
          <div className="flex flex-col items-center">
              <div 
                className={`text-4xl font-mono font-bold text-white text-center h-16 w-28 border-2 rounded flex items-center justify-center cursor-pointer mb-2 transition-colors ${activeInput === 'num' ? 'border-amber-500 bg-white/10' : 'border-slate-500'}`}
                onClick={() => setActiveInput('num')}
              >
                  {userInputNum}
              </div>
              <div className="w-28 h-1.5 bg-slate-400 rounded mb-2"></div>
              <div 
                className={`text-4xl font-mono font-bold text-white text-center h-16 w-28 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${activeInput === 'den' ? 'border-amber-500 bg-white/10' : 'border-slate-500'}`}
                onClick={() => setActiveInput('den')}
              >
                  {userInputDen}
              </div>
          </div>
      );
  };

  if (phase === 'select') {
      return (
          <div className="flex flex-col h-full max-w-4xl mx-auto p-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                    <button onClick={() => { playMenuBackSound(); onBack(); }} className="p-2 mr-4 bg-parchment-800 text-parchment-100 rounded hover:bg-parchment-700">
                        <ChevronLeft />
                    </button>
                    <h2 className="text-3xl font-serif font-bold text-parchment-200">{t.titles.alchimie}</h2>
                </div>
                <div className="flex items-center bg-cyan-900/80 px-4 py-2 rounded-full border border-cyan-500">
                    <Sigma className="w-5 h-5 text-cyan-300 mr-2" />
                    <span className="font-bold text-cyan-100">{playerNems} {t.common.nums}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 items-center max-w-3xl mx-auto w-full">
                  {/* Option 1 */}
                  <button 
                    onClick={() => initDraft(1)}
                    disabled={playerNems < 1 && !isAdmin}
                    className={`aspect-[3/4] p-4 rounded-xl border-4 flex flex-col items-center justify-center transition-all bg-parchment-200 hover:scale-105 group disabled:opacity-50 disabled:grayscale border-gray-500 hover:border-gray-400`}
                  >
                      <FlaskConical className="w-16 h-16 text-gray-600 mb-2 group-hover:rotate-12 transition-transform" />
                      <h3 className="text-2xl font-bold font-serif text-gray-800 mb-1">{t.alchimie.normal}</h3>
                      <div className="bg-gray-800/10 px-3 py-1 rounded flex flex-col items-center justify-center w-full mt-auto">
                          <span className="text-xs font-bold text-gray-600 mb-1">{t.alchimie.descNormal}</span>
                          <div className="bg-gray-800 text-white px-4 py-0.5 rounded-full font-bold flex items-center text-sm">
                              <Sigma className="w-3 h-3 mr-1 text-cyan-400" /> 1
                          </div>
                      </div>
                  </button>

                  {/* Option 2 */}
                  <button 
                    onClick={() => initDraft(3)}
                    disabled={playerNems < 3 && !isAdmin}
                    className={`aspect-[3/4] p-4 rounded-xl border-4 flex flex-col items-center justify-center transition-all bg-parchment-200 hover:scale-105 group disabled:opacity-50 disabled:grayscale border-blue-500 hover:border-blue-400`}
                  >
                      <Eye className="w-16 h-16 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
                      <h3 className="text-2xl font-bold font-serif text-blue-900 mb-1">{t.alchimie.flip}</h3>
                      <div className="bg-blue-900/10 px-3 py-1 rounded flex flex-col items-center justify-center w-full mt-auto">
                          <span className="text-xs font-bold text-blue-800 mb-1">{t.alchimie.descFlip}</span>
                          <div className="bg-blue-900 text-white px-4 py-0.5 rounded-full font-bold flex items-center text-sm">
                              <Sigma className="w-3 h-3 mr-1 text-cyan-400" /> 3
                          </div>
                      </div>
                  </button>

                  {/* Option 3 */}
                  <button 
                    onClick={() => initDraft(5)}
                    disabled={playerNems < 5 && !isAdmin}
                    className={`aspect-[3/4] p-4 rounded-xl border-4 flex flex-col items-center justify-center transition-all bg-parchment-200 hover:scale-105 group disabled:opacity-50 disabled:grayscale border-purple-500 hover:border-purple-400`}
                  >
                      <Sparkles className="w-16 h-16 text-purple-600 mb-2 group-hover:spin-slow transition-transform" />
                      <h3 className="text-2xl font-bold font-serif text-purple-900 mb-1">{t.alchimie.pick}</h3>
                      <div className="bg-purple-900/10 px-3 py-1 rounded flex flex-col items-center justify-center w-full mt-auto">
                          <span className="text-xs font-bold text-purple-800 mb-1">{t.alchimie.descPick}</span>
                          <div className="bg-purple-900 text-white px-4 py-0.5 rounded-full font-bold flex items-center text-sm">
                              <Sigma className="w-3 h-3 mr-1 text-cyan-400" /> 5
                          </div>
                      </div>
                  </button>
              </div>
          </div>
      );
  }

  if (phase === 'draft') {
      return (
          <div className="flex flex-col h-full max-w-7xl mx-auto p-4 animate-fadeIn">
              <h2 className="text-3xl font-serif font-bold text-center text-parchment-200 mb-8">{t.alchimie.selectMode}</h2>
              <div className="flex-1 flex items-center justify-center gap-8">
                  {draftCards.map((card, idx) => {
                      const style = RARITY_STYLES[card.rarity];
                      const isFlipped = flippedCards[idx];
                      
                      return (
                      <div key={idx} className="flex flex-col items-center gap-4">
                        <button 
                            onClick={() => handleCardInteraction(idx)}
                            className={`
                                relative w-80 h-[30rem] rounded-xl transition-all duration-500 transform preserve-3d cursor-pointer hover:-translate-y-2
                                ${isFlipped ? 'rotate-y-180' : ''}
                            `}
                        >
                            {/* Card Back */}
                            <div className={`absolute inset-0 backface-hidden rounded-xl overflow-hidden shadow-xl ${isFlipped ? 'hidden' : ''}`}>
                                <img src={CARD_BACK_URL} className="w-full h-full object-cover" alt="Card Back" />
                            </div>

                            {/* Card Front */}
                            {isFlipped && (
                                <div 
                                    className="absolute inset-0 rounded-xl flex flex-col items-center border-[4px] shadow-2xl overflow-hidden"
                                    style={{
                                        borderColor: style.border,
                                        backgroundColor: style.bg,
                                    }}
                                >
                                    {/* Holographic effect for high tier */}
                                    {(card.rarity === Rarity.LEGENDARY || card.rarity === Rarity.MYTHIC) && (
                                        <div className="absolute inset-0 holo-rainbow opacity-30 pointer-events-none z-0"></div>
                                    )}

                                    {/* Top Image Frame */}
                                    <div className="w-full h-[45%] bg-black/30 border-b border-white/10 flex items-center justify-center p-4 relative z-10">
                                        <div 
                                            className="w-full h-full rounded border-2 bg-black/50 flex items-center justify-center overflow-hidden relative"
                                            style={{ borderColor: style.border }}
                                        >
                                            <img src={card.image} className="w-full h-full object-contain" alt={card.name} />
                                            {/* Usage Overlay */}
                                            {card.uses && card.uses > 1 && (
                                              <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs font-bold px-2 py-0.5 rounded border border-white/20 shadow-md">
                                                {card.uses}x
                                              </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col items-center p-4 w-full relative z-10">
                                        <h3 className={`font-bold font-serif text-xl text-center mb-1 ${style.text}`}>{card.name}</h3>
                                        
                                        <p className="text-xs text-center text-gray-300 italic mb-auto mt-4">"{card.description}"</p>
                                        
                                        {/* Effects Display */}
                                        {card.tags && card.tags.length > 0 && (
                                            <div className="w-full mt-2 mb-2 bg-black/40 rounded p-2 border border-white/5">
                                                {card.tags.map(tag => {
                                                    const effect = STATUS_EFFECTS[tag];
                                                    if (!effect) return null;
                                                    return (
                                                        <div key={tag} className="flex items-center text-[10px] text-gray-200 mb-1 last:mb-0">
                                                            <span className="mr-1">{getEffectIcon(effect.type)}</span>
                                                            <span>{lang === 'fr' && effect.description_fr ? effect.description_fr : effect.description}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </button>

                        {/* PICK BUTTON */}
                        <div className="h-12 w-full flex justify-center items-center">
                            {isFlipped && (
                                <button 
                                    onClick={() => handlePickPotion(idx)}
                                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2 px-8 rounded-full border-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 flex items-center"
                                >
                                    <Hand className="w-4 h-4 mr-2" />
                                    {t.buttons.select}
                                </button>
                            )}
                        </div>
                      </div>
                  )})}
              </div>
              <div className="h-20 flex items-center justify-center text-parchment-400 italic">
                  {selectedMode === 3 && t.alchimie.draftFlip2}
                  {selectedMode === 1 && t.alchimie.draftFlip1}
                  {selectedMode === 5 && t.alchimie.draftPick}
              </div>

              {/* Zoom Overlay */}
              <ItemDetailOverlay 
                item={zoomedItem} 
                onClose={() => setZoomedItem(null)} 
              />
          </div>
      );
  }

  if (phase === 'craft') {
      const problem = problems[currentProblemIndex];
      const craftingFrame = (
        <div className="w-full flex flex-col gap-6">
            {/* Problem Frame */}
            <div className={`
                w-full p-8 rounded-xl border-4 shadow-xl flex flex-col items-center justify-center min-h-[220px] transition-colors duration-300
                ${feedback === 'unstable' ? 'bg-orange-100 border-orange-500' : 'bg-parchment-100 border-parchment-400'}
            `}>
                {feedback === 'unstable' ? (
                    <div className="flex flex-col items-center animate-shake">
                        <AlertTriangle className="w-16 h-16 text-orange-600 mb-2" />
                        <div className="text-2xl font-bold text-orange-700">{t.alchimie.unstable}</div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-lg font-bold uppercase tracking-widest text-parchment-600 mb-4 border-b-2 border-parchment-300 pb-1 w-full text-center">
                            {getOperationText(problem.question)}
                        </h3>
                        <div className="text-6xl font-serif font-bold text-parchment-900 text-center tracking-tight">
                            {problem.question}
                        </div>
                    </>
                )}
            </div>

            {/* Answer Input Frame */}
            <div 
                className={`
                    w-full p-6 rounded-xl border-4 bg-slate-800 shadow-inner flex justify-center transition-all duration-300
                    ${feedback === 'correct' ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : feedback === 'wrong' ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : feedback === 'unstable' ? 'border-orange-500 opacity-50' : 'border-slate-600'}
                `}
            >
                {renderFractionInput()}
            </div>
        </div>
      );

      return (
          <div className="flex flex-col h-full max-w-2xl mx-auto p-4 animate-fadeIn">
              <div className="text-center mb-6">
                  <h2 className="text-2xl font-serif font-bold text-parchment-200 mb-2">{t.alchimie.brewing}</h2>
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full transition-all" style={{ width: `${(currentProblemIndex / problems.length) * 100}%` }}></div>
                  </div>
              </div>

              {/* Current Potion Status */}
              {selectedPotion && (
                  <div className="flex justify-center mb-4">
                      <div className="bg-black/40 px-4 py-2 rounded-full border border-purple-500 flex items-center">
                          <span className={`text-sm font-bold ${RARITY_STYLES[selectedPotion.rarity].text} mr-3`}>
                              {selectedPotion.name}
                          </span>
                          <span className="text-xs text-white bg-purple-900 px-2 py-0.5 rounded-full">
                              {selectedPotion.uses} Uses
                          </span>
                      </div>
                  </div>
              )}

              <div className="flex-1 flex flex-col items-center justify-center gap-6 w-full">
                  {!keypadConfig?.centered && craftingFrame}
              </div>

              <div className={deviceType === 'tablet' ? "mt-auto mb-32" : "mt-auto mb-8"}>
                  <Keypad 
                    onInput={handleKeypadInput}
                    onDelete={handleKeypadDelete}
                    onValidate={handleKeypadValidate}
                    disabled={feedback !== 'none'}
                    compact={keypadConfig?.compact}
                    centered={keypadConfig?.centered}
                  >
                    {keypadConfig?.centered && craftingFrame}
                  </Keypad>
              </div>
          </div>
      );
  }

  return (
      <LootRewardCard 
        item={craftedItem}
        onBack={() => { playMenuBackSound(); onBack(); }}
        solvedCorrectly={!!craftedItem}
        failMessage={t.alchimie.shattered}
        failImage={FAILED_POTION_IMG}
      />
  );
};

export default Alchimie;
