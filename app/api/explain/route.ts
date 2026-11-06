import { z } from 'zod';
import { explainVerdict } from '@/lib/llm/explain';
import { checkRateLimit } from '@/lib/llm/rate-limit';

export const runtime = 'nodejs';

const SignalSchema = z
  .object({
    id: z.string().min(1).max(100),
    title: z.string().min(1).max(200),
    detail: z.string().min(1).max(300),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
  })
  .strict();

const ExplanationInputSchema = z
  .object({
    level: z.enum(['safe', 'suspicious', 'scam']),
    score: z.number().int().min(0).max(100),
    signals: z.array(SignalSchema).max(20),
    advice: z.array(z.string().min(1).max(200)).max(6),
  })
  .strict();

export async function POST(request: Request) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = ExplanationInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: 'Invalid input' }, { status: 400 });
  }

  const limit = checkRateLimit(ip);
  if (!limit.ok) {
    return Response.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) },
      },
    );
  }

  const result = await explainVerdict(parsed.data);

  return Response.json({ explanation: result.text, source: result.source });
}
