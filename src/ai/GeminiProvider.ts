import { GoogleGenerativeAI } from '@google/generative-ai';
import winston from 'winston';
import { AIProvider } from './AIProvider';
import { getGeminiModel } from './geminiModel';

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;
  private logger: winston.Logger;

  public constructor(apiKey: string, logger: winston.Logger) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.logger = logger;
  }

  public async extractVideoUrl(htmlSnippet: string, sourceUrl: string): Promise<string | null> {
    try {
      const modelName = getGeminiModel();
      const model = this.client.getGenerativeModel({ model: modelName });
      const prompt = `You are a web scraper assistant. Find the main video stream URL (MP4, M3U8, HLS) hidden in this HTML from a streaming site located at ${sourceUrl}. Return ONLY the direct video URL and nothing else. If there is no video URL found, reply with "NONE".\n\nHTML:\n${htmlSnippet}`;

      this.logger.debug(`[AI] Gemini extracting from ${sourceUrl} with model ${modelName} (length: ${htmlSnippet.length})`);
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().trim();

      if (text !== 'NONE' && text.startsWith('http')) {
        return text;
      }
      return null;
    } catch (err) {
      this.logger.error(`[AI] Gemini error for ${sourceUrl}: ${(err as Error).message}`);
      return null;
    }
  }
}
