import { describe, it, expect } from 'vitest';
import { ExplanationCache } from '../cache';
import { explainVerdict } from '../explain';
import type { ExplanationInput } from '../types';

const suspicious: ExplanationInput = {
  level: 'suspicious',
  score: 40,
  signals: [
    { id: 'text.prize', title: 'Premyo o raffle', detail: 'd', severity: 'high' },
  ],
  advice: ['Huwag i-click ang link.'],
};

describe('explainVerdict', () => {
  it('uses the template for safe verdicts without calling the provider', async () => {
    let called = false;
    const provider = {
      name: 'spy',
      explain: async () => {
        called = true;
        return 'x';
      },
    };

    const result = await explainVerdict(
      { level: 'safe', score: 0, signals: [], advice: ['ok'] },
      { provider },
    );

    expect(called).toBe(false);
    expect(result.source).toBe('template');
  });

  it('falls back to the template when the provider throws', async () => {
    const provider = {
      name: 'bad',
      explain: async () => {
        throw new Error('boom');
      },
    };

    const result = await explainVerdict(suspicious, { provider });

    expect(result.source).toBe('template');
    expect(result.text.length).toBeGreaterThan(0);
  });

  it('falls back when the provider output is unsafe', async () => {
    const provider = {
      name: 'unsafe',
      explain: async () => 'Click http://evil.com',
    };

    const result = await explainVerdict(suspicious, { provider });

    expect(result.source).toBe('template');
  });

  it('caches the second identical call', async () => {
    let calls = 0;
    const provider = {
      name: 'count',
      explain: async () => {
        calls++;
        return 'Mukhang scam ito. Huwag i-click.';
      },
    };
    const cache = new ExplanationCache();

    await explainVerdict(suspicious, { provider, cache });
    await explainVerdict(suspicious, { provider, cache });

    expect(calls).toBe(1);
  });

  it('times out and falls back', async () => {
    const provider = {
      name: 'slow',
      explain: () => new Promise<string>(() => {}),
    };

    const result = await explainVerdict(suspicious, { provider, timeoutMs: 10 });

    expect(result.source).toBe('template');
  });
});
