import type { RiskLevel, Signal } from './types';

const CRITICAL_FLOOR = 60;

export function scoreSignals(signals: Signal[]): { score: number; level: RiskLevel } {
  const total = signals.reduce((sum, signal) => sum + signal.weight, 0);

  let score = Math.min(100, Math.max(0, total));

  if (signals.some((signal) => signal.severity === 'critical')) {
    score = Math.max(score, CRITICAL_FLOOR);
  }

  const level: RiskLevel = score >= 60 ? 'scam' : score >= 25 ? 'suspicious' : 'safe';

  return { score, level };
}
