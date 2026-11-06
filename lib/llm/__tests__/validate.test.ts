import { describe, it, expect } from 'vitest';
import { isSafeExplanation } from '../validate';

describe('isSafeExplanation', () => {
  it('rejects unsafe or empty explanations', () => {
    expect(isSafeExplanation('Click http://evil.com now')).toBe(false);
    expect(isSafeExplanation('I-click ang link na ito')).toBe(false);
    expect(isSafeExplanation('Call 0917 123 4567')).toBe(false);
    expect(isSafeExplanation('')).toBe(false);
    expect(isSafeExplanation('word '.repeat(121))).toBe(false);
  });

  it('accepts a plain Taglish explanation', () => {
    expect(isSafeExplanation('Mukhang scam ito. Huwag i-click ang link.')).toBe(true);
  });

  it('rejects zero-sentence output, bare http tokens, and markdown links', () => {
    expect(isSafeExplanation('hello')).toBe(false);
    expect(isSafeExplanation('ok lang')).toBe(false);
    expect(isSafeExplanation('Visit http now')).toBe(false);
    expect(isSafeExplanation('Tingnan ang [link](evil.com)')).toBe(false);
  });
});
