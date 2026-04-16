import OpenAI from 'openai';
import { AIProvider } from './AIProvider';
import winston from 'winston';

export class OpenAIProvider implements AIProvider {
  private client: OpenAI;
  private logger: winston.Logger;

  constructor(apiKey: string, logger: winston.Logger) {
    this.client = new OpenAI({ apiKey });
    this.logger = logger;
  }

  public async extractVideoUrl(htmlSnippet: string, sourceUrl: string): Promise<string | null> {
    try {
      this.logger.debug(`[AI] OpenAI extracting from ${sourceUrl} (length: ${htmlSnippet.length})`);
      
      const completion = await this.client.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an advanced web scraper assistant.' },
          { role: 'user', content: `Find the main video stream URL (MP4, M3U8, HLS) hidden in this HTML from a streaming site located at ${sourceUrl}. Return ONLY the direct video URL and nothing else. If there is no video URL found, reply with "NONE".\n\nHTML:\n${htmlSnippet}` }
        ],
        temperature: 0,
      });

      const text = completion.choices[0]?.message?.content?.trim();
      
      if (text && text !== 'NONE' && text.startsWith('http')) {
        return text;
      }
      return null;
    } catch (err) {
      this.logger.error(`[AI] OpenAI error for ${sourceUrl}: ${(err as Error).message}`);
      return null;
    }
  }
}
