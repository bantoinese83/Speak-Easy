# Speak Easy TTS 🎤✨

Welcome to **Speak Easy TTS** – your playful, powerful, and easy-to-use text-to-speech engine powered by Gemini AI!

## Features
- 🚀 Modern TypeScript API with explicit types and ergonomic exports
- 🎭 Tons of fun, expressive voices (see `GEMINI_TTS_VOICES`)
- 🌍 Multilingual support (see `GEMINI_TTS_LANGUAGES`)
- 🧑‍💻 Developer-friendly docs, types, and playful error messages
- 🎉 Playful logs and engaging usage examples
- 🔥 Exports for everything you need: `TtsEngine`, `getRandomVoice`, `isValidVoice`, and more

## Quick Start

```bash
npm install speak-easy
```

## Usage

```ts
import { TtsEngine, getRandomVoice, GEMINI_TTS_VOICES, GEMINI_TTS_LANGUAGES } from 'speak-easy';

const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY, debug: true });

// Basic text-to-speech
await engine.synthesizeToFile({ text: 'Hello world!' });

// Feeling lucky? Try a random voice!
const randomVoice = getRandomVoice();
await engine.synthesizeToFile({ text: 'Surprise me!', voice: randomVoice });

// Explore all voices and languages
console.log('Voices:', GEMINI_TTS_VOICES);
console.log('Languages:', GEMINI_TTS_LANGUAGES);
```

## API Highlights

- **TtsEngine**: Main class for all TTS magic
- **getRandomVoice()**: Get a random voice for fun variety
- **GEMINI_TTS_VOICES**: List of all available voices
- **GEMINI_TTS_LANGUAGES**: List of supported languages
- **isValidVoice() / isValidLanguage()**: Validate your choices

## Error Handling

All errors are playful and descriptive! For example:

```
🛑 Oops! No API key found for your TTS adventure.
Set GEMINI_API_KEY in your environment or pass it to the TtsEngine constructor. The magic won't work without it! 🪄
```

## Pro Tips
- Use the `debug: true` option for extra fun logs.
- Try different voices and languages for unique results.
- Check out the code for more playful comments and tips!

## Contributing
PRs and ideas welcome! Let's make TTS more fun for everyone.

---

Go forth and synthesize with style! 🚀
