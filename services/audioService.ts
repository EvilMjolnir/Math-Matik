
const MENU_OPEN_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/computer-mouse-click-2.mp3';
const MENU_BACK_SOUND = 'https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/sounds/computer-mouse-click-3.mp3';

export const playMenuOpenSound = () => {
  const audio = new Audio(MENU_OPEN_SOUND);
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Audio play failed", e));
};

export const playMenuBackSound = () => {
  const audio = new Audio(MENU_BACK_SOUND);
  audio.volume = 0.5;
  audio.play().catch(e => console.error("Audio play failed", e));
};
