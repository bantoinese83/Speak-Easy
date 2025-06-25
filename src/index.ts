// Main entry point for speak-easy

/**
 * Main class for text-to-speech synthesis using Gemini AI.
 * Supports text, file, and multimodal prompts.
 * Includes file upload, management, and advanced TTS features.
 * @example
 *   import { TtsEngine } from 'speak-easy';
 *   const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY, debug: true });
 *   // Text-to-speech
 *   await engine.synthesizeToFile({ text: 'Hello world!' });
 *   // File upload
 *   const fileMeta = await engine.uploadFile({ file: 'audio.mp3', mimeType: 'audio/mpeg' });
 *   // Multimodal TTS
 *   await engine.synthesizeToFile({ file: fileMeta, prompt: 'Describe this audio' });
 */
export {
  TtsEngine,
  TtsEngineError,
  type TtsOptions,
  type TtsEngineConfig,
  type FileMetadata,
} from './core/ttsEngine.js';

/**
 * List of available Gemini TTS voices.
 * @example
 *   import { GEMINI_TTS_VOICES } from 'speak-easy';
 *   console.log(GEMINI_TTS_VOICES);
 */
export { GEMINI_TTS_VOICES, isValidVoice, getRandomVoice } from './core/geminiTTSConfig.js';

/**
 * List of supported languages.
 * @example
 *   import { GEMINI_TTS_LANGUAGES } from 'speak-easy';
 *   console.log(GEMINI_TTS_LANGUAGES);
 */
export { GEMINI_TTS_LANGUAGES, isValidLanguage } from './core/geminiTTSConfig.js';

/**
 * Default export for convenience (TtsEngine).
 */
import { TtsEngine } from './core/ttsEngine.js';
export default TtsEngine;

/**
 * TtsEngine: Main class for text-to-speech synthesis using Gemini AI.
 * @example
 *   const engine = new TtsEngine(process.env.GEMINI_API_KEY);
 *   await engine.synthesizeToFile({ text: 'Hello world!' });
 */

/**
 * TtsEngineError: Custom error class for TTS errors.
 */

/**
 * TtsOptions: Options for TTS synthesis (text, voice, language, fileName).
 */
