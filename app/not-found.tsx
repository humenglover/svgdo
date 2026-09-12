import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Home, ArrowRight } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-primary">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 rounded-full bg-orange/10 text-orange flex items-center justify-center font-black text-3xl mb-6 shadow-sm">
          404
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-secondary max-w-md mx-auto text-base leading-relaxed mb-8">
          The vector graphics tool or tutorial page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange text-white font-bold text-sm shadow-md hover:opacity-90 transition-all"
        >
          <Home size={16} /> Return to SVG Editor <ArrowRight size={14} />
        </Link>
      </main>
    </div>
  );
}
