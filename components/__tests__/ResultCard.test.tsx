import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { analyze } from '@/lib/engine';
import { ResultCard } from '../ResultCard';

const scamVerdict = analyze(
  'BDO ALERT: Your account has been suspended. Verify within 24 hours: http://bdo-secure-login.top/verify and send your OTP.',
);

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ResultCard', () => {
  it('renders template text immediately and upgrades when the API returns', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            JSON.stringify({
              explanation: 'Mas malinaw na paliwanag.',
              source: 'llm',
            }),
            { status: 200, headers: { 'content-type': 'application/json' } },
          ),
      ),
    );

    render(<ResultCard verdict={scamVerdict} />);

    expect(screen.getByTestId('explanation')).toHaveTextContent(/scam/i);
    expect(await screen.findByText('Mas malinaw na paliwanag.')).toBeInTheDocument();
  });

  it('shows every signal with its severity and evidence', () => {
    render(<ResultCard verdict={scamVerdict} />);

    const row = screen.getByTestId('signal-url.lookalike_brand');
    expect(within(row).getByText(/kahawig na domain/i)).toBeInTheDocument();
    expect(within(row).getByText(/bdo-secure-login\.top/)).toBeInTheDocument();
  });

  it('uses the provided explanation and skips the API entirely', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(
      <ResultCard
        verdict={scamVerdict}
        initialExplanation="Precomputed na paliwanag."
      />,
    );

    expect(screen.getByTestId('explanation')).toHaveTextContent(
      'Precomputed na paliwanag.',
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
