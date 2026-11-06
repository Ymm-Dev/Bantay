import type { RiskLevel, Signal } from '../engine/types';

export interface ExplanationInput {
  level: RiskLevel;
  score: number;
  signals: Array<Pick<Signal, 'id' | 'title' | 'detail' | 'severity'>>;
  advice: string[];
}

export interface ExplanationProvider {
  name: string;
  explain(input: ExplanationInput): Promise<string>;
}
