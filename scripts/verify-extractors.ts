import winston from 'winston';
import axios from 'axios';
import { createExtractors } from '../src/extractor';
import { Fetcher } from '../src/utils/Fetcher';
import { createTestContext } from '../src/test';

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ],
});

const axiosInstance = axios.create({
  timeout: 10000,
});

const fetcher = new Fetcher(axiosInstance, logger);
const ctx = createTestContext();

async function runHealthCheck() {
  logger.info('Starting Automated Extractor Verification...');

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  const extractors = createExtractors(fetcher);
  for (const extractor of extractors) {
    const urls = extractor.testUrls || [];

    if (urls.length === 0) {
      skippedCount++;
      logger.info(`[SKIP] Extractor '${extractor.label}' has no testUrls defined.`);
      continue;
    }

    for (const url of urls) {
      logger.info(`[TEST] Extractor '${extractor.label}' checking URL: ${url}`);
      try {
        const results = await extractor.extract(ctx, new URL(url), {
          title: 'Test',
          releaseYear: 2024,
          imdbId: 'tt12345678',
        } as any);

        if (results && results.length > 0 && results.some(r => r.url)) {
          logger.info(`[PASS] Extractor '${extractor.label}' returned ${results.length} valid results.`);
          successCount++;
        } else {
          logger.warn(`[WARN] Extractor '${extractor.label}' returned no valid streams.`);
          failCount++;
        }
      } catch (error) {
        logger.error(`[FAIL] Extractor '${extractor.label}' threw an error: ${(error as any).message}`);
        failCount++;
      }
    }
  }

  logger.info('------------------------------------');
  logger.info(`Verification Complete. PASS: ${successCount} | FAIL: ${failCount} | SKIP: ${skippedCount}`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runHealthCheck().catch(err => {
  logger.error(`Critical error during health check: ${err.message}`);
  process.exit(1);
});