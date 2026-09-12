import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Terms of Service - SVGDO',
  description: 'Terms of service and usage guidelines for SVGDO, the free browser-based SVG editor.',
  alternates: {
    canonical: 'https://svgdo.com/terms/',
  },
};

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-primary">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
          Terms of Service
        </h1>
        <p className="text-secondary text-sm md:text-base mb-10">
          Last Updated: July 2026
        </p>

        <div className="space-y-8 text-secondary leading-relaxed font-medium">
          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SVGDO, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use the tool.
            </p>
          </section>

          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary mb-4">2. Intellectual Property & User Content</h2>
            <p>
              You retain 100% full ownership and copyright of all SVG files, vector graphics, code, and exported images that you create, edit, or convert using SVGDO. SVGDO claims zero ownership or rights over your creative work.
            </p>
          </section>

          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary mb-4">3. Disclaimer of Warranties</h2>
            <p>
              SVGDO is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express or implied. We do not guarantee uninterrupted or error-free operation.
            </p>
          </section>

          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary mb-4">4. Contact Information</h2>
            <p>
              For legal inquiries or questions regarding these terms, reach us at:
            </p>
            <a href="mailto:shengqiangwang666@gmail.com" className="text-orange font-bold hover:underline inline-block mt-2">
              shengqiangwang666@gmail.com
            </a>
          </section>
        </div>
      </main>
    </div>
  );
}
