import { SITE } from '@/lib/site';
import { LogoMark } from './LogoMark';

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <a
          href="/"
          className="flex items-center gap-2.5 font-mono text-sm uppercase tracking-[0.25em] text-ink"
          aria-label={`${SITE.name} home`}
        >
          <LogoMark className="h-5 w-5 shrink-0" />
          <span>bantay</span>
        </a>
        <a
          href={SITE.github}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-xs uppercase tracking-[0.15em] text-muted underline-offset-4 hover:text-ink hover:underline"
        >
          GitHub ↗
        </a>
      </div>
    </header>
  );
}
