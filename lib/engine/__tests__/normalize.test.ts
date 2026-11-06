import { describe, it, expect } from 'vitest';
import { normalizeText } from '../normalize';

describe('normalizeText', () => {
  it('lowercases, strips accents, and collapses whitespace', () => {
    expect(normalizeText('  BDO  ALERT:  Na-deactívate  ')).toBe('bdo alert: na-deactivate');
  });

  it('returns empty string for whitespace input', () => {
    expect(normalizeText('   ')).toBe('');
  });

  it('keeps emoji and Taglish text without throwing', () => {
    expect(normalizeText('Agad! 🚨 Bayad na')).toBe('agad! 🚨 bayad na');
  });
});
