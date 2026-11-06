import { describe, it, expect } from 'vitest';
import { detectUrlSignals } from '../signals/url';

const ids = (s: string) => detectUrlSignals(s).map((x) => x.id);

describe('detectUrlSignals', () => {
  it('flags shorteners, IPs, punycode, and suspicious TLDs', () => {
    expect(ids('see bit.ly/abc')).toContain('url.shortener');
    expect(ids('go to http://192.168.1.1/login')).toContain('url.ip_literal');
    expect(ids('visit xn--bdo-9na.com')).toContain('url.punycode');
    expect(ids('visit bdo-online.top')).toContain('url.suspicious_tld');
  });

  it('flags lookalike and subdomain brand abuse', () => {
    expect(ids('verify at bdo-online.top')).toContain('url.lookalike_brand');
    expect(ids('verify at bdo.com.ph.evil.xyz')).toContain('url.brand_in_subdomain');
  });

  it('never fires the allowlist when any URL is unofficial', () => {
    expect(ids('bdo.com.ph and bit.ly/x')).not.toContain('url.known_brand');
  });

  it('fires the allowlist once when every URL is official', () => {
    const signals = detectUrlSignals('bdo.com.ph and gcash.com');
    expect(signals.filter((s) => s.id === 'url.known_brand')).toHaveLength(1);
  });

  it('flags plain http and excessive subdomains', () => {
    expect(ids('http://example.com')).toContain('url.no_https');
    expect(ids('http://a.b.c.d.example.com')).toContain('url.excessive_subdomains');
  });
});
