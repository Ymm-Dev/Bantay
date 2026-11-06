import { describe, it, expect } from 'vitest';
import { buildTemplateExplanation } from '../template';

describe('buildTemplateExplanation', () => {
  it('names the level, a top signal, and one action', () => {
    const text = buildTemplateExplanation({
      level: 'scam',
      score: 92,
      signals: [
        {
          id: 'url.lookalike_brand',
          title: 'Kahawig na domain',
          detail: 'd',
          severity: 'critical',
        },
      ],
      advice: ['Huwag i-click ang link.'],
    });

    expect(text).toContain('scam');
    expect(text).toContain('Kahawig na domain');
    expect(text).toContain('Huwag i-click');
  });

  it('handles a verdict with no signals', () => {
    const text = buildTemplateExplanation({
      level: 'safe',
      score: 0,
      signals: [],
      advice: ['Mag-ingat pa rin.'],
    });

    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain('safe');
  });
});
