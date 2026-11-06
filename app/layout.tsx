import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bantay — Scam Text Checker',
  description:
    'I-paste ang text message at alamin kung scam, suspicious, o safe. Rules engine ang nagde-desisyon; Taglish ang paliwanag.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tl" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
