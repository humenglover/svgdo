/**
 * SVGDO Sitemap Generator (English Only)
 * Usage: node scripts/generate-sitemap.cjs
 */

const fs = require('fs')
const path = require('path')

const SITE_URL = process.env.SITE_URL || 'https://svgdo.com'
const TODAY = new Date().toISOString().split('T')[0]

const PAGES = [
  { path: '', priority: '1.0', changefreq: 'weekly' },
  { path: 'about', priority: '0.6', changefreq: 'monthly' },
  { path: 'privacy', priority: '0.3', changefreq: 'monthly' },
  { path: 'terms', priority: '0.3', changefreq: 'monthly' },
  { path: 'resources', priority: '0.8', changefreq: 'weekly' },
]

// Dynamically extract article slugs from articles.ts
try {
  const articlesPath = path.resolve(__dirname, '..', 'src', 'data', 'articles.ts')
  const articlesContent = fs.readFileSync(articlesPath, 'utf-8')
  
  const slugRegex = /slug:\s*['"]([^'"]+)['"]/g
  let match
  while ((match = slugRegex.exec(articlesContent)) !== null) {
    const slug = match[1]
    PAGES.push({ path: `resources/${slug}`, priority: '0.7', changefreq: 'monthly' })
  }
} catch (error) {
  console.warn("Could not read articles.ts to dynamically add articles to sitemap:", error.message)
}

function generate() {
  const urlBlocks = PAGES.map(p => {
    const locUrl = p.path === '' ? `${SITE_URL}/` : `${SITE_URL}/${p.path}`
    return `  <url>
    <loc>${locUrl}</loc>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <lastmod>${TODAY}</lastmod>
  </url>`
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks.join('\n')}
</urlset>
`

  const baseDir = path.resolve(__dirname, '..')
  for (const target of ['public', 'dist']) {
    const outDir = path.resolve(baseDir, target)
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true })
    }
    const outPath = path.resolve(outDir, 'sitemap.xml')
    fs.writeFileSync(outPath, sitemap, 'utf-8')
    console.log(`✓ sitemap.xml → ${outPath}`)
  }
  console.log(`  ${urlBlocks.length} URLs generated`)
}

generate()
