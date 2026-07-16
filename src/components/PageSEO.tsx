import { SITE_NAME } from '@/constants/site'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { articles } from '@/data/articles'

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://svgdo.com'

interface Props {
  seoKey?: string
}

export default function PageSEO({ seoKey }: Props) {
  const { t, i18n } = useTranslation()
  const lang = (['zh', 'en', 'ja'].includes(i18n.language) ? i18n.language : 'en') as 'zh' | 'en' | 'ja'
  const isZh = lang === 'zh'

  // Determine page title/description based on seoKey
  let title: string, description: string, keywords: string[]

  if (seoKey === 'resources') {
    title = t('common.resources.hero') + (isZh ? ' - SVG 编辑器教程与指南' : ' - SVG Editor Tutorials & Guides')
    description = t('common.resources.desc')
    keywords = ['SVG教程', 'SVG编辑器帮助', '矢量图指南', 'SVG优化', '图标设计教程', 'SVG tutorial', 'vector graphics guide', 'SVG optimization', 'icon design']
  } else if (seoKey && articles.find(a => a.slug === seoKey)) {
    const article = articles.find(a => a.slug === seoKey)!
    title = article.title[lang]
    description = article.excerpt[lang]
    keywords = article.tags
  } else {
    title = t('seo.home.title')
    description = t('seo.home.description')
    keywords = t('seo.home.keywords', { returnObjects: true }) as unknown as string[]
  }

  const canonicalUrl = seoKey ? `${SITE_URL}/resources/${seoKey}` : `${SITE_URL}/`
  const imageUrl = `${SITE_URL}/og-image.png`

  const jsonLd = seoKey && seoKey !== 'resources' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: canonicalUrl,
    inLanguage: lang,
    datePublished: articles.find(a => a.slug === seoKey)?.date,
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title,
    description: description,
    url: canonicalUrl,
    applicationCategory: 'Multimedia',
    operatingSystem: 'Any',
    inLanguage: lang,
    offers: { '@type': 'Offer', price: '0' },
  }

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={seoKey && seoKey !== 'resources' ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:locale" content={lang === 'zh' ? 'zh_CN' : lang === 'ja' ? 'ja_JP' : 'en_US'} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  )
}
