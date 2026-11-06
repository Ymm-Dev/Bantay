import { Hero } from '@/components/Hero';
import { Header } from '@/components/Header';
import { Scanner } from '@/components/Scanner';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <div className="mx-auto w-full max-w-3xl px-5 pb-20">
          <Scanner />
        </div>
      </main>
    </>
  );
}
