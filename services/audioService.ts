
const MENU_OPEN_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/computer-mouse-click-2.mp3';
const MENU_BACK_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/computer-mouse-click-3.mp3';
const HIT_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/swoosh-1.mp3';
const LEVEL_UP_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/flute_complete.mp3';
const ITEM_REVEAL_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/simple-piano-reverse-logo.mp3';
const DAMAGE_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/breaking-small-bone-finger.mp3';
const BOSS_INTRO_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/epic-transition.mp3';
const VICTORY_TRUMPET_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/victory_trumpet.mp3';

let currentLongSound: HTMLAudioElement | null = null;

const playSound = (url: string, volume: number = 0.5, isLong: boolean = false) => {
  const audio = new Audio(url);
  audio.volume = volume;
  
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

export const playHitSound = () => playSound(HIT_SOUND, 0.6);
export const playLevelUpSound = () => playSound(LEVEL_UP_SOUND, 0.5, true);
export const playItemRevealSound = () => playSound(ITEM_REVEAL_SOUND, 0.6, true);
export const playDamageSound = () => playSound(DAMAGE_SOUND, 0.7);
export const playBossIntroSound = () => playSound(BOSS_INTRO_SOUND, 0.6, true);
export const playVictoryTrumpetSound = () => playSound(VICTORY_TRUMPET_SOUND, 0.6, true);
