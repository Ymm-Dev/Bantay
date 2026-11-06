import { SITE } from '@/lib/site';

export function Footer() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-5 py-8 text-xs leading-relaxed text-muted sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md space-y-2">
          <p>
            Hindi ito official na tool ng kahit anong bank o ahensya ng gobyerno. Gamitin
            ang sariling judgement.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em]">
            {SITE.name} · rules engine + Taglish explanation
          </p>
        </div>
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink underline-offset-4 hover:underline"
        >
          GitHub ↗
        </a>
      </div>
    </footer>
  );
}
