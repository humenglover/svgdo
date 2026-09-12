import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight, Calendar, Tag, ArrowUpDown, Check, ArrowLeft } from 'lucide-react'
import { articles, getTagLabel } from '@/data/articles'
import PageSEO from '@/components/PageSEO'
import Navbar from '@/components/Navbar'
import { AdsterraBanner } from '@/components/AdsterraBanner'

type SortMode = 'date-desc' | 'date-asc' | 'title'

export default function Resources() {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortMode>('date-desc')
  const [sortOpen, setSortOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

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
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTag) result = result.filter(a => a.tags.includes(activeTag))
    result.sort((a, b) => {
      if (sortBy === 'date-desc') return b.date.localeCompare(a.date)
      if (sortBy === 'date-asc') return a.date.localeCompare(b.date)
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return 0
    })
    return result
  }, [search, activeTag, sortBy])

  // Reset page when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [search, activeTag, sortBy])

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)

  const sortOptions: { value: SortMode; label: string }[] = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'title', label: 'Title (A-Z)' },
  ]

  return (
    <>
      <PageSEO seoKey="resources" />
      <div className="flex flex-col min-h-[100dvh] bg-bg-base">
        <Navbar />
        <div className="flex-1">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pt-8 sm:pb-16">
            <header className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-primary mb-3">SVG Tutorials & Guides</h1>
              <p className="text-sm sm:text-base text-secondary max-w-xl mx-auto">
                Explore in-depth tutorials, practical tips, and performance guides for scalable vector graphics.
              </p>
            </header>

            {/* Search */}
            <div className="max-w-md mx-auto mb-6">
              <div className="relative">
                <Search size={16} className="absolute left-3.5 top-3.5 text-secondary" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setActiveTag(null) }}
                  placeholder="Search tutorials, optimization tips, tags..."
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white dark:bg-bg-surface border border-border rounded-xl text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange/30 transition-all shadow-sm"
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
                  className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                    activeTag === null
                      ? 'bg-orange text-white border-orange shadow-sm'
                      : 'bg-white dark:bg-bg-surface text-secondary border-border hover:border-orange/30 hover:text-primary'
                  }`}
                >
                  All Topics
                </button>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      activeTag === tag
                        ? 'bg-orange text-white border-orange shadow-sm'
                        : 'bg-white dark:bg-bg-surface text-secondary border-border hover:border-orange/30 hover:text-primary'
                    }`}
                  >
                    {getTagLabel(tag)}
                  </button>
                ))}
              </div>
              <div className="relative shrink-0">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-secondary bg-white dark:bg-bg-surface border border-border hover:border-orange/30 hover:text-primary transition-all shadow-sm"
                >
                  <ArrowUpDown size={13} /> <span>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                </button>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                    <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-white dark:bg-bg-surface border border-border rounded-xl shadow-lg py-1 overflow-hidden">
                      {sortOptions.map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors hover:bg-orange/5 ${
                            sortBy === opt.value ? 'text-orange font-bold' : 'text-secondary'
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
              {paginated.slice(0, 3).map((article, i) => (
                <Link
                  key={article.slug}
                  to={`/resources/${article.slug}`}
                  className="group flex flex-col p-5 sm:p-6 rounded-[20px] transition-all duration-500 bg-white dark:bg-bg-surface border border-border hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] hover:border-orange/30"
                  style={{ animationDelay: `${i * 60}ms`, animation: 'fadeInUp 0.4s ease-out both' }}
                >
                  <div className="flex items-center gap-2 text-[11px] text-secondary/70 mb-2">
                    <Calendar size={12} /> <span>{article.date}</span>
                    <span className="mx-0.5">·</span>
                    <Tag size={12} /> <span>{getTagLabel(article.tags[0])}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-orange transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-orange font-bold text-xs sm:text-sm mt-auto">
                    Read Tutorial <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}

              {/* Stable Adsterra Banner */}
              {paginated.length > 0 && (
                <div key="stable-resources-ad-banner" className="col-span-full">
                  <AdsterraBanner maxWidth="max-w-full" className="!my-2" />
                </div>
              )}

              {paginated.slice(3).map((article, i) => (
                <Link
                  key={article.slug}
                  to={`/resources/${article.slug}`}
                  className="group flex flex-col p-5 sm:p-6 rounded-[20px] transition-all duration-500 bg-white dark:bg-bg-surface border border-border hover:-translate-y-1.5 hover:shadow-[0_16px_32px_rgba(0,0,0,0.06)] hover:border-orange/30"
                  style={{ animationDelay: `${(i + 3) * 60}ms`, animation: 'fadeInUp 0.4s ease-out both' }}
                >
                  <div className="flex items-center gap-2 text-[11px] text-secondary/70 mb-2">
                    <Calendar size={12} /> <span>{article.date}</span>
                    <span className="mx-0.5">·</span>
                    <Tag size={12} /> <span>{getTagLabel(article.tags[0])}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-primary mb-2 line-clamp-2 group-hover:text-orange transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary leading-relaxed line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-orange font-bold text-xs sm:text-sm mt-auto">
                    Read Tutorial <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 mb-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => { setCurrentPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="p-2 rounded-lg border border-border bg-white dark:bg-bg-surface text-secondary hover:text-primary hover:border-orange/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-1.5 mx-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setCurrentPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${
                        currentPage === i + 1
                          ? 'bg-orange text-white shadow-sm'
                          : 'bg-white dark:bg-bg-surface border border-border text-secondary hover:text-primary hover:border-orange/50'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => { setCurrentPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="p-2 rounded-lg border border-border bg-white dark:bg-bg-surface text-secondary hover:text-primary hover:border-orange/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-secondary">
                <p className="text-lg font-medium">No tutorials found matching your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
