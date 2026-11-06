const CONTRACT = [
  'Nananatili sa browser mo ang text at larawan. Hindi naka-upload ang orihinal.',
  'Ang mga nakitang signal lang — hindi ang mensahe o link — ang ipinapadala para sa paliwanag.',
  'Walang account, walang database, at walang logging ng nilalaman ng mensahe.',
  'Puwedeng gamitin nang walang API key; template explanation ang lalabas.',
];

export function PrivacyNote() {
  return (
    <section className="border-y border-rule bg-white/50">
      <div className="mx-auto grid w-full max-w-3xl gap-6 px-5 py-14 sm:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
            privacy
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink">
            Hindi kailangan ang tiwala. Ito ang kontrata.
          </h2>
        </div>
        <ul className="space-y-3">
          {CONTRACT.map((item) => (
            <li
              key={item}
              className="flex gap-3 border-l-2 border-ink/20 pl-4 text-sm leading-relaxed text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
