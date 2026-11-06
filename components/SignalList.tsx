import type { Severity, Signal } from '@/lib/engine/types';

const ORDER: Severity[] = ['critical', 'high', 'medium', 'low'];

const DOT: Record<Severity, string> = {
  critical: 'bg-scam',
  high: 'bg-suspicious',
  medium: 'bg-suspicious/70',
  low: 'bg-muted/50',
};

const LABEL: Record<Severity, string> = {
  critical: 'Kritikal',
  high: 'Mataas',
  medium: 'Katamtaman',
  low: 'Mababa',
};

export function SignalList({ signals }: { signals: Signal[] }) {
  if (signals.length === 0) return null;

  return (
    <div className="mt-5 space-y-5 border-t border-rule pt-4">
      <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
        Mga nakita naming signal
      </h3>

      {ORDER.map((severity) => {
        const group = signals.filter((signal) => signal.severity === severity);
        if (group.length === 0) return null;

        return (
          <section key={severity} aria-label={`${LABEL[severity]} na signal`}>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              {LABEL[severity]}
            </p>
            <ul className="mt-2 space-y-3">
              {group.map((signal) => (
                <li
                  key={signal.id}
                  data-testid={`signal-${signal.id}`}
                  className="flex gap-3 text-sm leading-relaxed"
                >
                  <span
                    aria-hidden="true"
                    className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${DOT[severity]}`}
                  />
                  <div className="min-w-0">
                    <p className="text-ink">{signal.title}</p>
                    <p className="text-muted">{signal.detail}</p>
                    {signal.evidence ? (
                      <p className="mt-1 break-all font-mono text-[11px] text-muted/80">
                        {signal.evidence}
                      </p>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
