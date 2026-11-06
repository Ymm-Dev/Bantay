const STEPS = [
  {
    number: '01',
    title: 'I-paste o screenshot',
    body: 'I-drop ang text message o larawan ng SMS. Nananatili sa browser mo ang orihinal.',
  },
  {
    number: '02',
    title: 'Sinuri ng rules engine',
    body: 'Tinitignan ang link, brand imitation, urgency, at paghingi ng OTP o password.',
  },
  {
    number: '03',
    title: 'Paliwanag sa Taglish',
    body: 'Malinaw na dahilan at susunod na hakbang — hindi lang basta red o green.',
  },
];

const FAMILIES = [
  ['Link', 'Kahina-hinalang domain, shortener, IP address, o pekeng brand sa URL.'],
  ['Brand imitation', 'Domain na kahawig ng BDO, GCash, Maya, at iba pang kilalang pangalan.'],
  ['Urgency at threat', 'Pananakot na i-deactivate, "within 24 hours", o "act now".'],
  ['OTP at credentials', 'Paghingi ng OTP, PIN, password, o card details — red flag ito.'],
];

export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-3xl px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted">
        paano gumagana
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        Desisyon muna, paliwanag pagkatapos.
      </h2>

      <ol className="mt-8 grid gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li key={step.number} className="border-t border-rule pt-4">
            <span className="font-mono text-xs text-muted">{step.number}</span>
            <h3 className="mt-2 text-base font-semibold text-ink">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 border border-rule bg-white/60 p-5 sm:p-6">
        <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
          Mga signal na tinitignan
        </h3>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {FAMILIES.map(([name, description]) => (
            <div key={name}>
              <dt className="text-sm font-semibold text-ink">{name}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-muted">{description}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-5 border-t border-rule pt-4 text-xs leading-relaxed text-muted">
          Ang rules engine ang nagde-desisyon. Ang LLM ay nagsusulat lang ng paliwanag mula
          sa mga nakitang signal — hindi nito nakikita ang orihinal na mensahe o link.
        </p>
      </div>
    </section>
  );
}
