import { Cacheable, CacheableMemory, Keyv } from 'cacheable';
import winston from 'winston';
import { AIFactory } from '../ai';
import { Context, Format, Meta, UrlResult } from '../types';
import { createKeyvSqlite, envGet, isExtractorDisabled } from '../utils';
import { Extractor } from './Extractor';

export class ExtractorRegistry {
  private readonly AI_HTML_SNIPPET_MAX_LENGTH = 40000;

  private readonly logger: winston.Logger;
  private readonly extractors: Extractor[];

  private readonly urlResultCache: Cacheable;
  private readonly lazyUrlResultCache: Cacheable;

  public constructor(logger: winston.Logger, extractors: Extractor[]) {
    this.logger = logger;
    this.extractors = extractors;

    this.urlResultCache = new Cacheable({
      nonBlocking: true,
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
      secondary: createKeyvSqlite('extractor-cache'),
      stats: true,
    });

    this.lazyUrlResultCache = new Cacheable({
      nonBlocking: true,
      primary: new Keyv({ store: new CacheableMemory({ lruSize: 1024 }) }),
      secondary: createKeyvSqlite('extractor-lazy-cache'),
      stats: true,
    });
  }

  public stats() {
    return {
      urlResultCache: this.urlResultCache.stats,
      lazyUrlResultCache: this.lazyUrlResultCache.stats,
    };
  };

  public async handle(ctx: Context, url: URL, meta?: Meta, allowLazy?: boolean): Promise<UrlResult[]> {
    const extractor = this.extractors.find(extractor => !isExtractorDisabled(ctx.config, extractor) && extractor.supports(ctx, url));
    if (!extractor) {
      return [];
    }

    const normalizedUrl = extractor.normalize(url);
    const cacheKey = this.determineCacheKey(ctx, extractor, normalizedUrl);

    const storedDataRaw = await this.urlResultCache.getRaw<UrlResult[]>(cacheKey);
    const expires = storedDataRaw?.expires;
    if (storedDataRaw && expires) {
      const ttl = expires - Date.now();

      /* istanbul ignore if */
      if (ttl > 0) {
        return (storedDataRaw.value as UrlResult[]).map(urlResult => ({ ...urlResult, ttl, url: new URL(urlResult.url) }));
      }
    }

    const lazyUrlResults = await this.lazyUrlResultCache.get<UrlResult[]>(normalizedUrl.href) ?? [];

    /* istanbul ignore next */
    if (
      lazyUrlResults.length && allowLazy && !extractor.viaMediaFlowProxy
      && lazyUrlResults.every(urlResult => urlResult.format !== Format.hls) // related to Android issues, e.g. https://github.com/Stremio/stremio-bugs/issues/1574 or https://github.com/Stremio/stremio-bugs/issues/1579
    ) {
      // generate lazy extract urls
      return lazyUrlResults.map((urlResult, index) => {
        const extractUrl = new URL(`${envGet('PROTOCOL')}:${envGet('HOST')}/extract/`);

        extractUrl.searchParams.set('index', `${index}`);
        extractUrl.searchParams.set('url', url.href);

        return { ...urlResult, url: extractUrl };
      });
    }

    this.logger.info(`Extract ${url} using ${extractor.id} extractor`, ctx);

    const mergedMeta: Meta = { ...meta, ...lazyUrlResults[0]?.meta };
    let urlResults = await extractor.extract(ctx, normalizedUrl, { extractorId: extractor.id, ...mergedMeta });

    const aiProvider = AIFactory.getProvider(this.logger, ctx.config);
    if (urlResults.length === 0 && aiProvider) {
      this.logger.info(`[AI Tracker] ${extractor.label} returned 0 results. Firing AI fallback...`, ctx);
      try {
        let htmlSnippet = '';

        try {
          htmlSnippet = this.toAiHtmlSnippet(await extractor.fetchAiHtml(ctx, normalizedUrl, {
            headers: {
              ...(mergedMeta.referer && { Referer: mergedMeta.referer }),
            },
          }));
        } catch (error) {
          this.logger.info(`[AI Tracker] Could not fetch HTML for ${normalizedUrl.href} before AI fallback: ${error}`, ctx);
        }

        const aiUrl = await aiProvider.extractVideoUrl(htmlSnippet, normalizedUrl.href);
        if (aiUrl) {
          urlResults = [{
            url: new URL(aiUrl),
            format: Format.unknown,
            isExternal: false,
            label: `${extractor.label} (AI Healed)`,
            ttl: extractor.ttl,
            meta: mergedMeta,
          }];
        }
      } catch {
        this.logger.error(`[AI Tracker] AI extraction failed for ${normalizedUrl.href}`, ctx);
      }
    }

    if (!Object.keys(mergedMeta).length || urlResults.some(urlResult => urlResult.error)) {
      await this.urlResultCache.delete(cacheKey);
      await this.lazyUrlResultCache.delete(normalizedUrl.href);

      return urlResults;
    }

    const ttl = urlResults.length ? extractor.ttl : 43200000; // 12h

    await this.urlResultCache.set<UrlResult[]>(cacheKey, urlResults, ttl);

    if (extractor.id !== 'external') {
      await this.lazyUrlResultCache.set<UrlResult[]>(normalizedUrl.href, urlResults, 2629800000); // 1 month
    }

    return urlResults;
  };

  private determineCacheKey(ctx: Context, extractor: Extractor, url: URL): string {
    let suffix = '';
    if (extractor.viaMediaFlowProxy) {
      suffix += `_${ctx.config.mediaFlowProxyUrl}`;
    }
    if (extractor.cacheVersion) {
      suffix += `_${extractor.cacheVersion}`;
    }

    return `${extractor.id}_${url}${suffix}`;
  }

  private toAiHtmlSnippet(html: string): string {
    if (html.length <= this.AI_HTML_SNIPPET_MAX_LENGTH) {
      return html;
    }

    const sideLength = Math.floor(this.AI_HTML_SNIPPET_MAX_LENGTH / 2);
    return [
      html.slice(0, sideLength),
      '\n<!-- hydra-ai-truncated -->\n',
      html.slice(-sideLength),
    ].join('');
  }
}
