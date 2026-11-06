import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import type { ExplanationInput, ExplanationProvider } from './types';

const SYSTEM_PROMPT = `Ikaw si Bantay, isang friendly na Filipino cybersecurity assistant.
Bibigyan ka ng listahan ng signals na nakita ng aming rules engine sa isang text message.
Sumulat ng 2-3 pangungusap sa simpleng Taglish.

Rules:
- Gamitin lang ang mga signal at advice na ibinigay. Huwag mag-imbento ng nakita.
- Huwag magbigay ng URL, phone number, o sabihing i-click ang kahit ano.
- Huwag sabihing ligtas kung suspicious o scam ang level.
- Tapusin sa isang konkretong aksyon mula sa advice.
- Walang markdown, walang bullet points.`;

export function createGroqProvider(): ExplanationProvider {
  return {
    name: 'groq',
    async explain(input: ExplanationInput): Promise<string> {
      if (!process.env.GROQ_API_KEY) {
        throw new Error('GROQ_API_KEY is not set');
      }

      const { text } = await generateText({
        model: groq('openai/gpt-oss-20b'),
        system: SYSTEM_PROMPT,
        prompt: JSON.stringify(input),
        maxOutputTokens: 180,
      });

      return text.trim();
    },
  };
}
