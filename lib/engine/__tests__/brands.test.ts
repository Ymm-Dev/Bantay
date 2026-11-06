import { describe, it, expect } from 'vitest';
import { parseUrl } from '../urls';
import { matchBrand } from '../brands';

const m = (s: string) => matchBrand(parseUrl(s)!);

describe('matchBrand', () => {
  it('flags an official domain as official', () => {
    expect(m('bdo.com.ph')?.kind).toBe('official');
  });

  it('flags a brand token in a non-official domain as a lookalike', () => {
    expect(m('bdo-online.top')).toEqual({ alias: 'bdo', kind: 'lookalike' });
    expect(m('gcash-login.xyz')).toEqual({ alias: 'gcash', kind: 'lookalike' });
  });

  it('flags a distance-1 typo as a lookalike', () => {
    expect(m('bdoo.com.ph')?.kind).toBe('lookalike');
  });

  it('flags a brand only in a subdomain as subdomain', () => {
    expect(m('bdo.com.ph.evil.xyz')).toEqual({ alias: 'bdo', kind: 'subdomain' });
  });

  it('flags a brand embedded anywhere in the SLD', () => {
    expect(m('fakebdo.com')).toEqual({ alias: 'bdo', kind: 'lookalike' });
    expect(m('mygcashlogin.com')).toEqual({ alias: 'gcash', kind: 'lookalike' });
    expect(m('xgcashphx.com')).toEqual({ alias: 'gcash', kind: 'lookalike' });
  });

  it('returns null for unrelated domains', () => {
    expect(m('example.com')).toBeNull();
  });
});
