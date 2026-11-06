import { ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import type { RiskLevel, Verdict } from '@/lib/engine/types';
import { buildTemplateExplanation } from '@/lib/llm/template';
import { toExplanationInput } from '@/lib/llm/toExplanationInput';
import { ScoreMeter } from './ScoreMeter';

const META: Record<
  RiskLevel,
  { Icon: typeof ShieldCheck; text: string; border: string; chip: string }
> = {
  safe: {
    Icon: ShieldCheck,
    text: 'text-safe',
    border: 'border-safe/40',
    chip: 'bg-safe/10',
  },
  suspicious: {
    Icon: ShieldAlert,
    text: 'text-suspicious',
    border: 'border-suspicious/40',
    chip: 'bg-suspicious/10',
  },
  scam: {
    Icon: ShieldX,
    text: 'text-scam',
    border: 'border-scam/40',
    chip: 'bg-scam/10',
  },
};

export function ResultCard({ verdict }: { verdict: Verdict }) {
  const meta = META[verdict.level];
  const Icon = meta.Icon;

  return (
    <section
      aria-live="polite"
      aria-label="Resulta ng pagsusuri"
      className={`mt-6 border ${meta.border} bg-white/70 p-5 sm:p-6`}
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className={`flex h-9 w-9 items-center justify-center ${meta.chip}`}>
          <Icon className={`h-5 w-5 ${meta.text}`} aria-hidden="true" />
        </span>
        <h2
          data-testid="verdict-level"
          className={`font-mono text-sm uppercase tracking-[0.25em] ${meta.text}`}
        >
          {verdict.level}
        </h2>
        <span className="ml-auto font-mono text-xs text-muted">{verdict.score}/100</span>
      </div>

      <ScoreMeter score={verdict.score} level={verdict.level} />

      <p data-testid="explanation" className="mt-5 text-base leading-relaxed text-ink">
        {buildTemplateExplanation(toExplanationInput(verdict))}
      </p>

      <ul className="mt-5 space-y-2 border-t border-rule pt-4">
        {verdict.advice.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
            <span aria-hidden="true" className="font-mono text-ink">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
