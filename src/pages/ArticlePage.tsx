import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Tag, Clock, FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { articles, getTagLabel } from '@/data/articles'
import { cn } from '@/utils'
import PageSEO from '@/components/PageSEO'

export default function ArticlePage() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language?.startsWith('zh') ? 'zh' : 'en') as 'zh' | 'en'
  const { slug } = useParams<{ slug: string }>()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const article = articles.find(a => a.slug === slug)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(false)
    const suffix = lang === 'en' ? '' : `.${lang}`
    fetch(`/content/${slug}${suffix}.md`)
      .then(r => { if (!r.ok) throw new Error(''); return r.text() })
      .then(setContent)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [slug, lang])

  if (!article) return (
    <div className="flex-1 flex items-center justify-center bg-bg-base">
      <div className="text-center">
        <p className="text-xl font-bold text-primary mb-2">404</p>
        <p className="text-secondary">{t('common.resources.notFound')}</p>
        <Link to="/resources" className="text-orange text-sm mt-4 inline-block hover:underline"><ArrowLeft size={14} className="inline mr-1" />{t('common.resources.back')}</Link>
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
        <Link to="/resources" className="text-orange text-sm hover:underline">�?{t('common.resources.back')}</Link>
      </div>
    </div>
  )

  return (
    <>
      <PageSEO seoKey={article.slug} />
      <div className="flex flex-col h-[100dvh] bg-bg-base overflow-hidden">
        <header className="h-14 flex items-center px-4 md:px-8 border-b border-border bg-bg-surface shrink-0 z-10">
          <Link to="/resources" className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">{t('common.resources.back')}</span>
          </Link>
        </header>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="mb-8">
            <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center text-orange mb-3">
              <FileText size={20} />
            </div>
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
            'prose-img:rounded-xl prose-img:shadow-md',
            'dark:prose-headings:text-primary dark:prose-p:text-secondary/90 dark:prose-strong:text-primary dark:prose-code:bg-orange/10 dark:prose-blockquote:bg-orange/10 dark:prose-li:text-secondary/90'
          )}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>

          <div className="mt-12 pt-8 border-t border-border">
            <Link to="/resources" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-orange text-white font-bold text-sm hover:opacity-90 transition-all shadow-sm">
              <ArrowLeft size={16} />{t('common.resources.browse')}
            </Link>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}

