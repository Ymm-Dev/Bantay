import type { ExplanationInput } from './types';

export interface ExplanationResponse {
  explanation: string;
  source: 'llm' | 'template';
}

const TIMEOUT_MS = 8000;

export async function requestExplanation(
  input: ExplanationInput,
): Promise<ExplanationResponse | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data: unknown = await response.json();
    if (!data || typeof data !== 'object') return null;

    const candidate = data as { explanation?: unknown; source?: unknown };
    if (typeof candidate.explanation !== 'string' || !candidate.explanation.trim()) {
      return null;
    }

    return {
      explanation: candidate.explanation,
      source: candidate.source === 'llm' ? 'llm' : 'template',
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
