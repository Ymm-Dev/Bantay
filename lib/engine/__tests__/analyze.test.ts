import { describe, it, expect } from 'vitest';
import { analyze } from '../index';

describe('analyze', () => {
  it('returns a full verdict shape', () => {
    const verdict = analyze(
      'BDO: account suspended, verify at bdo-online.top and send your OTP',
    );
    expect(verdict.level).toBe('scam');
    expect(verdict.signals.some((s) => s.id === 'url.lookalike_brand')).toBe(true);
    expect(verdict.advice.length).toBeGreaterThan(0);
  });

  it('handles empty input without throwing', () => {
    expect(analyze('   ')).toMatchObject({ score: 0, level: 'safe', signals: [] });
  });

  it('does not throw on malformed URLs', () => {
    expect(() => analyze('http:// /// broken')).not.toThrow();
  });
});
