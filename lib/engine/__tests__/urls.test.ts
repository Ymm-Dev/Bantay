import { describe, it, expect } from 'vitest';
import { extractUrls, parseUrl } from '../urls';

describe('extractUrls', () => {
  it('finds http(s) URLs and strips trailing punctuation', () => {
    expect(extractUrls('Go to http://bdo-secure.top/verify).')).toEqual([
      'http://bdo-secure.top/verify',
    ]);
  });

  it('finds bare domains with paths', () => {
    expect(extractUrls('check gcash-login.xyz/pay now')).toEqual(['gcash-login.xyz/pay']);
  });

  it('returns an empty array when there are none', () => {
    expect(extractUrls('hello po')).toEqual([]);
  });
});

describe('parseUrl', () => {
  it('parses a URL without a scheme and uppercases', () => {
    const parsed = parseUrl('BDO-ONLINE.TOP/verify');
    expect(parsed?.registrableDomain).toBe('bdo-online.top');
    expect(parsed?.protocol).toBe('http:');
  });

  it('returns null for malformed input instead of throwing', () => {
    expect(parseUrl('http://')).toBeNull();
  });
});
