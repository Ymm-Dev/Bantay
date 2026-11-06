import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Scanner } from '../Scanner';

describe('Scanner', () => {
  it('renders a scam verdict after submitting a phishing message', async () => {
    render(<Scanner />);

    await userEvent.type(
      screen.getByLabelText(/i-paste/i),
      'BDO suspended verify at bdo-online.top send OTP',
    );
    await userEvent.click(screen.getByRole('button', { name: /suriin/i }));

    expect(await screen.findByTestId('verdict-level')).toHaveTextContent(/scam/i);
  });

  it('shows a calm empty state for whitespace', async () => {
    render(<Scanner />);

    await userEvent.type(screen.getByLabelText(/i-paste/i), '   ');
    await userEvent.click(screen.getByRole('button', { name: /suriin/i }));

    expect(await screen.findByText(/walang text/i)).toBeInTheDocument();
  });
});
