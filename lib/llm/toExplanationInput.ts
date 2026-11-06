import type { Verdict } from '../engine/types';
import type { ExplanationInput } from './types';

export function toExplanationInput(verdict: Verdict): ExplanationInput {
  return {
    level: verdict.level,
    score: verdict.score,
    signals: verdict.signals.map(({ id, title, detail, severity }) => ({
      id,
      title,
      detail,
      severity,
    })),
    advice: [...verdict.advice],
  };
}
