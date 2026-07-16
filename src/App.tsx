import { useState, useRef, useEffect, useMemo } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Resources from './pages/Resources'
import ArticlePage from './pages/ArticlePage'
import { useDropzone } from 'react-dropzone'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'
// @ts-ignore
import svgpath from 'svgpath'
import { sanitizeSVG, loadRemoteSVG, getSVGDimensions } from '@/utils/svgSecurity'
import {
  Upload, Link as LinkIcon, Library, Maximize2, SplitSquareHorizontal,
  Code2, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Maximize,
  Grid, Sun, Moon, Settings, RotateCw, FlipHorizontal, FlipVertical,
  CheckCircle, X, Search, ChevronDown, ChevronUp, Menu
} from 'lucide-react'
import { cn } from '@/utils'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from '@/contexts/ThemeContext'
import i18n from '@/locales/i18n'
import PageSEO from '@/components/PageSEO'
import { Languages } from 'lucide-react'
import { ToolArticleBody } from '@/components/ToolArticleDialog'
import { SvgdoLogo } from '@/components/SvgdoLogo'

type MobileTab = 'canvas' | 'transform' | 'export'
type ViewMode = 'split' | 'preview' | 'code'

// Fallback icons in case index file is not yet downloaded
const FALLBACK_ICONS = [
  'activity', 'align-center', 'align-justify', 'align-left', 'align-right', 'anchor', 'aperture', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'at-sign', 'award', 'bar-chart', 'battery', 'bell', 'bluetooth', 'bold', 'book', 'bookmark', 'box', 'briefcase', 'calendar', 'camera', 'cast', 'check', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'chrome', 'circle', 'clipboard', 'clock', 'cloud', 'code', 'coffee', 'command', 'compass', 'copy', 'cpu', 'credit-card', 'crop', 'crosshair', 'database', 'delete', 'disc', 'dollar-sign', 'download', 'droplet', 'eye-off', 'eye', 'facebook', 'feather', 'figma', 'file', 'film', 'filter', 'flag', 'folder', 'framer', 'frown', 'gift', 'github', 'gitlab', 'globe', 'hard-drive', 'hash', 'headphones', 'heart', 'hexagon', 'home', 'image', 'inbox', 'info', 'instagram', 'italic', 'key', 'layers', 'life-buoy', 'link', 'linkedin', 'list', 'loader', 'lock', 'log-in', 'log-out', 'mail', 'map-pin', 'map', 'maximize', 'menu', 'message-circle', 'message-square', 'mic', 'minimize', 'minus', 'monitor', 'moon', 'mouse-pointer', 'move', 'music', 'navigation', 'octagon', 'package', 'paperclip', 'pause', 'percent', 'phone', 'pie-chart', 'play', 'plus', 'pocket', 'power', 'printer', 'radio', 'refresh-ccw', 'refresh-cw', 'repeat', 'rewind', 'save', 'scissors', 'search', 'send', 'server', 'settings', 'share-2', 'share', 'shield', 'shopping-bag', 'shopping-cart', 'shuffle', 'skip-back', 'skip-forward', 'slack', 'slash', 'smartphone', 'smile', 'speaker', 'square', 'star', 'sun', 'tablet', 'tag', 'target', 'terminal', 'thermometer', 'thumbs-down', 'thumbs-up', 'trash-2', 'trash', 'trello', 'trending-down', 'trending-up', 'triangle', 'truck', 'tv', 'twitch', 'twitter', 'type', 'umbrella', 'underline', 'upload', 'user', 'users', 'video', 'voicemail', 'volume-2', 'volume-x', 'volume', 'watch', 'wifi', 'wind', 'x', 'youtube', 'zap', 'zoom-in', 'zoom-out'
]

function EditorPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { theme, toggle: toggleTheme } = useTheme()
  const isZh = i18n.language === 'zh'

  // Editor state
  const [svgCode, setSvgCode] = useState<string>('')
  const [originalSvg, setOriginalSvg] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [zoom, setZoom] = useState<number>(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [bgMode, setBgMode] = useState<'grid' | 'light' | 'dark'>('grid')
  const [exportScale, setExportScale] = useState<number>(1)
  const [exportBg, setExportBg] = useState<string>('transparent')
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [optimizedCode, setOptimizedCode] = useState<string>('')
  const [optimizeMode, setOptimizeMode] = useState<'safe' | 'aggressive' | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const [librarySearch, setLibrarySearch] = useState('')
  const [libraryLimit, setLibraryLimit] = useState(30)
  const [showUrlPrompt, setShowUrlPrompt] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas')
  const [activePanels, setActivePanels] = useState<string[]>(['transform', 'optimize', 'export'])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastPanPos = useRef<{x: number, y: number} | null>(null)

  // Dynamically load icon list from downloaded index
  const [iconNames, setIconNames] = useState<string[]>(FALLBACK_ICONS)
  useEffect(() => {
    fetch('/icons/_index.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: { name: string }[]) => {
        // Shuffle and deduplicate so sample icons show variety
        const names = [...new Set(data.map(i => i.name))]
        for (let i = names.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
            ;[names[i], names[j]] = [names[j], names[i]]
        }
        if (names.length > 0) setIconNames(names)
      })
      .catch(() => { /* use fallback */ })
  }, [])

  const MAX_HISTORY = 200

  const pushToHistory = (code: string) => {
    if (history[historyIndex] === code) return
    let newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(code)
    if (newHistory.length > MAX_HISTORY) newHistory = newHistory.slice(newHistory.length - MAX_HISTORY)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleLoadNewSvg = (code: string) => {
    const cleanCode = sanitizeSVG(code)
    setSvgCode(cleanCode)
    setOriginalSvg(cleanCode)
    setOptimizedCode('')
    setOptimizeMode(null)
    pushToHistory(cleanCode)
  }

  useEffect(() => {
    if (svgCode && svgCode !== history[historyIndex]) {
      const timer = setTimeout(() => pushToHistory(svgCode), 500)
      return () => clearTimeout(timer)
    }
  }, [svgCode])

  const handleUndo = () => {
    if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setSvgCode(history[historyIndex - 1]) }
  }
  const handleRedo = () => {
    if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setSvgCode(history[historyIndex + 1]) }
  }

  const handleZoomIn = () => { if (svgCode) setZoom(Math.min(500, zoom + 20)) }
  const handleZoomOut = () => { if (svgCode) setZoom(Math.max(10, zoom - 20)) }
  const handleZoomReset = () => { if (svgCode) { setZoom(100); setPan({x: 0, y: 0}); } }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!svgCode) return
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(prev => Math.max(10, Math.min(500, prev + (e.deltaY > 0 ? -20 : 20)))) }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [svgCode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!svgCode) return
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) { e.preventDefault(); handleZoomIn() }
      else if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); handleZoomOut() }
      else if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); handleZoomReset() }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [svgCode, zoom])

  const sanitizedSVG = useMemo(() => svgCode ? sanitizeSVG(svgCode) : '', [svgCode])

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        if (text && text.includes('<svg')) handleLoadNewSvg(text)
        else alert('Please upload a valid SVG file.')
      }
      reader.readAsText(file)
    }
  }

  const { getRootProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/svg+xml': ['.svg'] }, noClick: true
  })

  const handleLoadPreset = async (id: string) => {
    try {
      const res = await fetch(`/icons/svg/${id}.svg`)
      if (res.ok) {
        const text = await res.text()
        if (text.includes('<svg')) { handleLoadNewSvg(text); setShowLibrary(false) }
        else toast.error(t('common.error.loadIconFailed'))
      } else toast.error(t('common.error.loadIconFailed'))
    } catch (e) { console.error(e) }
  }

  const handleLoadFromURL = async () => {
    if (!urlInput) return
    setIsLoading(true)
    try {
      const result = await loadRemoteSVG(urlInput)
      if (result.success && result.data) { handleLoadNewSvg(result.data); setShowUrlPrompt(false); setUrlInput(''); toast.success(t('pages.svgConverter.urlModal.loadSuccess')) }
      else toast.error(result.error || t('common.error.loadSvgFailed'))
    } catch (e: any) { toast.error(e.message || t('common.error.loadSvgFailed')) }
    finally { setIsLoading(false) }
  }

  const optimizeSVG = (code: string, mode: 'safe' | 'aggressive'): string => {
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(code, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      if (!svgEl) return code

      const removeComments = (node: Node) => {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_COMMENT)
        const comments: Node[] = []; let c
        while (c = walker.nextNode()) comments.push(c)
        comments.forEach(c => c.parentNode?.removeChild(c))
      }
      removeComments(doc)

      const optimizePath = (d: string): string => d.replace(/\s+/g, ' ').replace(/(\d)\s*-/g, '$1-').replace(/\s*,\s*/g, ',').replace(/([A-Za-z])\s*/g, '$1').replace(/\s+([A-Za-z])/g, '$1').trim()

      const processElement = (el: Element) => {
        if (mode === 'aggressive') { el.removeAttribute('id'); el.removeAttribute('data-name') }
        if (el.tagName.toLowerCase() === 'path') { const d = el.getAttribute('d'); if (d) el.setAttribute('d', optimizePath(d)) }
        Array.from(el.children).forEach(child => processElement(child))
      }
      processElement(svgEl)

      if (mode === 'aggressive') {
        const emptyGs = Array.from(doc.querySelectorAll('g')).filter(g => !g.hasAttributes() && g.children.length === 0)
        emptyGs.forEach(g => g.parentNode?.removeChild(g))
      }

      const serializer = new XMLSerializer()
      let optimized = serializer.serializeToString(doc)

      // Clean up XML serializer artifacts and self-close empty elements
      optimized = optimized.replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"\s?/g, '')
      optimized = optimized.replace(/<([^>\s]+)([^>]*)>\s*<\/\1>/g, '<$1$2/>')

      if (mode === 'aggressive') {
        // Strip excessive float precision (keep max 3 decimals)
        optimized = optimized.replace(/(\.\d{3})\d+/g, '$1')
        optimized = optimized.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim()
      }
      return optimized
    } catch (e) { console.error('SVG optimization failed:', e); return code }
  }

  const handleOptimize = (mode?: 'safe' | 'aggressive') => {
    if (!svgCode) return
    const targetMode = mode || optimizeMode || 'safe'
    setIsOptimizing(true)
    try {
      const optimized = optimizeSVG(svgCode, targetMode)
      const origLen = originalSvg.length || svgCode.length
      const currentLen = svgCode.length

      // Only apply if we actually saved bytes compared to CURRENT code
      const savedBytesFromCurrent = currentLen - optimized.length

      if (savedBytesFromCurrent > 0) {
        setOptimizedCode(optimized)
        setSvgCode(optimized)
        pushToHistory(optimized)

        // Report savings against the ORIGINAL imported file for better UX
        const totalSavedBytes = origLen - optimized.length
        const percentage = ((totalSavedBytes / origLen) * 100).toFixed(1)
        toast.success(t('pages.svgConverter.optimize.optimizeSuccess', { bytes: totalSavedBytes, percent: percentage }))
      } else {
        toast.success(t('pages.svgConverter.optimize.alreadyOptimized'))
      }
    } catch (e) { toast.error(t('pages.svgConverter.optimize.optimizeFailed')) }
    finally { setIsOptimizing(false) }
  }

  const handleToggleOptimize = (m: 'safe' | 'aggressive') => {
    if (optimizeMode === m) {
      setOptimizeMode(null)
      if (originalSvg) {
        setSvgCode(originalSvg)
        setOptimizedCode('')
        pushToHistory(originalSvg)
        toast.success(t('pages.svgConverter.optimize.restored'))
      }
    } else {
      setOptimizeMode(m)
      handleOptimize(m)
    }
  }

  const handleCopySVG = async () => {
    if (!svgCode) return
    try { await navigator.clipboard.writeText(svgCode); toast.success(t('pages.svgConverter.optimize.copied')) }
    catch { toast.error(t('common.error.copyFailed')) }
  }

  const handleDownloadSVG = () => {
    if (!svgCode) return
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'icon.svg'; a.click()
    toast.success(t('pages.svgConverter.export.downloading'))
  }

  const handleTransform = (type: 'rotate90' | 'rotate180' | 'rotate270' | 'flipH' | 'flipV') => {
    if (!svgCode) return
    const parser = new DOMParser()
    const doc = parser.parseFromString(svgCode, 'image/svg+xml')
    const svgEl = doc.querySelector('svg')
    if (!svgEl) return

    let vbStr = svgEl.getAttribute('viewBox')
    let cx = 512, cy = 512
    if (vbStr) {
      const parts = vbStr.trim().split(/[\s,]+/).map(parseFloat)
      if (parts.length === 4) { cx = parts[0] + parts[2] / 2; cy = parts[1] + parts[3] / 2 }
    } else {
      const w = parseFloat(svgEl.getAttribute('width') || '1024')
      const h = parseFloat(svgEl.getAttribute('height') || '1024')
      cx = w / 2; cy = h / 2
    }

    let gEl = Array.from(svgEl.children).find(el => el.tagName.toLowerCase() === 'g' && el.getAttribute('data-svg-editor-transform') === 'true')

    if (!gEl) {
      gEl = doc.createElementNS('http://www.w3.org/2000/svg', 'g')
      gEl.setAttribute('data-svg-editor-transform', 'true')
      while (svgEl.firstChild) {
        gEl.appendChild(svgEl.firstChild)
      }
      svgEl.appendChild(gEl)
    }

    let transform = ''
    if (type === 'rotate90') transform = `rotate(90, ${cx}, ${cy})`
    else if (type === 'rotate180') transform = `rotate(180, ${cx}, ${cy})`
    else if (type === 'rotate270') transform = `rotate(270, ${cx}, ${cy})`
    else if (type === 'flipH') transform = `translate(${cx * 2}, 0) scale(-1, 1)`
    else if (type === 'flipV') transform = `translate(0, ${cy * 2}) scale(1, -1)`

    const oldTransform = gEl.getAttribute('transform') || ''
    gEl.setAttribute('transform', `${transform} ${oldTransform}`.trim())

    const serializer = new XMLSerializer()
    let newCode = serializer.serializeToString(doc).replace(/xmlns="http:\/\/www\.w3\.org\/1999\/xhtml"/g, '')
    setSvgCode(newCode); pushToHistory(newCode)
  }

  const handleExportPNG = () => {
    if (!svgCode) return
    setIsExporting(true)
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d')
    if (!ctx) { setIsExporting(false); return }
    try {
      const parser = new DOMParser(); const doc = parser.parseFromString(svgCode, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      if (!svgEl) { setIsExporting(false); return }
      const { width, height } = getSVGDimensions(svgEl as SVGSVGElement)
      canvas.width = width * exportScale; canvas.height = height * exportScale
      if (exportBg === 'white') { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
      else if (exportBg === 'black') { ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, canvas.width, canvas.height) }
      const img = new Image()
      const uri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgCode)))}`
      const timeout = setTimeout(() => { setIsExporting(false); toast.error(t('common.error.exportTimeout')) }, 30000)
      img.onload = () => {
        clearTimeout(timeout); ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'icon.png'; a.click()
        toast.success(t('pages.svgConverter.export.exported')); setIsExporting(false)
      }
      img.onerror = () => { clearTimeout(timeout); toast.error(t('common.error.exportFailed')); setIsExporting(false) }
      img.src = uri
    } catch { toast.error(t('common.error.exportFailed')); setIsExporting(false) }
  }

  const toggleLang = () => {
    const next = i18n.language === 'zh' ? 'en' : 'zh'
    i18n.changeLanguage(next); localStorage.setItem('lang', next)
  }

  const togglePanel = (panel: string) => {
    setActivePanels(prev => prev.includes(panel) ? prev.filter(p => p !== panel) : [...prev, panel])
  }

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center justify-between p-2 border-b border-border bg-white dark:bg-bg-surface shrink-0 gap-2">
      <div className="hidden md:flex items-center gap-1 shrink-0">
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center p-2 md:px-3 md:py-1.5 bg-orange hover:opacity-90 text-white text-xs md:text-sm font-bold rounded-lg transition-all shadow-sm">
          <Upload size={14} /> <span className="hidden sm:inline ml-1">{t('pages.svgConverter.upload')}</span>
        </button>
        <button onClick={() => setShowUrlPrompt(true)} disabled={isLoading} className={cn("flex items-center justify-center p-2 md:px-3 md:py-1.5 bg-white dark:bg-bg-surface border border-border text-primary text-xs md:text-sm font-medium rounded-lg transition-colors shadow-sm", isLoading && "opacity-50 cursor-not-allowed")}>
          <LinkIcon size={14} /> <span className="hidden sm:inline ml-1">{isLoading ? '...' : 'URL'}</span>
        </button>
        <button onClick={() => setShowLibrary(true)} className="flex items-center justify-center p-2 md:px-3 md:py-1.5 bg-white dark:bg-bg-surface border border-border hover:bg-bg-subtle text-primary text-xs md:text-sm font-medium rounded-lg transition-colors shadow-sm">
          <Library size={14} /> <span className="hidden sm:inline ml-1">{t('pages.svgConverter.library')}</span>
        </button>
      </div>
      <div className="hidden md:flex items-center bg-bg-muted rounded-lg p-1 shrink-0">
        {(['preview', 'split', 'code'] as ViewMode[]).map(m => (
          <button key={m} disabled={!svgCode} onClick={() => setViewMode(m)}
            className={cn("flex items-center justify-center p-1.5 md:px-3 md:py-1 rounded-md text-xs font-bold transition-all",
              !svgCode ? "opacity-30 cursor-not-allowed" : viewMode === m ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}>
            {m === 'preview' ? <Eye size={14} /> : m === 'split' ? <SplitSquareHorizontal size={14} /> : <Code2 size={14} />}
            <span className="hidden md:inline ml-1.5">{t(`pages.svgConverter.toolbar.${m}`)}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between w-full md:w-auto shrink-0 ml-auto gap-0.5 sm:gap-1 md:gap-2 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={handleUndo} disabled={historyIndex <= 0} className={cn("p-1 md:p-1.5 rounded-md", historyIndex <= 0 ? "opacity-30" : "hover:bg-bg-subtle")}><Undo2 size={14} /></button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={cn("p-1 md:p-1.5 rounded-md", historyIndex >= history.length - 1 ? "opacity-30" : "hover:bg-bg-subtle")}><Redo2 size={14} /></button>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          <button disabled={!svgCode} onClick={handleZoomOut} className={cn("p-1 md:p-1.5 rounded-md", !svgCode && "opacity-30")}><ZoomOut size={14} /></button>
          <span className={cn("text-[10px] md:text-xs font-medium w-8 md:w-10 text-center", !svgCode && "opacity-30")}>{zoom}%</span>
          <button disabled={!svgCode} onClick={handleZoomIn} className={cn("p-1 md:p-1.5 rounded-md", !svgCode && "opacity-30")}><ZoomIn size={14} /></button>
          <button disabled={!svgCode} onClick={handleZoomReset} className={cn("p-1 md:p-1.5 rounded-md", !svgCode ? "opacity-30" : "hover:bg-bg-subtle")}><Maximize size={14} /></button>
        </div>
        <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
          {(['grid', 'light', 'dark'] as const).map(m => (
            <button key={m} disabled={!svgCode} onClick={() => setBgMode(m)} className={cn("p-1 md:p-1.5 rounded-md", !svgCode && "opacity-30", bgMode === m ? "text-orange bg-orange/10" : "hover:bg-bg-subtle")}>
              {m === 'grid' ? <Grid size={14} /> : m === 'light' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderSidebar = () => (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] dark:bg-bg-surface">
      {([
        { key: 'transform', icon: Settings, title: t('pages.svgConverter.transform.title') },
        { key: 'optimize', icon: CheckCircle, title: t('pages.svgConverter.optimize.title') },
      ] as const).map(panel => (
        <div key={panel.key} className="border-b border-border">
          <button onClick={() => togglePanel(panel.key)} className="flex items-center justify-between w-full p-4 hover:bg-bg-subtle transition-colors">
            <div className="flex items-center gap-2 text-sm font-bold text-primary"><panel.icon size={16} /> {panel.title}</div>
            {activePanels.includes(panel.key) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {activePanels.includes(panel.key) && panel.key === 'transform' && (
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-secondary">{t('pages.svgConverter.transform.rotate')}</label>
                <div className="grid grid-cols-3 gap-2">
                  {([90, 180, 270] as const).map(deg => (
                    <button key={deg} disabled={!svgCode} onClick={() => handleTransform(`rotate${deg}` as any)} className={cn("py-1.5 bg-white dark:bg-bg-base border rounded-lg text-xs flex items-center justify-center gap-1", !svgCode ? "opacity-50 cursor-not-allowed" : "hover:border-orange hover:text-orange")}><RotateCw size={12} /> {deg}°</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-secondary">{t('pages.svgConverter.transform.flip')}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button disabled={!svgCode} onClick={() => handleTransform('flipH')} className={cn("py-1.5 border rounded-lg text-xs flex items-center justify-center gap-1", !svgCode ? "opacity-50 cursor-not-allowed" : "bg-white dark:bg-bg-base hover:border-orange hover:text-orange")}><FlipHorizontal size={12} /> {t('pages.svgConverter.transform.flipH')}</button>
                  <button disabled={!svgCode} onClick={() => handleTransform('flipV')} className={cn("py-1.5 border rounded-lg text-xs flex items-center justify-center gap-1", !svgCode ? "opacity-50 cursor-not-allowed" : "bg-white dark:bg-bg-base hover:border-orange hover:text-orange")}><FlipVertical size={12} /> {t('pages.svgConverter.transform.flipV')}</button>
                </div>
              </div>
            </div>
          )}
          {activePanels.includes(panel.key) && panel.key === 'optimize' && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center justify-between bg-bg-subtle p-2.5 rounded-lg border border-border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-secondary font-bold uppercase">{t('pages.svgConverter.optimize.original')}</span>
                  <span className="text-xs font-mono text-primary font-medium">{originalSvg.length || svgCode.length} B</span>
                </div>
                <div className="h-6 w-px bg-border"></div>
                <div className="flex flex-col gap-0.5 items-end">
                  <span className="text-[10px] text-secondary font-bold uppercase">{t('pages.svgConverter.optimize.current')}</span>
                  <span className={cn("text-xs font-mono font-bold", optimizedCode && originalSvg && optimizedCode.length < originalSvg.length ? "text-green-500" : "text-primary")}>
                    {svgCode.length} B
                    {optimizedCode && originalSvg && optimizedCode.length < originalSvg.length && <span className="ml-1 opacity-80">(-{((1 - svgCode.length / originalSvg.length) * 100).toFixed(1)}%)</span>}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-secondary uppercase shrink-0">{t('pages.svgConverter.optimize.mode')}</label>
                <div className="flex-1 flex gap-2">
                  {(['safe', 'aggressive'] as const).map(m => (
                    <button key={m} onClick={() => handleToggleOptimize(m)} className={cn("flex-1 py-1.5 px-2 border rounded-lg text-xs font-bold transition-colors", optimizeMode === m ? "bg-orange text-white border-orange shadow-sm" : "bg-white dark:bg-bg-base border-border hover:border-orange text-primary hover:text-orange")}>
                      {t(`pages.svgConverter.optimize.mode${m === 'safe' ? 'Safe' : 'Aggressive'}`)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <button disabled={!svgCode} onClick={handleCopySVG} className={cn("py-2 border rounded-lg text-xs font-medium flex justify-center items-center gap-2", !svgCode ? "bg-bg-muted cursor-not-allowed" : "bg-white dark:bg-bg-base hover:bg-bg-subtle")}>
                  <Code2 size={12} /> {t('pages.svgConverter.optimize.copySvg')}
                </button>
                <button disabled={!svgCode || !optimizedCode || !originalSvg} onClick={() => { if (originalSvg) { setSvgCode(originalSvg); setOptimizedCode(''); pushToHistory(originalSvg); toast.success(t('pages.svgConverter.optimize.restored')) } }} className={cn("py-2 border rounded-lg text-xs font-medium flex justify-center items-center gap-2", (!svgCode || !optimizedCode || !originalSvg) ? "bg-bg-muted cursor-not-allowed" : "bg-white dark:bg-bg-base hover:bg-bg-subtle")}>
                  {t('pages.svgConverter.optimize.copyOriginal')}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Export panel */}
      <div className="border-b border-border">
        <button onClick={() => togglePanel('export')} className="flex items-center justify-between w-full p-4 hover:bg-bg-subtle transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary"><Upload size={16} className="rotate-180" /> {t('pages.svgConverter.export.title')}</div>
          {activePanels.includes('export') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {activePanels.includes('export') && (
          <div className="px-4 pb-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-secondary">{t('pages.svgConverter.export.exportPng')}</label>
              <div className="flex gap-2">
                <select value={exportScale} onChange={e => setExportScale(+e.target.value)} className="flex-1 text-xs p-2 bg-white dark:bg-bg-base border border-border rounded-lg outline-none">
                  <option value={1}>1x</option><option value={2}>2x</option><option value={4}>4x</option>
                </select>
                <select value={exportBg} onChange={e => setExportBg(e.target.value)} className="flex-1 text-xs p-2 bg-white dark:bg-bg-base border border-border rounded-lg outline-none">
                  <option value="transparent">{t('pages.svgConverter.export.bgTransparent')}</option>
                  <option value="white">{t('pages.svgConverter.export.bgWhite')}</option>
                  <option value="black">{t('pages.svgConverter.export.bgBlack')}</option>
                </select>
              </div>
              <button onClick={handleExportPNG} disabled={!svgCode || isExporting} className={cn("w-full py-2 border rounded-lg text-sm font-medium flex justify-center items-center gap-2", !svgCode || isExporting ? "bg-bg-muted cursor-not-allowed" : "bg-white dark:bg-bg-base hover:border-orange hover:text-orange")}>
                <Upload size={14} className="rotate-180" /> {isExporting ? 'Exporting...' : t('pages.svgConverter.export.btnExportPng')}
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 mt-auto">
        <button disabled={!svgCode} onClick={handleDownloadSVG} className="w-full py-3 bg-orange hover:opacity-90 disabled:bg-bg-muted disabled:text-secondary text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
          <Upload size={16} className="rotate-180" /> {t('pages.svgConverter.export.downloadSvg')}
        </button>
      </div>
    </div>
  )

  const renderEmptyState = () => (
    <div className="flex-1 overflow-y-auto flex flex-col items-center bg-transparent">
      <div className="w-full max-w-3xl px-4 pt-12 pb-16 mx-auto flex flex-col items-center">
        <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border hover:border-orange/50 rounded-3xl flex flex-col items-center justify-center py-16 px-8 cursor-pointer bg-white dark:bg-bg-surface shadow-sm hover:shadow-md mb-12 transition-all">
          <Code2 size={32} className="text-orange mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">{t('pages.svgConverter.upload')} / URL / {t('pages.svgConverter.library')}</h3>
          <p className="text-sm text-tertiary text-center mb-6">{t('pages.svgConverter.empty.desc')}</p>
          <div className="flex items-center gap-4">
            <button onClick={e => { e.stopPropagation(); setShowUrlPrompt(true) }} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-bg-base border border-border rounded-xl shadow-sm hover:border-orange text-sm font-bold text-primary"><LinkIcon size={16} /> URL</button>
            <button onClick={e => { e.stopPropagation(); setShowLibrary(true) }} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-bg-base border border-border rounded-xl shadow-sm hover:border-orange text-sm font-bold text-primary"><Library size={16} /> {t('pages.svgConverter.library')}</button>
          </div>
        </div>
        <div className="w-full bg-white dark:bg-bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <h4 className="text-sm font-bold text-primary mb-4">{t('pages.svgConverter.empty.startFromExample')}</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {iconNames.slice(0, 16).map(name => (
              <button key={name} onClick={() => handleLoadPreset(name)} className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-orange hover:text-orange text-primary transition-all shadow-sm hover:shadow-md">
                <img src={`/icons/svg/${name}.svg`} alt={name} className="w-6 h-6 opacity-70 dark:invert transition-all" />
                <span className="text-[10px] text-secondary text-center truncate w-full">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-16 w-full">
          <ToolArticleBody toolKey="svgConverter" />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <PageSEO />
      <Toaster position="top-center" />
      <input type="file" ref={fileInputRef} onChange={e => { if (e.target.files) onDrop(Array.from(e.target.files)) }} accept=".svg" className="hidden" />

      <div className="h-[100dvh] overflow-hidden flex flex-col bg-bg-base text-primary transition-colors">
        {/* Header */}
        <header className="h-12 md:h-14 flex items-center justify-between px-3 md:px-5 border-b border-border shrink-0 bg-bg-surface">
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className="w-7 h-7 md:w-8 md:h-8 drop-shadow-sm text-slate-800 dark:text-slate-200 transition-colors">
              <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="currentColor" strokeWidth="3" />
              <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="currentColor" strokeWidth="3" />
              <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="currentColor" strokeWidth="3" />
              <g transform="translate(68, 48) scale(2.4) rotate(-8)">
                <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </g>
            </svg>
            <SvgdoLogo className="h-[30px] md:h-[34px] w-auto text-primary dark:text-white" />
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-6">
              <Link to="/resources" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">{t('common.nav.help')}</Link>
              <Link to="/privacy" className="text-sm font-semibold text-secondary hover:text-primary transition-colors">{t('common.nav.privacy')}</Link>
            </div>
            <div className="hidden md:block w-px h-4 bg-border mx-2"></div>
            <div className="hidden md:flex items-center gap-1">
              <button onClick={toggleLang} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-subtle transition-colors"><Languages size={18} /></button>
              <button onClick={toggleTheme} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            </div>
            <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-1.5 -mr-1 text-secondary hover:text-primary hover:bg-bg-subtle rounded-lg transition-colors">
              <Menu size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 flex flex-row overflow-hidden relative">
          {/* Desktop sidebar (Left) */}
          <div className="hidden md:flex flex-col w-[260px] lg:w-[320px] shrink-0 bg-white dark:bg-bg-surface border-r border-border z-10">
            <div className="flex-1 overflow-y-auto">{renderSidebar()}</div>
          </div>

          <div {...getRootProps()} className={cn("flex-1 flex flex-col relative bg-white dark:bg-bg-surface overflow-hidden outline-none", isDragActive && "ring-4 ring-orange/500 ring-opacity-50")}>
            {renderToolbar()}

            <div className="flex-1 flex overflow-hidden relative">
              {svgCode ? (
                <div className="flex-1 flex w-full h-full">
                  {(viewMode === 'split' || viewMode === 'code') && (
                    <div className={cn("flex flex-col border-r border-border bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm overflow-hidden", viewMode === 'split' ? "w-1/2" : "w-full")}>
                      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2d2d] bg-[#252526] shrink-0">
                        <span className="text-xs font-medium text-white/70">SVG Source</span>
                        <button onClick={handleCopySVG} className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"><Code2 size={12} /> {t('pages.svgConverter.code.copy')}</button>
                      </div>
                      <div className="flex-1 w-full h-full bg-[#1e1e1e] overflow-auto">
                        <Editor
                          value={svgCode}
                          onValueChange={code => { setSvgCode(code); if (optimizedCode) setOptimizedCode('') }}
                          highlight={code => Prism.highlight(code, Prism.languages.markup, 'markup')}
                          padding={16}
                          className="font-mono text-sm min-h-full"
                          style={{ fontFamily: '"Fira Code", "JetBrains Mono", monospace', minHeight: '100%', width: '100%' }}
                        />
                      </div>
                    </div>
                  )}
                  {(viewMode === 'split' || viewMode === 'preview') && (
                    <div className={cn("flex-1 flex flex-col items-center justify-center overflow-hidden relative p-4", bgMode === 'light' ? "bg-white" : bgMode === 'dark' ? "bg-black" : "", isDragging ? "cursor-grabbing" : "cursor-grab")}
                      style={{ touchAction: 'none', ...(bgMode === 'grid' ? { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23000' fill-opacity='0.05' d='M0 0h16v16H0z'/%3E%3Cpath fill='%23000' fill-opacity='0.1' d='M0 0h1v16H0zm0 0h16v1H0z'/%3E%3C/svg%3E")` } : {}) }}
                      onWheel={(e) => {
                        if (e.deltaY > 0) setZoom(z => Math.max(10, z - 10))
                        else setZoom(z => Math.min(800, z + 10))
                      }}
                      onMouseDown={(e) => { 
                        e.preventDefault(); 
                        setIsDragging(true); 
                        lastPanPos.current = { x: e.clientX, y: e.clientY }; 
                      }}
                      onMouseMove={(e) => {
                        if (isDragging && lastPanPos.current) {
                          const dx = e.clientX - lastPanPos.current.x;
                          const dy = e.clientY - lastPanPos.current.y;
                          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                          lastPanPos.current = { x: e.clientX, y: e.clientY };
                        }
                      }}
                      onMouseUp={() => { setIsDragging(false); lastPanPos.current = null; }}
                      onMouseLeave={() => { setIsDragging(false); lastPanPos.current = null; }}
                      onTouchStart={(e) => {
                        if (e.touches.length === 1) {
                          setIsDragging(true);
                          lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                        }
                      }}
                      onTouchMove={(e) => {
                        if (isDragging && lastPanPos.current && e.touches.length === 1) {
                          const dx = e.touches[0].clientX - lastPanPos.current.x;
                          const dy = e.touches[0].clientY - lastPanPos.current.y;
                          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                          lastPanPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                        }
                      }}
                      onTouchEnd={() => { setIsDragging(false); lastPanPos.current = null; }}
                      onTouchCancel={() => { setIsDragging(false); lastPanPos.current = null; }}
                    >
                      <div className="svg-preview-container flex items-center justify-center origin-center pointer-events-none" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}
                        dangerouslySetInnerHTML={{ __html: sanitizedSVG }} />
                    </div>
                  )}
                </div>
              ) : renderEmptyState()}
            </div>
          </div>
        </div>

        {/* Mobile bottom nav */}
        {svgCode && (
          <div className="md:hidden flex flex-col bg-white dark:bg-bg-surface border-t border-border shrink-0 z-20">
            <div className="overflow-y-auto h-[35vh]">
              {mobileTab === 'canvas' && (
                <div className="p-4 space-y-5">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="col-span-2 flex items-center justify-center gap-2 p-3 bg-orange/10 text-orange font-bold rounded-xl border border-orange/20"><Upload size={18} /> <span className="text-sm">{t('pages.svgConverter.upload')}</span></button>
                    <button onClick={() => setShowUrlPrompt(true)} className="flex items-center justify-center gap-2 p-3 bg-bg-subtle text-primary font-bold rounded-xl border"><LinkIcon size={18} /> <span className="text-sm">URL</span></button>
                    <button onClick={() => setShowLibrary(true)} className="flex items-center justify-center gap-2 p-3 bg-bg-subtle text-primary font-bold rounded-xl border"><Library size={18} /> <span className="text-sm">{t('pages.svgConverter.library')}</span></button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-secondary font-bold">{t('common.viewMode')}</label>
                    <div className="flex bg-bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('preview')}
                        className={cn("flex-1 flex items-center justify-center py-2 rounded-md text-xs font-bold transition-all", viewMode === 'preview' ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}
                      >
                        <Eye size={14} className="mr-1.5" /> {t('pages.svgConverter.toolbar.preview')}
                      </button>
                      <button
                        onClick={() => setViewMode('split')}
                        className={cn("flex-1 flex items-center justify-center py-2 rounded-md text-xs font-bold transition-all", viewMode === 'split' ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}
                      >
                        <SplitSquareHorizontal size={14} className="mr-1.5" /> {t('pages.svgConverter.toolbar.split')}
                      </button>
                      <button
                        onClick={() => setViewMode('code')}
                        className={cn("flex-1 flex items-center justify-center py-2 rounded-md text-xs font-bold transition-all", viewMode === 'code' ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}
                      >
                        <Code2 size={14} className="mr-1.5" /> {t('pages.svgConverter.toolbar.code')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {mobileTab === 'transform' && (
                <div className="p-4 space-y-5">
                  <div className="grid grid-cols-3 gap-2">
                    {([90, 180, 270] as const).map(d => <button key={d} onClick={() => handleTransform(`rotate${d}` as any)} className="py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-bg-base"><RotateCw size={14} /> {d}°</button>)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleTransform('flipH')} className="py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-bg-base"><FlipHorizontal size={14} /> {t('pages.svgConverter.transform.flipH')}</button>
                    <button onClick={() => handleTransform('flipV')} className="py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-bg-base"><FlipVertical size={14} /> {t('pages.svgConverter.transform.flipV')}</button>
                  </div>
                  <div className="space-y-4 pt-3 border-t border-border">
                    <div className="flex items-center justify-between bg-bg-subtle p-3 rounded-xl border border-border">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] text-secondary font-bold uppercase">{t('pages.svgConverter.optimize.original')}</span>
                        <span className="text-sm font-mono text-primary font-bold">{originalSvg.length || svgCode.length} B</span>
                      </div>
                      <div className="h-8 w-px bg-border"></div>
                      <div className="flex flex-col gap-0.5 items-end">
                        <span className="text-[10px] text-secondary font-bold uppercase">{t('pages.svgConverter.optimize.current')}</span>
                        <span className={cn("text-sm font-mono font-bold", optimizedCode && originalSvg && optimizedCode.length < originalSvg.length ? "text-green-500" : "text-primary")}>
                          {svgCode.length} B
                          {optimizedCode && originalSvg && optimizedCode.length < originalSvg.length && <span className="ml-1.5 opacity-90">(-{((1 - svgCode.length / originalSvg.length) * 100).toFixed(1)}%)</span>}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-secondary uppercase shrink-0">{t('pages.svgConverter.optimize.mode')}</label>
                      <div className="flex-1 flex gap-2">
                        {(['safe', 'aggressive'] as const).map(m => (
                          <button key={m} onClick={() => handleToggleOptimize(m)} className={cn("flex-1 py-2 px-3 border rounded-xl text-sm font-bold transition-colors shadow-sm", optimizeMode === m ? "bg-orange text-white border-orange" : "bg-white dark:bg-bg-base border-border text-primary")}>
                            {t(`pages.svgConverter.optimize.mode${m === 'safe' ? 'Safe' : 'Aggressive'}`)}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {mobileTab === 'export' && (
                <div className="p-4 space-y-4">
                  <div className="flex gap-2">
                    <select value={exportScale} onChange={e => setExportScale(+e.target.value)} className="flex-1 text-xs p-2 border rounded-lg"><option value={1}>1x</option><option value={2}>2x</option><option value={4}>4x</option></select>
                    <select value={exportBg} onChange={e => setExportBg(e.target.value)} className="flex-1 text-xs p-2 border rounded-lg"><option value="transparent">{t('pages.svgConverter.export.bgTransparent')}</option><option value="white">{t('pages.svgConverter.export.bgWhite')}</option><option value="black">{t('pages.svgConverter.export.bgBlack')}</option></select>
                  </div>
                  <button onClick={handleExportPNG} className="w-full py-2 border rounded-lg text-sm font-medium">{t('pages.svgConverter.export.btnExportPng')}</button>
                  <button onClick={handleDownloadSVG} className="w-full py-3 bg-orange text-white font-bold rounded-xl">{t('pages.svgConverter.export.downloadSvg')}</button>
                </div>
              )}
            </div>
            <div className="flex items-center p-1 border-t border-border bg-bg-subtle shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {[
                { id: 'canvas' as const, icon: Maximize2 },
                { id: 'transform' as const, icon: Settings },
                { id: 'export' as const, icon: Upload },
              ].map(tab => (
                <button key={tab.id} onClick={() => setMobileTab(tab.id)} className={cn("flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium rounded-md", mobileTab === tab.id ? "text-orange bg-white dark:bg-bg-surface shadow-sm" : "text-secondary hover:text-primary")}>
                  <tab.icon size={20} strokeWidth={mobileTab === tab.id ? 2.5 : 2} />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Icon Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[85vh] bg-[#f8f9fa] dark:bg-bg-base rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-bg-surface border-b border-border shrink-0">
              <div className="flex items-center gap-2 text-primary font-bold"><Grid size={18} /> {t('pages.svgConverter.libraryModal.title')}</div>
              <button onClick={() => setShowLibrary(false)} className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-bg-subtle"><X size={18} /></button>
            </div>
            <div className="p-4 bg-white dark:bg-bg-surface border-b border-border shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input type="text" value={librarySearch} onChange={e => { setLibrarySearch(e.target.value); setLibraryLimit(30) }} placeholder={t('pages.svgConverter.libraryModal.search')} className="w-full pl-9 pr-4 py-2.5 bg-bg-subtle border border-border rounded-xl text-sm outline-none focus:border-orange" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                {iconNames.filter(n => n.includes(librarySearch.toLowerCase())).slice(0, libraryLimit).map(name => (
                  <button key={name} onClick={() => handleLoadPreset(name)} className="flex flex-col items-center justify-center gap-2 aspect-square rounded-xl bg-white dark:bg-bg-surface border border-border hover:border-orange hover:text-orange text-primary transition-all shadow-sm hover:shadow-md">
                    <img src={`/icons/svg/${name}.svg`} alt={name} className="w-6 h-6 opacity-80 dark:invert transition-all" />
                    <span className="text-[10px] text-secondary text-center px-1 truncate w-full">{name}</span>
                  </button>
                ))}
              </div>
              {iconNames.filter(n => n.includes(librarySearch.toLowerCase())).length > libraryLimit && (
                <div className="py-8 flex justify-center">
                  <button onClick={() => setLibraryLimit(l => l + 30)} className="px-6 py-2 bg-white dark:bg-bg-surface border border-border rounded-full text-sm font-bold hover:text-orange hover:border-orange shadow-sm">{t('pages.svgConverter.libraryModal.loadMore')}</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* URL Modal */}
      {showUrlPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-bold"><LinkIcon size={18} /> {t('pages.svgConverter.urlModal.title')}</div>
              <button onClick={() => setShowUrlPrompt(false)} className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-bg-subtle"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-secondary">{t('pages.svgConverter.urlModal.desc')}</p>
              <input type="text" autoFocus placeholder={t('pages.svgConverter.urlModal.placeholder')} value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLoadFromURL() }}
                className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-sm outline-none focus:border-orange" />
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowUrlPrompt(false)} className="px-5 py-2 text-sm font-medium text-secondary hover:bg-bg-subtle rounded-xl">{t('pages.svgConverter.urlModal.cancel')}</button>
                <button onClick={handleLoadFromURL} disabled={!urlInput || isLoading} className={cn("px-5 py-2 text-sm font-bold rounded-xl shadow-sm", !urlInput || isLoading ? "bg-orange/50 text-white cursor-not-allowed" : "bg-orange hover:opacity-90 text-white")}>
                  {isLoading ? 'Loading...' : t('pages.svgConverter.urlModal.load')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-[80%] h-full bg-bg-surface shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <SvgdoLogo className="h-[22px] w-auto text-primary dark:text-white" />
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-secondary hover:text-primary rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="flex flex-col p-2 overflow-y-auto">
              <div className="flex flex-col mb-2 pb-2 border-b border-border space-y-1">
                <button onClick={() => { toggleLang(); setIsMenuOpen(false); }} className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors w-full text-left">
                  <span>{t('common.language')}</span>
                  <span className="px-2.5 py-1 bg-bg-subtle border border-border rounded-full text-xs font-bold text-primary">{isZh ? t('common.langZh') : t('common.langEn')}</span>
                </button>
                <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors w-full text-left">
                  <span>{t('common.theme')}</span>
                  <span className="px-2.5 py-1 bg-bg-subtle border border-border rounded-full text-xs font-bold text-primary capitalize">{theme === 'dark' ? t('common.dark') : t('common.light')}</span>
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                <Link to="/resources" onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  {t('common.nav.resources')}
                </Link>
                <Link to="/privacy" onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  {t('pages.privacy.title', 'Privacy Policy')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<EditorPage />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/resources/:slug" element={<ArticlePage />} />
    </Routes>
  )
}
