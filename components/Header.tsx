import { SITE } from '@/lib/site';

export function Header() {
  return (
    <header className="border-b border-rule">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-5 py-5">
        <a
          href="/"
          className="font-mono text-sm uppercase tracking-[0.25em] text-ink"
          aria-label={`${SITE.name} home`}
        >
          bantay
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
