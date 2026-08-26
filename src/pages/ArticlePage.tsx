import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
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
import { AdSenseUnit } from '@/components/AdSenseUnit'
import { DEFAULT_LANGUAGE } from '@/locales/config'

const TOC_LABELS: Record<string, string> = {
  zh: '文章目录',
  en: 'Table of Contents',
  ja: '目次',
  ko: '목차',
  es: 'Tabla de contenido'
}

export default function ArticlePage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
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
    setLoading(true); setError(false)
    const suffix = lang === 'en' ? '' : `.${lang}`
    fetch(`/content/${slug}${suffix}.md`)
      .then(r => { if (!r.ok) throw new Error(''); return r.text() })
      .then(setContent)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug, lang])

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
    const onScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToHeading = (e: React.MouseEvent<HTMLAnchorElement>, id: string, text: string) => {
    e.preventDefault()
    let element = document.getElementById(id)
    if (!element) {
      // Fallback: find heading by text if rehypeSlug ID doesn't exactly match
      const headings = Array.from(document.querySelectorAll('h2, h3'))
      element = headings.find(h => h.textContent?.includes(text)) as HTMLElement
    }
    if (element) {
      const container = document.querySelector('main') || window
      container.scrollBy({ top: element.getBoundingClientRect().top - 80, behavior: 'smooth' })
    }
    setTocOpen(false)
  }

  if (!article) return (
    <div className="flex-1 flex items-center justify-center bg-bg-base">
      <div className="text-center">
        <p className="text-xl font-bold text-primary mb-2">404</p>
        <p className="text-secondary">{t('common.resources.notFound')}</p>
        <Link to={i18n.language === DEFAULT_LANGUAGE ? '/resources' : `/${i18n.language}/resources`} className="text-orange text-sm mt-4 inline-block hover:underline"><ArrowLeft size={14} className="inline mr-1" />{t('common.resources.back')}</Link>
      </div>
    </div>
  )

  if (loading) return (
    <div className="flex-1 bg-bg-base overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-pulse">
        <div className="h-4 bg-bg-muted rounded w-32 mb-6" />
        <div className="h-8 bg-bg-muted rounded w-3/4 mb-4" />
        <div className="h-4 bg-bg-muted rounded w-1/2 mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-bg-muted rounded" />
          <div className="h-4 bg-bg-muted rounded w-5/6" />
          <div className="h-4 bg-bg-muted rounded w-4/6" />
        </div>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex-1 flex items-center justify-center bg-bg-base">
      <div className="text-center">
        <p className="text-xl font-bold text-primary mb-2">{t('common.resources.loadFail')}</p>
        <Link to={i18n.language === DEFAULT_LANGUAGE ? '/resources' : `/${i18n.language}/resources`} className="text-orange text-sm hover:underline"><ArrowLeft size={14} className="inline mr-1" />{t('common.resources.back')}</Link>
      </div>
    </div>
  )

  return (
    <>
      <PageSEO seoKey={article.slug} />
      <div className="flex flex-col min-h-[100dvh] bg-bg-base relative">
        <Navbar />
        <div className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 pt-2 pb-12 sm:pt-4 sm:pb-16 flex flex-col lg:flex-row gap-8 xl:gap-16">
          
          {/* PC TOC Sidebar */}
          {headings.length > 0 && (
            <>
              {/* Spacer to preserve flex layout space */}
              <div className="hidden lg:block w-[260px] shrink-0" />
              {/* Fixed TOC — no sticky jitter */}
              <nav
                className="hidden lg:block fixed top-[72px] max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar z-20 overscroll-contain"
                style={{ width: '260px', left: 'max(24px, calc((100vw - 1200px) / 2 + 24px))' }}
              >
                <h3 className="text-sm font-bold text-primary mb-4 uppercase tracking-wider">{TOC_LABELS[lang] || TOC_LABELS['en']}</h3>
                <ul className="space-y-3 text-sm pb-24 pr-4">
                  {headings.map(h => (
                    <li key={h.id} className={cn("line-clamp-2 leading-relaxed", h.level === 3 && "pl-4")}>
                      <a
                        href={`#${h.id}`}
                        onClick={(e) => scrollToHeading(e, h.id, h.text)}
                        className="text-secondary hover:text-orange transition-colors"
                      >
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </>
          )}

          <div className="flex-1 max-w-3xl w-full mx-auto lg:mx-0">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">
              {article.title[lang]}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-secondary/70">
              <span className="flex items-center gap-1"><Calendar size={14} />{article.date}</span>
              <span className="flex items-center gap-1"><Clock size={14} />{t('common.resources.approxRead')}</span>
              <span className="flex items-center gap-1"><Tag size={14} />{article.tags.map(t => getTagLabel(t, lang)).join(', ')}</span>
            </div>
          </div>

          <article className={cn(
            'prose prose-sm sm:prose-base lg:prose-lg max-w-none',
            'prose-headings:text-primary prose-headings:font-bold prose-headings:tracking-tight',
            'prose-p:text-secondary prose-p:leading-relaxed',
            'prose-a:text-orange prose-a:no-underline hover:prose-a:underline',
            'prose-strong:text-primary prose-code:text-orange prose-code:bg-orange/5 prose-code:px-1 prose-code:py-0.5 prose-code:rounded',
            'prose-blockquote:border-l-orange prose-blockquote:bg-orange/5 prose-blockquote:rounded-r-lg prose-blockquote:py-0.5 prose-blockquote:pr-4',
            'prose-li:text-secondary prose-li:leading-relaxed',
            'prose-table:border prose-table:rounded-lg prose-th:bg-bg-subtle prose-th:text-primary prose-th:font-semibold prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2 prose-td:border-b prose-td:border-border',
            'prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto prose-img:block prose-img:my-8',
            'dark:prose-headings:text-primary dark:prose-p:text-secondary/90 dark:prose-strong:text-primary dark:prose-code:bg-orange/10 dark:prose-blockquote:bg-orange/10 dark:prose-li:text-secondary/90',
            '[&>h1]:hidden',
            '[&_svg]:max-w-full [&_svg]:h-auto'
          )}>
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw, rehypeSlug]}
              components={{
                p: (props) => {
                  const { node, ...rest } = props
                  const hasImage = node?.children?.some((c: any) => c.tagName === 'img')
                  if (hasImage) {
                    return <div className="my-6" {...rest} />
                  }
                  return <p {...rest} />
                },
                img: ({ node, ...props }) => (
                  <Zoom>
                    <img {...props} />
                  </Zoom>
                ),
                svg: ({ node, ...props }) => {
                  const { width, height } = props as any
                  const svgProps: any = { ...props }
                  // Add viewBox if missing so the SVG scales responsively
                  if (!svgProps.viewBox && width && height) {
                    svgProps.viewBox = `0 0 ${parseInt(width)} ${parseInt(height)}`
                  }
                  return <svg {...svgProps} />
                }
              }}
            >
              {content}
            </ReactMarkdown>
          </article>

          <div className="mt-12 pt-8 border-t border-border">
            {/* Prev / Next Article Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {prevArticle ? (
                <Link to={i18n.language === DEFAULT_LANGUAGE ? `/resources/${prevArticle.slug}` : `/${i18n.language}/resources/${prevArticle.slug}`} className="group flex flex-col items-start p-4 rounded-2xl border border-border bg-white dark:bg-bg-surface hover:border-orange/50 transition-all shadow-sm hover:shadow-md">
                  <div className="text-xs text-secondary mb-1 flex items-center gap-1">
                    <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
                    {lang === 'zh' ? '上一篇' : 'Previous Article'}
                  </div>
                  <div className="text-sm font-bold text-primary group-hover:text-orange transition-colors line-clamp-2">
                    {prevArticle.title[lang]}
                  </div>
                </Link>
              ) : <div />}
              
              {nextArticle ? (
                <Link to={i18n.language === DEFAULT_LANGUAGE ? `/resources/${nextArticle.slug}` : `/${i18n.language}/resources/${nextArticle.slug}`} className="group flex flex-col items-end p-4 rounded-2xl border border-border bg-white dark:bg-bg-surface hover:border-orange/50 transition-all shadow-sm hover:shadow-md text-right">
                  <div className="text-xs text-secondary mb-1 flex items-center gap-1">
                    {lang === 'zh' ? '下一篇' : 'Next Article'}
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="text-sm font-bold text-primary group-hover:text-orange transition-colors line-clamp-2">
                    {nextArticle.title[lang]}
                  </div>
                </Link>
              ) : <div />}
            </div>

            <div className="mb-8">
              <AdSenseUnit adSlot="2586065619" />
            </div>
            <div className="flex justify-center">
              <Link to={i18n.language === DEFAULT_LANGUAGE ? '/resources' : `/${i18n.language}/resources`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange text-white font-bold text-sm hover:opacity-90 transition-all shadow-sm">
                <ArrowLeft size={16} />{t('common.resources.browse')}
              </Link>
            </div>
          </div>
          </div>
        </div>

        {/* Mobile TOC Drawer */}
        {headings.length > 0 && (
          <div className="lg:hidden">
            <button 
              onClick={() => setTocOpen(true)}
              className="fixed bottom-6 left-6 z-40 bg-orange text-white p-3.5 rounded-full shadow-lg hover:scale-105 transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            
            {tocOpen && (
              <div className="fixed inset-0 z-50 flex justify-start">
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setTocOpen(false)} />
                <div className="relative w-[85%] max-w-sm bg-bg-surface h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-left-full">
                  <button onClick={() => setTocOpen(false)} className="absolute top-4 right-4 p-2 text-secondary hover:text-primary bg-bg-subtle rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                  <h3 className="text-lg font-bold text-primary mb-6">{TOC_LABELS[lang] || TOC_LABELS['en']}</h3>
                  <ul className="space-y-4 text-sm overscroll-contain">
                    {headings.map(h => (
                      <li key={h.id} className={cn(h.level === 3 && "pl-4")}>
                        <a 
                          href={`#${h.id}`} 
                          onClick={(e) => scrollToHeading(e, h.id, h.text)}
                          className="text-secondary hover:text-orange transition-colors block leading-relaxed"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          title={t('common.resources.backToTop')}
          aria-label={t('common.resources.backToTop')}
          className={cn(
            "fixed bottom-6 right-6 lg:bottom-8 z-30 bg-orange text-white p-3.5 rounded-full shadow-lg hover:scale-105 transition-all duration-300",
            showScrollTop ? "opacity-100 scale-100" : "opacity-0 scale-75 pointer-events-none"
          )}
        >
          <ArrowUp size={22} />
        </button>

      </div>
    </>
  )
}
