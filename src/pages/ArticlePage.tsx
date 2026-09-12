import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUp, Calendar, Tag, Clock, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import GithubSlugger from 'github-slugger'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { articles, getTagLabel } from '@/data/articles'
import { cn } from '@/utils'
import PageSEO from '@/components/PageSEO'
import Navbar from '@/components/Navbar'
import { AdsterraBanner } from '@/components/AdsterraBanner'

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [tocOpen, setTocOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const article = articles.find(a => a.slug === slug)
  const currentIndex = articles.findIndex(a => a.slug === slug)
  const prevArticle = currentIndex > 0 ? articles[currentIndex - 1] : null
  const nextArticle = currentIndex < articles.length - 1 && currentIndex !== -1 ? articles[currentIndex + 1] : null

  useEffect(() => {
    if (!slug) return
    window.scrollTo(0, 0)
    setLoading(true)
    setError(false)
    fetch(`/content/${slug}.md`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to load article')
        return r.text()
      })
      .then(setContent)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug])

  useEffect(() => {
    if (!content) return
    const slugger = new GithubSlugger()
    const extracted = []
    const regex = /^(##|###)\s+(.+)$/gm
    let match
    while ((match = regex.exec(content)) !== null) {
      const level = match[1] === '##' ? 2 : 3
      const text = match[2].trim()
      const id = slugger.slug(text.replace(/[*_`]/g, ''))
      extracted.push({ id, text: text.replace(/[*_`\[\]()]/g, ''), level })
    }
    setHeadings(extracted)
  }, [content])

  useEffect(() => {
    if (tocOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [tocOpen])

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const segments = useMemo(() => {
    if (!content) return []
    const h2Regex = /^(?=##\s+)/gm
    const parts = content.split(h2Regex).filter(Boolean)

    if (parts.length <= 2) {
      return [content]
    }

    const mid = Math.floor(parts.length / 2)
    return [
      parts.slice(0, mid).join(''),
      parts.slice(mid).join('')
    ]
  }, [content])

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const headerOffset = 80
      const elementPosition = el.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      setTocOpen(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const markdownComponents = {
    h1: () => null,
    h2: ({ children, ...props }: any) => {
      const slugger = new GithubSlugger()
      const id = slugger.slug(String(children).replace(/[*_`]/g, ''))
      return (
        <h2 id={id} className="scroll-mt-24 text-2xl font-bold text-primary mt-10 mb-4 pb-2 border-b border-border/60 flex items-center gap-2 group" {...props}>
          <span>{children}</span>
        </h2>
      )
    },
    h3: ({ children, ...props }: any) => {
      const slugger = new GithubSlugger()
      const id = slugger.slug(String(children).replace(/[*_`]/g, ''))
      return (
        <h3 id={id} className="scroll-mt-24 text-xl font-bold text-primary mt-8 mb-3 flex items-center gap-2" {...props}>
          <span>{children}</span>
        </h3>
      )
    },
    p: ({ children }: any) => {
      return <p className="text-secondary leading-relaxed mb-4 text-[15px]">{children}</p>
    },
    img: ({ src, alt }: any) => {
      const isVideo = src?.endsWith('.mp4') || src?.endsWith('.webm')
      if (isVideo) {
        return (
          <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-md bg-bg-surface">
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto block"
            />
            {alt && <div className="text-center text-xs text-secondary/60 py-2 border-t border-border/40 font-medium">{alt}</div>}
          </div>
        )
      }
      return (
        <div className="my-8 rounded-2xl overflow-hidden border border-border shadow-md bg-bg-surface">
          <Zoom>
            <img
              src={src}
              alt={alt || ''}
              loading="lazy"
              className="w-full h-auto object-cover block cursor-zoom-in"
            />
          </Zoom>
          {alt && <div className="text-center text-xs text-secondary/60 py-2 border-t border-border/40 font-medium">{alt}</div>}
        </div>
      )
    },
    a: ({ href, children }: any) => (
      <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-orange hover:underline font-medium inline-flex items-center gap-0.5">
        {children}
      </a>
    ),
    code: ({ inline, className, children, ...props }: any) => {
      if (inline) {
        return <code className="px-1.5 py-0.5 rounded bg-bg-subtle text-orange font-mono text-sm border border-border/50" {...props}>{children}</code>
      }
      return (
        <div className="relative group my-6 rounded-2xl overflow-hidden border border-border/80 shadow-sm">
          <div className="bg-[#1e1e1e] text-gray-200 p-4 font-mono text-sm overflow-x-auto">
            <code className={className} {...props}>{children}</code>
          </div>
        </div>
      )
    },
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-orange pl-4 py-1.5 my-6 text-secondary/90 italic bg-orange/5 rounded-r-xl">
        {children}
      </blockquote>
    ),
    ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-6 text-secondary text-[15px]">{children}</ul>,
    ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-6 text-secondary text-[15px]">{children}</ol>,
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  }

  return (
    <div className="min-h-screen bg-bg-base flex flex-col selection:bg-orange/20">
      <PageSEO seoKey={slug} />
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-secondary/60 mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-primary transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-primary truncate max-w-[200px] sm:max-w-xs">{article?.title || slug}</span>
          </nav>

          {article && (
            <div className="space-y-4 max-w-4xl">
              <div className="flex flex-wrap items-center gap-2">
                {article.tags.map(t => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange/10 text-orange border border-orange/20">
                    <Tag size={10} />
                    {getTagLabel(t)}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-primary tracking-tight leading-[1.15]">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-semibold text-secondary/70 pt-2">
                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-orange" /> {article.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange" /> 5 min read</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-12 items-start">
          <div className="flex-1 min-w-0 max-w-4xl">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4 text-secondary">
                <div className="w-8 h-8 rounded-full border-2 border-orange/20 border-t-orange animate-spin" />
                <p className="text-sm font-medium">Loading article content...</p>
              </div>
            ) : error ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
                  <FileText size={24} />
                </div>
                <h3 className="text-lg font-bold text-primary">Article content failed to load</h3>
                <p className="text-sm text-secondary max-w-sm mx-auto">Please check your network connection or return to resources.</p>
                <Link to="/resources" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange text-white font-bold text-sm hover:opacity-90 transition-opacity">
                  <ArrowLeft size={16} /> Back to Resources
                </Link>
              </div>
            ) : (
              <article className="prose dark:prose-invert max-w-none text-secondary">
                {segments.map((seg, idx) => (
                  <div key={idx}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSlug]}
                      components={markdownComponents}
                    >
                      {seg}
                    </ReactMarkdown>

                    {idx < segments.length - 1 && (
                      <div className="not-prose my-10">
                        <AdsterraBanner
                          variant="wechat"
                          wechatLabel="Sponsored Content"
                          maxWidth="max-w-full"
                          className="!my-0"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </article>
            )}

            <div className="mt-12 mb-6">
              <AdsterraBanner
                variant="wechat"
                wechatLabel="Advertisement"
                maxWidth="max-w-full"
                className="!my-0"
              />
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                {prevArticle ? (
                  <Link to={`/resources/${prevArticle.slug}`} className="group flex flex-col items-start p-4 rounded-2xl border border-border bg-white dark:bg-bg-surface hover:border-orange/50 transition-all shadow-sm hover:shadow-md">
                    <div className="text-xs text-secondary mb-1 flex items-center gap-1">
                      <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                      Previous Article
                    </div>
                    <div className="text-sm font-bold text-primary group-hover:text-orange transition-colors line-clamp-2">
                      {prevArticle.title}
                    </div>
                  </Link>
                ) : <div />}

                {nextArticle ? (
                  <Link to={`/resources/${nextArticle.slug}`} className="group flex flex-col items-end p-4 rounded-2xl border border-border bg-white dark:bg-bg-surface hover:border-orange/50 transition-all shadow-sm hover:shadow-md text-right">
                    <div className="text-xs text-secondary mb-1 flex items-center gap-1">
                      Next Article
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="text-sm font-bold text-primary group-hover:text-orange transition-colors line-clamp-2">
                      {nextArticle.title}
                    </div>
                  </Link>
                ) : <div />}
              </div>

              <div className="flex justify-center">
                <Link to="/resources" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange text-white font-bold text-sm hover:opacity-90 transition-all shadow-sm">
                  <ArrowLeft size={16} /> Browse All Resources
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Table of Contents Sidebar */}
          {headings.length > 0 && (
            <aside className="hidden xl:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-8">
              <div className="p-5 rounded-2xl bg-white dark:bg-bg-surface border border-border shadow-sm">
                <div className="flex items-center gap-2 font-bold text-sm text-primary mb-4 pb-3 border-b border-border/60">
                  <FileText size={16} className="text-orange" />
                  Table of Contents
                </div>
                <nav className="space-y-1.5 text-xs">
                  {headings.map(h => (
                    <button
                      key={h.id}
                      onClick={() => scrollToHeading(h.id)}
                      className={cn(
                        "block w-full text-left py-1 px-2 rounded-lg text-secondary hover:text-orange hover:bg-orange/5 transition-all truncate",
                        h.level === 3 ? "pl-4 text-secondary/70 font-normal" : "font-semibold"
                      )}
                    >
                      {h.text}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
          )}
        </div>

        {/* Mobile TOC Drawer Toggle */}
        {headings.length > 0 && (
          <button
            onClick={() => setTocOpen(true)}
            className="xl:hidden fixed bottom-6 left-6 z-40 p-3 rounded-2xl bg-bg-surface border border-border shadow-xl text-primary flex items-center gap-2 text-xs font-bold hover:scale-105 active:scale-95 transition-all"
          >
            <FileText size={16} className="text-orange" />
            Table of Contents
          </button>
        )}

        {/* Scroll to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl bg-orange text-white shadow-xl flex items-center justify-center hover:opacity-90 hover:scale-105 active:scale-95 transition-all"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        )}
      </main>
    </div>
  )
}
