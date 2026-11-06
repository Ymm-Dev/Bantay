import { describe, it, expect } from 'vitest';
import { scoreSignals } from '../score';
import type { Signal } from '../types';

const sig = (weight: number, severity: Signal['severity'] = 'medium'): Signal => ({
  id: `t${weight}`,
  category: 'text',
  severity,
  weight,
  title: 't',
  detail: 'd',
});

describe('scoreSignals', () => {
  it('maps totals to the three levels', () => {
    expect(scoreSignals([sig(10)]).level).toBe('safe');
    expect(scoreSignals([sig(30)]).level).toBe('suspicious');
    expect(scoreSignals([sig(70)]).level).toBe('scam');
  });

  it('floors any critical signal at 60', () => {
    expect(scoreSignals([sig(10, 'critical')]).score).toBe(60);
  });

  it('clamps at 100 and never goes below 0', () => {
    expect(scoreSignals([sig(90), sig(90)]).score).toBe(100);
    expect(scoreSignals([sig(-20)]).score).toBe(0);
  });
});
