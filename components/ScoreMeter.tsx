import type { RiskLevel } from '@/lib/engine/types';

const BAR_COLOR: Record<RiskLevel, string> = {
  safe: 'bg-safe',
  suspicious: 'bg-suspicious',
  scam: 'bg-scam',
};

export function ScoreMeter({ score, level }: { score: number; level: RiskLevel }) {
  return (
    <div
      role="meter"
      aria-label="Risk score"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={score}
      className="mt-4 h-2 w-full overflow-hidden bg-rule/50"
    >
      <div
        className={`h-full transition-[width] duration-500 ${BAR_COLOR[level]}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
