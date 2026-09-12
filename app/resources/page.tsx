import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { articles } from '@/data/articles';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';
import { AdsterraBanner } from '@/components/AdsterraBanner';

export const metadata: Metadata = {
  title: 'SVG Guides, Tutorials & Vector Best Practices - SVGDO',
  description: 'Learn SVG editing, vector optimization, CSS animations, and web performance engineering with our in-depth developer guides.',
  keywords: ['svg tutorials', 'svg guides', 'learn svg', 'svg best practices', 'svg optimization guide'],
  alternates: {
    canonical: 'https://svgdo.com/resources/',
  },
};

export default function ResourcesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-primary">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto px-4 py-12 md:py-16">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/10 text-orange text-xs font-bold uppercase tracking-wider">
            <BookOpen size={14} /> Knowledge Hub & Tutorials
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight">
            SVG Guides & Vector Best Practices
          </h1>
          <p className="text-secondary text-base md:text-lg leading-relaxed">
            Master Scalable Vector Graphics with our in-depth developer tutorials, optimization guides, and performance architecture analyses.
          </p>
        </div>

        <AdsterraBanner className="!my-6 w-full" />

        {/* ARTICLES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="group flex flex-col justify-between bg-bg-surface rounded-2xl border border-border hover:border-orange/50 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-secondary/70 mb-3">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar size={13} /> {article.date}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {article.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-md bg-bg-subtle text-secondary text-[11px] font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-lg font-bold text-primary group-hover:text-orange transition-colors leading-snug mb-3">
                  <Link href={`/resources/${article.slug}/`}>
                    {article.title}
                  </Link>
                </h2>

                <p className="text-secondary text-sm leading-relaxed line-clamp-3 mb-6">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                <Link
                  href={`/resources/${article.slug}/`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange group-hover:translate-x-1 transition-transform"
                >
                  Read Full Tutorial <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
