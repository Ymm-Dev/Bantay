'use client';

import { useState, type FormEvent } from 'react';
import { analyze } from '@/lib/engine';
import type { Verdict } from '@/lib/engine/types';
import { ExampleChips } from './ExampleChips';
import { ResultCard } from './ResultCard';
import { ScreenshotInput } from './ScreenshotInput';

const MAX_LENGTH = 1000;

type Tab = 'paste' | 'screenshot';

export function Scanner() {
  const [text, setText] = useState('');
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('paste');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = text.trim();
    if (!trimmed) {
      setVerdict(null);
      setError('Walang text na susuriin.');
      return;
    }

    setError(null);
    setVerdict(analyze(trimmed));
  }

  function handleExample(exampleText: string) {
    const trimmed = exampleText.slice(0, MAX_LENGTH);
    setText(trimmed);
    setError(null);
    setTab('paste');
    setVerdict(analyze(trimmed));
  }

  function handleScreenshotText(ocrText: string) {
    setText(ocrText.slice(0, MAX_LENGTH));
    setError(null);
    setTab('paste');
  }

  return (
    <div>
      <div className="border border-rule bg-white/60">
        <div className="flex border-b border-rule">
          <button
            type="button"
            onClick={() => setTab('paste')}
            aria-pressed={tab === 'paste'}
            className={`px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] ${
              tab === 'paste' ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
            }`}
          >
            I-paste
          </button>
          <button
            type="button"
            onClick={() => setTab('screenshot')}
            aria-pressed={tab === 'screenshot'}
            className={`px-5 py-3 font-mono text-xs uppercase tracking-[0.15em] ${
              tab === 'screenshot' ? 'bg-ink text-paper' : 'text-muted hover:text-ink'
            }`}
          >
            Screenshot
          </button>
        </div>

        {tab === 'screenshot' ? (
          <div className="p-5 sm:p-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
              I-upload ang screenshot ng text message
            </p>
            <ScreenshotInput onText={handleScreenshotText} />
            <p className="mt-3 text-xs text-muted">
              Babasahin sa browser mo ang larawan; hindi ito umaalis sa device mo.
            </p>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <label
            htmlFor="sms-text"
            className="font-mono text-xs uppercase tracking-[0.2em] text-muted"
          >
            I-paste ang text message
          </label>

          <textarea
            id="sms-text"
            value={text}
            onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
            maxLength={MAX_LENGTH}
            rows={5}
            placeholder="Halimbawa: BDO ALERT: Your account has been suspended. Verify here…"
            className="mt-3 w-full resize-y border border-rule bg-paper px-3 py-3 text-base leading-relaxed text-ink outline-none placeholder:text-muted/60 focus:border-ink"
          />

          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-xs text-muted">
              Hindi umaalis ang text mo sa browser mo.
            </p>
            <span className="font-mono text-[11px] text-muted">
              {text.length}/{MAX_LENGTH}
            </span>
          </div>

          {error ? (
            <p role="alert" className="mt-4 text-sm text-suspicious">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-4 w-full bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink/85 sm:w-auto"
          >
            Suriin
          </button>

          <ExampleChips onSelect={handleExample} />
        </form>
        )}
      </div>

      {verdict ? <ResultCard verdict={verdict} /> : null}
    </div>
  );
}
