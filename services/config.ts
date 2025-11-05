/**
 * Defines configuration values for the Gemini services.
 */
export const GEMINI_MODELS = {
  /** For general text tasks like summarization, prompt generation, etc. */
  TEXT: 'gemini-2.5-pro',
  /** For generating images from text prompts. */
  IMAGE: 'gemini-2.5-flash-image',
  /** A list of video generation models to try in order as a fallback mechanism. */
  VIDEO_FALLBACK_LIST: [
    'veo-3.1-fast-generate-preview', // User's "Veo 3.1 Fast" (Prioritized)
    'veo-3.1-generate-preview', // User's "Veo 3.1" (High Quality, now fallback)
    // User also requested "Veo 3", but this is an ambiguous model name.
    // A two-step fallback with documented models is implemented for robustness.
  ],
};

/**
 * The default Gemini model to be used for content generation.
 * This can be overridden on a per-call basis in the service functions.
 * @deprecated use GEMINI_MODELS.TEXT instead
 */
export const GEMINI_DEFAULT_MODEL = GEMINI_MODELS.TEXT;