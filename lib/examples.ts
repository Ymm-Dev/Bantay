import { CURATED_EXAMPLES } from '@/lib/engine/__fixtures__/messages';

export interface Example {
  id: string;
  label: string;
  text: string;
}

export const EXAMPLES: Example[] = CURATED_EXAMPLES.map(({ id, label, text }) => ({
  id,
  label,
  text,
}));
