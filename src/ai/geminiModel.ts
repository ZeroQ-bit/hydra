import { envGet } from '../utils/env';

export const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export const getGeminiModel = (): string => envGet('GEMINI_MODEL') || DEFAULT_GEMINI_MODEL;
