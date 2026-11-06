import { buildAdvice } from './advice';
import { scoreSignals } from './score';
import { detectCombinationSignals } from './signals/combinations';
import { detectTextSignals } from './signals/text';
import { detectUrlSignals } from './signals/url';
import type { Verdict } from './types';
import { extractUrls } from './urls';

export function analyze(raw: string): Verdict {
  const urlSignals = detectUrlSignals(raw);
  const textSignals = detectTextSignals(raw);
  const baseSignals = [...urlSignals, ...textSignals];
  const signals = [...baseSignals, ...detectCombinationSignals(baseSignals)];

  const { score, level } = scoreSignals(signals);

  return {
    score,
    level,
    signals,
    urls: extractUrls(raw),
    advice: buildAdvice(level),
  };
}
