# Bantay

**Bantay** checks a Philippine SMS for scam signals and explains the verdict in
Taglish. Paste a message, or upload a screenshot, and get a clear verdict with the
reasons and next steps.

> Hindi ito official na tool ng kahit anong bank o ahensya ng gobyerno. Gamitin ang
> sariling judgement.

Live URL: [https://bantay-mu.vercel.app/](https://bantay-mu.vercel.app/)

## Why this exists

Scam texts in the Philippines often imitate banks, e-wallets, couriers, and government
agencies. The hard part is not detecting a single bad word — it is explaining *why* a
message is dangerous without scaring people or leaking their data.

Bantay is deliberately split in two:

- A **deterministic rules engine** reads the message, extracts signals, and decides the
  verdict. It is pure TypeScript, runs in the browser, and is covered by a frozen
  40-message fixture suite.
- An **LLM writes the explanation only**. It receives a stripped summary of the
  findings — never the raw message, URLs, or signal evidence — and its output is
  validated before it can reach the screen. If the model fails, the template
  explanation remains.

`safe` verdicts never call the model at all.

## Architecture

```text
SMS text ──► engine (pure, deterministic)
             ├─ URL signals: lookalike brand, punycode, IP, shortener, TLD, HTTPS
             ├─ text signals: OTP/credential requests, prize, money, urgency, threat
             ├─ combination signals: job scam, advance fee, agency + money
             └─ scoring: 0–24 safe · 25–59 suspicious · 60–100 scam
                        (any critical signal floors the score at 60)
                                  │
                                  ▼
                       Verdict + advice (rendered immediately)
                                  │
             ExplanationInput only (no text · no URLs · no evidence)
                                  ▼
                    /api/explain ─► Groq (optional) ─► validator
                                  │                      │
                                  └──── fallback ◄───────┘
                                     template explanation
```

The result card shows the template explanation immediately, then crossfades to the
model's explanation if one arrives and passes validation. There is no spinner and no
incomplete state.

## Privacy contract

- The message and screenshot stay in the browser. OCR runs locally with Tesseract.js.
- Only the structured findings (`ExplanationInput`) are sent to `/api/explain`.
- No accounts, no database, no logging of message content.
- Without `GROQ_API_KEY`, the app still works end-to-end using template explanations.

## Signal catalogue

| Family | Examples |
| --- | --- |
| URL | lookalike brand, brand only in subdomain/path, punycode or homoglyph, IP literal, shortener, suspicious TLD, plain HTTP, excessive subdomains |
| Credentials | OTP/PIN sharing request, password or CVV request |
| Social engineering | prize/raffle, money or load request, agency impersonation, account-suspension threat, urgency (English and Taglish) |
| Combinations | job offer + off-platform contact, prize + payment, agency + money |

Weights and severities live in `lib/engine/signals/`. The fixture suite in
`lib/engine/__fixtures__/messages.ts` is the regression contract; tune the lexicons,
not the fixtures.

## Run locally

```bash
npm install       # also fetches OCR assets into public/tesseract (gitignored)
npm run dev       # http://localhost:3000
```

Optional model explanations:

```bash
cp .env.example .env.local
# set GROQ_API_KEY=...
```

Precompute the curated example explanations (used by the example chips so demos never
hit the API):

```bash
npm run precompute
```

## Tests

```bash
npm run test:run        # Vitest: engine, fixtures, LLM, API route, components
npm run test:e2e        # Playwright (install Chromium once: npx playwright install chromium)
npm run build           # production build + type check
```

The engine suite covers every signal and combination rule, plus 40 frozen messages
(20 legitimate, 20 scams). The API suite covers validation, unknown fields, oversized
signal lists, and rate limiting. Component tests cover the template → model crossfade
and signal detail.

## Deploy

1. Push the repo to GitHub.
2. Import it into Vercel (Hobby plan).
3. Add `GROQ_API_KEY` as an environment variable if you want model explanations.
4. Deploy. Vercel runs the build; `postinstall` prepares the Tesseract assets.

The in-memory rate limiter (10 requests/minute per IP) is intentionally best-effort for
a portfolio deploy. Production would replace it with a shared store and a bot check.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · Vitest ·
Testing Library · Playwright · `tldts` · `tesseract.js` · Vercel AI SDK + Groq · Zod ·
Lucide.
