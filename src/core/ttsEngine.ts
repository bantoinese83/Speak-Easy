import { GoogleGenAI, createUserContent, createPartFromUri } from '@google/genai';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Readable } from 'stream';
import {
  GEMINI_TTS_VOICES,
  isValidVoice,
  getRandomVoice,
  GEMINI_TTS_LANGUAGES,
  isValidLanguage,
} from './geminiTTSConfig.js';

const execAsync = promisify(exec);

const DEFAULT_OUTPUT_DIR = 'data/tts';

function getEnv(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback;
}

function suggestVoice(input: string): string | undefined {
  const voices = GEMINI_TTS_VOICES.map((v) => v.name.toLowerCase());
  const match = voices.find((v) => v.startsWith(input.toLowerCase()));
  return match ? GEMINI_TTS_VOICES.find((v) => v.name.toLowerCase() === match)?.name : undefined;
}

function suggestLanguage(input: string): string | undefined {
  const langs = GEMINI_TTS_LANGUAGES.map((l) => l.code.toLowerCase());
  const match = langs.find((l) => l.startsWith(input.toLowerCase()));
  return match ? GEMINI_TTS_LANGUAGES.find((l) => l.code.toLowerCase() === match)?.code : undefined;
}

async function checkFFmpeg(): Promise<boolean> {
  try {
    await execAsync('ffmpeg -version');
    return true;
  } catch {
    return false;
  }
}

export interface TtsOptions {
  text?: string;
  voice?: string;
  fileName?: string;
  language?: string;
  /**
   * Single file or array of files to use as prompt (for multimodal or file-based TTS)
   * Each file can be a local path or a FileMetadata object from uploadFile/listFiles
   */
  file?: string | FileMetadata;
  files?: (string | FileMetadata)[];
  /**
   * Optional prompt to use with file(s) (e.g. 'Describe this audio clip')
   */
  prompt?: string;
}

export interface TtsEngineConfig {
  apiKey?: string;
  defaultVoice?: string;
  defaultLanguage?: string;
  outputDir?: string;
  debug?: boolean;
  /**
   * Optional logger (console-like or custom, e.g. winston/pino)
   */
  logger?: {
    log: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn?: (...args: any[]) => void;
    info?: (...args: any[]) => void;
    debug?: (...args: any[]) => void;
  };
  hooks?: {
    beforeSynthesize?: (opts: TtsOptions) => void;
    afterSynthesize?: (result: { buffer: Buffer; voice: string; language: string }) => void;
    onError?: (err: TtsEngineError) => void;
  };
}

export interface FileMetadata {
  name: string;
  uri: string;
  mimeType: string;
  size?: number;
  createTime?: string;
  [key: string]: any;
}

export class TtsEngineError extends Error {
  code: string;
  suggestion?: string;
  constructor(
    message: string,
    code = 'TTS_ERROR',
    suggestion?: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'TtsEngineError';
    this.code = code;
    this.suggestion = suggestion;
  }
}

export class TtsEngine {
  private readonly genAI: GoogleGenAI;
  private readonly config: TtsEngineConfig;
  private readonly outputDir: string;
  private readonly debug: boolean;
  private readonly hooks: NonNullable<TtsEngineConfig['hooks']>;
  private readonly logger: Required<Pick<Console, 'log' | 'error'>> & Partial<Console>;

  constructor(configOrApiKey?: string | TtsEngineConfig) {
    let config: TtsEngineConfig;
    if (typeof configOrApiKey === 'string') {
      config = { apiKey: configOrApiKey };
    } else {
      config = configOrApiKey || {};
    }
    const apiKey = config.apiKey || getEnv('GEMINI_API_KEY');
    if (!apiKey)
      throw new TtsEngineError(
        'API key is required for TTS',
        'NO_API_KEY',
        'Set GEMINI_API_KEY in your environment or pass it to the constructor.',
      );
    this.genAI = new GoogleGenAI({ apiKey });
    this.config = config;
    this.outputDir = config.outputDir || DEFAULT_OUTPUT_DIR;
    this.debug = !!config.debug;
    this.hooks = config.hooks || {};
    this.logger = config.logger || console;
  }

  /**
   * Upload a file to Gemini Files API. Returns FileMetadata.
   * @param filePath Local path to file
   * @param mimeType File MIME type (e.g. 'audio/mpeg', 'image/png')
   */
  public async uploadFile({
    file,
    mimeType,
  }: {
    file: string;
    mimeType: string;
  }): Promise<FileMetadata> {
    try {
      const uploaded = await this.genAI.files.upload({ file, config: { mimeType } });
      if (!uploaded.name || !uploaded.uri || !uploaded.mimeType) {
        throw new TtsEngineError(
          'Uploaded file is missing required metadata',
          'FILE_METADATA_ERROR',
        );
      }
      this.logger.log('[TTS] File uploaded:', uploaded.name, uploaded.mimeType);
      return uploaded as FileMetadata;
    } catch (err) {
      this.logger.error('[TTS] File upload error:', err);
      this.hooks.onError?.(err as TtsEngineError);
      throw err;
    }
  }

  /**
   * List uploaded files (optionally paginated)
   */
  public async listFiles({ pageSize = 10 }: { pageSize?: number } = {}): Promise<FileMetadata[]> {
    try {
      const listResponse = await this.genAI.files.list({ config: { pageSize } });
      const files: FileMetadata[] = [];
      for await (const file of listResponse) {
        if (!file.name || !file.uri || !file.mimeType) {
          throw new TtsEngineError(
            'Listed file is missing required metadata',
            'FILE_METADATA_ERROR',
          );
        }
        files.push(file as FileMetadata);
      }
      this.logger.log('[TTS] Listed files:', files.length);
      return files;
    } catch (err) {
      this.logger.error('[TTS] List files error:', err);
      this.hooks.onError?.(err as TtsEngineError);
      throw err;
    }
  }

  /**
   * Get metadata for a file by name
   */
  public async getFile({ name }: { name: string }): Promise<FileMetadata> {
    try {
      const file = await this.genAI.files.get({ name });
      if (!file.name || !file.uri || !file.mimeType) {
        throw new TtsEngineError(
          'Fetched file is missing required metadata',
          'FILE_METADATA_ERROR',
        );
      }
      this.logger.log('[TTS] Got file:', file.name);
      return file as FileMetadata;
    } catch (err) {
      this.logger.error('[TTS] Get file error:', err);
      this.hooks.onError?.(err as TtsEngineError);
      throw err;
    }
  }

  /**
   * Delete a file by name
   */
  public async deleteFile({ name }: { name: string }): Promise<void> {
    try {
      await this.genAI.files.delete({ name });
      this.logger.log('[TTS] Deleted file:', name);
    } catch (err) {
      this.logger.error('[TTS] Delete file error:', err);
      this.hooks.onError?.(err as TtsEngineError);
      throw err;
    }
  }

  /**
   * Synthesize speech from a file or multimodal prompt (file + text)
   * @param options TtsOptions with file/files and optional prompt
   */
  public async synthesizeFromFile(
    options: TtsOptions,
  ): Promise<{ buffer: Buffer; voice: string; language: string }> {
    this.hooks.beforeSynthesize?.(options);
    const { file, files, prompt, voice, language } = options;
    const chosenVoice = voice || this.config.defaultVoice || getRandomVoice();
    if (!isValidVoice(chosenVoice)) {
      const suggestion = suggestVoice(chosenVoice);
      const err = new TtsEngineError(
        `Voice '${chosenVoice}' is not supported.`,
        'INVALID_VOICE',
        suggestion ? `Did you mean '${suggestion}'?` : `See GEMINI_TTS_VOICES for options.`,
      );
      this.logger.error('[TTS] Invalid voice:', chosenVoice, err);
      this.hooks.onError?.(err);
      throw err;
    }
    const chosenLanguage = language || this.config.defaultLanguage || 'en-US';
    if (!isValidLanguage(chosenLanguage)) {
      const suggestion = suggestLanguage(chosenLanguage);
      const err = new TtsEngineError(
        `Language '${chosenLanguage}' is not supported.`,
        'INVALID_LANGUAGE',
        suggestion ? `Did you mean '${suggestion}'?` : `See GEMINI_TTS_LANGUAGES for options.`,
      );
      this.logger.error('[TTS] Invalid language:', chosenLanguage, err);
      this.hooks.onError?.(err);
      throw err;
    }
    // Build multimodal content array
    const contentParts: any[] = [];
    const fileList = [file, ...(files || [])].filter(Boolean);
    for (const f of fileList) {
      let fileMeta: FileMetadata | undefined;
      if (typeof f === 'string') {
        // Assume it's a file name, fetch metadata
        fileMeta = await this.getFile({ name: f });
      } else {
        fileMeta = f;
      }
      if (!fileMeta || !fileMeta.name || !fileMeta.uri || !fileMeta.mimeType) {
        throw new TtsEngineError('File metadata is missing required fields', 'FILE_METADATA_ERROR');
      }
      contentParts.push(createPartFromUri(fileMeta.uri, fileMeta.mimeType));
    }
    if (prompt) contentParts.push(prompt);
    // Fallback: if no prompt, just describe the file(s)
    if (!prompt && fileList.length) contentParts.push('Describe this file');
    if (this.debug) this.logger.log('[TTS] synthesizeFromFile contentParts:', contentParts);
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-pro-preview-tts',
        contents: createUserContent(contentParts),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: chosenVoice },
            },
          },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const buffer = Buffer.from(audioData, 'base64');
        this.hooks.afterSynthesize?.({ buffer, voice: chosenVoice, language: chosenLanguage });
        this.logger.log('[TTS] Synthesize from file success:', {
          voice: chosenVoice,
          language: chosenLanguage,
        });
        return { buffer, voice: chosenVoice, language: chosenLanguage };
      }
      const err = new TtsEngineError('No audio data returned from Gemini API', 'NO_AUDIO');
      this.logger.error('[TTS] No audio data returned', err);
      this.hooks.onError?.(err);
      throw err;
    } catch (error) {
      this.logger.error('[TTS] Synthesize from file error:', error);
      const err = new TtsEngineError(
        'Failed to synthesize audio from file',
        'SYNTH_FILE_ERROR',
        undefined,
        error,
      );
      this.hooks.onError?.(err);
      throw err;
    }
  }

  /**
   * Synthesize text or file-based prompt to speech and save to file
   */
  public async synthesizeToFile(
    options: TtsOptions,
  ): Promise<{ filePath: string; voice: string; language: string }> {
    let bufferResult: { buffer: Buffer; voice: string; language: string };
    let tempRawPath: string | undefined;
    try {
      if (options.file || options.files) {
        bufferResult = await this.synthesizeFromFile(options);
      } else {
        bufferResult = await this.synthesizeToBuffer(options);
      }
      await mkdir(this.outputDir, { recursive: true });
      const fileName = this.createSafeFileName(
        options.fileName || options.text?.slice(0, 40) || 'output',
        bufferResult.voice,
      );
      const filePath = path.join(this.outputDir, fileName);
      tempRawPath = filePath.replace(/\.mp3$/, '.raw');
      await writeFile(tempRawPath, bufferResult.buffer);
      const ffmpegOk = await checkFFmpeg();
      if (!ffmpegOk) {
        const err = new TtsEngineError(
          'ffmpeg is required to convert audio. Please install ffmpeg.',
          'NO_FFMPEG',
          'Install ffmpeg and ensure it is in your PATH.',
        );
        this.logger.error('[TTS] ffmpeg not found', err);
        this.hooks.onError?.(err);
        throw err;
      }
      try {
        await execAsync(`ffmpeg -y -f s16le -ar 24000 -ac 1 -i "${tempRawPath}" "${filePath}"`);
        await unlink(tempRawPath);
      } catch (e) {
        this.logger.error('[TTS] ffmpeg conversion failed, saving raw buffer instead.', e);
        await writeFile(filePath, bufferResult.buffer);
      }
      this.logger.log('[TTS] Synthesize to file success:', filePath);
      return { filePath, voice: bufferResult.voice, language: bufferResult.language };
    } catch (err) {
      this.logger.error('[TTS] Synthesize to file error:', err);
      this.hooks.onError?.(err as TtsEngineError);
      throw err;
    } finally {
      if (tempRawPath) {
        try {
          await unlink(tempRawPath);
        } catch {
          // Temp file may not exist or already deleted; safe to ignore
        }
      }
    }
  }

  /**
   * Synthesize text or file-based prompt to speech and return as Buffer
   */
  public async synthesizeToBuffer(
    options: TtsOptions,
  ): Promise<{ buffer: Buffer; voice: string; language: string }> {
    if (options.file || options.files) {
      return await this.synthesizeFromFile(options);
    }
    this.hooks.beforeSynthesize?.(options);
    const { text, voice, language } = options;
    if (!text || typeof text !== 'string' || text.length < 1) {
      const err = new TtsEngineError('Text is required for TTS synthesis', 'NO_TEXT');
      this.logger.error('[TTS] No text provided', err);
      this.hooks.onError?.(err);
      throw err;
    }
    const chosenVoice = voice || this.config.defaultVoice || getRandomVoice();
    if (!isValidVoice(chosenVoice)) {
      const suggestion = suggestVoice(chosenVoice);
      const err = new TtsEngineError(
        `Voice '${chosenVoice}' is not supported.`,
        'INVALID_VOICE',
        suggestion ? `Did you mean '${suggestion}'?` : `See GEMINI_TTS_VOICES for options.`,
      );
      this.logger.error('[TTS] Invalid voice:', chosenVoice, err);
      this.hooks.onError?.(err);
      throw err;
    }
    const chosenLanguage = language || this.config.defaultLanguage || 'en-US';
    if (!isValidLanguage(chosenLanguage)) {
      const suggestion = suggestLanguage(chosenLanguage);
      const err = new TtsEngineError(
        `Language '${chosenLanguage}' is not supported.`,
        'INVALID_LANGUAGE',
        suggestion ? `Did you mean '${suggestion}'?` : `See GEMINI_TTS_LANGUAGES for options.`,
      );
      this.logger.error('[TTS] Invalid language:', chosenLanguage, err);
      this.hooks.onError?.(err);
      throw err;
    }
    if (this.debug)
      this.logger.log(
        `[TTS] Synthesizing with voice: ${chosenVoice}, language: ${chosenLanguage}...`,
      );
    try {
      const response = await this.genAI.models.generateContent({
        model: 'gemini-2.5-pro-preview-tts',
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: chosenVoice },
            },
          },
        },
      });
      const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (audioData) {
        const buffer = Buffer.from(audioData, 'base64');
        this.hooks.afterSynthesize?.({ buffer, voice: chosenVoice, language: chosenLanguage });
        this.logger.log('[TTS] Synthesize to buffer success:', {
          voice: chosenVoice,
          language: chosenLanguage,
        });
        return { buffer, voice: chosenVoice, language: chosenLanguage };
      }
      const err = new TtsEngineError('No audio data returned from Gemini API', 'NO_AUDIO');
      this.logger.error('[TTS] No audio data returned', err);
      this.hooks.onError?.(err);
      throw err;
    } catch (error) {
      this.logger.error('[TTS] Synthesize to buffer error:', error);
      const err = new TtsEngineError('Failed to synthesize audio', 'SYNTH_ERROR', undefined, error);
      this.hooks.onError?.(err);
      throw err;
    }
  }

  /**
   * Synthesize text or file-based prompt to speech and return as a Readable stream
   */
  public async synthesizeToStream(
    options: TtsOptions,
  ): Promise<{ stream: Readable; voice: string; language: string }> {
    const { buffer, voice, language } = await this.synthesizeToBuffer(options);
    const stream = Readable.from(buffer);
    this.logger.log('[TTS] Synthesize to stream success');
    return { stream, voice, language };
  }

  /**
   * Create a safe filename for the audio file
   */
  private createSafeFileName(base: string, voice: string): string {
    const sanitized = `${base}-${voice}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const truncated = sanitized.slice(0, 60);
    return `${truncated}.mp3`;
  }
}
