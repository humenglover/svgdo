import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Calendar, Tag, ArrowUpDown, Check, FileText, ArrowLeft } from 'lucide-react'
import { articles, getTagLabel } from '@/data/articles'
import PageSEO from '@/components/PageSEO'
import { DEFAULT_LANGUAGE } from '@/locales/config'

type SortMode = 'date-desc' | 'date-asc' | 'title'

export default function Resources() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortMode>('date-desc')
  const [sortOpen, setSortOpen] = useState(false)

  const allTags = useMemo(() => {
    const tagSet = new Set<string>()
    articles.forEach(a => a.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [])

  const filtered = useMemo(() => {
    let result = [...articles]
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(a =>
        a.title[lang].toLowerCase().includes(q) ||
        a.excerpt[lang].toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTag) result = result.filter(a => a.tags.includes(activeTag))
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date)
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date)
      if (sortBy === 'title') return a.title[lang].localeCompare(b.title[lang])
      return 0
    })
    return result
  }, [search, activeTag, sortBy, lang])

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: 'date-desc', label: t('common.resources.sortDateDesc') },
    { value: 'date-asc', label: t('common.resources.sortDateAsc') },
    { value: 'title', label: t('common.resources.sortTitle') },
  ]

  return (
    <>
      <PageSEO seoKey="resources" />
      <div className="flex flex-col h-[100dvh] bg-bg-base overflow-hidden">
        <header className="h-14 flex items-center px-4 md:px-8 border-b border-border bg-bg-surface shrink-0 z-10">
          <Link to={i18n.language === DEFAULT_LANGUAGE ? '/' : `/${i18n.language}/`} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={20} />
            <span className="font-bold text-sm">{t('common.nav.backToHome')}</span>
          </Link>
        </header>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          {/* Hero */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-3 tracking-tight">{t('common.resources.hero')}</h1>
            <p className="text-sm sm:text-base text-secondary max-w-2xl mx-auto leading-relaxed">{t('common.resources.desc')}</p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-5">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-secondary" />
              <input
                type="text" value={search} onChange={e => { setSearch(e.target.value); setActiveTag(null) }}
                placeholder={t('common.resources.search')}
                className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-bg-surface border border-border rounded-xl text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/30 transition-all"
              />
            </div>
          </div>

          {/* Tags + Sort */}
          <div className="flex items-center w-full gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div
              className="flex-1 min-w-0 overflow-x-auto flex items-center gap-2 pb-3 -mb-3"
              onWheel={e => { if (Math.abs(e.deltaY) > 0) e.currentTarget.scrollLeft += e.deltaY }}
            >
              <button
                onClick={() => setActiveTag(null)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                  activeTag === null ? 'bg-orange text-white border-orange shadow-sm' : 'bg-white dark:bg-bg-surface text-secondary border-border hover:border-orange/30 hover:text-primary'
                }`}
              >
                {t('common.resources.all')}
              </button>
              {allTags.map(tag => (
                <button
                  key={tag} onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                    activeTag === tag ? 'bg-orange text-white border-orange shadow-sm' : 'bg-white dark:bg-bg-surface text-secondary border-border hover:border-orange/30 hover:text-primary'
                  }`}
                >
                  {getTagLabel(tag, lang)}
                </button>
              ))}
            </div>
            <div className="relative shrink-0">
              <button onClick={() => setSortOpen(!sortOpen)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-secondary bg-white dark:bg-bg-surface border border-border hover:border-orange/30 hover:text-primary transition-all">
                <ArrowUpDown size={13} /> <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
              </button>
              {sortOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-bg-surface border border-border rounded-xl shadow-lg py-1 overflow-hidden">
                    {sortOptions.map(opt => (
                      <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors hover:bg-orange/5 ${
                          sortBy === opt.value ? 'text-orange' : 'text-secondary'
                        }`}
                      >
                        {opt.label} {sortBy === opt.value && <Check size={13} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Article cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {filtered.map((article, i) => (
              <Link
                key={article.slug}
                to={i18n.language === DEFAULT_LANGUAGE ? `/resources/${article.slug}` : `/${i18n.language}/resources/${article.slug}`}
                className="group flex flex-col p-5 sm:p-6 rounded-[20px] transition-all duration-500 bg-white dark:bg-bg-surface border border-border hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] hover:border-orange/30"
                style={{ animationDelay: `${i * 60}ms`, animation: 'fadeInUp 0.4s ease-out both' }}
              >
                <div className="flex items-center gap-2 text-[11px] text-secondary/70 mb-2">
                  <Calendar size={12} /> <span>{article.date}</span>
                  <span className="mx-0.5">·</span>
                  <Tag size={12} /> <span>{getTagLabel(article.tags[0], lang)}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-orange transition-colors">
                  {article.title[lang]}
                </h3>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed line-clamp-3 mb-4 flex-1">
                  {article.excerpt[lang]}
                </p>
                <div className="flex items-center gap-1.5 text-orange font-bold text-xs sm:text-sm mt-auto">
                  {t('common.resources.read')} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-secondary">
              <p className="text-lg font-medium">{t('common.resources.empty')}</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  )
}

