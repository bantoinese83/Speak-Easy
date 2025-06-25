# Speak Easy TTS 🎤✨

Welcome to **Speak Easy TTS** – your playful, powerful, and easy-to-use text-to-speech engine powered by Gemini AI! This package is designed for a top-tier developer experience with a modern, fully-typed API, robust error handling, and fun, expressive features.

## Features
- 🚀 **Modern TypeScript API**: Fully-typed and designed for an ergonomic developer experience.
- 🎭 **Expressive Voices**: A whole cast of fun voices to bring your text to life.
- 🌍 **Multilingual Support**: Synthesize speech in numerous languages.
- 🧑‍💻 **Developer-Friendly Docs**: Comprehensive JSDoc and clear examples.
- 🎉 **Playful & Powerful**: Fun error messages, helpful logs, and robust features like caching and a CLI.
- 🔥 **Everything Exported**: All the types and helpers you need are ready to import.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Library Usage](#library-usage)
  - [Basic Synthesis](#basic-synthesis)
  - [Using a Random Voice](#using-a-random-voice)
  - [Synthesizing to a Buffer or Stream](#synthesizing-to-a-buffer-or-stream)
  - [Using the Cache](#using-the-cache)
  - [Multimodal Synthesis](#multimodal-synthesis)
  - [Advanced Configuration](#advanced-configuration)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## Installation

For the CLI:
```bash
npm install -g @base83/speak-easy
```
For the library:
```bash
npm install @base83/speak-easy
```

## Quick Start

```bash
# Ensure your GEMINI_API_KEY is set in your environment
export GEMINI_API_KEY="YOUR_API_KEY"

# Run from the CLI
speak-easy "Hello from Speak Easy!"
```

## CLI Usage

### From the Command Line (CLI)

```bash
# Basic synthesis
speak-easy "Hello from the CLI!"

# With options
speak-easy "Bonjour le monde!" --voice Puck --language fr-FR --output bonjour.mp3

# Using cache for repeated requests
speak-easy "This will be cached" --use-cache
```

### As a Library

```ts
import { TtsEngine } from '@base83/speak-easy';
const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY, debug: true });
await engine.synthesizeToFile({ text: 'Hello world!' });
```

## Library Usage

### Basic Synthesis
```ts
import { TtsEngine } from '@base83/speak-easy';
const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY });
const { filePath } = await engine.synthesizeToFile({ text: 'Hello from the library!' });
console.log(`Audio saved to: ${filePath}`);
```

### Using a Random Voice
```ts
import { TtsEngine, getRandomVoice } from '@base83/speak-easy';
const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY });
const voice = getRandomVoice();
await engine.synthesizeToFile({ text: 'A random voice is fun!', voice });
```

### Synthesizing to a Buffer or Stream
```ts
// To Buffer
const { buffer } = await engine.synthesizeToBuffer({ text: 'This is a buffer.' });

// To Stream
const { stream } = await engine.synthesizeToStream({ text: 'This is a stream.' });
stream.pipe(process.stdout);
```

### Using the Cache
Enable caching to save time and API calls on repeated requests.
```ts
const engine = new TtsEngine({ apiKey: process.env.GEMINI_API_KEY, useCache: true });
await engine.synthesizeToFile({ text: 'This will be cached.' });
await engine.synthesizeToFile({ text: 'This will be cached.' }); // This one will be much faster!
```

### Multimodal Synthesis
Use files as prompts for synthesis.
```ts
const fileMeta = await engine.uploadFile({ file: 'image.png', mimeType: 'image/png' });
await engine.synthesizeToFile({ file: fileMeta, prompt: 'Describe this image for me.' });
```

### Advanced Configuration
Customize the engine with hooks, a default voice, and your own logger.
```ts
const engine = new TtsEngine({
  apiKey: process.env.GEMINI_API_KEY,
  defaultVoice: 'Puck',
  useCache: true,
  hooks: {
    beforeSynthesize: (opts) => console.log('Starting job...'),
    afterSynthesize: (res) => console.log(`Finished with ${res.voice}!`),
  }
});
```

## API Reference

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
- The `synthesizeToFile` method will auto-generate a filename if you don't provide one.
- Check out the full JSDoc in your editor for detailed info on every function and type.

## Contributing
PRs and ideas welcome! Let's make TTS more fun for everyone.

---

Go forth and synthesize with style! 🚀
