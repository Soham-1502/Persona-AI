'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/categories');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-(--bg-dark)] text-white">
      <div className="scanline" />

      <div className="orb orb-purple" />
      <div className="orb orb-indigo" />

      <div className="relative z-10 text-center px-4 max-w-5xl">
        <h1
          className="
            text-6xl md:text-8xl lg:text-9xl 
            font-black tracking-tighter 
            gradient-text leading-tight mb-8
          "
        >
          AI-Led<br />Microlearning
        </h1>

        <div className="glass-card rounded-2xl p-6 md:p-8 max-w-3xl mx-auto border-white/10">
          <p className="text-lg md:text-xl font-medium tracking-wide text-gray-300 uppercase leading-relaxed">
            <span className="text-white">LEARN.</span>
            <span className="text-white/60 mx-1">TEST.</span>
            <span className="text-white">EXPLAIN.</span>
          </p>
          <p className="mt-4 text-gray-400 text-sm md:text-base font-light tracking-widest uppercase">
            Watch, Validate, and Articulate your Understanding
          </p>
        </div>
      </div>
    </div>
  );
}