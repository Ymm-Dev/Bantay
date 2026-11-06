'use client';

import { useEffect, useState } from 'react';
import { Check, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';
import type { RiskLevel, Verdict } from '@/lib/engine/types';
import { requestExplanation } from '@/lib/llm/client';
import { buildTemplateExplanation } from '@/lib/llm/template';
import { toExplanationInput } from '@/lib/llm/toExplanationInput';
import { ScoreMeter } from './ScoreMeter';
import { SignalList } from './SignalList';

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

const CROSSFADE_MS = 180;

export function ResultCard({
  verdict,
  initialExplanation,
}: {
  verdict: Verdict;
  initialExplanation?: string;
}) {
  const meta = META[verdict.level];
  const Icon = meta.Icon;

  const [explanation, setExplanation] = useState(
    initialExplanation ?? buildTemplateExplanation(toExplanationInput(verdict)),
  );
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const input = toExplanationInput(verdict);
    setExplanation(initialExplanation ?? buildTemplateExplanation(input));
    setVisible(true);

    if (initialExplanation || verdict.level === 'safe') return;

    let cancelled = false;
    let timer: number | undefined;

    requestExplanation(input).then((result) => {
      if (cancelled || !result || result.source !== 'llm') return;

      setVisible(false);
      timer = window.setTimeout(() => {
        if (cancelled) return;
        setExplanation(result.explanation);
        setVisible(true);
      }, CROSSFADE_MS);
    });

    return () => {
      cancelled = true;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [verdict, initialExplanation]);

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

      <div className="mt-5 min-h-[6rem]">
        <p
          data-testid="explanation"
          className={`text-base leading-relaxed text-ink transition-opacity duration-300 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {explanation}
        </p>
      </div>

      <SignalList signals={verdict.signals} />

      <ul className="mt-5 space-y-2 border-t border-rule pt-4">
        {verdict.advice.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-relaxed text-muted">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
