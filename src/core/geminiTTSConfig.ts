// src/core/geminiTTSConfig.ts

export const GEMINI_TTS_VOICES = [
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

export const GEMINI_TTS_LANGUAGES = [
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

export function isValidVoice(voice: string): boolean {
  return GEMINI_TTS_VOICES.some((v) => v.name === voice);
}

export function isValidLanguage(code: string): boolean {
  return GEMINI_TTS_LANGUAGES.some((l) => l.code === code);
}

export function getRandomVoice(): string {
  const idx = Math.floor(Math.random() * GEMINI_TTS_VOICES.length);
  return GEMINI_TTS_VOICES[idx].name;
}
