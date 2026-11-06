import type { RiskLevel } from './types';

const ADVICE: Record<RiskLevel, string[]> = {
  safe: [
    'Mukhang okay naman ang mensahe, pero mag-ingat pa rin.',
    'I-verify sa official app o hotline kung may duda.',
  ],
  suspicious: [
    'Huwag i-click ang link.',
    'I-verify sa official app o hotline ng bank o kumpanya.',
    'Huwag ibigay ang OTP, PIN, o password.',
  ],
  scam: [
    'Huwag i-click ang link.',
    'Huwag ibigay ang OTP, PIN, o password.',
    'I-block at i-report ang sender.',
    'I-report sa official hotline ng bank o sa DICT/NTC.',
  ],
};

export function buildAdvice(level: RiskLevel): string[] {
  return [...ADVICE[level]];
}
