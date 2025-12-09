
const MENU_OPEN_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/computer-mouse-click-2.mp3';
const MENU_BACK_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/computer-mouse-click-3.mp3';
const HIT_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/swoosh-1.mp3';
const LEVEL_UP_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/flute_complete.mp3';
const ITEM_REVEAL_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/simple-piano-reverse-logo.mp3';
const EPIC_REVEAL_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/epic-flute-reveal-logo.mp3';
const DAMAGE_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/breaking-small-bone-finger.mp3';
const BOSS_INTRO_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/epic-transition.mp3';
const VICTORY_TRUMPET_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/victory_trumpet.mp3';
const FLIP_CARD_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/flipcard.mp3';
const GLASS_BREAK_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/glass_break.mp3';
const ACID_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/acideffect.mp3';
const BUBBLES_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/bubbles.mp3';

let currentLongSound: HTMLAudioElement | null = null;

const playSound = (url: string, volume: number = 0.5, isLong: boolean = false, pitchVariance: number = 0, speed: number = 1.0) => {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.playbackRate = speed;
  
  // Apply pitch variation if requested (changes playback rate which affects pitch)
  if (pitchVariance > 0) {
    // Generates a random rate between (1 - variance) and (1 + variance)
    // e.g. 0.1 variance => random between 0.9 and 1.1
    const rate = speed + (Math.random() * (pitchVariance * 2) - pitchVariance);
    audio.playbackRate = rate;
    
    // For browser compatibility to ensure pitch changes with rate
    (audio as any).preservesPitch = false; 
  }
  
  if (isLong) {
    // If there is already a long sound playing, stop it immediately
    if (currentLongSound) {
      currentLongSound.pause();
      currentLongSound.currentTime = 0;
    }
    currentLongSound = audio;
  }

  audio.play().catch(e => console.error("Audio play failed", e));
  
  // Clear reference when done
  if (isLong) {
      audio.onended = () => {
          if (currentLongSound === audio) {
              currentLongSound = null;
          }
      };
  }
};

export const fadeOutCurrentSound = () => {
    if (currentLongSound) {
        const audio = currentLongSound;
        const fadeInterval = setInterval(() => {
            if (audio.volume > 0.05) {
                audio.volume -= 0.05;
            } else {
                audio.pause();
                audio.currentTime = 0;
                clearInterval(fadeInterval);
                if (currentLongSound === audio) {
                    currentLongSound = null;
                }
            }
        }, 50);
    }
};

export const playMenuOpenSound = () => playSound(MENU_OPEN_SOUND);
export const playMenuBackSound = () => playSound(MENU_BACK_SOUND);

// Added 0.1 (10%) variance to Hit and Damage sounds
export const playHitSound = () => playSound(HIT_SOUND, 0.6, false, 0.1);
export const playDamageSound = () => playSound(DAMAGE_SOUND, 0.7, false, 0.1);

export const playLevelUpSound = () => playSound(LEVEL_UP_SOUND, 0.5, true);
export const playItemRevealSound = () => playSound(ITEM_REVEAL_SOUND, 0.6, true);
export const playEpicRevealSound = () => playSound(EPIC_REVEAL_SOUND, 0.6, true);
export const playBossIntroSound = () => playSound(BOSS_INTRO_SOUND, 0.6, true);
export const playVictoryTrumpetSound = () => playSound(VICTORY_TRUMPET_SOUND, 0.6, true);
export const playFlipCardSound = (speed: number = 1.0) => playSound(FLIP_CARD_SOUND, 0.5, false, 0, speed);
export const playGlassBreakSound = () => playSound(GLASS_BREAK_SOUND, 0.6, false, 0.1);

export const playMeltingSound = () => {
  const playTrack = (url: string, maxRandomStart: number) => {
    const audio = new Audio(url);
    audio.volume = 0;
    
    // Pitch variance +/- 15% => 0.85 to 1.15
    const variance = 0.15;
    const rate = 1.0 + (Math.random() * (variance * 2) - variance);
    audio.playbackRate = rate;
    (audio as any).preservesPitch = false;

    if (maxRandomStart > 0) {
      audio.currentTime = Math.random() * maxRandomStart;
    }

    const targetVolume = 0.5;

    audio.play().catch(e => console.error("Audio play failed", e));

    // Fade In (approx 500ms)
    const fadeInStep = 0.05;
    const fadeInInterval = setInterval(() => {
      if (audio.volume < targetVolume) {
        // Ensure we don't exceed target due to float math
        audio.volume = Math.min(targetVolume, audio.volume + fadeInStep);
      } else {
        clearInterval(fadeInInterval);
      }
    }, 50);

    // Fade Out after 4 seconds
    setTimeout(() => {
      clearInterval(fadeInInterval); // Safety clear
      const fadeOutInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          audio.pause();
          clearInterval(fadeOutInterval);
        }
      }, 50);
    }, 4000);
  };

  playTrack(ACID_SOUND, 0);
  playTrack(BUBBLES_SOUND, 7); // Random start between 0 and 7 seconds
};

// Export map for Admin Panel
export const ALL_SOUNDS = [
    { name: "Menu Open", fn: playMenuOpenSound },
    { name: "Menu Back", fn: playMenuBackSound },
    { name: "Hit (Var)", fn: playHitSound },
    { name: "Damage (Var)", fn: playDamageSound },
    { name: "Card Flip", fn: playFlipCardSound },
    { name: "Item Reveal", fn: playItemRevealSound },
    { name: "Epic Reveal", fn: playEpicRevealSound },
    { name: "Level Up", fn: playLevelUpSound },
    { name: "Victory", fn: playVictoryTrumpetSound },
    { name: "Boss Intro", fn: playBossIntroSound },
    { name: "Glass Break", fn: playGlassBreakSound },
    { name: "Melting", fn: playMeltingSound },
];
