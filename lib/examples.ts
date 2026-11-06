import { CURATED_EXAMPLES } from './engine/__fixtures__/messages';

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
