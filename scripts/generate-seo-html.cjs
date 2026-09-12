/**
 * generate-seo-html.cjs (Pure English Version)
 *
 * 为 SVGDO 生成纯英文 SEO 静态预渲染 HTML。
 * 彻底移除多语言支持，确保 Google 抓取到 100% 原创富文本英文内容。
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const PUBLIC = path.join(ROOT, 'public')
const SITE = 'https://svgdo.com'
const OG_IMAGE = `${SITE}/og-image.png`
const CONTACT_EMAIL = 'shengqiangwang666@gmail.com'

/* ─── 页面级 SEO 元数据 ────────────────────────────── */
const PAGE_SEO = {
  home: {
    title: 'SVGDO - Free Online SVG Editor | Fast, Secure & No Upload',
    description: 'The ultimate free online SVG editor. Experience lightning-fast, 100% local browser-based SVG editing, compression, path manipulation, and PNG export. Zero cloud uploads. Secure and private.',
    h1: 'SVGDO - Free Online SVG Editor & Vector Suite',
  },
  resources: {
    title: 'Help Center & SVG Guides - SVG Editor Tutorials & Best Practices',
    description: 'Learn SVG editing, vector path optimization, CSS/SMIL animation, and web design best practices with our in-depth guides.',
    h1: 'SVG Tutorials, Guides & Best Practices',
  },
  about: {
    title: 'About SVGDO - Free Online SVG Editor & Mission',
    description: 'SVGDO is a free, 100% private, browser-based SVG editor. No uploads, no accounts, no data leaving your device.',
    h1: 'About SVGDO - Local-First Vector Engineering',
  },
  privacy: {
    title: 'Privacy Policy - SVGDO',
    description: 'SVGDO processes all vector images locally in your browser memory. Read our privacy policy — your data never leaves your device.',
    h1: 'Privacy Policy',
  },
  terms: {
    title: 'Terms of Service - SVGDO',
    description: 'The terms of service for using SVGDO, the free online SVG editor.',
    h1: 'Terms of Service',
  },
}

/* ─── 常见问题 FAQ 库 ──────────────────────────────────── */
const FAQ_DATA = [
  {
    q: 'What is SVGDO and how does it work?',
    a: 'SVGDO is a free, modern online SVG editor and vector optimizer that runs 100% inside your web browser. It allows you to view, edit, clean, transform, and convert Scalable Vector Graphics (SVG) with real-time visual and code synchronization.',
  },
  {
    q: 'Are my SVG files uploaded to any server?',
    a: 'No. SVGDO uses a 100% client-side, local-first architecture. All parsing, rendering, and exporting algorithms execute entirely in your browser memory. Your files and proprietary designs are never uploaded to any remote server or cloud storage.',
  },
  {
    q: 'Can I export SVG to high-resolution PNG or JPG?',
    a: 'Yes. SVGDO includes a built-in raster export pipeline supporting custom resolution scales (1x, 2x, 4x, 8x), transparency controls, and multiple output formats including PNG, JPEG, and WebP.',
  },
  {
    q: 'How does the SVG optimizer reduce file size?',
    a: 'Our optimization engine strips redundant metadata, editor comments, empty groups, and unnecessary XML attributes while rounding decimal precision in path commands. This typically reduces SVG file size by 30% to 70% without any visible loss in visual quality.',
  },
  {
    q: 'Is SVGDO free for commercial use?',
    a: 'Yes, SVGDO is completely free for both personal and commercial use. There are no subscriptions, account signups, or usage limits.',
  },
]

/* ─── 工具函数 ─────────────────────────────────────────────── */
function extractArticles() {
  const src = fs.readFileSync(path.join(ROOT, 'src', 'data', 'articles.ts'), 'utf8')
  const blocks = src.split(/slug:\s*'/).slice(1)
  const articles = []
  for (const block of blocks) {
    const slug = block.slice(0, block.indexOf("'"))
    
    // Extract title
    const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/)
    const title = titleMatch ? titleMatch[1] : slug

    // Extract date
    const dateMatch = block.match(/date:\s*'([^']+)'/)
    const date = dateMatch ? dateMatch[1] : '2026-07-20'

    // Extract excerpt
    const excerptMatch = block.match(/excerpt:\s*['"]([^'"]+)['"]/)
    const excerpt = excerptMatch ? excerptMatch[1] : ''

    // Extract tags
    const tagsMatch = block.match(/tags:\s*\[([^\]]+)\]/)
    const tags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean) : ['SVG']

    articles.push({ slug, title, excerpt, date, tags })
  }
  return articles
}

function extractAssetTags(template) {
  const tags = template.match(/<script[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/g) || []
  const preloads = template.match(/<link[^>]*rel="modulepreload"[^>]*href="\/assets\/[^"]*"[^>]*>/g) || []
  const css = template.match(/<link[^>]*rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/g) || []
  const adsense = template.match(/<script[^>]*adsbygoogle[^>]*><\/script>/g) || []
  const gtagLoader = template.match(/<script[^>]*googletagmanager\.com\/gtag[^>]*><\/script>/g) || []
  let gtagInline = ''
  const inlineStart = template.indexOf('window.dataLayer')
  if (inlineStart > -1) {
    const scriptStart = template.lastIndexOf('<script>', inlineStart)
    const scriptEnd = template.indexOf('</script>', inlineStart) + '</script>'.length
    if (scriptStart > -1 && scriptEnd > scriptStart) gtagInline = template.slice(scriptStart, scriptEnd)
  }
  return { tags, preloads, css, adsense, gtagLoader, gtagInline }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function pageUrl(pagePath) {
  return pagePath === '' ? SITE : `${SITE}/${pagePath}`
}

function relativeHref(pagePath) {
  return pagePath === '' ? '/' : `/${pagePath}`
}

/* ─── 统一 HTML 骨架渲染函数 ─────────────────────────────────── */
function renderNavbar() {
  return `
    <header style="background:#0f172a;border-bottom:1px solid #1e293b;padding:12px 24px;color:#f8fafc;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:#f8fafc;font-weight:800;font-size:20px;">
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="#f97316"/><path d="M9 16L14 21L23 11" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span>SVGDO</span>
      </a>
      <nav style="display:flex;align-items:center;gap:18px;font-size:14px;font-weight:600;">
        <a href="/" style="color:#cbd5e1;text-decoration:none;">Editor</a>
        <a href="/resources" style="color:#cbd5e1;text-decoration:none;">Tutorials & Guides</a>
        <a href="/about" style="color:#cbd5e1;text-decoration:none;">About Us</a>
        <a href="/privacy" style="color:#cbd5e1;text-decoration:none;">Privacy Policy</a>
        <a href="/terms" style="color:#cbd5e1;text-decoration:none;">Terms of Service</a>
      </nav>
    </header>
  `
}

function renderFooter() {
  return `
    <footer style="background:#090d16;border-top:1px solid #1e293b;padding:40px 24px 30px;color:#94a3b8;font-size:14px;margin-top:auto;">
      <div style="max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;justify-content:space-between;gap:30px;">
        <div style="max-width:360px;">
          <div style="font-weight:800;font-size:18px;color:#f8fafc;margin-bottom:8px;">SVGDO - Free Online SVG Editor</div>
          <p style="line-height:1.6;color:#64748b;margin:0;">100% private, client-side vector graphics suite. Zero uploads, lightning fast, instant conversion and export.</p>
        </div>
        <div>
          <div style="font-weight:700;color:#f8fafc;margin-bottom:12px;">Quick Links</div>
          <ul style="list-style:none;padding:0;margin:0;line-height:2;">
            <li><a href="/" style="color:#94a3b8;text-decoration:none;">Editor</a></li>
            <li><a href="/resources" style="color:#94a3b8;text-decoration:none;">Tutorials & Guides</a></li>
            <li><a href="/about" style="color:#94a3b8;text-decoration:none;">About Us</a></li>
            <li><a href="/privacy" style="color:#94a3b8;text-decoration:none;">Privacy Policy</a></li>
            <li><a href="/terms" style="color:#94a3b8;text-decoration:none;">Terms of Service</a></li>
          </ul>
        </div>
        <div>
          <div style="font-weight:700;color:#f8fafc;margin-bottom:12px;">Support & Contact</div>
          <p style="margin:0 0 8px;color:#64748b;">Questions or bug reports? Reach us anytime:</p>
          <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;text-decoration:none;font-weight:600;">${CONTACT_EMAIL}</a>
        </div>
      </div>
      <div style="max-width:1100px;margin:30px auto 0;padding-top:20px;border-top:1px solid #1e293b;text-align:center;color:#475569;font-size:13px;">
        © 2026 SVGDO. All rights reserved. 100% Client-Side Vector Engineering.
      </div>
    </footer>
  `
}

/* ─── 页面主体 HTML 构建器 ──────────────────────────────────── */
function buildHomeBody(articles) {
  const recentArticles = articles.slice(0, 6)

  return `
    ${renderNavbar()}
    <main style="max-width:1100px;margin:0 auto;padding:40px 20px;color:#1e293b;line-height:1.7;">
      <!-- Hero -->
      <section style="text-align:center;padding:40px 0 30px;">
        <h1 style="font-size:2.5rem;font-weight:900;color:#0f172a;line-height:1.2;margin-bottom:16px;">${esc(PAGE_SEO.home.h1)}</h1>
        <p style="font-size:1.2rem;color:#475569;max-width:760px;margin:0 auto 24px;">${esc(PAGE_SEO.home.description)}</p>
        <div style="display:inline-flex;gap:12px;">
          <a href="/" style="background:#f97316;color:#ffffff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">Start Editing SVG</a>
          <a href="/resources" style="background:#f1f5f9;color:#0f172a;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">Browse Tutorials</a>
        </div>
      </section>

      <!-- Key Features Grid -->
      <section style="margin:50px 0;padding:30px 0;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:30px;">Why Choose SVGDO Online SVG Editor?</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(240px, 1fr));gap:24px;">
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">🔒 100% Local & Private</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">All SVG processing happens in your browser RAM. Zero server uploads, zero data leakage.</p>
          </div>
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">⚡ Visual & Code Sync</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">Inspect and edit SVG elements visually or tweak raw XML path data with instant live preview.</p>
          </div>
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">📉 Lossless Optimizer</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">Strip useless metadata, round coordinates, and compress SVG file sizes by up to 70%.</p>
          </div>
          <div style="background:#f8fafc;padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
            <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;">🖼️ High-Res Multi-Format Export</h3>
            <p style="color:#64748b;font-size:14px;margin:0;">Convert SVG to crisp PNG, JPEG, and WebP at 1x, 2x, 4x, or custom dimensions.</p>
          </div>
        </div>
      </section>

      <!-- How to use -->
      <section style="margin:50px 0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:24px;">How to Edit & Optimize SVG Online</h2>
        <div style="max-width:800px;margin:0 auto;display:flex;flex-direction:column;gap:16px;">
          <div style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;font-weight:600;color:#334155;">1. Load SVG: Drop your SVG file, paste raw code, or choose from our built-in icon presets.</div>
          <div style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;font-weight:600;color:#334155;">2. Edit & Optimize: Adjust paths, colors, viewBox, stroke styles, and apply instant code minification.</div>
          <div style="padding:16px 20px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;font-weight:600;color:#334155;">3. Download & Export: Save clean SVG code or export to ultra-clear PNG with one click.</div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section style="margin:50px 0;padding-top:30px;border-top:1px solid #e2e8f0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:30px;">Frequently Asked Questions</h2>
        <div style="max-width:850px;margin:0 auto;display:flex;flex-direction:column;gap:20px;">
          ${FAQ_DATA.map(faq => `
            <div style="background:#f8fafc;padding:22px;border-radius:14px;border:1px solid #e2e8f0;">
              <h3 style="font-size:1.1rem;font-weight:700;color:#0f172a;margin-bottom:8px;">${esc(faq.q)}</h3>
              <p style="color:#475569;font-size:15px;margin:0;">${esc(faq.a)}</p>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Featured Tutorials -->
      <section style="margin:50px 0;padding-top:30px;border-top:1px solid #e2e8f0;">
        <h2 style="font-size:1.8rem;font-weight:800;color:#0f172a;text-align:center;margin-bottom:30px;">Explore SVG Tutorials & Best Practices</h2>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(300px, 1fr));gap:20px;">
          ${recentArticles.map(a => `
            <article style="background:#ffffff;padding:24px;border-radius:16px;border:1px solid #e2e8f0;display:flex;flex-direction:column;justify-content:space-between;">
              <div>
                <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">${a.date}</div>
                <h3 style="font-size:1.15rem;font-weight:700;color:#0f172a;margin-bottom:10px;line-height:1.4;">
                  <a href="/resources/${a.slug}" style="color:#0f172a;text-decoration:none;">${esc(a.title)}</a>
                </h3>
                <p style="color:#64748b;font-size:14px;line-height:1.6;margin:0 0 16px;">${esc(a.excerpt)}</p>
              </div>
              <a href="/resources/${a.slug}" style="color:#f97316;font-weight:700;font-size:14px;text-decoration:none;">Read Article →</a>
            </article>
          `).join('')}
        </div>
      </section>
    </main>
    ${renderFooter()}
  `
}

function buildResourcesListBody(articles) {
  return `
    ${renderNavbar()}
    <main style="max-width:1100px;margin:0 auto;padding:40px 20px;color:#1e293b;line-height:1.7;">
      <header style="text-align:center;margin-bottom:40px;">
        <h1 style="font-size:2.4rem;font-weight:900;color:#0f172a;margin-bottom:12px;">${esc(PAGE_SEO.resources.h1)}</h1>
        <p style="font-size:1.1rem;color:#64748b;max-width:650px;margin:0 auto;">${esc(PAGE_SEO.resources.description)}</p>
      </header>

      <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(320px, 1fr));gap:24px;margin-bottom:60px;">
        ${articles.map(a => `
          <article style="background:#ffffff;border:1px solid #e2e8f0;border-radius:16px;padding:26px;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
            <div>
              <div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap;">
                ${a.tags.map(t => `<span style="background:#f1f5f9;color:#475569;font-size:11px;font-weight:700;padding:2px 8px;border-radius:6px;">${esc(t)}</span>`).join('')}
                <span style="font-size:12px;color:#94a3b8;margin-left:auto;">${a.date}</span>
              </div>
              <h2 style="font-size:1.25rem;font-weight:800;color:#0f172a;margin-bottom:12px;line-height:1.4;">
                <a href="/resources/${a.slug}" style="color:#0f172a;text-decoration:none;">${esc(a.title)}</a>
              </h2>
              <p style="color:#64748b;font-size:14px;line-height:1.6;margin-bottom:20px;">${esc(a.excerpt)}</p>
            </div>
            <a href="/resources/${a.slug}" style="color:#f97316;font-weight:700;font-size:14px;text-decoration:none;">Read Tutorial →</a>
          </article>
        `).join('')}
      </div>
    </main>
    ${renderFooter()}
  `
}

function buildArticleDetailBody(article, renderedHtml) {
  return `
    ${renderNavbar()}
    <main style="max-width:860px;margin:0 auto;padding:40px 20px;color:#334155;line-height:1.8;">
      <!-- Breadcrumb -->
      <nav style="font-size:13px;color:#64748b;margin-bottom:20px;">
        <a href="/" style="color:#64748b;text-decoration:none;">Home</a> &gt;
        <a href="/resources" style="color:#64748b;text-decoration:none;">Tutorials & Guides</a> &gt;
        <span style="color:#0f172a;font-weight:600;">${esc(article.title)}</span>
      </nav>

      <article>
        <header style="margin-bottom:36px;border-bottom:1px solid #e2e8f0;padding-bottom:24px;">
          <div style="display:flex;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            ${article.tags.map(t => `<span style="background:#ffedd5;color:#c2410c;font-size:12px;font-weight:700;padding:3px 10px;border-radius:6px;">${esc(t)}</span>`).join('')}
          </div>
          <h1 style="font-size:2.3rem;font-weight:900;color:#0f172a;line-height:1.25;margin-bottom:16px;">${esc(article.title)}</h1>
          <div style="display:flex;align-items:center;gap:16px;font-size:13px;color:#64748b;">
            <span>✍️ SVGDO Editorial Team</span>
            <span>📅 Published on ${article.date}</span>
          </div>
        </header>

        <!-- Article Markdown Rendered Content -->
        <div class="prose" style="font-size:16px;color:#334155;line-height:1.8;">
          ${renderedHtml}
        </div>

        <footer style="margin-top:60px;padding-top:30px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;">
          <a href="/resources" style="color:#f97316;font-weight:700;text-decoration:none;font-size:15px;">← Back to all tutorials</a>
          <a href="/" style="background:#f97316;color:#ffffff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">Try SVGDO Online Editor</a>
        </footer>
      </article>
    </main>
    ${renderFooter()}
  `
}

function buildAboutBody() {
  return `
    ${renderNavbar()}
    <main style="max-width:900px;margin:0 auto;padding:40px 20px;color:#334155;line-height:1.8;">
      <h1 style="font-size:2.4rem;font-weight:900;color:#0f172a;margin-bottom:16px;">${esc(PAGE_SEO.about.h1)}</h1>
      <p style="font-size:1.15rem;color:#475569;margin-bottom:36px;">${esc(PAGE_SEO.about.description)}</p>

      <section style="margin-bottom:36px;">
        <h2 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin-bottom:12px;">Our Mission: Local-First Vector Processing</h2>
        <p>In an era where web tools increasingly force users to upload their creative assets and proprietary graphics to remote servers, SVGDO was created to redefine browser-based vector workflows. We believe that privacy, performance, and simplicity should never be compromised.</p>
        <p>Every single line of SVG code, path coordinate, color adjustment, and export operation happens 100% locally in your device's memory. No tracking of your designs, no cloud storage leaks, and no mandatory logins.</p>
      </section>

      <section style="margin-bottom:36px;">
        <h2 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin-bottom:12px;">Core Architecture & Technical Innovations</h2>
        <ul style="padding-left:24px;line-height:1.9;">
          <li><strong>Memory-Level AST & DOM Parsing:</strong> Real-time SVG XML parsing and sanitization using pure client-side parsers.</li>
          <li><strong>Zero-Latency GPU Rasterization:</strong> High-DPI Canvas export pipeline supporting up to 8x resolution scaling.</li>
          <li><strong>Integrated Code Minification:</strong> Native SVG path precision rounding, attribute optimization, and unused namespace stripping.</li>
          <li><strong>Responsive Cross-Platform UI:</strong> Designed to work seamlessly across desktops, tablets, and mobile devices.</li>
        </ul>
      </section>

      <section style="background:#f8fafc;padding:28px;border-radius:16px;border:1px solid #e2e8f0;margin-top:40px;">
        <h2 style="font-size:1.4rem;font-weight:800;color:#0f172a;margin-bottom:8px;">Contact & Developer Support</h2>
        <p style="margin-bottom:12px;color:#64748b;">Have suggestions, feature requests, or business inquiries? Contact our team directly:</p>
        <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;font-weight:700;font-size:16px;text-decoration:none;">${CONTACT_EMAIL}</a>
      </section>
    </main>
    ${renderFooter()}
  `
}

function buildLegalBody(type) {
  const isPrivacy = type === 'privacy'
  const title = isPrivacy ? PAGE_SEO.privacy.h1 : PAGE_SEO.terms.h1
  
  return `
    ${renderNavbar()}
    <main style="max-width:860px;margin:0 auto;padding:40px 20px;color:#334155;line-height:1.8;">
      <h1 style="font-size:2.3rem;font-weight:900;color:#0f172a;margin-bottom:16px;">${esc(title)}</h1>
      <p style="color:#64748b;font-size:14px;margin-bottom:30px;"><strong>Last Updated: July 2026</strong></p>

      ${isPrivacy ? `
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">1. Client-Side Local Processing & Zero Server Uploads</h2>
          <p>SVGDO operates exclusively client-side. When you edit, convert, or export SVG files on this website, all processing algorithms execute in your local browser memory. Your image assets, code, and graphics are never transmitted or stored on any remote server.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">2. Cookies & Google AdSense Advertising Disclosures</h2>
          <p>To keep SVGDO free, we partner with third-party advertising vendors including Google AdSense. Google uses cookies (including the DoubleClick cookie) to serve ads based on user visits to this and other websites on the Internet.</p>
          <p>Users may opt out of personalized advertising by visiting Google Ads Settings (https://adssettings.google.com/) or via aboutads.info.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">3. GDPR & CCPA Compliance</h2>
          <p>We respect international privacy rights under GDPR (EU/UK) and CCPA (California). Because we do not collect personal identities or store your creative files, data deletion requests are naturally satisfied by refreshing or closing your browser.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">4. Contact Us</h2>
          <p>For any privacy-related inquiries, please email our data protection contact at: <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;font-weight:600;">${CONTACT_EMAIL}</a>.</p>
        </section>
      ` : `
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">1. Description of Service</h2>
          <p>SVGDO provides free online vector graphic editing, code formatting, path manipulation, and image export tools. All operations run directly in your web browser.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">2. User Ownership of Content</h2>
          <p>You retain 100% full ownership and intellectual property rights to all SVG graphics, vector files, and exported images that you create or process using SVGDO.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">3. Disclaimer & Limitation of Liability</h2>
          <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. SVGDO shall not be liable for any indirect or consequential damages arising from the use of this tool.</p>
        </section>
        <section style="margin-bottom:28px;">
          <h2 style="font-size:1.3rem;font-weight:700;color:#0f172a;margin-bottom:8px;">4. Legal Inquiries</h2>
          <p>If you have any questions regarding these Terms of Service, reach out to us at: <a href="mailto:${CONTACT_EMAIL}" style="color:#f97316;font-weight:600;">${CONTACT_EMAIL}</a>.</p>
        </section>
      `}
    </main>
    ${renderFooter()}
  `
}

/* ─── 生成最终 HTML 文档 ─────────────────────────────────────── */
function buildFullHtml({ pagePath, title, description, keywords, type, datePublished, bodyHtml }) {
  const url = pageUrl(pagePath)

  let jsonLd
  if (type === 'article') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      url,
      inLanguage: 'en',
      datePublished: datePublished || '2026-07-20',
      author: { '@type': 'Organization', name: 'SVGDO' },
      publisher: { '@type': 'Organization', name: 'SVGDO', logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    }
  } else if (type === 'webapp') {
    jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: title,
      description,
      url,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      inLanguage: 'en',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    }
  } else {
    jsonLd = { '@context': 'https://schema.org', '@type': 'WebPage', name: title, description, url, inLanguage: 'en' }
  }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#f97316" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}" />
    ${keywords ? `<meta name="keywords" content="${esc(keywords.join(', '))}" />` : ''}

    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="${type === 'article' ? 'article' : 'website'}" />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_US" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(description)}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />

    <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

    ${assetTags.gtagLoader.join('\n    ')}
    ${assetTags.gtagInline}
    ${assetTags.adsense.join('\n    ')}
    ${assetTags.preloads.join('\n    ')}
    ${assetTags.css.join('\n    ')}
    ${assetTags.tags.join('\n    ')}
  </head>
  <body>
    <div id="root">${bodyHtml}</div>
  </body>
</html>
`
}

/* ─── 主流程 ─────────────────────────────────────────────── */
async function main() {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) {
    console.error('✗ dist/index.html does not exist, run npm run build first')
    process.exit(1)
  }
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')
  assetTags = extractAssetTags(template)

  const { marked } = await import('marked')
  marked.setOptions({
    gfm: true,
    breaks: true,
  })

  const articles = extractArticles()
  console.log(`  Extracted ${articles.length} English tutorials from articles.ts`)

  let count = 0
  const writeFor = (html, pagePath) => {
    const dir = path.join(DIST, pagePath)
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(path.join(dir, 'index.html'), html, 'utf8')
    count++
  }

  // 1. Fixed Pages
  // Home
  writeFor(buildFullHtml({
    pagePath: '',
    title: PAGE_SEO.home.title,
    description: PAGE_SEO.home.description,
    keywords: ['SVG editor', 'free SVG editor', 'online SVG editor', 'SVG optimizer', 'SVG to PNG'],
    type: 'webapp',
    bodyHtml: buildHomeBody(articles),
  }), '')

  // Resources
  writeFor(buildFullHtml({
    pagePath: 'resources',
    title: PAGE_SEO.resources.title,
    description: PAGE_SEO.resources.description,
    type: 'webpage',
    bodyHtml: buildResourcesListBody(articles),
  }), 'resources')

  // About
  writeFor(buildFullHtml({
    pagePath: 'about',
    title: PAGE_SEO.about.title,
    description: PAGE_SEO.about.description,
    type: 'webpage',
    bodyHtml: buildAboutBody(),
  }), 'about')

  // Privacy
  writeFor(buildFullHtml({
    pagePath: 'privacy',
    title: PAGE_SEO.privacy.title,
    description: PAGE_SEO.privacy.description,
    type: 'webpage',
    bodyHtml: buildLegalBody('privacy'),
  }), 'privacy')

  // Terms
  writeFor(buildFullHtml({
    pagePath: 'terms',
    title: PAGE_SEO.terms.title,
    description: PAGE_SEO.terms.description,
    type: 'webpage',
    bodyHtml: buildLegalBody('terms'),
  }), 'terms')

  // 2. 17 English Articles
  for (const article of articles) {
    const pagePath = `resources/${article.slug}`
    const mdPath = path.join(PUBLIC, 'content', `${article.slug}.md`)

    let renderedMarkdown = ''
    if (fs.existsSync(mdPath)) {
      const mdRaw = fs.readFileSync(mdPath, 'utf8')
      renderedMarkdown = marked.parse(mdRaw)
    } else {
      renderedMarkdown = `<p>${esc(article.excerpt)}</p>`
    }

    const articleBodyHtml = buildArticleDetailBody(article, renderedMarkdown)
    const articleHtml = buildFullHtml({
      pagePath,
      title: `${article.title} - SVGDO`,
      description: article.excerpt,
      keywords: article.tags,
      type: 'article',
      datePublished: article.date,
      bodyHtml: articleBodyHtml,
    })
    writeFor(articleHtml, pagePath)
  }

  console.log(`\n🎉 Generated ${count} Pure English Pre-Rendered SEO HTML Pages!`)
}

let assetTags = null
main().catch(err => {
  console.error('generate-seo-html error:', err)
  process.exit(1)
})
