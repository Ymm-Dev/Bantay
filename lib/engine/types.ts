export type RiskLevel = 'safe' | 'suspicious' | 'scam';

export type Severity = 'low' | 'medium' | 'high' | 'critical';

export type SignalCategory = 'url' | 'text';

export interface Signal {
  id: string;
  category: SignalCategory;
  severity: Severity;
  weight: number;
  title: string;
  detail: string;
  evidence?: string;
}

export interface Verdict {
  score: number;
  level: RiskLevel;
  signals: Signal[];
  urls: string[];
  advice: string[];
}
