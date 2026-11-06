import { describe, it, expect } from 'vitest';
import { analyze } from '../../engine';
import { toExplanationInput } from '../toExplanationInput';

describe('toExplanationInput', () => {
  it('strips evidence, urls, and raw text', () => {
    const verdict = analyze('verify at bdo-online.top and send your OTP');
    const input = toExplanationInput(verdict);
    const serialized = JSON.stringify(input);

    expect(serialized).not.toContain('bdo-online.top');
    expect(serialized).not.toContain('verify at');
    expect(input.signals.every((signal) => !('evidence' in signal))).toBe(true);
    expect(input).toHaveProperty('level');
    expect(input).toHaveProperty('advice');
  });
});
