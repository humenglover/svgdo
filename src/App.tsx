import { useState, useRef, useEffect, useMemo, lazy, Suspense } from 'react'
import { Routes, Route, Link, Outlet, useParams, useLocation, useNavigate, useBlocker } from 'react-router-dom'
import PrivacyPolicy from './pages/PrivacyPolicy'
import AboutPage from './pages/AboutPage'
import TermsOfService from './pages/TermsOfService'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const Resources = lazy(() => import('./pages/Resources'))
const ArticlePage = lazy(() => import('./pages/ArticlePage'))
const NotFound = lazy(() => import('./pages/NotFound'))
import { CookieConsent } from '@/components/CookieConsent'
import { ExportPanel } from '@/components/ExportPanel'
import { useDropzone } from 'react-dropzone'
import Editor from 'react-simple-code-editor'
import Prism from 'prismjs'
import 'prismjs/components/prism-markup'
import 'prismjs/themes/prism-tomorrow.css'
import { sanitizeSVG, loadRemoteSVG, getSVGDimensions } from '@/utils/svgSecurity'
import { injectEditorIds, resetIdCounter, describeElement, parseTransform, buildTransform, updateElementAttribute, getSvgScaleRatio, getMousePositionInSVG, type ElementInfo } from '@/utils/svgDom'
import { optimizeSVG } from '@/utils/svgOptimize'
import {
  Upload, Link as LinkIcon, Library, Maximize2, SplitSquareHorizontal,
  Code2, Eye, Undo2, Redo2, ZoomIn, ZoomOut, Maximize,
  Grid, Sun, Moon, Settings, RotateCw, FlipHorizontal, FlipVertical,
  CheckCircle, X, Search, ChevronDown, ChevronUp, Menu, MousePointer2, Sliders, AlertTriangle, Download
} from 'lucide-react'
import { cn } from '@/utils'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from '@/contexts/ThemeContext'
import PageSEO from '@/components/PageSEO'
import { ToolArticleBody } from '@/components/ToolArticleDialog'
import { AdsterraBanner } from '@/components/AdsterraBanner'
import { ExportSuccessModal } from '@/components/ExportSuccessModal'
import { FullLogo } from '@/components/FullLogo'
import PropertiesPanel from '@/components/PropertiesPanel'
import Navbar from '@/components/Navbar'

type MobileTab = 'canvas' | 'transform' | 'export' | 'properties'
type ViewMode = 'split' | 'preview' | 'code'

import { FALLBACK_ICONS } from '@/constants/icons'
function EditorPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  // Editor state
  const [svgCode, setSvgCode] = useState<string>('')
  const [originalSvg, setOriginalSvg] = useState<string>('')
  const [viewMode, setViewMode] = useState<ViewMode>('preview')
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
  const [showCodePrompt, setShowCodePrompt] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [showOverwritePrompt, setShowOverwritePrompt] = useState(false)
  const [pendingSvgCode, setPendingSvgCode] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<MobileTab>('canvas')
  const [activePanels, setActivePanels] = useState<string[]>(['transform', 'optimize', 'export'])
  const [exportSuccessModal, setExportSuccessModal] = useState<{ open: boolean; format: string }>({ open: false, format: 'svg' })
  const [nextSelectedIndex, setNextSelectedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastPanPos = useRef<{ x: number, y: number } | null>(null)
  const elementDragState = useRef<{
    id: string;
    el: HTMLElement;
    svgEl: SVGSVGElement;
    ctm: DOMMatrix;
    startXInSVG: number;
    startYInSVG: number;
    lastDx: number;
    lastDy: number;
    lastTx?: number;
    lastTy?: number;
    originalTransform: string;
    paddingX: number;
    paddingY: number;
    isResizing?: boolean;
    resizeDir?: string;
    startDist?: number;
    cx?: number;
    cy?: number;
    anchorX?: number;
    anchorY?: number;
    startScaleX?: number;
    startScaleY?: number;
    startTx?: number;
    startTy?: number;
    lastScaleX?: number;
    lastScaleY?: number;
  } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const workspaceRef = useRef<HTMLDivElement>(null)
  const [selectionBox, setSelectionBox] = useState<{ x: number, y: number, w: number, h: number } | null>(null)

  // ── SVG Element Selection State ──
  const [selectedElement, setSelectedElement] = useState<ElementInfo | null>(null)
  const [allElements, setAllElements] = useState<ElementInfo[]>([])
  const mouseDownPos = useRef<{ x: number, y: number } | null>(null)
  const isPinching = useRef(false)
  const initialPinchDist = useRef<number | null>(null)
  const initialZoom = useRef<number | null>(null)

  // Dynamically load icon list from downloaded index
  const [iconNames, setIconNames] = useState<string[]>(FALLBACK_ICONS)
  useEffect(() => {
    fetch('/icons/_index.json')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then((data: { name: string }[]) => {
        const names = [...new Set(data.map(i => i.name))].sort()
        if (names.length > 0) setIconNames(names)
      })
      .catch(() => { /* use fallback */ })
  }, [])

  // Prevent accidental exit if there is unsaved work in the workspace (Browser reload/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (svgCode && svgCode.trim().length > 0) {
        e.preventDefault();
        e.returnValue = ''; // Required for most browsers to show the prompt
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [svgCode])

  // Prevent accidental client-side navigation (React Router links/back button)
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      svgCode !== undefined && svgCode.trim().length > 0 &&
      currentLocation.pathname !== nextLocation.pathname
  );

  // Curated quick-start icons — first one is the site logo
  const QUICK_START_ICONS = [
    'logo',
    'activity', 'aperture', 'archive', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'award',
    'bar-chart', 'battery', 'bell', 'bluetooth', 'bold', 'book', 'bookmark', 'box',
    'briefcase', 'calendar', 'camera', 'cast', 'check', 'chevron-down', 'chevron-up', 'chrome',
    'circle', 'clipboard', 'clock', 'cloud', 'code', 'coffee', 'copy', 'cpu',
    'crop', 'database', 'download', 'eye', 'feather', 'file', 'film', 'filter',
    'flag', 'folder', 'gift', 'globe', 'hard-drive', 'headphones', 'heart', 'home',
    'image', 'inbox', 'info', 'key', 'layers', 'link', 'lock', 'mail',
    'map', 'map-pin', 'maximize', 'menu', 'message-circle', 'mic', 'monitor', 'moon',
    'mouse-pointer', 'move', 'music', 'navigation', 'package', 'paperclip', 'pause', 'phone',
    'pie-chart', 'play', 'plus', 'printer', 'radio', 'refresh-cw', 'save', 'scissors',
    'search', 'send', 'server', 'settings', 'share', 'shield', 'shopping-cart', 'slash',
    'smartphone', 'smile', 'speaker', 'square', 'star', 'sun', 'tablet', 'tag',
    'target', 'terminal', 'thumbs-up', 'trash', 'trending-up', 'truck', 'tv', 'umbrella',
    'upload', 'user', 'users', 'video', 'voicemail', 'watch', 'wifi', 'zap',
    'zoom-in', 'zoom-out',
  ]

  const HOME_ICONS = [
    'logo', 'smile', 'edit', 'envelope', 'database', 'film', 'user', 'zap'
  ]

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
    if (svgCode && svgCode.trim() !== '' && code !== svgCode) {
      setPendingSvgCode(code)
      setShowOverwritePrompt(true)
      return
    }
    executeLoadNewSvg(code)
  }

  const confirmLoadNewSvg = () => {
    if (pendingSvgCode) {
      executeLoadNewSvg(pendingSvgCode)
    }
    setShowOverwritePrompt(false)
    setPendingSvgCode(null)
  }

  const executeLoadNewSvg = (code: string) => {
    const cleanCode = sanitizeSVG(code)
    setSvgCode(cleanCode)
    setOriginalSvg(cleanCode)
    setOptimizedCode('')
    setOptimizeMode(null)
    pushToHistory(cleanCode)

    // Auto scale to fit comfortably
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(cleanCode, 'image/svg+xml')
      const svgEl = doc.querySelector('svg')
      if (svgEl) {
        let w = parseFloat(svgEl.getAttribute('width') || '0')
        let h = parseFloat(svgEl.getAttribute('height') || '0')
        if ((!w || !h) && svgEl.getAttribute('viewBox')) {
          const vb = svgEl.getAttribute('viewBox')?.trim().split(/[\s,]+/)
          if (vb && vb.length >= 4) { w = parseFloat(vb[2]); h = parseFloat(vb[3]) }
        }
        const maxDim = Math.max(w || 100, h || 100)
        let optimalZoom = 100
        if (maxDim <= 24) optimalZoom = 1200
        else if (maxDim <= 32) optimalZoom = 800
        else if (maxDim <= 64) optimalZoom = 400
        else if (maxDim <= 128) optimalZoom = 200
        else if (maxDim > 800) optimalZoom = Math.max(10, Math.round((600 / maxDim) * 100))
        setZoom(optimalZoom)
        setPan({ x: 0, y: 0 })
      }
    } catch (e) {
      setZoom(100)
      setPan({ x: 0, y: 0 })
    }
  }

  useEffect(() => {
    if (svgCode && svgCode !== history[historyIndex]) {
      const timer = setTimeout(() => pushToHistory(svgCode), 500)
      return () => clearTimeout(timer)
    }
  }, [svgCode])

  // 属性面板更新 SVG → 进历史
  const handleUpdateSvg = (newCode: string, nextIndex?: number) => {
    setSvgCode(newCode)
    setOptimizedCode('')
    pushToHistory(newCode)
    if (nextIndex !== undefined) setNextSelectedIndex(nextIndex)
  }

  const handleResizeStart = (e: React.MouseEvent | React.PointerEvent, dir: string) => {
    e.stopPropagation();
    if (!selectedElement) return;

    const el = document.querySelector(`[data-editor-id="${selectedElement.id}"]`) as HTMLElement | null;
    const svgEl = (el as any)?.ownerSVGElement as SVGSVGElement | undefined;
    if (!el || !svgEl) return;

    const rect = el.getBoundingClientRect();
    const cx_screen = rect.left + rect.width / 2;
    const cy_screen = rect.top + rect.height / 2;

    const ctm = el.parentNode ? (el.parentNode as SVGGraphicsElement).getScreenCTM() : svgEl.getScreenCTM();
    if (!ctm) return;

    const ptCenter = getMousePositionInSVG(cx_screen, cy_screen, svgEl, ctm);
    const ptMouse = getMousePositionInSVG(e.clientX, e.clientY, svgEl, ctm);

    let anchor_screen_x = cx_screen;
    let anchor_screen_y = cy_screen;
    if (dir.includes('e')) anchor_screen_x = rect.left;
    else if (dir.includes('w')) anchor_screen_x = rect.right;
    if (dir.includes('s')) anchor_screen_y = rect.top;
    else if (dir.includes('n')) anchor_screen_y = rect.bottom;

    const ptAnchor = getMousePositionInSVG(anchor_screen_x, anchor_screen_y, svgEl, ctm);

    const startDist = Math.sqrt(
      Math.pow(ptMouse.x - ptAnchor.x, 2) + Math.pow(ptMouse.y - ptAnchor.y, 2)
    );

    const originalTransform = el.getAttribute('transform') || '';
    const t = parseTransform(originalTransform);

    let paddingX = 0; let paddingY = 0;
    const ratio = getSvgScaleRatio(svgEl)
    const strokeW = parseFloat(getComputedStyle(el).strokeWidth) || 0
    if (strokeW > 0) {
      paddingX = (strokeW * ratio.ratioX) / 2 || 0
      paddingY = (strokeW * ratio.ratioY) / 2 || 0
    }

    elementDragState.current = {
      id: selectedElement.id,
      el, svgEl, ctm,
      startXInSVG: ptMouse.x, startYInSVG: ptMouse.y, lastDx: 0, lastDy: 0,
      isResizing: true,
      resizeDir: dir,
      startDist,
      cx: ptCenter.x,
      cy: ptCenter.y,
      anchorX: ptAnchor.x,
      anchorY: ptAnchor.y,
      startScaleX: t.scaleX || 1,
      startScaleY: t.scaleY || 1,
      startTx: t.tx || 0,
      startTy: t.ty || 0,
      lastScaleX: t.scaleX || 1,
      lastScaleY: t.scaleY || 1,
      originalTransform,
      paddingX, paddingY
    };
  }

  const handleUndo = () => {
    if (historyIndex > 0) { setHistoryIndex(historyIndex - 1); setSvgCode(history[historyIndex - 1]) }
  }
  const handleRedo = () => {
    if (historyIndex < history.length - 1) { setHistoryIndex(historyIndex + 1); setSvgCode(history[historyIndex + 1]) }
  }

  const handleZoomIn = () => { if (svgCode) setZoom(zoom => Math.min(5000, zoom + (zoom < 200 ? 20 : 50))) }
  const handleZoomOut = () => { if (svgCode) setZoom(zoom => Math.max(10, zoom - (zoom < 200 ? 20 : 50))) }
  const handleZoomReset = () => { if (svgCode) { setZoom(100); setPan({ x: 0, y: 0 }); } }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!svgCode) return
      if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom(prev => Math.max(10, Math.min(5000, prev + (e.deltaY > 0 ? -20 : 20)))) }
    }
    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [svgCode])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when typing in inputs or code editor
      const tag = (e.target as HTMLElement).tagName
      const isEditing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).closest('.npm__react-simple-code-editor__textarea')

      const ctrl = e.ctrlKey || e.metaKey

      // Undo/Redo — always work
      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); handleUndo() }
      else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); handleRedo() }

      if (isEditing) return

      // Zoom
      if (ctrl && (e.key === '+' || e.key === '=')) { e.preventDefault(); handleZoomIn() }
      else if (ctrl && e.key === '-') { e.preventDefault(); handleZoomOut() }
      else if (ctrl && e.key === '0') { e.preventDefault(); handleZoomReset() }

      // File operations (work even without SVG loaded)
      else if (ctrl && e.key === 'o') { e.preventDefault(); fileInputRef.current?.click() }
      else if (ctrl && e.key === 'l') { e.preventDefault(); setShowUrlPrompt(true) }
      else if (ctrl && e.key === 'i') { e.preventDefault(); setShowLibrary(true) }

      if (!svgCode) return

      // Export & copy
      if (ctrl && e.key === 's') { e.preventDefault(); handleDownloadSVG() }
      else if (ctrl && e.key === 'e') { e.preventDefault(); handleExportPNG() }
      else if (ctrl && e.key === 'c') { e.preventDefault(); handleCopySVG() }

      // Edit
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElement) { e.preventDefault(); /* handled by element Drag/Delete */ }
      }
      else if (e.key === 'Escape') {
        setSelectedElement(null)
        const sel = previewRef.current?.querySelector('.svg-element-selected')
        sel?.classList.remove('svg-element-selected')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [svgCode, zoom, selectedElement])

  const syntaxError = useMemo(() => {
    if (!svgCode) return null
    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(svgCode, 'image/svg+xml')
      const errorNode = doc.querySelector('parsererror')
      if (errorNode) {
        return errorNode.querySelector('div')?.textContent || errorNode.textContent || 'SVG syntax error'
      }
    } catch (e) {
      return 'SVG syntax error'
    }
    return null
  }, [svgCode])

  const sanitizedSVG = useMemo(() => svgCode ? sanitizeSVG(svgCode) : '', [svgCode])

  // 注入 data-editor-id 到 SVG 元素
  const processedSVG = useMemo(() => {
    if (!sanitizedSVG) return { html: '', elements: [] as ElementInfo[] }
    const result = injectEditorIds(sanitizedSVG)
    setAllElements(result.elements)
    // 如果之前的选中元素已不存在，并且没有等待选中的特定 index，则取消选择
    if (selectedElement && !result.elements.find(e => e.id === selectedElement.id) && nextSelectedIndex === null) {
      setSelectedElement(null)
    }
    return result
  }, [sanitizedSVG])

  useEffect(() => {
    if (nextSelectedIndex !== null && allElements.length > 0) {
      const el = allElements.find(e => e.index === nextSelectedIndex)
      if (el) setSelectedElement(el)
      setNextSelectedIndex(null)
    }
  }, [allElements, nextSelectedIndex])

  // Dynamically calculate the bounding box for the selection indicator
  useEffect(() => {
    if (!selectedElement || !workspaceRef.current || viewMode === 'code') {
      setSelectionBox(null)
      return
    }

    const updateBox = () => {
      setTimeout(() => {
        if (!workspaceRef.current) return
        const el = document.querySelector(`[data-editor-id="${selectedElement.id}"]`) as SVGElement | null
        if (!el) {
          setSelectionBox(null)
          return
        }
        const rect = el.getBoundingClientRect()
        const workspaceRect = workspaceRef.current.getBoundingClientRect()

        let w = rect.width
        let h = rect.height
        let x = rect.left - workspaceRect.left
        let y = rect.top - workspaceRect.top

        // 补偿描边宽度带来的视觉溢出
        const svgEl = el.ownerSVGElement
        if (svgEl) {
          const strokeW = parseFloat(getComputedStyle(el).strokeWidth) || 0
          if (strokeW > 0) {
            const ctm = (el as SVGGraphicsElement).getScreenCTM()
            if (ctm) {
              const scaleX = Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b)
              const scaleY = Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
              const px = (strokeW * scaleX) / 2
              const py = (strokeW * scaleY) / 2
              x -= px; y -= py;
              w += px * 2; h += py * 2;
            }
          }
        }

        // 确保不会因为太小（如极小线段）而无法看见，设定最小 24 像素避免四周拖拉热区互相重叠覆盖中心
        if (w < 24) { x -= (24 - w) / 2; w = 24; }
        if (h < 24) { y -= (24 - h) / 2; h = 24; }

        setSelectionBox({ x, y, w, h })
      }, 0)
    }

    updateBox()
    window.addEventListener('resize', updateBox)
    return () => window.removeEventListener('resize', updateBox)
  }, [selectedElement, processedSVG, pan, zoom, viewMode])

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        if (text) {
          handleLoadNewSvg(text)
        }
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
        else toast.error('Failed to load icon')
      } else toast.error('Failed to load icon')
    } catch (e) { console.error(e) }
  }

  const handleLoadFromURL = async () => {
    if (!urlInput) return
    setIsLoading(true)
    try {
      const result = await loadRemoteSVG(urlInput)
      if (result.success && result.data) { handleLoadNewSvg(result.data); setShowUrlPrompt(false); setUrlInput(''); toast.success('SVG loaded successfully') }
      else toast.error(result.error || 'Failed to load SVG')
    } catch (e: any) { toast.error(e.message || 'Failed to load SVG') }
    finally { setIsLoading(false) }
  }

  const handleLoadFromCode = () => {
    if (!codeInput) return
    if (!codeInput.includes('<svg')) {
      toast.error('Not a valid SVG code')
      return
    }
    handleLoadNewSvg(codeInput)
    setShowCodePrompt(false)
    setCodeInput('')
    toast.success('SVG loaded successfully')
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
        toast.success(`Optimized: Saved ${totalSavedBytes} B (${percentage}%)`)
      } else {
        toast.success('SVG is already optimized')
      }
    } catch (e) { toast.error('Failed to optimize SVG') }
    finally { setIsOptimizing(false) }
  }

  const handleToggleOptimize = (m: 'safe' | 'aggressive') => {
    if (optimizeMode === m) {
      setOptimizeMode(null)
      if (originalSvg) {
        setSvgCode(originalSvg)
        setOptimizedCode('')
        pushToHistory(originalSvg)
        toast.success('Restored original SVG')
      }
    } else {
      setOptimizeMode(m)
      handleOptimize(m)
    }
  }

  const handleCopySVG = async () => {
    if (!svgCode) return
    try { await navigator.clipboard.writeText(svgCode); toast.success('SVG copied to clipboard') }
    catch { toast.error('Failed to copy to clipboard') }
  }

  const handleDownloadSVG = () => {
    if (!svgCode) return
    const blob = new Blob([svgCode], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'icon.svg'; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 100)
    setExportSuccessModal({ open: true, format: 'svg' })
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
      const timeout = setTimeout(() => { setIsExporting(false); toast.error('Export timed out') }, 30000)
      img.onload = () => {
        clearTimeout(timeout); ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'icon.png'; a.click()
        setIsExporting(false)
        setExportSuccessModal({ open: true, format: 'png' })
      }
      img.onerror = () => { clearTimeout(timeout); toast.error('Export failed'); setIsExporting(false) }
      img.src = uri
    } catch { toast.error('Export failed'); setIsExporting(false) }
  }

  const togglePanel = (panel: string) => {
    setActivePanels(prev => prev.includes(panel) ? prev.filter(p => p !== panel) : [...prev, panel])
  }

  const renderToolbar = () => (
    <div className="flex flex-wrap items-center justify-between p-2 border-b border-border bg-white dark:bg-bg-surface shrink-0 gap-2">
      <div className="hidden md:flex items-center bg-bg-muted rounded-lg p-1 shrink-0">
        {(['preview', 'split', 'code'] as ViewMode[]).map(m => (
          <button key={m} disabled={!svgCode} onClick={() => setViewMode(m)}
            className={cn("flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-bold rounded-md transition-all",
              !svgCode ? "opacity-30 cursor-not-allowed" : viewMode === m ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}>
            {m === 'preview' ? <Eye size={14} /> : m === 'split' ? <SplitSquareHorizontal size={14} /> : <Code2 size={14} />}
            {m === 'preview' ? 'Preview' : m === 'split' ? 'Split' : 'Code'}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between w-full md:w-auto shrink-0 ml-auto gap-0.5 sm:gap-1 md:gap-2 overflow-x-auto custom-scrollbar">
        <div className="flex items-center gap-0.5 shrink-0">
          <button onClick={handleUndo} disabled={historyIndex <= 0} className={cn("p-1 md:p-1.5 rounded-md", historyIndex <= 0 ? "opacity-30" : "hover:bg-bg-subtle")}><Undo2 size={14} /></button>
          <button onClick={handleRedo} disabled={historyIndex >= history.length - 1} className={cn("p-1 md:p-1.5 rounded-md", historyIndex >= history.length - 1 ? "opacity-30" : "hover:bg-bg-subtle")}><Redo2 size={14} /></button>
        </div>
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
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
            <div className="w-px h-4 bg-border mx-1"></div>
            <button
              disabled={!svgCode}
              onClick={handleDownloadSVG}
              title={svgCode ? 'Export SVG' : ''}
              className={cn(
                "p-1.5 rounded-lg transition-all flex items-center justify-center",
                !svgCode
                  ? "text-secondary/30 opacity-30 cursor-not-allowed"
                  : "text-orange bg-orange/10 hover:bg-orange hover:text-white shadow-xs cursor-pointer"
              )}
            >
              <Download size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSidebar = () => (
    <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] dark:bg-bg-surface">
      {/* 导入操作四宫格 */}
      <div className="p-4 grid grid-cols-2 gap-2 border-b border-border bg-white dark:bg-bg-surface shrink-0">
        <button onClick={() => fileInputRef.current?.click()} className="py-2.5 px-2 bg-orange/10 text-orange hover:bg-orange hover:text-white font-bold rounded-xl border border-orange/20 transition-colors shadow-sm text-xs truncate">
          Upload SVG
        </button>
        <button onClick={() => setShowCodePrompt(true)} className="py-2.5 px-2 bg-white dark:bg-bg-surface text-primary hover:text-orange hover:border-orange font-bold rounded-xl border border-border transition-colors shadow-sm text-xs truncate">
          Paste Code
        </button>
        <button onClick={() => setShowUrlPrompt(true)} disabled={isLoading} className={cn("py-2.5 px-2 bg-white dark:bg-bg-surface text-primary hover:text-orange hover:border-orange font-bold rounded-xl border border-border transition-colors shadow-sm text-xs truncate", isLoading && "opacity-50 cursor-not-allowed")}>
          {isLoading ? '...' : 'URL'}
        </button>
        <button onClick={() => setShowLibrary(true)} className="py-2.5 px-2 bg-white dark:bg-bg-surface text-primary hover:text-orange hover:border-orange font-bold rounded-xl border border-border transition-colors shadow-sm text-xs truncate">
          Icons Library
        </button>
      </div>

      {([
        { key: 'transform', icon: Settings, title: 'Transform' },
        { key: 'optimize', icon: CheckCircle, title: 'Optimize' },
      ] as const).map(panel => (
        <div key={panel.key} className="border-b border-border">
          <button onClick={() => togglePanel(panel.key)} className="flex items-center justify-between w-full p-4 hover:bg-bg-subtle transition-colors">
            <div className="flex items-center gap-2 text-sm font-bold text-primary"><panel.icon size={16} /> {panel.title}</div>
            {activePanels.includes(panel.key) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {activePanels.includes(panel.key) && panel.key === 'transform' && (
            <div className="px-4 pb-4 space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-secondary">Rotation</label>
                <div className="grid grid-cols-3 gap-2">
                  {([90, 180, 270] as const).map(deg => (
                    <button key={deg} disabled={!svgCode} onClick={() => handleTransform(`rotate${deg}` as any)} className={cn("py-1.5 bg-white dark:bg-bg-base border rounded-lg text-xs flex items-center justify-center gap-1", !svgCode ? "opacity-50 cursor-not-allowed" : "hover:border-orange hover:text-orange")}><RotateCw size={12} /> {deg}°</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-secondary">Flip</label>
                <div className="grid grid-cols-2 gap-2">
                  <button disabled={!svgCode} onClick={() => handleTransform('flipH')} className={cn("py-1.5 border rounded-lg text-xs flex items-center justify-center gap-1", !svgCode ? "opacity-50 cursor-not-allowed" : "bg-white dark:bg-bg-base hover:border-orange hover:text-orange")}><FlipHorizontal size={12} /> Flip Horizontal</button>
                  <button disabled={!svgCode} onClick={() => handleTransform('flipV')} className={cn("py-1.5 border rounded-lg text-xs flex items-center justify-center gap-1", !svgCode ? "opacity-50 cursor-not-allowed" : "bg-white dark:bg-bg-base hover:border-orange hover:text-orange")}><FlipVertical size={12} /> Flip Vertical</button>
                </div>
              </div>
            </div>
          )}
          {activePanels.includes(panel.key) && panel.key === 'optimize' && (
            <div className="px-4 pb-4 space-y-4">
              <div className="flex items-center justify-between bg-bg-subtle p-2.5 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-secondary font-bold uppercase">Original</span>
                  <span className="text-xs font-mono text-primary font-medium">{originalSvg.length || svgCode.length} B</span>
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-secondary font-bold uppercase">Optimized</span>
                  <span className={cn("text-xs font-mono font-bold", optimizedCode && originalSvg && optimizedCode.length < originalSvg.length ? "text-green-500" : "text-primary")}>
                    {svgCode.length} B
                    {optimizedCode && originalSvg && optimizedCode.length < originalSvg.length && <span className="ml-1 opacity-80">(-{((1 - svgCode.length / originalSvg.length) * 100).toFixed(1)}%)</span>}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[10px] font-bold text-secondary uppercase shrink-0">Mode</label>
                <div className="flex-1 flex gap-2">
                  {(['safe', 'aggressive'] as const).map(m => (
                    <button key={m} onClick={() => handleToggleOptimize(m)} className={cn("flex-1 py-1.5 px-2 border rounded-lg text-xs font-bold transition-colors", optimizeMode === m ? "bg-orange text-white border-orange shadow-sm" : "bg-white dark:bg-bg-base border-border hover:border-orange text-primary hover:text-orange")}>
                      {m === 'safe' ? 'Safe' : 'Aggressive'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                <button disabled={!svgCode} onClick={handleCopySVG} className={cn("py-2 border rounded-lg text-xs font-medium flex justify-center items-center gap-2", !svgCode ? "bg-bg-muted cursor-not-allowed" : "bg-white dark:bg-bg-base hover:bg-bg-subtle")}>
                  <Code2 size={12} /> Copy SVG
                </button>
                <button disabled={!svgCode || !optimizedCode || !originalSvg} onClick={() => { if (originalSvg) { setSvgCode(originalSvg); setOptimizedCode(''); pushToHistory(originalSvg); toast.success('Restored original SVG') } }} className={cn("py-2 border rounded-lg text-xs font-medium flex justify-center items-center gap-2", (!svgCode || !optimizedCode || !originalSvg) ? "bg-bg-muted cursor-not-allowed" : "bg-white dark:bg-bg-base hover:bg-bg-subtle")}>
                  Restore Original
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Export panel */}
      <div className="border-b border-border pb-4">
        <button onClick={() => togglePanel('export')} className="flex items-center justify-between w-full p-4 hover:bg-bg-subtle transition-colors">
          <div className="flex items-center gap-2 text-sm font-bold text-primary"><Upload size={16} className="rotate-180" /> Export</div>
          {activePanels.includes('export') ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {activePanels.includes('export') && (
          <ExportPanel svgCode={svgCode} onExportSuccess={f => setExportSuccessModal({ open: true, format: f })} />
        )}
      </div>

      <div className="mt-auto pt-12 pb-6 flex justify-center opacity-40 pointer-events-none select-none">
        <FullLogo iconClassName="h-[18px] w-auto grayscale" textClassName="h-[20px] w-auto grayscale" />
      </div>
    </div>
  )

  const renderEmptyState = () => (
    <div className="flex-1 overflow-y-auto flex flex-col items-center bg-transparent">
      <div className="w-full max-w-3xl px-4 pt-6 pb-12 mx-auto flex flex-col items-center gap-5">
        {/* Upload Dropzone */}
        <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-border hover:border-orange/50 rounded-2xl flex flex-col items-center justify-center py-6 px-4 cursor-pointer bg-white dark:bg-bg-surface shadow-sm hover:shadow-md transition-all group">
          <h3 className="text-lg font-bold text-primary mb-1">Upload SVG</h3>
          <p className="text-xs text-tertiary text-center max-w-[280px]">
            Drag & drop your SVG file here, or click to browse
          </p>
        </div>

        {/* Separator */}
        <div className="flex items-center w-full max-w-md gap-4 text-tertiary">
          <div className="h-px bg-border flex-1"></div>
          <span className="text-[10px] font-bold uppercase tracking-widest">OR</span>
          <div className="h-px bg-border flex-1"></div>
        </div>

        {/* Actions Area */}
        <div className="w-full grid grid-cols-3 gap-3">
          <button onClick={() => setShowCodePrompt(true)} className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-bg-surface border border-border rounded-2xl shadow-sm hover:border-orange hover:text-orange text-sm font-bold text-primary transition-all">
            <Code2 size={16} /> <span className="truncate">Paste Code</span>
          </button>
          <button onClick={() => setShowUrlPrompt(true)} className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-bg-surface border border-border rounded-2xl shadow-sm hover:border-orange hover:text-orange text-sm font-bold text-primary transition-all">
            <LinkIcon size={16} /> URL
          </button>
          <button onClick={() => setShowLibrary(true)} className="flex items-center justify-center gap-2 p-3 bg-white dark:bg-bg-surface border border-border rounded-2xl shadow-sm hover:border-orange hover:text-orange text-sm font-bold text-primary transition-all">
            <Library size={16} /> Icons Library
          </button>
        </div>

        {/* Adsterra Native Banner placed above examples */}
        <AdsterraBanner className="!my-2 w-full" />

        <div className="w-full bg-white dark:bg-bg-surface rounded-2xl border border-border p-4 shadow-sm">
          <h4 className="text-sm font-bold text-primary mb-3">Start from an example</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
            {HOME_ICONS.map(name => (
              <button key={name} onClick={() => handleLoadPreset(name)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-border hover:border-orange hover:text-orange text-primary transition-all shadow-sm hover:shadow-md">
                <img src={`/icons/svg/${name}.svg`} alt={name} className="w-5 h-5 opacity-70 dark:invert transition-all" />
                <span className="text-[10px] text-secondary text-center truncate w-full">{name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 w-full">
          <ToolArticleBody toolKey="svgConverter" showAd={false} />
        </div>
      </div>
    </div>
  )

  return (
    <>
      <PageSEO />
      <Toaster position="top-center" />
      <ExportSuccessModal
        open={exportSuccessModal.open}
        onClose={() => setExportSuccessModal(prev => ({ ...prev, open: false }))}
        format={exportSuccessModal.format}
      />
      <input type="file" ref={fileInputRef} onChange={e => { if (e.target.files) onDrop(Array.from(e.target.files)) }} accept=".svg" className="hidden" />

      <div className="h-[100dvh] overflow-hidden flex flex-col bg-bg-base text-primary transition-colors">
        <Navbar />


        <div className="flex-1 flex flex-row overflow-hidden relative">
          {/* Desktop sidebar (Left) */}
          <div className="hidden md:flex flex-col w-[220px] lg:w-[260px] shrink-0 bg-white dark:bg-bg-surface border-r border-border z-10">
            <div className="flex-1 overflow-y-auto">{renderSidebar()}</div>
          </div>

          <div {...getRootProps()} className={cn("flex-1 flex flex-col relative bg-white dark:bg-bg-surface overflow-hidden outline-none", isDragActive && "ring-4 ring-orange/500 ring-opacity-50")}>
            {renderToolbar()}

            {syntaxError && (
              <div className="absolute top-12 left-0 right-0 z-50 mx-auto max-w-2xl bg-red-500/95 text-white px-4 py-2.5 rounded-b-xl flex items-start gap-2 shadow-lg backdrop-blur-sm animate-in slide-in-from-top-4 duration-300 pointer-events-none">
                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold uppercase tracking-wider">SVG Syntax Error</span>
                  <span className="text-[11px] opacity-90 break-all leading-tight mt-0.5 font-mono">{syntaxError}</span>
                </div>
              </div>
            )}

            <div className="flex-1 flex overflow-hidden relative">
              {svgCode ? (
                <div className="flex-1 flex w-full h-full">
                  {(viewMode === 'split' || viewMode === 'code') && (
                    <div className={cn("flex flex-col border-r border-border bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm overflow-hidden", viewMode === 'split' ? "w-1/2" : "w-full")}>
                      <div className="flex items-center justify-between px-4 py-2 border-b border-[#2d2d2d] bg-[#252526] shrink-0">
                        <span className="text-xs font-medium text-white/70">SVG Source</span>
                        <button onClick={handleCopySVG} className="text-xs text-white/50 hover:text-white transition-colors flex items-center gap-1"><Code2 size={12} /> Copy SVG</button>
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
                    <div ref={workspaceRef} className={cn("flex-1 flex flex-col items-center justify-center overflow-hidden relative p-4", bgMode === 'light' ? "bg-white" : bgMode === 'dark' ? "bg-black" : "", isDragging ? "cursor-grabbing" : "cursor-default")}
                      style={{ touchAction: 'none', ...(bgMode === 'grid' ? { backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%23000' fill-opacity='0.05' d='M0 0h16v16H0z'/%3E%3Cpath fill='%23000' fill-opacity='0.1' d='M0 0h1v16H0zm0 0h16v1H0z'/%3E%3C/svg%3E")` } : {}) }}
                      onWheel={(e) => {
                        if (e.deltaY > 0) setZoom(z => Math.max(10, z - 10))
                        else setZoom(z => Math.min(5000, z + 10))
                      }}
                      onTouchStart={(e) => {
                        if (e.touches.length >= 2) {
                          isPinching.current = true;
                          mouseDownPos.current = null;
                          elementDragState.current = null;
                          lastPanPos.current = null;
                          setSelectionBox(null);

                          const dist = Math.hypot(
                            e.touches[0].clientX - e.touches[1].clientX,
                            e.touches[0].clientY - e.touches[1].clientY
                          );
                          initialPinchDist.current = dist;
                          initialZoom.current = zoom;
                        }
                      }}
                      onTouchMove={(e) => {
                        if (e.touches.length === 2 && initialPinchDist.current !== null && initialZoom.current !== null) {
                          const dist = Math.hypot(
                            e.touches[0].clientX - e.touches[1].clientX,
                            e.touches[0].clientY - e.touches[1].clientY
                          );
                          const scale = dist / initialPinchDist.current;
                          const newZoom = Math.min(5000, Math.max(10, initialZoom.current * scale));
                          setZoom(Math.round(newZoom));
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (e.touches.length < 2) {
                          initialPinchDist.current = null;
                          initialZoom.current = null;
                          setTimeout(() => { isPinching.current = false; }, 100);
                        }
                      }}
                      onPointerDown={(e) => {
                        if (isPinching.current) return;
                        mouseDownPos.current = { x: e.clientX, y: e.clientY }

                        // 拦截: 如果点击的是图形内部，禁止拖动画布
                        const target = e.target as HTMLElement
                        
                        const leafEl = target.closest('[data-editor-id]') as HTMLElement | null;
                        const groupEl = target.closest('g[data-editor-id]') as HTMLElement | null;
                        
                        let el = groupEl || leafEl;
                        if (leafEl && groupEl && selectedElement) {
                          const groupId = groupEl.getAttribute('data-editor-id');
                          const isGroupSelected = selectedElement.id === groupId;
                          const isSiblingSelected = groupEl.querySelector(`[data-editor-id="${selectedElement.id}"]`) !== null;
                          if (isGroupSelected || isSiblingSelected) {
                            el = leafEl;
                          }
                        }
                        
                        if (el) {
                          lastPanPos.current = null;

                          // 如果点中的是新图形，顺便帮用户选中它
                          const id = el.getAttribute('data-editor-id')!
                          if (!selectedElement || selectedElement.id !== id) {
                            const info = allElements.find(e => e.id === id)
                            if (info) setSelectedElement(info)
                          }

                          const svgEl = (el as any).ownerSVGElement as SVGSVGElement | undefined
                          if (!svgEl) return;

                          let parentCTM = svgEl.getScreenCTM()
                          const parent = el.parentNode as SVGGraphicsElement
                          if (parent && parent.getScreenCTM) {
                            parentCTM = parent.getScreenCTM()
                          }

                          if (parentCTM) {
                            const pt = getMousePositionInSVG(e.clientX, e.clientY, svgEl, parentCTM)

                            let paddingX = 0; let paddingY = 0;
                            const ratio = getSvgScaleRatio(svgEl)
                            const strokeW = parseFloat(getComputedStyle(el).strokeWidth) || 0
                            if (strokeW > 0) {
                              paddingX = (strokeW * ratio.ratioX) / 2 || 0
                              paddingY = (strokeW * ratio.ratioY) / 2 || 0
                            }

                            elementDragState.current = {
                              id, el, svgEl, ctm: parentCTM,
                              startXInSVG: pt.x,
                              startYInSVG: pt.y,
                              lastDx: 0, lastDy: 0,
                              originalTransform: el.getAttribute('transform') || '',
                              paddingX, paddingY
                            }
                          }
                          return;
                        }

                        lastPanPos.current = { x: e.clientX, y: e.clientY };
                      }}
                      onPointerMove={(e) => {
                        if (isPinching.current) return;
                        // 处理图形拖拽
                        if (elementDragState.current) {
                          const state = elementDragState.current;
                          const currentPt = getMousePositionInSVG(e.clientX, e.clientY, state.svgEl, state.ctm)

                          if (state.isResizing) {
                            let kX = 1; let kY = 1;

                            if (state.resizeDir === 'e' || state.resizeDir === 'w') {
                              let raw = (currentPt.x - state.anchorX!) / (state.startXInSVG - state.anchorX!);
                              kX = isNaN(raw) || Math.abs(raw) < 0.05 ? (raw < 0 ? -0.05 : 0.05) : raw;
                              kY = 1;
                            } else if (state.resizeDir === 'n' || state.resizeDir === 's') {
                              let raw = (currentPt.y - state.anchorY!) / (state.startYInSVG - state.anchorY!);
                              kY = isNaN(raw) || Math.abs(raw) < 0.05 ? (raw < 0 ? -0.05 : 0.05) : raw;
                              kX = 1;
                            } else {
                              const currentDist = Math.sqrt(
                                Math.pow(currentPt.x - state.anchorX!, 2) + Math.pow(currentPt.y - state.anchorY!, 2)
                              );
                              let k = currentDist / state.startDist!;
                              if (isNaN(k) || k <= 0.05) k = 1;
                              kX = k; kY = k;
                            }

                            const newScaleX = state.startScaleX! * kX;
                            const newScaleY = state.startScaleY! * kY;
                            const newTx = state.anchorX! - (state.anchorX! - state.startTx!) * kX;
                            const newTy = state.anchorY! - (state.anchorY! - state.startTy!) * kY;

                            state.lastScaleX = newScaleX;
                            state.lastScaleY = newScaleY;
                            state.lastTx = newTx;
                            state.lastTy = newTy;

                            const t = parseTransform(state.originalTransform);
                            t.scaleX = newScaleX;
                            t.scaleY = newScaleY;
                            t.tx = newTx;
                            t.ty = newTy;
                            state.el.setAttribute('transform', buildTransform(t));
                          } else {
                            const dx = currentPt.x - state.startXInSVG;
                            const dy = currentPt.y - state.startYInSVG;
                            state.lastDx = dx;
                            state.lastDy = dy;
                            const t = parseTransform(state.originalTransform)
                            t.tx += dx;
                            t.ty += dy;
                            state.el.setAttribute('transform', buildTransform(t))
                          }

                          // 同步移动标注框
                          const boxEl = document.getElementById('selection-box-overlay')
                          if (boxEl && workspaceRef.current) {
                            const rect = state.el.getBoundingClientRect()
                            const workspaceRect = workspaceRef.current.getBoundingClientRect()

                            let w = rect.width
                            let h = rect.height
                            let x = rect.left - workspaceRect.left
                            let y = rect.top - workspaceRect.top

                            const strokeW = parseFloat(getComputedStyle(state.el).strokeWidth) || 0
                            if (strokeW > 0) {
                              const ctm = (state.el as unknown as SVGGraphicsElement).getScreenCTM()
                              if (ctm) {
                                const scaleX = Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b)
                                const scaleY = Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d)
                                const px = (strokeW * scaleX) / 2
                                const py = (strokeW * scaleY) / 2
                                x -= px; y -= py;
                                w += px * 2; h += py * 2;
                              }
                            }
                            if (w < 24) { x -= (24 - w) / 2; w = 24; }
                            if (h < 24) { y -= (24 - h) / 2; h = 24; }

                            boxEl.style.left = `${x}px`
                            boxEl.style.top = `${y}px`
                            boxEl.style.width = `${w}px`
                            boxEl.style.height = `${h}px`
                          }
                          return;
                        }

                        // 正常的画布拖拽 (Pan)
                        if (!lastPanPos.current) return
                        const dx = e.clientX - lastPanPos.current.x
                        const dy = e.clientY - lastPanPos.current.y
                        // 移动超过 10px 才算拖拽
                        if (!isDragging && mouseDownPos.current &&
                          (Math.abs(e.clientX - mouseDownPos.current.x) > 10 ||
                            Math.abs(e.clientY - mouseDownPos.current.y) > 10)) {
                          setIsDragging(true)
                        }
                        if (isDragging) {
                          setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
                          lastPanPos.current = { x: e.clientX, y: e.clientY };
                        }
                      }}
                      onPointerUp={() => {
                        if (isPinching.current) return;
                        if (elementDragState.current) {
                          const state = elementDragState.current;
                          // 允许极小的误差，防止被识别为拖拽
                          if (state.isResizing) {
                            if (state.lastScaleX !== undefined) {
                              const t = parseTransform(state.originalTransform);
                              t.scaleX = state.lastScaleX;
                              t.scaleY = state.lastScaleY!;
                              t.tx = state.lastTx!;
                              t.ty = state.lastTy!;
                              const index = allElements.find(e => e.id === state.id)?.index;
                              if (index !== undefined) {
                                handleUpdateSvg(updateElementAttribute(svgCode, index, 'transform', buildTransform(t)))
                              }
                            }
                          } else if (Math.abs(state.lastDx) > 0.1 || Math.abs(state.lastDy) > 0.1) {
                            const t = parseTransform(state.originalTransform)
                            t.tx += state.lastDx;
                            t.ty += state.lastDy;
                            const finalTransform = buildTransform(t)

                            // 查找元素的 index
                            const index = allElements.find(e => e.id === state.id)?.index;
                            if (index !== undefined) {
                              // 把累积的位移写入到 SVG 并存入撤销栈
                              const newCode = updateElementAttribute(svgCode, index, 'transform', finalTransform)
                              handleUpdateSvg(newCode)
                            }
                          }
                          elementDragState.current = null;
                        }

                        setIsDragging(false); lastPanPos.current = null;
                      }}
                      onPointerLeave={() => { setIsDragging(false); lastPanPos.current = null; elementDragState.current = null; }}

                      onClick={(e) => {
                        // 防止真正的拖拽结束后误触 onClick 导致取消选择
                        if (mouseDownPos.current && (
                          Math.abs(e.clientX - mouseDownPos.current.x) > 10 ||
                          Math.abs(e.clientY - mouseDownPos.current.y) > 10
                        )) {
                          return;
                        }

                        const target = e.target as HTMLElement
                        if (target.closest('#selection-box-overlay')) return;

                        const leafEl = target.closest('[data-editor-id]') as HTMLElement | null;
                        const groupEl = target.closest('g[data-editor-id]') as HTMLElement | null;
                        
                        let el = groupEl || leafEl;
                        if (leafEl && groupEl && selectedElement) {
                          const groupId = groupEl.getAttribute('data-editor-id');
                          const isGroupSelected = selectedElement.id === groupId;
                          const isSiblingSelected = groupEl.querySelector(`[data-editor-id="${selectedElement.id}"]`) !== null;
                          if (isGroupSelected || isSiblingSelected) {
                            el = leafEl;
                          }
                        }

                        if (el) {
                          const id = el.getAttribute('data-editor-id')!
                          const info = allElements.find(e => e.id === id)
                          if (info) setSelectedElement(info)
                        } else {
                          // 点击到空白区域，取消选择
                          setSelectedElement(null)
                        }
                      }}
                    >
                      <div
                        ref={previewRef}
                        className="svg-preview-container flex items-center justify-center origin-center"
                        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})` }}
                        dangerouslySetInnerHTML={{ __html: processedSVG.html || sanitizedSVG }}
                      />

                      {selectionBox && (
                        <div
                          id="selection-box-overlay"
                          className="absolute pointer-events-none border-[1.5px] border-[#007AFF] z-40"
                          style={{
                            left: selectionBox.x,
                            top: selectionBox.y,
                            width: selectionBox.w,
                            height: selectionBox.h,
                          }}
                        >


                          {/* 四条边拉伸控制柄 (边缘吸附区) */}
                          {selectionBox.w > 30 && selectionBox.h > 30 && ['n', 's', 'w', 'e'].map(dir => (
                            <div key={dir}
                              onPointerDown={(e) => { e.stopPropagation(); handleResizeStart(e, dir); }}
                              className={cn(
                                "absolute pointer-events-auto hover:bg-[#007AFF]/20 transition-colors z-[41] touch-none",
                                ['n', 's'].includes(dir) ? "h-[20px] w-[calc(100%-20px)] left-[10px] opacity-0 hover:opacity-100" : "w-[20px] h-[calc(100%-20px)] top-[10px] opacity-0 hover:opacity-100",
                                dir === 'n' ? '-top-[10px]' : '',
                                dir === 's' ? '-bottom-[10px]' : '',
                                dir === 'w' ? '-left-[10px]' : '',
                                dir === 'e' ? '-right-[10px]' : ''
                              )}
                              style={{ cursor: `${dir}-resize` }}
                            />
                          ))}

                          {/* 四个角缩放控制柄 (高亮显示) */}
                          {['nw', 'ne', 'sw', 'se'].map(dir => (
                            <div key={dir}
                              onPointerDown={(e) => { e.stopPropagation(); handleResizeStart(e, dir); }}
                              className={cn(
                                "absolute w-[10px] h-[10px] bg-white border-[1.5px] border-[#007AFF] pointer-events-auto hover:bg-[#007AFF] transition-colors z-[42] touch-none",
                                selectionBox.w > 30 && selectionBox.h > 30 ? "after:absolute after:content-[''] after:-inset-[12px]" : "", // 只有图形足够大时才添加大热区，避免遮挡微小元素的中心拖拽区

                                dir.includes('n') ? '-top-[5px]' : '-bottom-[5px]',
                                dir.includes('w') ? '-left-[5px]' : '-right-[5px]'
                              )}
                              style={{ cursor: `${dir}-resize` }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : renderEmptyState()}
            </div>
          </div>

          {/* Desktop Right Sidebar — Properties Panel */}
          <div className="hidden md:flex flex-col w-[240px] lg:w-[280px] shrink-0 bg-white dark:bg-bg-surface border-l border-border z-10">
            {selectedElement ? (
              <PropertiesPanel
                element={selectedElement}
                svgCode={svgCode}
                onUpdateSvg={handleUpdateSvg}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-5 bg-bg-base/30">
                <div className="w-full h-full border-[1.5px] border-dashed border-border/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-sm bg-white/30 dark:bg-black/10">
                  <div className="w-12 h-12 mb-4 rounded-full bg-bg-subtle flex items-center justify-center text-secondary/40 shadow-inner">
                    <MousePointer2 size={22} />
                  </div>
                  <h3 className="text-xs font-bold text-primary mb-2 uppercase tracking-widest">
                    No Element Selected
                  </h3>
                  <p className="text-[11px] text-secondary/70 leading-relaxed max-w-[160px]">
                    Click on any SVG element to edit its fill, stroke, size and styles
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile bottom nav */}
        {svgCode && (
          <div className="md:hidden flex flex-col bg-white dark:bg-bg-surface border-t border-border shrink-0 z-20">
            <div className="overflow-y-auto h-[35vh]">
              {mobileTab === 'canvas' && (
                <div className="p-4 space-y-5">
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 p-3 bg-orange/10 text-orange font-bold rounded-xl border border-orange/20"><Upload size={18} /> <span className="text-sm">Upload SVG</span></button>
                    <button onClick={() => setShowCodePrompt(true)} className="flex items-center justify-center gap-2 p-3 bg-bg-subtle text-primary font-bold rounded-xl border"><Code2 size={18} /> <span className="text-sm">Paste Code</span></button>
                    <button onClick={() => setShowUrlPrompt(true)} className="flex items-center justify-center gap-2 p-3 bg-bg-subtle text-primary font-bold rounded-xl border"><LinkIcon size={18} /> <span className="text-sm">URL</span></button>
                    <button onClick={() => setShowLibrary(true)} className="flex items-center justify-center gap-2 p-3 bg-bg-subtle text-primary font-bold rounded-xl border"><Library size={18} /> <span className="text-sm">Icons Library</span></button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-secondary font-bold">View Mode</label>
                    <div className="flex bg-bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('preview')}
                        className={cn("flex-1 flex items-center justify-center py-2 rounded-md text-xs font-bold transition-all", viewMode === 'preview' ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}
                      >
                        <Eye size={14} className="mr-1.5" /> Preview
                      </button>
                      <button
                        onClick={() => setViewMode('split')}
                        className={cn("flex-1 flex items-center justify-center py-2 rounded-md text-xs font-bold transition-all", viewMode === 'split' ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}
                      >
                        <SplitSquareHorizontal size={14} className="mr-1.5" /> Split
                      </button>
                      <button
                        onClick={() => setViewMode('code')}
                        className={cn("flex-1 flex items-center justify-center py-2 rounded-md text-xs font-bold transition-all", viewMode === 'code' ? "bg-white shadow-sm text-slate-900" : "text-secondary hover:text-primary")}
                      >
                        <Code2 size={14} className="mr-1.5" /> Code
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {mobileTab === 'properties' && (
                <div className="h-full w-full">
                  {selectedElement ? (
                    <PropertiesPanel
                      element={selectedElement}
                      svgCode={svgCode}
                      onUpdateSvg={handleUpdateSvg}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-5 text-secondary/70">
                      <MousePointer2 size={24} className="mb-2 opacity-50" />
                      <p className="text-xs font-medium">No Element Selected</p>
                    </div>
                  )}
                </div>
              )}
              {mobileTab === 'transform' && (
                <div className="p-4 space-y-5">
                  <div className="grid grid-cols-3 gap-2">
                    {([90, 180, 270] as const).map(d => <button key={d} onClick={() => handleTransform(`rotate${d}` as any)} className="py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-bg-base"><RotateCw size={14} /> {d}°</button>)}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleTransform('flipH')} className="py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-bg-base"><FlipHorizontal size={14} /> Flip Horizontal</button>
                    <button onClick={() => handleTransform('flipV')} className="py-2 border rounded-lg text-sm font-medium flex items-center justify-center gap-1 shadow-sm bg-white dark:bg-bg-base"><FlipVertical size={14} /> Flip Vertical</button>
                  </div>
                  <div className="space-y-4 pt-3 border-t border-border">
                    <div className="flex items-center justify-between bg-bg-subtle p-3 rounded-xl border border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-secondary font-bold uppercase">Original</span>
                        <span className="text-sm font-mono text-primary font-bold">{originalSvg.length || svgCode.length} B</span>
                      </div>
                      <div className="h-4 w-px bg-border"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-secondary font-bold uppercase">Optimized</span>
                        <span className={cn("text-sm font-mono font-bold", optimizedCode && originalSvg && optimizedCode.length < originalSvg.length ? "text-green-500" : "text-primary")}>
                          {svgCode.length} B
                          {optimizedCode && originalSvg && optimizedCode.length < originalSvg.length && <span className="ml-1.5 opacity-90">(-{((1 - svgCode.length / originalSvg.length) * 100).toFixed(1)}%)</span>}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-secondary uppercase shrink-0">Mode</label>
                      <div className="flex-1 flex gap-2">
                        {(['safe', 'aggressive'] as const).map(m => (
                          <button key={m} onClick={() => handleToggleOptimize(m)} className={cn("flex-1 py-2 px-3 border rounded-xl text-sm font-bold transition-colors shadow-sm", optimizeMode === m ? "bg-orange text-white border-orange" : "bg-white dark:bg-bg-base border-border text-primary")}>
                            {m === 'safe' ? 'Safe' : 'Aggressive'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {mobileTab === 'export' && (
                <ExportPanel svgCode={svgCode} onExportSuccess={f => setExportSuccessModal({ open: true, format: f })} />
              )}
            </div>
            <div className="flex items-center p-1 border-t border-border bg-bg-subtle shrink-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
              {[
                { id: 'canvas' as const, icon: Maximize2 },
                { id: 'properties' as const, icon: Sliders },
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
              <div className="flex items-center gap-2 text-primary font-bold"><Grid size={18} /> Icons Library</div>
              <button onClick={() => setShowLibrary(false)} className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-bg-subtle"><X size={18} /></button>
            </div>
            <div className="p-4 bg-white dark:bg-bg-surface border-b border-border shrink-0">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" />
                <input type="text" value={librarySearch} onChange={e => { setLibrarySearch(e.target.value); setLibraryLimit(30) }} placeholder="Search icons..." className="w-full pl-9 pr-4 py-2.5 bg-bg-subtle border border-border rounded-xl text-sm outline-none focus:border-orange" />
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
                  <button onClick={() => setLibraryLimit(l => l + 30)} className="px-6 py-2 bg-white dark:bg-bg-surface border border-border rounded-full text-sm font-bold hover:text-orange hover:border-orange shadow-sm">Load More</button>
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
              <div className="flex items-center gap-2 text-primary font-bold"><LinkIcon size={18} /> Load from URL</div>
              <button onClick={() => setShowUrlPrompt(false)} className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-bg-subtle"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-secondary">Enter a public SVG URL to import directly into the editor.</p>
              <input type="text" autoFocus placeholder="https://example.com/icon.svg" value={urlInput} onChange={e => setUrlInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') handleLoadFromURL() }}
                className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-sm outline-none focus:border-orange" />
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowUrlPrompt(false)} className="px-5 py-2 text-sm font-medium text-secondary hover:bg-bg-subtle rounded-xl">Cancel</button>
                <button onClick={handleLoadFromURL} disabled={!urlInput || isLoading} className={cn("px-5 py-2 text-sm font-bold rounded-xl shadow-sm transition-all", !urlInput || isLoading ? "bg-bg-muted text-tertiary cursor-not-allowed" : "bg-orange hover:opacity-90 text-white")}>
                  {isLoading ? 'Loading...' : 'Load SVG'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Prompt Modal */}
      {showCodePrompt && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2 text-primary font-bold"><Code2 size={18} /> Paste SVG Code</div>
              <button onClick={() => setShowCodePrompt(false)} className="p-1.5 text-secondary hover:text-primary rounded-lg hover:bg-bg-subtle"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <textarea autoFocus placeholder="<svg>...</svg>" value={codeInput} onChange={e => setCodeInput(e.target.value)} rows={8}
                className="w-full px-4 py-3 bg-bg-subtle border border-border rounded-xl text-sm outline-none focus:border-orange font-mono resize-none" />
              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowCodePrompt(false)} className="px-5 py-2 text-sm font-medium text-secondary hover:bg-bg-subtle rounded-xl">Cancel</button>
                <button onClick={handleLoadFromCode} disabled={!codeInput} className={cn("px-5 py-2 text-sm font-bold rounded-xl shadow-sm transition-all", !codeInput ? "bg-bg-muted text-tertiary cursor-not-allowed" : "bg-orange hover:opacity-90 text-white")}>
                  Load SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overwrite Confirmation Modal */}
      {showOverwritePrompt && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 p-4 border-b border-border text-primary font-bold">
              <AlertTriangle size={18} className="text-orange" />
              Warning
            </div>
            <div className="p-6 space-y-6">
              <p className="text-sm text-secondary font-medium">
                Loading a new SVG will overwrite your current canvas. Are you sure you want to proceed?
              </p>
              <div className="flex justify-end gap-2">
                <button onClick={() => { setShowOverwritePrompt(false); setPendingSvgCode(null) }} className="px-5 py-2 text-sm font-medium text-secondary hover:bg-bg-subtle rounded-xl">
                  Cancel
                </button>
                <button onClick={confirmLoadNewSvg} className="px-5 py-2 text-sm font-bold bg-orange hover:opacity-90 text-white rounded-xl shadow-sm transition-all">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* SPA Navigation Blocker Modal */}
      {blocker.state === 'blocked' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-bg-surface border border-border shadow-2xl rounded-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-primary mb-2">
                Unsaved Changes
              </h3>
              <p className="text-secondary text-sm leading-relaxed mb-6">
                You have unsaved changes in your SVG editor. Leaving this page will discard your changes.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => blocker.reset?.()} className="px-5 py-2.5 text-sm font-medium text-secondary hover:bg-bg-subtle rounded-xl transition-colors">
                  Stay on Page
                </button>
                <button onClick={() => blocker.proceed?.()} className="px-5 py-2.5 text-sm font-bold bg-red hover:opacity-90 text-white rounded-xl shadow-sm transition-opacity">
                  Leave
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


    </>
  )
}

const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh]">
    <div className="w-6 h-6 rounded-full border-2 border-orange/20 border-t-orange animate-spin" />
  </div>
)


export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<EditorPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/resources/:slug" element={<ArticlePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <CookieConsent />
      </Suspense>
    </ErrorBoundary>
  )
}
