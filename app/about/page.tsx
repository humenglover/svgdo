import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import TechConstellation from '@/components/TechConstellation';
import { AdsterraBanner } from '@/components/AdsterraBanner';
import { Shield, Zap, Palette, Code2, ServerOff } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About SVGDO - The Native In-Browser SVG Toolkit',
  description: 'SVGDO is a free, 100% private, browser-based SVG editor and converter. No uploads, no accounts, zero data leaving your device.',
  keywords: ['about svgdo', 'client side svg editor', 'private svg tool', 'svg editor web'],
  alternates: {
    canonical: 'https://svgdo.com/about/',
  },
};

export default function AboutPage() {
  const features = [
    {
      key: 'privacy',
      icon: Shield,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
      title: '100% Client-Side Privacy',
      desc: 'Your SVG files never touch any external server. All parsing, rendering, and export processing take place completely inside your local browser sandbox.'
    },
    {
      key: 'performance',
      icon: Zap,
      color: 'text-orange',
      bg: 'bg-orange/10',
      title: 'Zero Latency Processing',
      desc: 'Experience instant updates without waiting for network round-trips. Smooth panning, zooming, and direct manipulation powered by modern web technologies.'
    },
    {
      key: 'design',
      icon: Palette,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      title: 'Geek & Designer Friendly',
      desc: 'Engineered for both visual tweaking and clean code generation. Inspect DOM hierarchies, modify properties directly, and export clean SVGs.'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-bg-base transition-colors duration-300 selection:bg-orange/30">
      <Navbar />

      <main className="flex-1 overflow-x-hidden">
        {/* HERO */}
        <section className="relative w-full min-h-[70vh] flex flex-col items-center justify-center overflow-hidden py-16">
          <ParticleBackground />
          <div className="relative z-10 text-center space-y-5 px-4 w-full max-w-3xl mx-auto animate-in fade-in duration-700">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary leading-[1.15] tracking-tight">
              About SVGDO
            </h1>
            <AdsterraBanner className="!my-2 w-full" />
            <p className="text-lg md:text-xl text-secondary max-w-xl mx-auto font-medium leading-relaxed">
              Redefining browser-based vector graphics editing. Native, private, and lightning-fast.
            </p>
          </div>
        </section>

        {/* MISSION & ARCHITECTURE */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 pt-8 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="bg-bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-border shadow-sm flex flex-col h-full">
              <h2 className="flex items-center gap-4 text-2xl md:text-3xl font-extrabold text-primary mb-6 tracking-tight">
                <div className="w-12 h-12 rounded-xl bg-primary text-bg-surface flex items-center justify-center shrink-0 shadow-sm">
                  <ServerOff size={24} strokeWidth={2} />
                </div>
                Our Mission
              </h2>
              <p className="text-secondary text-[16px] leading-relaxed font-medium">
                In an era of content explosion, editing SVG vector graphics often means enduring bloated desktop applications, slow cloud uploads, or spammy conversion sites. We built SVGDO to change that: a modern vector toolbox running 100% locally in your browser with zero server uploads.
              </p>
            </div>

            <div className="bg-bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-border shadow-sm flex flex-col h-full">
              <h2 className="flex items-center gap-4 text-2xl md:text-3xl font-extrabold text-primary mb-6 tracking-tight">
                <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 shadow-sm">
                  <Code2 size={24} strokeWidth={2} />
                </div>
                Architecture
              </h2>
              <p className="text-secondary text-[16px] leading-relaxed font-medium">
                Built from scratch adhering to modern Web standards. Every DOM node interceptor and parsing engine is finely tuned for performance and precision, combining geeky engineering rigour with clean UI design.
              </p>
            </div>
          </div>
        </section>

        {/* CORE FEATURES */}
        <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 border-t border-border">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
              Core Technologies
            </h2>
            <p className="mt-3 text-base md:text-lg text-secondary font-medium max-w-2xl mx-auto">
              Powered by cutting-edge Web standards for seamless vector manipulation:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {features.map((feat) => (
              <div key={feat.key} className="bg-bg-surface p-6 md:p-8 rounded-[24px] border border-border hover:border-orange/50 transition-all duration-300 shadow-sm relative overflow-hidden h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative z-10 ${feat.bg} ${feat.color}">
                  <feat.icon size={22} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 tracking-tight relative z-10">
                  {feat.title}
                </h3>
                <p className="text-secondary text-sm font-medium leading-relaxed relative z-10">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <TechConstellation />
          </div>

          {/* CONTACT */}
          <div className="mt-16 mb-20 bg-orange/5 dark:bg-orange/10 border border-orange/20 rounded-[32px] p-6 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 tracking-tight">
              Contact & Feedback
            </h2>
            <p className="text-secondary text-base md:text-lg mb-6 max-w-xl mx-auto">
              Have questions, feedback, or feature suggestions? We would love to hear from you.
            </p>
            <a href="mailto:shengqiangwang666@gmail.com" className="inline-flex w-full sm:w-auto items-center justify-center bg-orange text-white px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-[15px] sm:text-lg overflow-hidden hover:opacity-90 transition-opacity shadow-lg shadow-orange/20">
              <span className="truncate">shengqiangwang666@gmail.com</span>
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
