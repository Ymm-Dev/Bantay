const URL_PATTERN = /https?:\/\/|www\.|\bhttps?\b/i;
const MARKDOWN_LINK = /\[[^\]]*\]\([^)]*\)/;
const BARE_DOMAIN =
  /(?:\b[a-z0-9-]+\.)+(?:com|net|org|ph|io|co|app|xyz|top|click|info|live|shop|buzz|site|online)\b/i;

// Directives to click are unsafe; warnings such as "Huwag i-click" are fine.
const CLICK_WARNING = /\b(huwag|don'?t|dont|do not|never)\s+(i-)?click\b/gi;
const CLICK_DIRECTIVE = /\b(i-)?click\b|pindutin/i;

const PHONE_PATTERN =
  /\b(?:\+?63|0)9\d{2}[-.\s]?\d{3}[-.\s]?\d{4}\b|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/;

function hasAtLeastOneSentence(text: string): boolean {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [];

  return sentences.some((sentence) => {
    const words = sentence.trim().split(/\s+/).filter(Boolean);
    return words.length >= 2;
  });
}

export function isSafeExplanation(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;

  if (URL_PATTERN.test(trimmed)) return false;
  if (MARKDOWN_LINK.test(trimmed)) return false;
  if (BARE_DOMAIN.test(trimmed)) return false;
  if (CLICK_DIRECTIVE.test(trimmed.replace(CLICK_WARNING, ''))) return false;
  if (PHONE_PATTERN.test(trimmed)) return false;
  if (trimmed.split(/\s+/).length > 120) return false;
  if (!hasAtLeastOneSentence(trimmed)) return false;

  return true;
}
