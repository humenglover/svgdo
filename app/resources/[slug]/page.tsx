import fs from 'fs';
import path from 'path';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { articles } from '@/data/articles';
import { marked } from 'marked';
import { ArrowLeft, Calendar, Tag, User, Sparkles } from 'lucide-react';
import { AdsterraBanner } from '@/components/AdsterraBanner';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: `${article.title} - SVGDO`,
    description: article.excerpt,
    keywords: article.tags,
    alternates: {
      canonical: `https://svgdo.com/resources/${slug}/`,
    },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `https://svgdo.com/resources/${slug}/`,
      publishedTime: article.date,
      authors: ['SVGDO Editorial Team'],
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: ['/og-image.png'],
    },
  };
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    notFound();
  }

  const mdPath = path.join(process.cwd(), 'public', 'content', `${slug}.md`);
  let contentHtml = '';
  if (fs.existsSync(mdPath)) {
    const rawMd = fs.readFileSync(mdPath, 'utf8');
    contentHtml = await marked.parse(rawMd, { gfm: true, breaks: true });
  } else {
    contentHtml = `<p>${article.excerpt}</p>`;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.date,
    url: `https://svgdo.com/resources/${slug}/`,
    author: {
      '@type': 'Organization',
      name: 'SVGDO Editorial Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SVGDO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://svgdo.com/favicon.svg',
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-base text-primary">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 md:py-14 w-full">
        {/* BACK LINK */}
        <Link
          href="/resources/"
          className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-orange transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Back to all guides
        </Link>

        {/* HEADER */}
        <header className="mb-10 pb-8 border-b border-border space-y-4">
          <div className="flex flex-wrap gap-2 mb-2">
            {article.tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange/10 text-orange font-bold text-xs"
              >
                <Tag size={12} /> {t}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-primary tracking-tight leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs md:text-sm text-secondary pt-2">
            <span className="flex items-center gap-1.5">
              <User size={14} className="text-orange" /> SVGDO Editorial Team
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> Published on {article.date}
            </span>
          </div>
        </header>

        <AdsterraBanner className="!my-6 w-full" />

        {/* MARKDOWN CONTENT */}
        <article
          className="prose prose-slate dark:prose-invert max-w-none text-base md:text-lg leading-relaxed
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-primary
            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-secondary prose-p:leading-relaxed prose-p:mb-5
            prose-a:text-orange prose-a:font-semibold hover:prose-a:underline
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:rounded-xl
            prose-code:text-orange prose-code:font-mono prose-code:text-sm
            prose-li:text-secondary"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <AdsterraBanner className="!my-10 w-full" />

        {/* BOTTOM CTA */}
        <footer className="mt-14 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/resources/"
            className="inline-flex items-center gap-2 text-sm font-bold text-secondary hover:text-orange transition-colors"
          >
            <ArrowLeft size={16} /> All Tutorials
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange hover:opacity-90 text-white font-bold text-sm shadow-md transition-all"
          >
            <Sparkles size={16} /> Launch Online SVG Editor
          </Link>
        </footer>
      </main>
    </div>
  );
}
