import type { Severity } from '../engine/types';
import type { ExplanationInput, ExplanationProvider } from './types';

const SEVERITY_RANK: Record<Severity, number> = {
  critical: 3,
  high: 2,
  medium: 1,
  low: 0,
};

export function buildTemplateExplanation(input: ExplanationInput): string {
  const top = [...input.signals].sort(
    (a, b) => SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity],
  )[0];

  const reason = top
    ? ` ${top.title}.`
    : ' Wala kaming nakitang malinaw na scam signal.';
  const action = input.advice[0] ?? 'Mag-ingat at i-verify sa official app.';

  return `Mukhang ${input.level} ito.${reason} ${action}`.trim();
}

export const templateProvider: ExplanationProvider = {
  name: 'template',
  async explain(input) {
    return buildTemplateExplanation(input);
  },
};
