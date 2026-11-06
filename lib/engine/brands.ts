import type { ParsedUrl } from './urls';

const AFFIX_TOKENS = new Set([
  'secure',
  'login',
  'verify',
  'online',
  'account',
  'update',
  'my',
  'ph',
  'official',
  'support',
  'alert',
  'service',
  'app',
  'web',
  'portal',
  'signin',
  'auth',
  'help',
]);

const OFFICIAL_MAP: Record<string, string> = {
  bdo: 'bdo.com.ph',
  bpi: 'bpi.com.ph',
  gcash: 'gcash.com',
  maya: 'maya.ph',
  metrobank: 'metrobank.com.ph',
  landbank: 'landbank.com',
  unionbank: 'unionbankph.com',
  pnb: 'pnb.com.ph',
  rcbc: 'rcbc.com',
  eastwest: 'eastwestbanker.com',
  chinabank: 'chinabank.ph',
  securitybank: 'securitybank.com',
  shopee: 'shopee.ph',
  lazada: 'lazada.com.ph',
  grab: 'grab.com',
  meralco: 'meralco.com.ph',
  maynilad: 'mayniladwater.com.ph',
  globe: 'globe.com.ph',
  smart: 'smart.com.ph',
  pldt: 'pldt.com.ph',
  converge: 'convergeict.com',
  jnt: 'jtexpress.ph',
  lalamove: 'lalamove.com',
  ninjavan: 'ninjavan.co',
  '2go': '2go.com.ph',
  philpost: 'philpost.gov.ph',
};

export const BRAND_ALIASES: readonly string[] = Object.keys(OFFICIAL_MAP);

export const OFFICIAL_DOMAINS: readonly string[] = Object.values(OFFICIAL_MAP);

export type BrandMatch = {
  alias: string;
  kind: 'lookalike' | 'subdomain' | 'official';
};

function tokenize(value: string): string[] {
  return value.split(/[^a-z0-9]+/).filter(Boolean);
}

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const distance: number[][] = Array.from({ length: rows }, (_, i) =>
    Array.from({ length: cols }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );

  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      distance[i][j] = Math.min(
        distance[i - 1][j] + 1,
        distance[i][j - 1] + 1,
        distance[i - 1][j - 1] + cost,
      );
    }
  }

  return distance[a.length][b.length];
}

export function matchBrand(url: ParsedUrl): BrandMatch | null {
  const officialAlias = BRAND_ALIASES.find(
    (alias) => OFFICIAL_MAP[alias] === url.registrableDomain,
  );
  if (officialAlias) return { alias: officialAlias, kind: 'official' };

  const tokens = tokenize(url.sld).filter((token) => !AFFIX_TOKENS.has(token));
  const joined = url.sld.replace(/[^a-z0-9]/g, '');

  for (const alias of BRAND_ALIASES) {
    if (tokens.includes(alias)) return { alias, kind: 'lookalike' };

    if (tokens.some((token) => token.length >= 4 && levenshtein(token, alias) <= 1)) {
      return { alias, kind: 'lookalike' };
    }

    const suffixLength = joined.length - alias.length;
    if (joined.startsWith(alias) && suffixLength > 0 && suffixLength <= 3) {
      return { alias, kind: 'lookalike' };
    }
  }

  const prefix = url.hostname.slice(0, url.hostname.length - url.registrableDomain.length);
  const surroundingTokens = [...tokenize(prefix), ...tokenize(url.path)];

  for (const alias of BRAND_ALIASES) {
    if (surroundingTokens.includes(alias)) return { alias, kind: 'subdomain' };
  }

  return null;
}
