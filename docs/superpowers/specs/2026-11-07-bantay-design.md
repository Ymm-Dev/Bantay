# Bantay — Scam Text Checker · Design

Date: 2026-11-07
Status: revised after builder review — awaiting human approval
Working name: **Bantay** (Filipino: "guard"). Marketing line: *"Bantay sa mga scam text."*

---

## 1. Intent and why

A portfolio piece that proves three things at once: security engineering (a real,
auditable detection engine), product judgement (a narrow tool people actually need),
and AI integration done responsibly (the model explains, it does not decide).

Primary audience: hiring managers and recruiters, PH and remote. Secondary audience:
real users, once hardened.

The differentiator is the architecture story: **deterministic verdict, LLM explanation.**
Almost every AI portfolio project is a prompt wrapper. This one argues — correctly —
that a security verdict should not be delegated to a language model, and that the model
is best used to translate machine findings into human language.

Success for the portfolio version: a recruiter pastes a message and instantly sees a
credible verdict with its signals; a readable explanation is there immediately (template)
and is upgraded by the LLM when it arrives. The "How it works" section makes them want
to ask about it in the interview.

---

## 2. What it is

One mobile-first page.

- Paste an SMS, or drop a screenshot (OCR happens in the browser, text is editable before analysis).
- Get a verdict: **Safe / Suspicious / Scam**, a 0–100 score, the exact signals that
  produced it, a 2–3 sentence Taglish explanation, and what to do next.
- Six or seven curated examples are one tap away, including the subtle pair:
  a legitimate OTP notice vs. a message asking you to *share* your OTP.

No accounts. No history. No database.

---

## 3. Goals, non-goals, anti-goals

**Goals**
- G1 Correctly separate obvious scams from legitimate bank / GCash / delivery messages
  across a frozen fixture set of ~40 messages.
- G2 Every verdict is explainable: each point of the score traces to a named signal.
- G3 The product still works — completely — with the LLM unavailable.
- G4 Mobile-first, LCP < 2s on 4G, Lighthouse ≥ 90.
- G5 Runs entirely on free tiers; demoing costs nothing.

**Non-goals (v1)**
- Accounts, history, saved scans, a database.
- Browser extension, SMS forwarding, native app.
- Machine-learned classifier.
- Multilingual UI beyond Taglish/English copy.
- Fetching or scanning live URLs (SSRF risk, dead links, slow).

**Anti-goals**
- Claiming certainty, or implying endorsement by BSP / DICT / NTC / any bank.
- Storing or logging message content.
- Requiring sign-up to use it.
- Shipping without engine tests.

---

## 4. Constraints

- Next.js 16 (App Router), TypeScript, Tailwind v4 — matches the existing ChikAI stack.
- Free hosting (Vercel Hobby) and a free LLM tier (Groq, already in use).
- API key server-side only.
- Privacy contract: message text never leaves the browser; only extracted signals
  are sent to the LLM, with hostnames and evidence stripped. This is a feature, not a
  limitation — say it in the UI.

---

## 5. Approaches considered

| # | Approach | Trade-off | Verdict |
|---|---|---|---|
| 1 | **Rules engine decides, LLM explains** | Hand-tuned weights; may miss novel scams | **Chosen** — free, instant, offline-capable, auditable, strong story |
| 2 | LLM-first classifier | Burns quota per scan, inconsistent, black box, weak security story | Rejected |
| 3 | Local ML classifier + LLM explainer | Most technically impressive, but dataset/labelling is half the project | Rejected for v1; the engine interface leaves room to add it later |

Chosen because #1 is the only option where the demo survives a quota outage, costs
nothing, and can be defended in an interview. The engine sits behind one interface
(`analyze(text): Verdict`), so #3 can replace its internals later without touching the UI.

---

## 6. Architecture

```
Input
 ├─ pasted text
 └─ screenshot → Tesseract.js (client-side) → editable text
                    │
                    ▼
        Normalize (lowercase, strip accents, unicode NFKC)
                    │
                    ▼
   ┌─────────────────────────────────────────┐
   │  lib/engine  (pure TS, zero I/O)        │
   │  URL signals · Text signals · Scoring   │
   └─────────────────────────────────────────┘
                    │
                    ▼
              Verdict { score, level, signals, advice }
                    │
        ┌───────────┴────────────┐
        ▼                        ▼
  Render immediately      POST /api/explain
  + template explanation  (signals only, no text/URLs/evidence)
                                 │
                        ┌────────┴────────┐
                        ▼                 ▼
                   Groq (gpt-oss)    Template fallback
                        │                 │
                        └────────┬────────┘
                                 ▼
                        Taglish explanation
                        (validated, cached by hash)
```

Module boundaries:
- `lib/engine/*` — pure functions, no network, no framework. Fully unit-testable.
- `lib/llm/*` — `ExplanationProvider` interface, `groq.ts`, `template.ts`, `explain.ts` (orchestration + cache + output validation).
- `app/api/explain/route.ts` — thin HTTP adapter: validate, rate-limit, call provider, return text.
- `components/*` — presentation only.

This is also the production seam: later work adds services around these modules,
it does not rewrite them.

---

## 7. Detection engine

### Types

```ts
export type RiskLevel = 'safe' | 'suspicious' | 'scam';
export type Severity = 'low' | 'medium' | 'high' | 'critical';

export interface Signal {
  id: string;                 // e.g. 'url.lookalike_brand'
  category: 'url' | 'text';
  severity: Severity;
  weight: number;             // contribution to score
  title: string;              // short human label
  detail: string;             // why it matters, one sentence, generic (no input text)
  evidence?: string;          // matched substring / hostname — never sent to the LLM
}

export interface Verdict {
  score: number;              // 0–100
  level: RiskLevel;
  signals: Signal[];
  urls: string[];
  advice: string[];           // 2–4 concrete next steps
}
```

### Signal catalogue

**URL signals**

| id | Detects | Weight | Severity |
|---|---|---|---|
| `url.lookalike_brand` | Brand alias is in a non-official registrable domain (see algorithm) | 35 | critical |
| `url.brand_in_subdomain` | Brand appears in subdomain/path but not in the registrable domain | 25 | high |
| `url.punycode` | `xn--` host, mixed-script homoglyphs | 30 | high |
| `url.ip_literal` | Host is an IP address | 25 | high |
| `url.shortener` | bit.ly, tinyurl, t.co, cutt.ly, rebrand.ly, is.gd, etc. | 15 | medium |
| `url.suspicious_tld` | `.top .xyz .click .shop .live .buzz .icu .rest` | 15 | medium |
| `url.no_https` | Plain `http://` | 5 | low |
| `url.excessive_subdomains` | ≥ 4 labels before the registrable domain | 8 | low |
| `url.long_random_path` | Path with 20+ chars of high-entropy gibberish | 5 | low |
| `url.known_brand` | Every extracted URL is on the official allowlist (applied at most once) | −10 | safe |

**Text signals**

| id | Detects | Weight | Severity |
|---|---|---|---|
| `text.otp_request` | Asks the reader to *share/send* an OTP, PIN, or verification code | 30 | critical |
| `text.credential_request` | Asks for password, account number, CVV, full card details | 30 | critical |
| `text.prize` | "Congratulations / winner / raffle / claim your prize" | 25 | high |
| `text.money_request` | "Send load / cash in / transfer / processing fee" | 20 | high |
| `text.impersonation` | Names a bank/agency + a verification demand | 20 | high |
| `text.threat` | "Account suspended / deactivated / blocked / legal action" | 15 | medium |
| `text.job_offer` | "Earn ₱X daily / no experience / WFH" | 18 | medium |
| `text.urgency` | "Within 24 hours / final notice / last chance / act now" | 12 | medium |
| `text.contact_offsite` | Pushes to Viber / Telegram / WhatsApp | 8 | low |
| `text.taglish_urgency` | "Agad / ngayon na / bilisan / huling araw / i-click" | 6 | low |

**Combination signals** (added so categories separate honestly):

| id | Fires when | Weight |
|---|---|---|
| `text.job_scam_pattern` | `text.job_offer` AND `text.contact_offsite` | +15 |
| `text.advance_fee_pattern` | `text.prize` AND `text.money_request` | +10 |

Important nuance the fixtures must prove: a legitimate OTP *notification*
("Your OTP is 123456. Never share it.") must score **safe**, while a message asking
you to *send* your OTP must be critical. Same words, opposite verdict.

### Brand matching algorithm (critical signal, defined precisely)

1. Extract the registrable domain with `tldts` (e.g. `bdo-online.top` → `bdo-online.top`, SLD `bdo-online`).
2. Tokenize the SLD on non-alphanumerics: `["bdo", "online"]`.
3. Drop affix tokens: `secure, login, verify, online, account, update, my, ph, official, support, alert, service, app, web, portal, signin, auth, help`.
4. For each brand alias (`bdo`, `bpi`, `gcash`, `maya`, `metrobank`, `landbank`, `unionbank`, `pnb`, `rcbc`, `eastwest`, `shopee`, `lazada`, `grab`, `meralco`, `globe`, `smart`, `pldt`, …):
   - alias is one of the remaining tokens → **lookalike**
   - OR a token of length ≥ 4 is within Levenshtein distance 1 of the alias → **lookalike** (typos: `bdoo`, `gcashh`)
   - OR the alias is a substring of the joined SLD (e.g. `bdoph`, `gcashph`) → **lookalike**
5. If the registrable domain is on the official allowlist, do not emit a lookalike; emit `url.known_brand` instead.
6. `url.brand_in_subdomain` fires when an alias appears in a hostname label before the registrable domain or in the path, and the registrable SLD is not the brand.

Worked examples: `bdo-online.top` → token `bdo` → fires. `gcash-login.xyz` → token `gcash` → fires. `bdo.com.ph.evil.xyz` → `bdo` in subdomain only → `brand_in_subdomain`. `bdoo.com.ph` → distance 1 → fires. `bdo.com.ph` → allowlisted → safe.

### Scoring

- Sum weights, clamp to 0–100.
- Thresholds: `0–24` safe · `25–59` suspicious · `60–100` scam.
- **Critical floor:** if any `critical` signal fires and the total is below 60, raise to 60.
- **Allowlist rule:** `url.known_brand` (−10) applies once per message and only when every
  extracted URL is official (or there are no URLs). It never suppresses a critical signal
  or the critical floor.
- Every signal is returned, including allowlist ones (shown as "good sign").

### URL parsing

Use `tldts` for correct registrable-domain extraction rather than hand-rolling a
public-suffix list. Normalize with `new URL`, handle missing scheme, decode punycode
for display, never fetch.

### Fixtures

~40 messages in `lib/engine/__fixtures__/messages.ts`, each with `text`, `expectedLevel`,
`mustInclude` signal ids, and `mustNotInclude`. Doubles as the test suite and the
curated examples in the UI. Coverage: legitimate bank debit alerts, GCash receipts,
OTP notices, delivery updates, Meralco bills; and phishing, raffle, job, load,
parcel-fee, and impersonation scams.

**Provenance:** fixtures are written first, from publicly documented PH scam patterns
(BSP/GCash/bank advisories) and synthetic variations — no real personal data, no real
phone numbers. They are frozen before engine tuning so the tests are not self-graded.
If the engine must change to pass a fixture, the fixture is reviewed explicitly rather
than silently edited.

---

## 8. LLM layer

```ts
export interface ExplanationInput {
  level: RiskLevel;
  score: number;
  signals: Array<Pick<Signal, 'id' | 'title' | 'detail' | 'severity'>>;
  advice: string[];
}

export interface ExplanationProvider {
  name: string;
  explain(input: ExplanationInput): Promise<string>;
}
```

**The payload is the privacy boundary.** `evidence`, `urls`, and the message text are
never included. The API route accepts only `ExplanationInput`; it has no access to the
raw message. A unit test asserts this.

- **Provider:** Groq via the AI SDK (`@ai-sdk/groq`), model `openai/gpt-oss-20b`.
  Chosen for speed and the 1,000 requests/day free tier. Swappable through the interface.
- **When it is called:** only for `suspicious` and `scam` verdicts. `safe` verdicts always
  use the template — fewer tokens, and no need for a scary-sounding explanation.
- **Prompt:** friendly Taglish, 2–3 sentences, no markdown, may only restate the given
  signals and advice, and must end with one concrete action taken from `advice`.
- **Output validation (post-generation):** reject and fall back if the text contains a
  URL, an `http` token, a phone-number pattern, "click"/"i-click"/"pindutin", more than
  120 words, or fewer than one sentence. The model is never allowed to send the user to
  a channel that came from the message.
- **Timeout:** 6s with `AbortController`; any failure → `TemplateProvider`.
- **Cache:** SHA-256 of the canonical `ExplanationInput` → text, in-memory LRU
  (200 entries, 24h). Repeated demo clicks cost zero.
- **Examples are precomputed:** `scripts/precompute-explanations.ts` runs the provider
  for the curated examples once and writes `lib/examples.generated.ts`. Example chips
  render instantly and never hit the API.
- **Rate limit (v1):** 10 requests/min per IP, in-memory, best-effort. Accepted residual
  risk for a portfolio deploy; production replaces it with Upstash + Turnstile.

Template fallback example:
> "Mukhang scam ito. May link na kahawig ng BDO pero hindi opisyal, at hinihingi ang OTP mo.
> Huwag i-click ang link at huwag ibigay ang code. I-report sa official hotline ng bank mo."

---

## 9. UI

Direction: **"signal room"** — off-white paper, ink-black type, monospace labels,
risk colours used only for risk (green / amber / red). No purple gradients, no glass
cards. Confident and utilitarian, like a lab instrument.

Sections, top to bottom:

1. **Header** — wordmark, link to GitHub.
2. **Hero** — *"May duda ka ba sa text na 'yan?"* One-line explanation, no jargon.
3. **Scanner card** — two tabs: *I-paste* / *Screenshot*. Textarea (max 1,000 chars),
   primary button, privacy microcopy ("Hindi umaalis ang text mo sa browser mo"),
   example chips underneath.
4. **Result card** — verdict badge with icon + colour, score meter, signal list grouped
   by severity with evidence fragments, Taglish explanation in a distinct quote block,
   advice as a checklist, "I-check ang iba" reset.
5. **How it works** — three steps, plus the signal families in plain language. This is
   the section that sells the engineering.
6. **Privacy / trust** — the contract: text stays local, only findings are sent,
   nothing is logged, no account.
7. **Footer** — disclaimer (not an official bank/government tool, use judgement),
   GitHub, built-with.

**Explanation timing:** the template explanation renders with the verdict, immediately.
If the LLM response arrives and passes validation, it crossfades in. The block reserves
min-height so nothing shifts. No spinner; the page is never in an incomplete state.

Interaction states: empty, loading (shimmer + "Sinusuri…"), safe, suspicious, scam,
OCR running, OCR failed, LLM failed (silently stays on template). Results announced via
`aria-live="polite"`.

Mobile-first: single column to 640px, two-column result on desktop. Keyboard and
screen-reader pass before ship. Light theme only for v1.

---

## 10. Testing

- **Engine (primary):** Vitest, table-driven. One test per signal and per combination
  rule, plus every fixture asserting level and must/must-not-include signals. Fixtures
  are written first (red), then the engine.
- **LLM orchestration:** mocked provider; asserts `evidence`, URLs, and raw text never
  appear in the payload; timeout falls back; cache prevents a second call; output
  validator rejects unsafe text.
- **API route:** rejects anything that is not a valid `ExplanationInput`; validation
  (empty, too long); rate-limit response; 200 shape.
- **Components:** result card for all three verdicts, template→LLM crossfade, loading
  and error states.
- **E2E (Playwright, one spec):** paste a scam example → verdict renders; kill the
  provider → explanation still renders from the template.
- **Manual before ship:** iPhone SE viewport, screenshot OCR with a real SMS, Lighthouse,
  keyboard-only pass, API key removed.

---

## 11. Build order (high level — detailed plan next)

0. Scaffold Next.js 16 + TS + Tailwind v4 + Vitest; folder skeleton.
1. Write fixtures first, then the engine: types → lexicons/brand list → URL signals →
   brand algorithm → text signals → combinations → scoring → make fixtures green (TDD).
2. LLM layer: interface, template provider, Groq provider, output validator, cache,
   `/api/explain`, safety tests.
3. UI: scanner, examples, result card, states.
4. OCR: Tesseract.js behind a dynamic import, editable extraction.
5. Polish: How it works, privacy, footer, a11y, mobile, performance.
6. Precompute example explanations, README with architecture diagram, deploy,
   Lighthouse, final manual pass.

---

## 12. Production seam (what changes later)

Add, without touching the engine: Upstash cache + distributed rate limit, Cloudflare
Turnstile, Sentry/Logtail, privacy-safe analytics (counts only), URL reputation API,
sender-ID parsing, PWA offline mode, i18n, optional ML classifier behind `analyze()`.
The only file that changes meaningfully is `app/api/explain/route.ts` plus new infra modules.

---

## 13. Decisions I made (check these)

- **Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, lucide-react, no UI library.
- **Deps:** `tldts`, `tesseract.js` (dynamic import, `eng` pack only, self-hosted worker
  assets in `/public/tesseract`), `ai` + `@ai-sdk/groq`.
- **OCR language:** English only — SMS screenshots are mostly English/Taglish with
  English loanwords, and the `tgl` pack is weak and heavy. Extracted text is editable
  and must be confirmed before analysis.
- **Theme:** light "signal room"; no dark mode in v1.
- **Engine weights and thresholds** as tabled; the catalogue is a floor, not a ceiling —
  new signals must ship with tests.
- **No database, no accounts, no raw-text logging.**
- **LLM receives `ExplanationInput` only**, never the message, URLs, or evidence.
- **Safe verdicts never call the LLM.**
- **Examples are precomputed**, so the demo costs zero quota.
- **Name:** "Bantay" as working name.

## 14. Open questions for the human

1. Final name — keep **Bantay**, or something else (e.g. *Iwas*, *BantayText*)?
2. Is there an existing Vercel account / Groq key we should reuse, or should setup be part of the plan?

## 15. Definition of done

- Public repo + deployed URL.
- ~40 fixtures green; signal, combination, and privacy tests green; the one E2E spec green.
- Works with the Groq key removed (template fallback).
- No message content appears in server logs or LLM payloads.
- Verdict renders instantly; explanation present immediately (template) and upgraded
  within 6s at most.
- LCP < 2s on throttled 4G; Lighthouse ≥ 90 mobile.
- README: problem, architecture diagram, the verdict-vs-explanation reasoning,
  privacy contract, how to run.
