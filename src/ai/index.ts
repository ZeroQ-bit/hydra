import { AIProvider } from './AIProvider';
import { GeminiProvider } from './GeminiProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { envGet } from '../utils/env';
import winston from 'winston';

export * from './AIProvider';

export class AIFactory {
  public static getProvider(logger: winston.Logger, config?: Record<string, any>): AIProvider | null {
    const geminiKey = config?.['geminiApiKey'] || envGet('GEMINI_API_KEY');
    if (geminiKey) {
      return new GeminiProvider(geminiKey, logger);
    }

    const openAiKey = config?.['openAiApiKey'] || envGet('OPENAI_API_KEY');
    if (openAiKey) {
      return new OpenAIProvider(openAiKey, logger);
    }

    return null;
  }
}
