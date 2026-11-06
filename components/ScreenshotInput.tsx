'use client';

import { useRef, useState, type DragEvent } from 'react';
import { extractTextFromImage } from '@/lib/ocr';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg'];

export function ScreenshotInput({ onText }: { onText: (text: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [working, setWorking] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file || working) return;

    if (!ACCEPTED.includes(file.type)) {
      setError('PNG o JPEG lang ang pwedeng i-upload.');
      return;
    }

    if (file.size > MAX_BYTES) {
      setError('Sobra ang laki ng file. Hanggang 5 MB lang.');
      return;
    }

    setError(null);
    setWorking(true);

    try {
      const text = await extractTextFromImage(file);
      if (!text) {
        setError('Walang mababasang text sa screenshot. Subukan ang mas malinaw na larawan.');
        return;
      }
      onText(text);
    } catch {
      setError('Hindi mabasa ang screenshot. Subukan ang paste.');
    } finally {
      setWorking(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    void handleFile(event.dataTransfer.files[0]);
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`mt-3 flex flex-col items-center justify-center border border-dashed px-5 py-10 text-center transition-colors ${
          dragging ? 'border-ink bg-ink/5' : 'border-rule bg-paper'
        }`}
      >
        <p className="text-sm text-ink">I-drop ang screenshot dito</p>
        <p className="mt-1 text-xs text-muted">PNG o JPEG, hanggang 5 MB.</p>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={working}
          className="mt-4 border border-ink bg-ink px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-paper transition-opacity hover:opacity-85 disabled:opacity-50"
        >
          Pumili ng larawan
        </button>

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="sr-only"
          onChange={(event) => void handleFile(event.target.files?.[0])}
        />

        {working ? (
          <p role="status" className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
            Binabasa ang screenshot…
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-suspicious">
          {error}
        </p>
      ) : null}
    </div>
  );
}
