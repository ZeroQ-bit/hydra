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
      if (envGet('GEMINI_API_KEY') === geminiKey) {
        logger.info('[AI] Loaded Default Gemini API integration');
      } else {
        logger.info('[AI] Loaded User Gemini API integration');
      }
      return new GeminiProvider(geminiKey, logger);
    }

    const openAiKey = config?.['openAiApiKey'] || envGet('OPENAI_API_KEY');
    if (openAiKey) {
      if (envGet('OPENAI_API_KEY') === openAiKey) {
        logger.info('[AI] Loaded Default OpenAI API integration');
      } else {
        logger.info('[AI] Loaded User OpenAI API integration');
      }
      return new OpenAIProvider(openAiKey, logger);
    }

    return null;
  }
}
