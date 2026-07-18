/**
 * SVGDO Sitemap Generator
 * 用法: node scripts/generate-sitemap.cjs
 * 在 npm run build 后自动运行 (postbuild)
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.SITE_URL || 'https://svgdo.com'
const TODAY = new Date().toISOString().split('T')[0]

const LANGS = [
  { code: 'en', hreflang: 'en' },
  { code: 'zh', hreflang: 'zh' },
  { code: 'ja', hreflang: 'ja' },
  { code: 'ko', hreflang: 'ko' },
  { code: 'es', hreflang: 'es' },
]
const DEFAULT_LANG = 'en'

const PAGES = [
  { path: '/',              priority: '1.0', changefreq: 'weekly' },
  { path: '/about',          priority: '0.6', changefreq: 'monthly' },
  { path: '/privacy',       priority: '0.3', changefreq: 'monthly' },
  { path: '/resources',     priority: '0.8', changefreq: 'weekly' },
  { path: '/resources/svg-basics',         priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-vs-png',         priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-optimization',   priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-animation',      priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-icons-guide',    priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-in-web',         priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-editor-guide',   priority: '0.7', changefreq: 'monthly' },
  { path: '/resources/svg-to-png-guide',   priority: '0.7', changefreq: 'monthly' },
]

function generate() {
  const allUrls = []
  
  PAGES.forEach(p => {
    LANGS.forEach(lang => {
      // The actual path for this language variant
      const localizedPath = lang.code === DEFAULT_LANG 
        ? p.path 
        : (p.path === '/' ? `/${lang.code}/` : `/${lang.code}${p.path}`)
      
      const locUrl = `${SITE_URL}${localizedPath}`

      // Generate alternates for this URL block (must include self)
      const alternates = LANGS.map(l => {
        const altPath = l.code === DEFAULT_LANG 
          ? p.path 
          : (p.path === '/' ? `/${l.code}/` : `/${l.code}${p.path}`)
        return `    <xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${SITE_URL}${altPath}"/>`
      }).join('\n')

      const urlBlock = `  <url>
    <loc>${locUrl}</loc>
${alternates}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${TODAY}</lastmod>
  </url>`
      
      allUrls.push(urlBlock)
    })
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls.join('\n')}
</urlset>
`

  const baseDir = path.resolve(__dirname, '..')
  for (const target of ['public', 'dist']) {
    const outPath = path.resolve(baseDir, target, 'sitemap.xml')
    fs.writeFileSync(outPath, sitemap, 'utf-8')
    console.log(`✓ sitemap.xml → ${outPath}`)
  }
  console.log(`  ${allUrls.length} URLs generated`)
}

generate()
