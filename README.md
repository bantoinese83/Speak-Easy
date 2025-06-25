# Speak-Easy

> The most developer-friendly Gemini AI TTS engine for Node.js and TypeScript.

---

## Features

- **Simple API**: One class, one method, instant TTS.
- **TypeScript-first**: Full type safety and autocompletion.
- **Flexible**: Choose voice, language, and output file name.
- **Multiple outputs**: Get audio as file, buffer, or stream.
- **Hooks & Events**: Run code before/after synth, on error.
- **Robust**: Input validation, error codes, suggestions, debug logging.
- **Modern**: ESM & CJS support, blazing fast build.
- **Custom errors**: Easy error handling for robust apps.
- **Files API**: Upload, manage, and use files for multimodal TTS.
- **Custom Logging**: Plug in your own logger for production monitoring.

---

## Error Handling & Logging

### Logger Option

You can provide a custom logger (e.g. [winston](https://github.com/winstonjs/winston), [pino](https://getpino.io/), or your own object) to the `TtsEngine` config:

```ts
import winston from 'winston';
const logger = winston.createLogger({
  /* ... */
});
const engine = new TtsEngine({
  apiKey: process.env.GEMINI_API_KEY,
  logger, // Use your logger
});
```

If not provided, `console` is used by default.

### Error Tracking (Sentry, Bugsnag, etc.)

Use the `onError` hook to send errors to your error tracking service:

```ts
import * as Sentry from '@sentry/node';
const engine = new TtsEngine({
  apiKey: process.env.GEMINI_API_KEY,
  hooks: {
    onError: (err) => {
      Sentry.captureException(err);
    },
  },
});
```

### Error Codes

All errors thrown are instances of `TtsEngineError` and include a `.code` and optional `.suggestion`.

| Code                | Meaning                                      |
| ------------------- | -------------------------------------------- |
| NO_API_KEY          | API key missing                              |
| FILE_METADATA_ERROR | File missing required metadata               |
| INVALID_VOICE       | Voice not supported                          |
| INVALID_LANGUAGE    | Language not supported                       |
| NO_TEXT             | No text provided for synthesis               |
| NO_AUDIO            | No audio data returned from Gemini API       |
| SYNTH_ERROR         | Failed to synthesize audio (text)            |
| SYNTH_FILE_ERROR    | Failed to synthesize audio (file/multimodal) |
| NO_FFMPEG           | ffmpeg not found for audio conversion        |

### Best Practices

- Always use the `onError` hook to catch and report errors.
- Use a custom logger in production for better monitoring.
- Check error `.code` and `.suggestion` for actionable info.
- Clean up temp files and resources in your own hooks if needed.

---

## Installation

```bash
npm install speak-easy
```

---

## Usage

### Basic (File Output)

```ts
import { TtsEngine } from 'speak-easy';
const engine = new TtsEngine(process.env.GEMINI_API_KEY!);
await engine.synthesizeToFile({
  text: 'Hello, world!',
  voice: 'Zephyr',
  language: 'en-US',
  fileName: 'hello.mp3',
});
```

### Buffer Output

```ts
const { buffer } = await engine.synthesizeToBuffer({ text: 'Buffer output!' });
```

### Stream Output

```ts
const { stream } = await engine.synthesizeToStream({ text: 'Stream output!' });
stream.pipe(fs.createWriteStream('output.mp3'));
```

### Global Config & Hooks

```ts
const engine = new TtsEngine({
  apiKey: process.env.GEMINI_API_KEY,
  defaultVoice: 'Zephyr',
  defaultLanguage: 'en-US',
  outputDir: 'audio/',
  debug: true,
  hooks: {
    beforeSynthesize: (opts) => console.log('Synth starting:', opts),
    afterSynthesize: (res) => console.log('Synth done:', res),
    onError: (err) => console.error('TTS error:', err),
  },
});
```

### File Upload & Multimodal Usage

#### Upload a File

```ts
// Upload a local file (audio, image, etc.) to Gemini Files API
const fileMeta = await engine.uploadFile({
  file: 'path/to/sample.mp3',
  mimeType: 'audio/mpeg',
});
console.log(fileMeta); // { name, uri, mimeType, ... }
```

#### List, Get, and Delete Files

```ts
// List uploaded files
const files = await engine.listFiles({ pageSize: 5 });
console.log(files);

// Get metadata for a file
const meta = await engine.getFile({ name: fileMeta.name });
console.log(meta);

// Delete a file
await engine.deleteFile({ name: fileMeta.name });
```

#### Synthesize Speech from a File (Audio, Image, etc.)

```ts
// Synthesize from a file (e.g., describe an audio clip)
const { buffer } = await engine.synthesizeToBuffer({
  file: fileMeta, // or fileMeta.name
  prompt: 'Describe this audio clip',
  voice: 'Zephyr',
});
// Save or play the buffer as needed
```

#### Multimodal Prompt (File + Text)

```ts
// Combine file(s) and text in a single prompt
const { filePath } = await engine.synthesizeToFile({
  files: [fileMeta],
  prompt: 'Summarize the content of this file and read it aloud.',
  voice: 'Erinome',
  fileName: 'summary.mp3',
});
console.log('Audio saved to:', filePath);
```

---

## API Reference

### `TtsEngine(configOrApiKey)`

- `configOrApiKey`: string (API key) or config object

#### Config Options

- `apiKey` (string): Gemini API key (or set `GEMINI_API_KEY` in env)
- `defaultVoice` (string): Default voice name
- `defaultLanguage` (string): Default language code
- `outputDir` (string): Directory for audio files
- `debug` (boolean): Enable debug logging
- `logger` (object): Custom logger (console-like)
- `hooks` (object): Event hooks
  - `beforeSynthesize(opts)`
  - `afterSynthesize({ buffer, voice, language })`
  - `onError(error)`

### Methods

- `synthesizeToFile({ text, voice?, language?, fileName?, file?, files?, prompt? })`
- `synthesizeToBuffer({ text, voice?, language?, file?, files?, prompt? })`
- `synthesizeToStream({ text, voice?, language?, file?, files?, prompt? })`
- `uploadFile({ file, mimeType })`
- `listFiles({ pageSize? })`
- `getFile({ name })`
- `deleteFile({ name })`
- `synthesizeFromFile({ file, files, prompt, ... })`

### Types

- `TtsOptions`, `TtsEngineConfig`, `TtsEngineError`, `FileMetadata`

---

## Voices & Languages

### Voices

| Name      |
| --------- |
| Zephyr    |
| Erinome   |
| Sadachbia |
| ...       |

### Languages

| Code  | Name         |
| ----- | ------------ |
| en-US | English (US) |
| ...   | ...          |

See `GEMINI_TTS_VOICES` and `GEMINI_TTS_LANGUAGES` exports for full lists.

---

## Advanced Usage

- **Validate voices/languages:**
  - `isValidVoice('Zephyr')`, `isValidLanguage('en-US')`
- **Get a random voice:**
  - `getRandomVoice()`
- **Debug logging:**
  - Pass `debug: true` in config
- **Hooks:**
  - See config example above

---

## Troubleshooting

- **Missing ffmpeg:** Install ffmpeg and ensure it's in your PATH.
- **API key errors:** Set `GEMINI_API_KEY` or pass in config.
- **Voice/language errors:** Check suggestions in error or use exported lists.
- **File errors:** Ensure files are uploaded and not expired (48h retention).

---

## Coming Soon

- CLI tool: `npx speak-easy "Hello world!"`
- Test coverage & CI badges
- More voices/languages

---

## Contributing

PRs welcome! Please open issues for bugs/feature requests.

## License

MIT
