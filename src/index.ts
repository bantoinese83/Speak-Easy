// Main entry point for speak-easy

/**
 * 🎉 Welcome to Speak Easy TTS! 🎉
 *
 * This is your gateway to playful, powerful, and easy text-to-speech with Gemini AI.
 *
 * @example
 *   import { TtsEngine } from 'speak-easy';
 *   const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY, debug: true });
 *   await engine.synthesizeToFile({ text: 'Hello world!' });
 *
 *   // Feeling lucky? Try a random voice!
 *   const randomVoice = getRandomVoice();
 *   await engine.synthesizeToFile({ text: 'Surprise me!', voice: randomVoice });
 *
 *   // Explore all voices and languages
 *   console.log('Voices:', GEMINI_TTS_VOICES);
 *   console.log('Languages:', GEMINI_TTS_LANGUAGES);
 *
 *   // For more fun, check the README!
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
 * @example
 *   import TtsEngine from 'speak-easy';
 *   const engine = new TtsEngine(process.env.GEMINI_API_KEY);
 */
import { TtsEngine } from './core/ttsEngine.js';
export default TtsEngine;

// 🚀 Go forth and synthesize with style! 🚀

/**
 * TtsEngine: Main class for text-to-speech synthesis using Gemini AI.
 * @example
 *   const engine = new TtsEngine(process.env.GEMINI_API_KEY);
 *   await engine.synthesizeToFile({ text: 'Hello world!' });
 */

/**
 * TtsEngineError: Custom error class for TTS errors.
 * @example
 *   const engine = new TtsEngine(process.env.GEMINI_API_KEY);
 *   try {
 *     await engine.synthesizeToFile({ text: 'Hello world!' });
 *   } catch (error) {
 *     if (error instanceof TtsEngineError) {
 *       console.error('TTS error:', error.message);
 */

/**
 * TtsOptions: Options for TTS synthesis (text, voice, language, fileName).
 * @example
 *   const engine = new TtsEngine(process.env.GEMINI_API_KEY);
 *   await engine.synthesizeToFile({ text: 'Hello world!', voice: 'Zephyr', language: 'en-US', fileName: 'hello.mp3' });
 */
