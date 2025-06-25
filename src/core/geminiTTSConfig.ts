// src/core/geminiTTSConfig.ts

/**
 * 🚀 GEMINI_TTS_VOICES: The full cast of voice personalities for your TTS adventures!
 * Each voice has a unique name and a descriptive tag to help you find the perfect match.
 * These are the officially supported voice options for the Gemini TTS model.
 *
 * @example
 * import { GEMINI_TTS_VOICES } from '@base83/speak-easy';
 * console.log('Available voices:', GEMINI_TTS_VOICES.map(v => v.name));
 * // Output: ['Zephyr', 'Puck', ...]
 */
export const GEMINI_TTS_VOICES: ReadonlyArray<{ name: string; description: string }> = [
  { name: 'Zephyr', description: 'Bright' },
  { name: 'Puck', description: 'Upbeat' },
  { name: 'Charon', description: 'Informative' },
  { name: 'Kore', description: 'Firm' },
  { name: 'Fenrir', description: 'Excitable' },
  { name: 'Leda', description: 'Youthful' },
  { name: 'Orus', description: 'Firm' },
  { name: 'Aoede', description: 'Breezy' },
  { name: 'Callirrhoe', description: 'Easy-going' },
  { name: 'Autonoe', description: 'Bright' },
  { name: 'Enceladus', description: 'Breathy' },
  { name: 'Iapetus', description: 'Clear' },
  { name: 'Umbriel', description: 'Easy-going' },
  { name: 'Algieba', description: 'Smooth' },
  { name: 'Despina', description: 'Smooth' },
  { name: 'Erinome', description: 'Clear' },
  { name: 'Algenib', description: 'Gravelly' },
  { name: 'Rasalgethi', description: 'Informative' },
  { name: 'Laomedeia', description: 'Upbeat' },
  { name: 'Achernar', description: 'Soft' },
  { name: 'Alnilam', description: 'Firm' },
  { name: 'Schedar', description: 'Even' },
  { name: 'Gacrux', description: 'Mature' },
  { name: 'Pulcherrima', description: 'Forward' },
  { name: 'Achird', description: 'Friendly' },
  { name: 'Zubenelgenubi', description: 'Casual' },
  { name: 'Vindemiatrix', description: 'Gentle' },
  { name: 'Sadachbia', description: 'Lively' },
  { name: 'Sadaltager', description: 'Knowledgeable' },
  { name: 'Sulafat', description: 'Warm' },
] as const;

/**
 * 🌍 GEMINI_TTS_LANGUAGES: Supported languages for your global TTS journey!
 * Each entry includes a human-readable name and its corresponding BCP-47 language code.
 * Use these codes to synthesize speech in different languages.
 *
 * @example
 * import { GEMINI_TTS_LANGUAGES } from '@base83/speak-easy';
 * const spanish = GEMINI_TTS_LANGUAGES.find(l => l.language.includes('Spanish'));
 * console.log(spanish?.code); // 'es-US'
 */
export const GEMINI_TTS_LANGUAGES: ReadonlyArray<{ language: string; code: string }> = [
  { language: 'Arabic (Egyptian)', code: 'ar-EG' },
  { language: 'German (Germany)', code: 'de-DE' },
  { language: 'English (US)', code: 'en-US' },
  { language: 'Spanish (US)', code: 'es-US' },
  { language: 'French (France)', code: 'fr-FR' },
  { language: 'Hindi (India)', code: 'hi-IN' },
  { language: 'Indonesian (Indonesia)', code: 'id-ID' },
  { language: 'Italian (Italy)', code: 'it-IT' },
  { language: 'Japanese (Japan)', code: 'ja-JP' },
  { language: 'Korean (Korea)', code: 'ko-KR' },
  { language: 'Portuguese (Brazil)', code: 'pt-BR' },
  { language: 'Russian (Russia)', code: 'ru-RU' },
  { language: 'Dutch (Netherlands)', code: 'nl-NL' },
  { language: 'Polish (Poland)', code: 'pl-PL' },
  { language: 'Thai (Thailand)', code: 'th-TH' },
  { language: 'Turkish (Turkey)', code: 'tr-TR' },
  { language: 'Vietnamese (Vietnam)', code: 'vi-VN' },
  { language: 'Romanian (Romania)', code: 'ro-RO' },
  { language: 'Ukrainian (Ukraine)', code: 'uk-UA' },
  { language: 'Bengali (Bangladesh)', code: 'bn-BD' },
  { language: 'English (India)', code: 'en-IN' },
  { language: 'Marathi (India)', code: 'mr-IN' },
  { language: 'Tamil (India)', code: 'ta-IN' },
  { language: 'Telugu (India)', code: 'te-IN' },
] as const;

/**
 * Checks if a given voice name is a valid and supported option.
 * This is useful for validating user input before making an API call.
 *
 * @param voice - The name of the voice to check (case-sensitive).
 * @returns `true` if the voice is in `GEMINI_TTS_VOICES`, `false` otherwise.
 * @example
 * import { isValidVoice } from '@base83/speak-easy';
 * console.log(isValidVoice('Zephyr')); // true
 * console.log(isValidVoice('InvalidVoice')); // false
 */
export const isValidVoice = (voice: string): boolean =>
  GEMINI_TTS_VOICES.some((v) => v.name === voice);

/**
 * Checks if a given language code is a valid and supported option.
 *
 * @param code - The BCP-47 language code to check (case-sensitive).
 * @returns `true` if the code is in `GEMINI_TTS_LANGUAGES`, `false` otherwise.
 * @example
 * import { isValidLanguage } from '@base83/speak-easy';
 * console.log(isValidLanguage('en-US')); // true
 * console.log(isValidLanguage('xx-XX')); // false
 */
export const isValidLanguage = (code: string): boolean =>
  GEMINI_TTS_LANGUAGES.some((l) => l.code === code);

/**
 * 🎲 getRandomVoice: Feeling lucky? Get a random voice from the cast!
 * A fun utility to add variety to your application's speech output.
 *
 * @returns The name of a randomly selected voice as a string.
 * @example
 * import { getRandomVoice } from '@base83/speak-easy';
 * const randomVoice = getRandomVoice();
 * console.log(`Today's voice is: ${randomVoice}`);
 */
export const getRandomVoice = (): string => {
  const idx = Math.floor(Math.random() * GEMINI_TTS_VOICES.length);
  return GEMINI_TTS_VOICES[idx].name;
};

// 🌟 Go forth and synthesize with style! 🌟
