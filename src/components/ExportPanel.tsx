import React, { useState, useEffect } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { cn } from '@/utils'
import { useTranslation } from 'react-i18next'

interface ExportPanelProps {
  svgCode: string
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ svgCode }) => {
  const { t } = useTranslation()
  const [format, setFormat] = useState<'svg' | 'png' | 'webp' | 'jpeg'>('svg')
  const [bg, setBg] = useState<'transparent' | 'white' | 'black' | 'custom'>('transparent')
  const [customBg, setCustomBg] = useState('#ffffff')
  const [scale, setScale] = useState(1)
  const [baseWidth, setBaseWidth] = useState(0)
  const [baseHeight, setBaseHeight] = useState(0)
  const [targetWidth, setTargetWidth] = useState(0)
  const [targetHeight, setTargetHeight] = useState(0)
  const [aspectRatio, setAspectRatio] = useState(1)

  useEffect(() => {
    if (!svgCode) return
    const wrapper = document.createElement('div')
    wrapper.innerHTML = svgCode.trim()
    const svgEl = wrapper.querySelector('svg')
    if (svgEl) {
      let w = parseFloat(svgEl.getAttribute('width') || '0')
      let h = parseFloat(svgEl.getAttribute('height') || '0')
      
      if (!w || !h) {
        const viewBox = svgEl.getAttribute('viewBox')
        if (viewBox) {
          const parts = viewBox.trim().split(/[ ,]+/)
          if (parts.length >= 4) {
            w = parseFloat(parts[2])
            h = parseFloat(parts[3])
          }
        }
      }
      if (!w) w = 800
      if (!h) h = 800
      setBaseWidth(w)
      setBaseHeight(h)
      
      // Keep old user override scale, just update the target based on new original
      setTargetWidth(Math.round(w * scale))
      setTargetHeight(Math.round(h * scale))
      setAspectRatio(w / h)
    }
  }, [svgCode])

  const handleScaleChange = (s: number) => {
    setScale(s)
    setTargetWidth(Math.round(baseWidth * s))
    setTargetHeight(Math.round(baseHeight * s))
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const w = parseInt(e.target.value) || 0
    setTargetWidth(w)
    setTargetHeight(Math.round(w / aspectRatio))
    setScale(w / baseWidth)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const h = parseInt(e.target.value) || 0
    setTargetHeight(h)
    setTargetWidth(Math.round(h * aspectRatio))
    setScale(h / baseHeight)
  }

  const handleExport = async () => {
    if (format === 'svg') {
      const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `export.svg`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      return
    }

    try {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = svgCode.trim()
      const svgEl = wrapper.querySelector('svg')
      if (!svgEl) throw new Error('Invalid SVG')

      // Set explicit dimensions for accurate rendering
      svgEl.setAttribute('width', targetWidth.toString())
      svgEl.setAttribute('height', targetHeight.toString())

      const svgString = new XMLSerializer().serializeToString(svgEl)
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)

      const img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      const bgColor = format === 'jpeg' && bg === 'transparent' ? '#ffffff' : (bg === 'custom' ? customBg : bg)
      
      if (bgColor !== 'transparent') {
        ctx.fillStyle = bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
      URL.revokeObjectURL(url)

      const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg'
      const dataUrl = canvas.toDataURL(mimeType, 1.0)
      
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = `export.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error('Export failed', e)
    }
  }

  return (
    <div className="flex flex-col gap-5 p-4 w-full text-sm">
      <div className="space-y-2">
        <label className="text-xs font-bold text-secondary uppercase">{t('pages.svgConverter.exportPanel.format')}</label>
        <div className="grid grid-cols-4 gap-2">
          {(['svg', 'png', 'webp', 'jpeg'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                "py-2 rounded-lg font-bold text-xs border transition-colors",
                format === f ? "bg-orange text-white border-orange" : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle"
              )}
            >
              {t(`pages.svgConverter.exportPanel.format${f.toUpperCase()}`)}
            </button>
          ))}
        </div>
      </div>

      {format !== 'svg' && (
        <>
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase">Background</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setBg('transparent')}
                disabled={format === 'jpeg'}
                className={cn(
                  "py-2 rounded-lg font-bold text-xs border transition-colors",
                  bg === 'transparent' ? "bg-blue-500/10 text-blue-500 border-blue-500/50" : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle",
                  format === 'jpeg' && "opacity-50 cursor-not-allowed bg-bg-muted"
                )}
              >
                Transparent
              </button>
              <button
                onClick={() => setBg('white')}
                className={cn(
                  "py-2 rounded-lg font-bold text-xs border transition-colors",
                  bg === 'white' ? "bg-blue-500/10 text-blue-500 border-blue-500/50" : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle"
                )}
              >
                White
              </button>
              <div className={cn(
                "flex items-center gap-1 border rounded-lg bg-white dark:bg-bg-base overflow-hidden px-1 transition-colors",
                bg === 'custom' ? "border-blue-500/50 bg-blue-500/10" : "border-border"
              )}>
                <input 
                  type="color" 
                  value={customBg} 
                  onChange={e => { setCustomBg(e.target.value); setBg('custom') }}
                  className="w-6 h-6 border-0 p-0 cursor-pointer bg-transparent"
                />
                <span className={cn("text-xs font-bold flex-1 text-center", bg === 'custom' ? "text-blue-500" : "text-primary")}>Custom</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase">Scale & Size</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[1, 2, 4, 8].map(s => (
                <button
                  key={s}
                  onClick={() => handleScaleChange(s)}
                  className={cn(
                    "py-1.5 rounded-lg font-bold text-xs border transition-colors",
                    scale === s ? "bg-blue-500/10 text-blue-500 border-blue-500/50" : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle"
                  )}
                >
                  {s}x
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex flex-col flex-1">
                <span className="text-[10px] text-tertiary font-medium mb-1">Width (px)</span>
                <input 
                  type="number" 
                  value={targetWidth} 
                  onChange={handleWidthChange}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono bg-white dark:bg-bg-base focus:outline-none focus:ring-1 focus:ring-orange"
                />
              </div>
              <div className="mt-4 text-tertiary">
                <RefreshCw size={14} className="opacity-50" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] text-tertiary font-medium mb-1">Height (px)</span>
                <input 
                  type="number" 
                  value={targetHeight} 
                  onChange={handleHeightChange}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono bg-white dark:bg-bg-base focus:outline-none focus:ring-1 focus:ring-orange"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <button 
        onClick={handleExport}
        className="w-full py-3 bg-orange hover:bg-orange/90 text-white font-bold rounded-xl flex justify-center items-center gap-2 shadow-sm transition-colors"
      >
        <Download size={18} />
        Export {format.toUpperCase()}
      </button>
    </div>
  )
}
