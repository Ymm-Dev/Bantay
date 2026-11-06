import { parse as parseDomain } from 'tldts';

const URL_PATTERN =
  /https?:\/\/[^\s<>"']+|\b(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}(?:\/[^\s<>"']*)?/gi;

const TRAILING_PUNCTUATION = /[.,;:!?)\]}"']+$/;

const IPV4 = /^(\d{1,3}\.){3}\d{1,3}$/;

export interface ParsedUrl {
  href: string;
  hostname: string;
  registrableDomain: string;
  sld: string;
  path: string;
  protocol: string;
  isIp: boolean;
}

function isIpLiteral(hostname: string): boolean {
  return IPV4.test(hostname) || hostname.startsWith('[') || hostname.includes(':');
}

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_PATTERN) ?? [];
  const seen = new Set<string>();
  const urls: string[] = [];

  for (const match of matches) {
    const cleaned = match.replace(TRAILING_PUNCTUATION, '');
    if (!cleaned) continue;

    const parsed = parseUrl(cleaned);
    if (!parsed || seen.has(parsed.href)) continue;

    seen.add(parsed.href);
    urls.push(cleaned);
  }

  return urls;
}

export function parseUrl(raw: string): ParsedUrl | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const href = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `http://${trimmed}`;
    const url = new URL(href);
    const hostname = url.hostname.toLowerCase();

    if (!hostname) return null;

    if (isIpLiteral(hostname)) {
      return {
        href,
        hostname,
        registrableDomain: hostname,
        sld: hostname,
        path: url.pathname,
        protocol: url.protocol,
        isIp: true,
      };
    }

    const parsed = parseDomain(hostname, { allowPrivateDomains: true });
    if (!parsed.domain) return null;

    return {
      href,
      hostname,
      registrableDomain: parsed.domain,
      sld: parsed.domainWithoutSuffix ?? '',
      path: url.pathname,
      protocol: url.protocol,
      isIp: false,
    };
  } catch {
    return null;
  }
}
