import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Header } from '../Header';

describe('Header', () => {
  it('renders the Bantay mark inside the home link', () => {
    render(<Header />);

    const home = screen.getByRole('link', { name: /bantay home/i });

    expect(home).toHaveAttribute('href', '/');
    expect(home.querySelector('svg')).toBeInTheDocument();
  });
});
