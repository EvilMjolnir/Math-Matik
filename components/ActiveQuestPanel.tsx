
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
}

const ActiveQuestPanel: React.FC<ActiveQuestPanelProps> = ({ activeEncounter, activeTome, t, lang, onAnimating }) => {
  const getTomeTitle = (tome: Tome) => (lang === 'fr' && tome.title_fr) ? tome.title_fr : tome.title;
  const getTomeDesc = (tome: Tome) => (lang === 'fr' && tome.description_fr) ? tome.description_fr : tome.description;

  // Key for session storage to track previous progress
  const storageKey = activeTome ? `quest_progress_${activeTome.id}` : 'quest_progress_none';

  // Initialize state lazily from session storage to capture the "Old" value before the update
  const [displayDistance, setDisplayDistance] = useState<number>(() => {
    if (!activeTome) return 0;
    // Strict reset if we are at 0
    if (activeTome.currentDistance === 0) return 0;

    const saved = sessionStorage.getItem(storageKey);
    // If we have a saved value, use it (unless it's larger than current)
    if (saved) {
        const val = parseFloat(saved);
        return val <= activeTome.currentDistance ? val : activeTome.currentDistance;
    }
    return activeTome.currentDistance;
  });

  // Force snap to 0 if the prop is 0 (handles resets or tome switches properly)
  useEffect(() => {
    if (activeTome?.currentDistance === 0 && displayDistance !== 0) {
      setDisplayDistance(0);
      sessionStorage.setItem(storageKey, '0');
    }
  }, [activeTome?.currentDistance, storageKey]);

  // Derived state: If display doesn't match target, we are (or should be) animating
  const targetDistance = activeTome?.currentDistance || 0;
  const isAnimating = displayDistance < targetDistance;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Effect 1: Notify Parent of Animation State ---
  useEffect(() => {
    if (onAnimating) {
        onAnimating(isAnimating);
    }
    return () => {
        if (onAnimating) onAnimating(false);
    };
  }, [isAnimating, onAnimating]);

  // --- Effect 2: Handle Animation Loop & Sound ---
  useEffect(() => {
    if (!activeTome) return;

    // Only animate if the display (old) is less than the target (new)
    if (isAnimating && targetDistance > 0) {
      const diff = targetDistance - displayDistance;
      const duration = 2000; // 2 seconds total animation
      const steps = 60; // 60fps approx
      const increment = diff / steps;
      const intervalTime = duration / steps;
      
      let currentStep = 0;

      // --- Sound Logic ---
      const soundUrl = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/walking-in-bushes.mp3';
      
      // Ensure we don't stack sounds
      if (!audioRef.current || audioRef.current.paused) {
          const audio = new Audio(soundUrl);
          audioRef.current = audio;
          audio.volume = 0;
          // Random start between 0 and 10s
          audio.currentTime = Math.random() * 10;
          
          audio.play().then(() => {
              // Fade In
              let vol = 0;
              const fadeInterval = setInterval(() => {
                  if (vol < 0.5) {
                      vol = Math.min(0.5, vol + 0.05);
                      if (audioRef.current) audioRef.current.volume = vol;
                  } else {
                      clearInterval(fadeInterval);
                  }
              }, 100);
          }).catch(e => console.warn("Audio play blocked:", e));
      }

      // Animation Loop
      const timer = setInterval(() => {
        currentStep++;
        
        setDisplayDistance(prev => {
            const next = prev + increment;
            if (next >= targetDistance) return targetDistance;
            return next;
        });

        // Cleanup/End condition
        if (currentStep >= steps) {
          clearInterval(timer);
          // Update storage to the new value so next time we don't re-animate
          sessionStorage.setItem(storageKey, targetDistance.toString());
          
          // Fade Out Sound
          if (audioRef.current) {
              const fadeOut = setInterval(() => {
                  if (audioRef.current && audioRef.current.volume > 0.05) {
                      audioRef.current.volume -= 0.05;
                  } else {
                      if (audioRef.current) audioRef.current.pause();
                      clearInterval(fadeOut);
                  }
              }, 100);
          }
        }
      }, intervalTime);

      return () => {
        clearInterval(timer);
      };
    } else {
        // Sync display if logic missed it (e.g. rapid updates or 0 start)
        if (displayDistance !== targetDistance) {
            setDisplayDistance(targetDistance);
            sessionStorage.setItem(storageKey, targetDistance.toString());
        }
    }
  }, [targetDistance, isAnimating, storageKey, activeTome]); 

  // Decide what to render: If animating, FORCE the progress view.
  const showEncounter = activeEncounter && !isAnimating;
  const isCompleted = activeTome?.isCompleted;

  // Progress Bar Logic
  // We want a bar that goes from 0 to totalDistance-1, and a final segment for the boss.
  // The 'boss segment' activates when currentDistance >= totalDistance.
  const bossNodeActive = activeTome && displayDistance >= activeTome.totalDistance;
  // Percentage for the main bar (excluding boss node)
  const maxBarDistance = activeTome ? activeTome.totalDistance : 1;
  const progressPercent = activeTome ? Math.min(100, (displayDistance / maxBarDistance) * 100) : 0;

  return (
    <div className="relative w-full mb-16">
      <div className={`w-full p-6 backdrop-blur-sm min-h-[120px] flex flex-col justify-center transition-all duration-500 overflow-hidden
        ${showEncounter 
          ? 'rounded-lg border-2 bg-red-900/80 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)]' 
          : 'border-bevel'
        }
        ${isCompleted ? 'blur-sm brightness-75' : ''}
      `}>
        {showEncounter ? (
          <div className="flex flex-col items-center animate-pulse">
            <div className="flex items-center text-red-400 font-bold text-3xl mb-1">
              <Skull className="w-10 h-10 mr-2" />
              {t.home.encounterActive}
            </div>
            <p className="text-parchment-200 text-lg">{t.home.encounterDesc}</p>
            {activeEncounter.type === 'boss' && <span className="text-red-500 font-bold uppercase tracking-widest mt-2 border border-red-500 px-2 py-1 rounded">BOSS BATTLE</span>}
            {activeEncounter.type === 'miniboss' && <span className="text-amber-500 font-bold uppercase tracking-widest mt-2 border border-amber-500 px-2 py-1 rounded">MINI-BOSS</span>}
          </div>
        ) : activeTome ? (
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            {activeTome.image && (
              <div className="relative shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg border-4 border-amber-700 shadow-[0_0_15px_rgba(0,0,0,0.5)] overflow-hidden bg-black/50">
                  <img src={activeTome.image} alt="Quest Location" className="w-full h-full object-cover" />
                </div>
                {/* Decorative corners */}
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400"></div>
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400"></div>
              </div>
            )}
            <div className="flex-1 w-full">
              <div className="flex justify-between items-center mb-3">
                <span className="text-parchment-300 font-serif flex items-center text-xl">
                  <Map className="w-6 h-6 mr-2" />
                  {t.home.currentQuest}: <span className="text-amber-400 font-bold ml-2">{getTomeTitle(activeTome)}</span>
                </span>
                <span className="text-sm text-parchment-400 font-bold">{Math.floor(displayDistance)} / {activeTome.totalDistance}</span>
              </div>
              
              {/* Custom Segmented Progress Bar */}
              <div className="flex items-center w-full h-8 relative">
                  {/* Main Bar Track */}
                  <div className="flex-1 h-5 bg-gray-900 rounded-l-full overflow-hidden border border-gray-700 relative mr-1">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-700 to-blue-500 transition-all duration-75"
                        style={{ width: `${progressPercent}%` }}
                      />
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

              <p className="text-base text-parchment-500 mt-2 italic">{getTomeDesc(activeTome)}</p>
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
