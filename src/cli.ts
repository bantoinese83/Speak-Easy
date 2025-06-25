#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { TtsEngine, getRandomVoice, GEMINI_TTS_VOICES } from './index.js';

console.log('🎤 Welcome to Speak Easy CLI! 🎤');

yargs(hideBin(process.argv))
  .command(
    '$0 <text>',
    'Synthesize text to speech and save to a file.',
    (y) => {
      return y
        .positional('text', {
          describe: 'The text to synthesize',
          type: 'string',
        })
        .option('voice', {
          alias: 'v',
          describe: 'The voice to use for synthesis.',
          type: 'string',
          choices: GEMINI_TTS_VOICES.map((v) => v.name),
        })
        .option('random-voice', {
          describe: 'Use a random voice. Ignores --voice.',
          type: 'boolean',
        })
        .option('language', {
          alias: 'l',
          describe: 'The language code (e.g., en-US).',
          type: 'string',
        })
        .option('output', {
          alias: 'o',
          describe: 'Output file name. Defaults to an auto-generated name.',
          type: 'string',
        })
        .option('use-cache', {
          describe: 'Enable caching to speed up repeated requests.',
          type: 'boolean',
          default: false,
        })
        .option('debug', {
          describe: 'Enable debug logging.',
          type: 'boolean',
          default: false,
        });
    },
    async (argv) => {
      if (!argv.text) {
        console.error('🛑 Error: Text to synthesize is required.');
        process.exit(1);
      }

      try {
        console.log('🚀 Initializing TTS engine...');
        const engine = new TtsEngine({
          apiKey: process.env.GEMINI_API_KEY,
          debug: argv.debug,
          useCache: argv.useCache,
        });

        const voice = argv.randomVoice ? getRandomVoice() : argv.voice;

        console.log(`🗣️  Synthesizing with voice: ${voice || 'default'}...`);

        const { filePath } = await engine.synthesizeToFile({
          text: argv.text,
          voice,
          language: argv.language,
          fileName: argv.output,
        });

        console.log(`✅ Success! Audio saved to: ${filePath}`);
      } catch (err: any) {
        console.error(`💥 Oh no! An error occurred: ${err.message}`);
        if (err.suggestion) {
          console.error(`💡 Suggestion: ${err.suggestion}`);
        }
        process.exit(1);
      }
    },
  )
  .help()
  .alias('help', 'h')
  .demandCommand(1, 'Please provide the text to synthesize.')
  .parse(); 