
import { Companion } from '../types';

export const COMPANIONS_DATA: Record<string, Companion> = {
  comp_owl: {
    id: "comp_owl",
    name: "Pythagoras",
    role: "Advisor",
    level: 1,
    description: "A wise old owl who helps you learn faster.",
    description_fr: "Un vieux hibou sage qui vous aide à apprendre plus vite.",
    tags: ["scholar_1"],
    image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/companions/pythagorus2.png"
  },
  comp_frog: {
    id: "comp_frog",
    name: "Pascal",
    role: "Scout",
    level: 1,
    description: "A quick hopper who finds shortcuts in the path.",
    description_fr: "Une grenouille agile qui trouve des raccourcis sur le chemin.",
    tags: ["navigator_1"],
    image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/companions/pascal1.png"
  },
  comp_zelda: {
    id: "comp_zelda",
    name: "Zelda",
    role: "Guardian",
    level: 1,
    description: "A loyal protector who fights with fierce determination.",
    description_fr: "Un protecteur loyal qui se bat avec une détermination féroce.",
    tags: ["fighter_1"], 
    image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/companions/zelda.png"
  },
  comp_dee: {
    id: "comp_dee",
    name: "Dee",
    role: "Mystic",
    level: 1,
    description: "A mysterious feline who seems to know the secrets of the universe.",
    description_fr: "Un félin mystérieux qui semble connaître les secrets de l'univers.",
    tags: ["scholar_1"],
    image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/companions/luffy1.png"
  },
  comp_fib: {
    id: "comp_fib",
    name: "Fib",
    role: "Thief",
    level: 1,
    description: "A sneaky little rascal who loves shiny gold coins.",
    description_fr: "Un petit coquin sournois qui adore les pièces d'or brillantes.",
    tags: ["merchant_1"],
    image: "https://nccn8mr5ssa9nolp.public.blob.vercel-storage.com/images/companions/fib.png"
  }
};

// Define which companions the player starts with (or can acquire)
export const STARTING_COMPANIONS: Companion[] = [
  COMPANIONS_DATA.comp_owl,
  COMPANIONS_DATA.comp_frog,
  COMPANIONS_DATA.comp_zelda,
  COMPANIONS_DATA.comp_dee,
  COMPANIONS_DATA.comp_fib
];
