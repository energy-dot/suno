import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

export const ai = new GoogleGenAI({apiKey: process.env.API_KEY || "DUMMY_KEY_FOR_COMPILATION" });
