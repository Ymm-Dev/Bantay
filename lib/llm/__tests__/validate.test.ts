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
});
