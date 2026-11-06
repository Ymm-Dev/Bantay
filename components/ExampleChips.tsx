import { EXAMPLES } from '@/lib/examples';

export function ExampleChips({ onSelect }: { onSelect: (text: string) => void }) {
  return (
    <div className="mt-5 border-t border-rule pt-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        Mga halimbawa
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((example) => (
          <button
            key={example.id}
            type="button"
            onClick={() => onSelect(example.text)}
            className="border border-rule bg-paper px-3 py-1.5 text-left text-xs leading-snug text-muted transition-colors hover:border-ink hover:text-ink"
          >
            {example.label}
          </button>
        ))}
      </div>
    </div>
  );
}
