
import React, { useState, useEffect, useRef } from 'react';
import { Tome, Encounter } from '../types';
import { Skull, Map, Infinity as InfinityIcon, CheckCircle } from 'lucide-react';
import { Translation } from '../localization/types';

interface ActiveQuestPanelProps {
  activeEncounter: Encounter | null;
  activeTome?: Tome;
  t: Translation;
  lang: string;
  onAnimating?: (isAnimating: boolean) => void;
  isPaused?: boolean;
  onAnimationComplete?: () => void;
  compact?: boolean;
}

const TOME_BG_IMAGES: Record<string, string> = {
  'tome_1': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome1%28noCharacter%29.png',
  'tome_2': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome2%28noCharacter%29.png',
  'tome_3': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome3%28hood%29.png',
  'tome_4': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome4%28noCharacter%29.png',
  'tome_5': 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/backgrounds/tome5%28noCharacter%29.png',
};

const ActiveQuestPanel: React.FC<ActiveQuestPanelProps> = ({ 
  activeEncounter, 
  activeTome, 
  t, 
  lang, 
  onAnimating,
  isPaused = false,
  onAnimationComplete,
  compact = false
}) => {
  const getTomeTitle = (tome: Tome) => (lang === 'fr' && tome.title_fr) ? tome.title_fr : tome.title;
  const getTomeDesc = (tome: Tome) => (lang === 'fr' && tome.description_fr) ? tome.description_fr : tome.description;

  // Key for session storage to track previous progress
  const storageKey = activeTome ? `quest_progress_${activeTome.id}` : 'quest_progress_none';

  // Initialize state lazily from session storage to capture the "Old" value before the update
  const [displayDistance, setDisplayDistance] = useState<number>(() => {
    if (!activeTome) return 0;
    // Strict reset if we are at 0 (new tome or reset)
    if (activeTome.currentDistance === 0) return 0;

    const saved = sessionStorage.getItem(storageKey);
    // If we have a saved value, use it (unless it's larger than current, which implies a reset/bug)
    if (saved) {
        const val = parseFloat(saved);
        return val <= activeTome.currentDistance ? val : activeTome.currentDistance;
    }
    return activeTome.currentDistance;
  });

  const [isFilling, setIsFilling] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const targetDistance = activeTome?.currentDistance || 0;

  // --- Effect: Handle Snap to Target if rolled back ---
  useEffect(() => {
      if (activeTome && displayDistance > targetDistance) {
          setDisplayDistance(targetDistance);
          sessionStorage.setItem(storageKey, targetDistance.toString());
      }
  }, [activeTome, displayDistance, targetDistance, storageKey]);

  // --- Effect: Notify Parent ---
  useEffect(() => {
    if (onAnimating) {
        onAnimating(isFilling);
    }
  }, [isFilling, onAnimating]);

  // --- Main Animation Logic ---
  useEffect(() => {
    if (!activeTome || isPaused) return;

    const startDist = parseFloat(sessionStorage.getItem(storageKey) || displayDistance.toString());
    const diff = targetDistance - startDist;

    // If no progress to animate (or barely any), just snap and return
    if (diff <= 0.01) {
        setDisplayDistance(targetDistance);
        sessionStorage.setItem(storageKey, targetDistance.toString());
        if (isFilling) setIsFilling(false);
        // Important: Signal completion even if no animation occurred, so queued events (Level Up) can proceed
        if (onAnimationComplete) onAnimationComplete();
        return;
    }

    let isCancelled = false;
    let delayTimer: ReturnType<typeof setTimeout>;
    
    const startAnimationSequence = () => {
        if (isCancelled) return;

        // --- Sound Setup ---
        const soundUrl = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/walking-in-bushes.mp3';
        if (!audioRef.current) {
            const audio = new Audio(soundUrl);
            audioRef.current = audio;
            audio.loop = true; 
            audio.volume = 0.5;
        }

        const runAnimation = () => {
            if (isCancelled) return;
            setIsFilling(true);

            // --- Animation Parameters ---
            // Minimum 3 seconds (3000ms), or longer for big steps.
            const duration = Math.max(3000, diff * 100); 
            const startTime = performance.now();

            const animate = (currentTime: number) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Linear Animation
                const currentVal = startDist + (diff * progress);
                setDisplayDistance(currentVal);

                if (progress < 1) {
                    animationFrameRef.current = requestAnimationFrame(animate);
                } else {
                    // Done
                    setDisplayDistance(targetDistance);
                    sessionStorage.setItem(storageKey, targetDistance.toString());
                    setIsFilling(false);
                    
                    if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                    }
                    
                    if (onAnimationComplete) {
                        onAnimationComplete();
                    }
                }
            };

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (!isCancelled) runAnimation();
            }).catch((e) => {
                // Ignore AbortError, start animation anyway if sound fails
                if (e.name !== 'AbortError') console.warn("Audio play failed, starting anim anyway", e);
                if (!isCancelled) runAnimation();
            });
        } else {
            if (!isCancelled) runAnimation();
        }
    };

    // 0.5s Delay before starting everything
    delayTimer = setTimeout(startAnimationSequence, 500);

    return () => {
        isCancelled = true;
        clearTimeout(delayTimer);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };
  }, [targetDistance, isPaused, activeTome, storageKey]);

  // Decide what to render
  const showEncounter = activeEncounter && !isFilling;
  const isCompleted = activeTome?.isCompleted;

  // Progress Bar Logic
  const bossNodeActive = activeTome && displayDistance >= activeTome.totalDistance;
  const maxBarDistance = activeTome ? activeTome.totalDistance : 1;
  const progressPercent = activeTome ? Math.min(100, (displayDistance / maxBarDistance) * 100) : 0;

  const bgImage = activeTome ? (TOME_BG_IMAGES[activeTome.id] || activeTome.image) : undefined;

  return (
    <div className="relative w-full mb-16">
      <div className={`w-full p-6 backdrop-blur-sm min-h-[180px] flex flex-col justify-center transition-all duration-500 overflow-hidden relative
        ${showEncounter 
          ? 'rounded-lg border-2 bg-red-900/80 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
          : (activeTome ? 'rounded-xl border-4 border-parchment-600 shadow-xl' : 'border-bevel')
        }
        ${isCompleted ? 'blur-sm brightness-75' : ''}
      `}>
        {/* Background Image and Overlay for Active Tome */}
        {activeTome && !showEncounter && (
           <>
             <div 
               className="absolute inset-0 bg-cover bg-center z-0"
               style={{ 
                 backgroundImage: bgImage ? `url('${bgImage}')` : undefined 
               }}
             />
             <div className="absolute inset-0 bg-black/70 z-0" />
           </>
        )}

        {showEncounter ? (
          <div className="flex flex-col items-center animate-pulse relative z-10">
            <div className="flex items-center text-red-400 font-bold text-3xl mb-1">
              <Skull className="w-10 h-10 mr-2" />
              {t.home.encounterActive}
            </div>
            <p className="text-parchment-200 text-lg">{t.home.encounterDesc}</p>
            {activeEncounter.type === 'boss' && <span className="text-red-500 font-bold uppercase tracking-widest mt-2 border border-red-500 px-2 py-1 rounded">BOSS BATTLE</span>}
            {activeEncounter.type === 'miniboss' && <span className="text-amber-500 font-bold uppercase tracking-widest mt-2 border border-amber-500 px-2 py-1 rounded">MINI-BOSS</span>}
          </div>
        ) : activeTome ? (
          <div className="flex flex-col items-center gap-4 w-full relative z-10">
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="text-parchment-100 font-serif flex items-center text-xl shadow-black drop-shadow-md">
                  <Map className="w-6 h-6 mr-2 text-amber-500" />
                  {!compact && <span className="mr-2">{t.home.currentQuest}:</span>} 
                  <span className="text-amber-400 font-bold">{getTomeTitle(activeTome)}</span>
                </span>
                {!compact && (
                    <span className="text-sm text-parchment-200 font-bold bg-black/40 px-2 py-1 rounded">{Math.floor(displayDistance)} / {activeTome.totalDistance}</span>
                )}
              </div>
              
              {/* Custom Segmented Progress Bar */}
              <div className="flex items-center w-full h-8 relative">
                  {/* Main Bar Track */}
                  <div className="flex-1 h-5 bg-black/60 rounded-l-full overflow-hidden border border-gray-500 relative mr-1">
                      <div 
                        className={`h-full bg-gradient-to-r from-blue-700 to-cyan-500 absolute top-0 left-0 bottom-0 ${isFilling ? 'animate-pulse brightness-125' : 'transition-all duration-500'}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                      
                      {/* Compact Steps Text Overlay */}
                      {compact && (
                          <div className="absolute inset-0 flex items-center justify-center z-10">
                              <span className="text-xs font-bold text-parchment-100 drop-shadow-md tracking-wider">
                                {Math.floor(displayDistance)} / {activeTome.totalDistance}
                              </span>
                          </div>
                      )}
                  </div>

                  {/* Boss Node Segment */}
                  <div className={`
                     w-10 h-10 shrink-0 rounded-full border-2 flex items-center justify-center shadow-lg z-10 transition-all duration-500
                     ${bossNodeActive 
                        ? 'bg-red-600 border-red-400 shadow-[0_0_15px_rgba(220,38,38,0.6)]' 
                        : 'bg-gray-800 border-gray-600'
                     }
                  `}>
                     <Skull className={`w-6 h-6 ${bossNodeActive ? 'text-white animate-pulse' : 'text-gray-500'}`} />
                  </div>
              </div>

              <p className="text-base text-parchment-300 mt-2 italic shadow-black drop-shadow-sm">{getTomeDesc(activeTome)}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-parchment-400">
            <div className="flex items-center text-3xl font-serif font-bold text-mythic mb-2">
              <InfinityIcon className="w-10 h-10 mr-2" />
              {t.home.infiniteMode}
            </div>
            <p className="text-lg italic">{t.home.infiniteDesc}</p>
          </div>
        )}
      </div>

      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black/80 px-8 py-2 rounded-lg border-2 border-red-500 shadow-2xl transform -rotate-2">
                <h2 className="text-3xl font-serif font-bold uppercase tracking-widest flex items-center text-red-500 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                    <CheckCircle className="w-8 h-8 mr-3 text-red-500" />
                    Completed
                </h2>
            </div>
        </div>
      )}
    </div>
  );
};

export default ActiveQuestPanel;
