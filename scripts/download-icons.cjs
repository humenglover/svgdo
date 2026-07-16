/**
 * svgviewer.dev 图标批量下载脚本 v2
 *
 * 直接从 static-svgs/{id}/{name}.svg 下载
 * 用法: node scripts/download-icons.cjs [startPage] [endPage] [concurrency]
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const BASE = 'www.svgviewer.dev'
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'icons', 'svg')
const META_FILE = path.resolve(__dirname, '..', 'public', 'icons', '_index.json')
const ICONS_PER_PAGE = 50

// ==================== FETCH ====================

function fetchPage(urlPath) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: BASE, path: urlPath, method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SVGEditor/1.0)', 'Accept': 'text/html' },
      timeout: 15000,
    }
    const req = https.get(opts, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const target = res.headers.location.replace(`https://${BASE}`, '').replace(`http://${BASE}`, '')
        return fetchPage(target).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function downloadFile(urlPath, filePath) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: BASE, path: urlPath, method: 'GET',
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 15000,
    }
    const req = https.get(opts, (res) => {
      if (res.statusCode !== 200) { reject(new Error(`HTTP ${res.statusCode}`)); return }
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve(Buffer.concat(chunks)))
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')) })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ==================== PARSE ====================

function extractIconsFromDirectory(html) {
  const regex = /href="\/s\/(\d+)\/([^"]+)"/g
  const icons = []
  const seen = new Set()
  let match
  while ((match = regex.exec(html)) !== null) {
    const [, id, name] = match
    // Deduplicate by name — keep only the first ID found for each name
    if (!seen.has(name)) { seen.add(name); icons.push({ id, name }) }
  }
  return icons
}

// ==================== MAIN ====================

async function main() {
  const startPage = parseInt(process.argv[2]) || 1
  const endPage = parseInt(process.argv[3]) || 200
  const concurrency = parseInt(process.argv[4]) || 15

  console.log(`\n📦 SVG Icon Downloader v2 (direct static-svgs)`)
  console.log(`   Pages: ${startPage} → ${endPage} (~${(endPage - startPage + 1) * ICONS_PER_PAGE} icons)`)
  console.log(`   Out:   ${OUT_DIR}`)
  console.log(`   Workers: ${concurrency}\n`)

  fs.mkdirSync(OUT_DIR, { recursive: true })

  // ── Phase 1: Scrape metadata ──
  console.log('📋 Phase 1: Scraping metadata...\n')

  const allIcons = []
  let completed = 0
  const queue = []
  for (let p = startPage; p <= endPage; p++) queue.push(p)

  async function scraperWorker() {
    while (queue.length > 0) {
      const page = queue.shift()
      if (page === undefined) break
      try {
        const html = await fetchPage(`/directory/all/${page}`)
        const icons = extractIconsFromDirectory(html)
        allIcons.push(...icons)
        completed++
        if (completed % 50 === 0) console.log(`  ✅ ${completed} pages | ${allIcons.length} icons`)
      } catch (e) {
        completed++
        if (completed % 10 === 0) console.log(`  ⚠  Page ${page}: ${e.message}`)
      }
      await sleep(100)
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => scraperWorker()))
  console.log(`\n  📊 Total: ${allIcons.length} unique icons\n`)

  fs.writeFileSync(META_FILE, JSON.stringify(allIcons, null, 2))

  // ── Phase 2: Download SVG files ──
  console.log('🎨 Phase 2: Downloading SVG files...\n')

  let ok = 0, skip = 0, fail = 0
  const dlQueue = [...allIcons]

  async function dlWorker() {
    while (dlQueue.length > 0) {
      const icon = dlQueue.shift()
      if (!icon) break
      const filePath = path.join(OUT_DIR, `${icon.name}.svg`)

      if (fs.existsSync(filePath)) { skip++; continue }

      try {
        const data = await downloadFile(`/static-svgs/${icon.id}/${icon.name}.svg`)
        fs.writeFileSync(filePath, data)
        ok++
      } catch (e) {
        // Fallback: try __NEXT_DATA__ extraction from detail page
        try {
          const html = await fetchPage(`/s/${icon.id}/${icon.name}`)
          const match = html.match(/"svg":\{[^}]*"text":"((?:\\u[0-9a-f]{4}|[^"\\])*)"[^}]*\}/)
          if (match) {
            let text = match[0].match(/"text":"([^"]+)"/)
            if (text) {
              const svg = JSON.parse(`"${text[1]}"`)
              fs.writeFileSync(filePath, svg, 'utf-8')
              ok++
              continue
            }
          }
          fail++
        } catch (e2) { fail++ }
      }

      if ((ok + skip + fail) % 100 === 0) {
        console.log(`  📥 ${ok + skip + fail}/${dlQueue.length + ok + skip + fail} | ✅${ok} ⏭${skip} ❌${fail}`)
      }
      await sleep(50)
    }
  }

  const allWorkers = Array.from({ length: concurrency * 2 }, () => dlWorker())
  await Promise.all(allWorkers)

  console.log(`\n✨ Done! ✅${ok} ⏭${skip} ❌${fail}\n`)
}

main().catch(e => { console.error(e); process.exit(1) })
