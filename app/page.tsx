import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { HowItWorks } from '@/components/HowItWorks';
import { PrivacyNote } from '@/components/PrivacyNote';
import { Scanner } from '@/components/Scanner';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="mx-auto w-full max-w-3xl px-5 pb-16">
          <Scanner />
        </div>
        <HowItWorks />
        <PrivacyNote />
      </main>
      <Footer />
    </>
  );
}
