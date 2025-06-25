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
npm install @base83/speak-easy
```

## Usage

### Basic text-to-speech
```ts
import { TtsEngine } from '@base83/speak-easy';
const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY, debug: true });
await engine.synthesizeToFile({ text: 'Hello world!' });
```

### Feeling lucky? Try a random voice!
```ts
import { getRandomVoice } from '@base83/speak-easy';
const randomVoice = getRandomVoice();
await engine.synthesizeToFile({ text: 'Surprise me!', voice: randomVoice });
```

### Synthesize to buffer
```ts
const { buffer, voice, language } = await engine.synthesizeToBuffer({ text: 'Buffer output!' });
// Do something fun with the buffer, like play or save it!
```

### Synthesize to stream
```ts
const { stream } = await engine.synthesizeToStream({ text: 'Stream output!' });
stream.pipe(require('fs').createWriteStream('output.mp3'));
```

### Upload and use a file (multimodal magic)
```ts
const fileMeta = await engine.uploadFile({ file: 'audio.mp3', mimeType: 'audio/mpeg' });
await engine.synthesizeToFile({ file: fileMeta, prompt: 'Describe this audio' });
```

### Validate voices and languages
```ts
import { isValidVoice, isValidLanguage } from '@base83/speak-easy';
console.log(isValidVoice('Zephyr')); // true or false
console.log(isValidLanguage('en-US')); // true or false
```

### Error handling
```ts
import { TtsEngineError } from '@base83/speak-easy';
try {
  await engine.synthesizeToFile({ text: '' }); // Oops, no text!
} catch (err) {
  if (err instanceof TtsEngineError) {
    console.error('TTS error:', err.message, err.code, err.suggestion);
  }
}
```

### Using hooks and a custom logger
```ts
const customLogger = {
  log: (...args) => console.log('[CUSTOM LOG]', ...args),
  error: (...args) => console.error('[CUSTOM ERROR]', ...args),
};
const engineWithHooks = new TtsEngine({
  apiKey: process.env.GEMINI_API_KEY,
  logger: customLogger,
  hooks: {
    beforeSynthesize: (opts) => console.log('About to synthesize:', opts),
    afterSynthesize: (res) => console.log('Synthesis complete:', res),
    onError: (err) => console.error('Custom error handler:', err),
  },
});
```

### Explore all voices and languages
```ts
import { GEMINI_TTS_VOICES, GEMINI_TTS_LANGUAGES } from '@base83/speak-easy';
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
