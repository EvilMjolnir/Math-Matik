
import { Rarity, Item } from "../types";
import { lootData } from "../data/loot";

export const generateLootItem = async (rarity: Rarity): Promise<Item> => {
  // Simulate a short delay to mimic "searching" (and keep UI consistent with previous async behavior)
  await new Promise(resolve => setTimeout(resolve, 800));

  const items = lootData[rarity] || lootData[Rarity.COMMON];
  
  // Pick a random item from the list
  const randomItem = items[Math.floor(Math.random() * items.length)];

  return {
    name: randomItem.name,
    description: randomItem.description,
    rarity: rarity
  };
};
