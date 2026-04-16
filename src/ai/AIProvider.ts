export interface AIProvider {
  /**
   * Attempts to extract a hidden or obfuscated video URL from HTML text or DOM snippet.
   */
  extractVideoUrl(htmlSnippet: string, sourceUrl: string): Promise<string | null>;
}
