import type { Signal } from '../types';
import { extractUrls, parseUrl, type ParsedUrl } from '../urls';
import { matchBrand, OFFICIAL_DOMAINS } from '../brands';

const SHORTENERS = new Set([
  'bit.ly',
  'tinyurl.com',
  't.co',
  'cutt.ly',
  'rebrand.ly',
  'is.gd',
  'shorturl.at',
  'rb.gy',
  'bit.do',
  'ow.ly',
  'buff.ly',
  's.id',
  'linktr.ee',
]);

const SUSPICIOUS_TLDS = new Set([
  'top',
  'xyz',
  'click',
  'shop',
  'live',
  'buzz',
  'icu',
  'rest',
  'cyou',
  'monster',
]);

function makeSignal(
  id: string,
  severity: Signal['severity'],
  weight: number,
  title: string,
  detail: string,
  evidence?: string,
): Signal {
  return { id, category: 'url', severity, weight, title, detail, evidence };
}

export function detectUrlSignals(text: string): Signal[] {
  const parsed = extractUrls(text)
    .map(parseUrl)
    .filter((url): url is ParsedUrl => url !== null);

  if (parsed.length === 0) return [];

  const signals = new Map<string, Signal>();
  const add = (signal: Signal) => {
    if (!signals.has(signal.id)) signals.set(signal.id, signal);
  };

  for (const url of parsed) {
    const brand = matchBrand(url);

    if (brand?.kind === 'lookalike') {
      add(
        makeSignal(
          'url.lookalike_brand',
          'critical',
          35,
          'Kahawig na domain ng kilalang brand',
          `Ginagamit ng scammer ang domain na kahawig ng opisyal na ${brand.alias.toUpperCase()} site.`,
          url.hostname,
        ),
      );
    }

    if (brand?.kind === 'subdomain') {
      add(
        makeSignal(
          'url.brand_in_subdomain',
          'high',
          25,
          'Brand nasa subdomain o path lang',
          'Nasa subdomain o path lang ang pangalan ng brand; hindi ito ang tunay na domain.',
          url.hostname,
        ),
      );
    }

    const isPunycode = url.hostname.includes('xn--');
    const hasMixedScript = /[\u0400-\u04ff\u0370-\u03ff]/.test(url.hostname);
    if (isPunycode || hasMixedScript) {
      add(
        makeSignal(
          'url.punycode',
          'high',
          30,
          'Punycode o homoglyph na domain',
          'Maaaring gumamit ng katulad na letra para magmukhang opisyal ang domain.',
          url.hostname,
        ),
      );
    }

    if (url.isIp) {
      add(
        makeSignal(
          'url.ip_literal',
          'high',
          25,
          'IP address ang link',
          'Bihirang gumamit ng IP address ang mga opisyal na bank o app.',
          url.hostname,
        ),
      );
    }

    const bareHost = url.hostname.replace(/^www\./, '');
    if (SHORTENERS.has(bareHost)) {
      add(
        makeSignal(
          'url.shortener',
          'medium',
          15,
          'Pinaikling link',
          'Itinatago ng shortener ang tunay na destinasyon ng link.',
          url.hostname,
        ),
      );
    }

    const tld = url.registrableDomain.split('.').pop() ?? '';
    if (SUSPICIOUS_TLDS.has(tld)) {
      add(
        makeSignal(
          'url.suspicious_tld',
          'medium',
          15,
          'Kahina-hinalang domain ending',
          `Maraming scam site ang gumagamit ng murang domain ending tulad ng .${tld}.`,
          url.hostname,
        ),
      );
    }

    if (url.protocol === 'http:') {
      add(
        makeSignal(
          'url.no_https',
          'low',
          5,
          'Walang HTTPS',
          'Hindi secure ang koneksyon sa link.',
          url.hostname,
        ),
      );
    }

    const hostLabels = url.hostname.split('.').length;
    const registrableLabels = url.registrableDomain.split('.').length;
    if (hostLabels - registrableLabels >= 4) {
      add(
        makeSignal(
          'url.excessive_subdomains',
          'low',
          8,
          'Sobrang daming subdomain',
          'Ginagamit ito para magmukhang lehitimo ang link.',
          url.hostname,
        ),
      );
    }

    if (/\/[a-z0-9_-]{20,}/i.test(url.path)) {
      add(
        makeSignal(
          'url.long_random_path',
          'low',
          5,
          'Random na mahabang path',
          'Karaniwan ito sa phishing link na may fake page o tracking.',
          url.hostname,
        ),
      );
    }
  }

  const allOfficial = parsed.every((url) => OFFICIAL_DOMAINS.includes(url.registrableDomain));
  if (allOfficial) {
    add(
      makeSignal(
        'url.known_brand',
        'low',
        -10,
        'Opisyal na domain',
        'Lahat ng link ay kabilang sa opisyal na domain ng brand.',
      ),
    );
  }

  return [...signals.values()];
}
