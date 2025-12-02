import { GoogleGenAI, Type } from "@google/genai";
import { Rarity, Item } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateLootItem = async (rarity: Rarity): Promise<Item> => {
  const prompt = `Generate a creative fantasy RPG item for a player who just solved a math puzzle in a magical library. 
  The item rarity is ${rarity}.
  Return the Name and a short Description (max 1 sentence).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING }
          },
          required: ["name", "description"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const data = JSON.parse(text);
    return {
      name: data.name,
      description: data.description,
      rarity: rarity
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback item if API fails
    return {
      name: `Mystery ${rarity} Artifact`,
      description: "A strange object humming with calculated energy.",
      rarity: rarity
    };
  }
};
