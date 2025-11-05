import { ai } from './client';
import { GenerateContentParameters, GenerateContentResponse } from "@google/genai";

const MAX_RETRIES = 3;
const INITIAL_BACKOFF_MS = 2000;

/**
 * A wrapper around the Gemini API's generateContent method that includes
 * automatic retries with exponential backoff for transient server errors.
 * @param params The parameters for the generateContent call.
 * @returns A Promise that resolves with the GenerateContentResponse.
 */
export async function generateContentWithRetry(params: GenerateContentParameters): Promise<GenerateContentResponse> {
  let lastError: any = null;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      // The API call itself
      const response = await ai.models.generateContent(params);
      return response;
    } catch (error: any) {
      lastError = error;
      const errorMessage = String(error?.message || '').toLowerCase();
      
      // Check for retryable errors (5xx, network issues, rpc failures)
      if (errorMessage.includes('500') || errorMessage.includes('503') || errorMessage.includes('rpc failed') || errorMessage.includes('network error')) {
        const delay = INITIAL_BACKOFF_MS * Math.pow(2, i) + Math.random() * 1000; // Exponential backoff with jitter
        console.warn(`Gemini API call failed (attempt ${i + 1}/${MAX_RETRIES}). Retrying in ${Math.round(delay / 1000)}s...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // Not a retryable error, rethrow immediately
        throw error;
      }
    }
  }

  console.error("Gemini API call failed after multiple retries.", lastError);
  throw new Error(`AI generation failed after ${MAX_RETRIES} attempts. Last error: ${lastError?.message}`);
}
