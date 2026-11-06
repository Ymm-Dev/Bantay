import { describe, it, expect } from 'vitest';
import { POST } from '../route';

const validBody = {
  level: 'safe',
  score: 0,
  signals: [],
  advice: ['Mag-ingat pa rin.'],
};

function req(body: unknown, ip: string): Request {
  return new Request('http://localhost/api/explain', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

describe('POST /api/explain', () => {
  it('rejects an invalid body with 400', async () => {
    const res = await POST(req({}, '10.0.0.1'));
    expect(res.status).toBe(400);
  });

  it('rejects unknown fields and oversized signal lists', async () => {
    const extra = await POST(req({ ...validBody, text: 'raw message' }, '10.0.0.2'));
    expect(extra.status).toBe(400);

    const tooMany = await POST(
      req(
        {
          ...validBody,
          signals: Array.from({ length: 21 }, (_, i) => ({
            id: `s${i}`,
            title: 't',
            detail: 'd',
            severity: 'low',
          })),
        },
        '10.0.0.3',
      ),
    );
    expect(tooMany.status).toBe(400);
  });

  it('returns an explanation for a valid input', async () => {
    const res = await POST(req(validBody, '10.0.0.4'));
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.explanation.length).toBeGreaterThan(0);
    expect(body.source).toBe('template');
  });

  it('returns 429 after 10 requests in the window', async () => {
    for (let i = 0; i < 10; i++) {
      const res = await POST(req(validBody, '10.0.0.5'));
      expect(res.status).toBe(200);
    }

    const blocked = await POST(req(validBody, '10.0.0.5'));
    expect(blocked.status).toBe(429);
    expect(blocked.headers.get('retry-after')).toBeTruthy();
  });
});
