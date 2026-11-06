import type { Signal } from '../types';

export function detectCombinationSignals(signals: Signal[]): Signal[] {
  const has = (id: string) => signals.some((signal) => signal.id === id);
  const combinations: Signal[] = [];

  if (has('text.job_offer') && has('text.contact_offsite')) {
    combinations.push({
      id: 'text.job_scam_pattern',
      category: 'text',
      severity: 'high',
      weight: 15,
      title: 'Job scam pattern',
      detail: 'Pinagsasama ang offer na kumita agad at contact sa labas ng platform.',
    });
  }

  if (has('text.prize') && has('text.money_request')) {
    combinations.push({
      id: 'text.advance_fee_pattern',
      category: 'text',
      severity: 'high',
      weight: 10,
      title: 'Advance-fee pattern',
      detail: 'May premyo pero kailangan munang magbayad o mag-load.',
    });
  }

  return combinations;
}
