import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { ShieldCheck, Lock, EyeOff, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy - SVGDO',
  description: 'SVGDO processes all images locally in your browser sandbox. Your files and code never leave your device.',
  alternates: {
    canonical: 'https://svgdo.com/privacy/',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-primary">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-16">
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck size={14} /> 100% Client-Side Privacy
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-secondary text-sm md:text-base">
            Last Updated: July 2026 • Effective Immediately
          </p>
        </div>

        <div className="space-y-8 text-secondary leading-relaxed font-medium">
          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <Lock size={20} className="text-orange" /> 1. Zero Cloud Uploads & Local-First Processing
            </h2>
            <p>
              SVGDO operates exclusively inside your local web browser sandbox. When you open, drag-and-drop, edit, optimize, or export SVG files on our platform, all computational algorithms execute directly in your device memory (RAM) via HTML5 Canvas and DOM APIs.
            </p>
            <p className="mt-3 font-semibold text-primary">
              Your SVG files, vector coordinates, graphic assets, and source code are NEVER uploaded, transmitted, or stored on our servers or any third-party cloud infrastructure.
            </p>
          </section>

          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <EyeOff size={20} className="text-orange" /> 2. Cookies & Advertising Disclosures
            </h2>
            <p>
              To keep SVGDO completely free for everyone, we partner with advertising platforms including Google AdSense. Third-party vendors, including Google, use cookies to serve ads based on user prior visits to our website and other sites across the internet.
            </p>
            <p className="mt-3">
              Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com/) or via aboutads.info.
            </p>
          </section>

          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-4">
              <FileText size={20} className="text-orange" /> 3. GDPR & CCPA Compliance
            </h2>
            <p>
              We adhere strictly to international data privacy regulations including GDPR (EU/UK) and CCPA (California). Because we do not collect personal identifiers, emails, or user files during tool usage, your privacy is protected by default.
            </p>
          </section>

          <section className="bg-bg-surface p-6 md:p-8 rounded-2xl border border-border">
            <h2 className="text-xl font-bold text-primary mb-4">4. Contact Information</h2>
            <p>
              If you have any questions or data privacy inquiries, contact our team at:
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
