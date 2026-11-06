import { createHash } from 'node:crypto';
import type { ExplanationCache } from './cache';
import { ExplanationCache as Cache } from './cache';
import { createGroqProvider } from './groq';
import { buildTemplateExplanation } from './template';
import type { ExplanationInput, ExplanationProvider } from './types';
import { isSafeExplanation } from './validate';

export interface ExplainDeps {
  provider?: ExplanationProvider;
  cache?: ExplanationCache;
  timeoutMs?: number;
}

export interface ExplanationResult {
  text: string;
  source: 'llm' | 'template';
}

const DEFAULT_TIMEOUT_MS = 6000;
const defaultProvider = createGroqProvider();
const defaultCache = new Cache();

function canonicalize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(',')}]`;
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    return `{${keys
      .map((key) => `${JSON.stringify(key)}:${canonicalize(record[key])}`)
      .join(',')}}`;
  }

  return JSON.stringify(value);
}

function cacheKey(input: ExplanationInput, providerName: string): string {
  return createHash('sha256')
    .update(providerName)
    .update(canonicalize(input))
    .digest('hex');
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Explanation timed out')), ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

export async function explainVerdict(
  input: ExplanationInput,
  deps: ExplainDeps = {},
): Promise<ExplanationResult> {
  if (input.level === 'safe') {
    return { text: buildTemplateExplanation(input), source: 'template' };
  }

  const provider = deps.provider ?? defaultProvider;
  const cache = deps.cache ?? defaultCache;
  const key = cacheKey(input, provider.name);

  const cached = cache.get(key);
  if (cached) return { text: cached, source: 'llm' };

  try {
    const text = await withTimeout(
      provider.explain(input),
      deps.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );

    if (!isSafeExplanation(text)) {
      throw new Error('Unsafe explanation');
    }

    cache.set(key, text);
    return { text, source: 'llm' };
  } catch {
    return { text: buildTemplateExplanation(input), source: 'template' };
  }
}
