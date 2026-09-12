import { SITE_NAME } from '@/constants/site'
import { Helmet } from 'react-helmet-async'
import { articles } from '@/data/articles'
import { useLocation } from 'react-router-dom'

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://svgdo.com'
const OG_IMAGE = `${SITE_URL}/og-image.png`

interface Props { seoKey?: string }

export default function PageSEO({ seoKey }: Props) {
  const location = useLocation()

  let title = 'SVGDO - Free Online SVG Editor | Fast, Secure & No Upload'
  let description = 'The ultimate free online SVG editor. Experience lightning-fast, 100% local browser-based SVG editing, compression, and PNG export. Zero cloud uploads.'
  let keywords = ['SVG editor', 'free SVG editor', 'online SVG editor', 'fast SVG optimizer', 'SVG to PNG converter', 'secure vector editor', 'browser-based SVG tool']

  if (seoKey === 'resources') {
    title = 'Help Center & SVG Guides - SVGDO'
    description = 'Learn SVG editing, vector path optimization, CSS animation, and web design best practices with our comprehensive guides.'
  } else if (seoKey === 'about') {
    title = 'About SVGDO - Free Online SVG Editor'
    description = 'Explore and reshape browser-based vector graphics editing. Native, private, and lightning-fast.'
  } else if (seoKey === 'privacy') {
    title = 'Privacy Policy - SVGDO'
    description = 'SVGDO processes all images locally in your browser. Read our privacy policy — your data never leaves your device.'
  } else if (seoKey === 'terms') {
    title = 'Terms of Service - SVGDO'
    description = 'The terms of service for using SVGDO, the free online SVG editor.'
  } else if (seoKey && articles.find(a => a.slug === seoKey)) {
    const article = articles.find(a => a.slug === seoKey)!
    title = `${article.title} - SVGDO`
    description = article.excerpt
    keywords = article.tags
  }

  const cleanPath = location.pathname === '/' ? '' : (location.pathname.endsWith('/') ? location.pathname.slice(0, -1) : location.pathname)
  const canonicalUrl = `${SITE_URL}${cleanPath}`

  const jsonLd = seoKey && seoKey !== 'resources' ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title, description, url: canonicalUrl,
    inLanguage: 'en',
    datePublished: articles.find(a => a.slug === seoKey)?.date,
  } : {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: title, description, url: canonicalUrl,
    applicationCategory: 'Multimedia', operatingSystem: 'Any',
    inLanguage: 'en',
    offers: { '@type': 'Offer', price: '0' },
  }

  return (
    <Helmet>
      <html lang="en" />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={seoKey && seoKey !== 'resources' ? 'article' : 'website'} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />
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
