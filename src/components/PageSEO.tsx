import { SITE_NAME } from '@/constants/site'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { articles } from '@/data/articles'
import { LANGUAGES, DEFAULT_LANGUAGE } from '@/locales/config'
import { getLanguageByCode } from '@/locales/i18n'
import { useLocation } from 'react-router-dom'

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://svgdo.com'
const OG_IMAGE = `${SITE_URL}/og-image.png`

interface Props { seoKey?: string }

export default function PageSEO({ seoKey }: Props) {
  const { t, i18n } = useTranslation()
  const lang = getLanguageByCode(i18n.language) || LANGUAGES[0]
  const location = useLocation()

  let title: string, description: string, keywords: string[]

  if (seoKey === 'resources') {
    title = t('common.resources.seoTitle')
    description = t('common.resources.desc')
    keywords = (t('seo.home.keywords', { returnObjects: true }) as unknown as string[]) || []
  } else if (seoKey === 'about') {
    title = t('pages.about.title', 'About') + ' - SVGDO'
    description = t('pages.about.subtitle', 'About SVGDO')
    keywords = (t('seo.home.keywords', { returnObjects: true }) as unknown as string[]) || []
  } else if (seoKey === 'privacy') {
    title = t('pages.privacy.title', 'Privacy Policy') + ' - SVGDO'
    description = t('pages.privacy.lastUpdated', 'Privacy Policy')
    keywords = (t('seo.home.keywords', { returnObjects: true }) as unknown as string[]) || []
  } else if (seoKey === 'terms') {
    title = t('pages.terms.title', 'Terms of Service') + ' - SVGDO'
    description = t('pages.terms.lastUpdated', 'Terms of Service')
    keywords = (t('seo.home.keywords', { returnObjects: true }) as unknown as string[]) || []
  } else if (seoKey && articles.find(a => a.slug === seoKey)) {
    const article = articles.find(a => a.slug === seoKey)!
    title = article.title[i18n.language] || article.title.en
    description = article.excerpt[i18n.language] || article.excerpt.en
    keywords = article.tags
  } else {
    title = t('seo.home.title')
    description = t('seo.home.description')
    keywords = (t('seo.home.keywords', { returnObjects: true }) as unknown as string[]) || []
  }

  const parts = location.pathname.split('/').filter(Boolean)
  const hasLangPrefix = LANGUAGES.some(l => l.code === parts[0])
  const pathWithoutLang = hasLangPrefix ? '/' + parts.slice(1).join('/') : location.pathname
  // Normalize trailing slash
  const cleanPath = pathWithoutLang === '/' ? '' : (pathWithoutLang.endsWith('/') ? pathWithoutLang.slice(0, -1) : pathWithoutLang)

  const canonicalUrl = `${SITE_URL}${i18n.language === DEFAULT_LANGUAGE ? cleanPath : `/${i18n.language}${cleanPath}`}`

  const jsonLd = seoKey && seoKey !== 'resources' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title, description, url: canonicalUrl,
    inLanguage: lang.code,
    datePublished: articles.find(a => a.slug === seoKey)?.date,
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title, description, url: canonicalUrl,
    applicationCategory: 'Multimedia', operatingSystem: 'Any',
    inLanguage: lang.code,
    offers: { '@type': 'Offer', price: '0' },
  }

  return (
    <Helmet>
      <html lang={lang.htmlLang} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Hreflang alternates for all supported languages */}
      {LANGUAGES.map(l => (
        <link key={l.code} rel="alternate" hrefLang={l.code} href={`${SITE_URL}${l.code === DEFAULT_LANGUAGE ? cleanPath : `/${l.code}${cleanPath}`}`} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}${cleanPath}`} />

      {/* Open Graph */}
      <meta property="og:type" content={seoKey && seoKey !== 'resources' ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={lang.ogLocale} />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE} />

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
