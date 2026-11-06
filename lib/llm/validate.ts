const URL_PATTERN = /https?:\/\/|www\./i;

// Directives to click are unsafe; warnings such as "Huwag i-click" are fine.
const CLICK_WARNING = /\b(huwag|don'?t|dont|do not|never)\s+(i-)?click\b/gi;
const CLICK_DIRECTIVE = /\b(i-)?click\b|pindutin/i;

const PHONE_PATTERN =
  /\b(?:\+?63|0)9\d{2}[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/;

export function isSafeExplanation(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  if (URL_PATTERN.test(trimmed)) return false;
  if (CLICK_DIRECTIVE.test(trimmed.replace(CLICK_WARNING, ''))) return false;
  if (PHONE_PATTERN.test(trimmed)) return false;
  if (trimmed.split(/\s+/).length > 120) return false;

  return true;
}
