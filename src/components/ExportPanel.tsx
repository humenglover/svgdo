import React, { useState, useEffect } from 'react'
import { Download, RefreshCw } from 'lucide-react'
import { cn } from '@/utils'
import { ExportSuccessModal } from './ExportSuccessModal'

interface ExportPanelProps {
  svgCode: string
  onExportSuccess?: (format: string) => void
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ svgCode, onExportSuccess }) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
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
    if (!svgCode) return

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
      if (onExportSuccess) onExportSuccess('svg')
      else setShowSuccessModal(true)
      return
    }

    try {
      const wrapper = document.createElement('div')
      wrapper.innerHTML = svgCode.trim()
      const svgEl = wrapper.querySelector('svg')
      if (!svgEl) throw new Error('Invalid SVG')

      const finalWidth = targetWidth || 800
      const finalHeight = targetHeight || 800

      svgEl.setAttribute('width', finalWidth.toString())
      svgEl.setAttribute('height', finalHeight.toString())

      const cleanedSvg = wrapper.innerHTML
      const svgBlob = new Blob([cleanedSvg], { type: 'image/svg+xml;charset=utf-8' })
      const URL_API = window.URL || window.webkitURL || window
      const blobUrl = URL_API.createObjectURL(svgBlob)

      const image = new Image()
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = finalWidth
        canvas.height = finalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        if (format === 'jpeg' || bg !== 'transparent') {
          ctx.fillStyle = bg === 'custom' ? customBg : bg === 'black' ? '#000000' : '#ffffff'
          ctx.fillRect(0, 0, finalWidth, finalHeight)
        }

        ctx.drawImage(image, 0, 0, finalWidth, finalHeight)
        URL_API.revokeObjectURL(blobUrl)

        const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg'
        canvas.toBlob((blob) => {
          if (!blob) return
          const downloadUrl = URL_API.createObjectURL(blob)
          const downloadLink = document.createElement('a')
          downloadLink.href = downloadUrl
          downloadLink.download = `export.${format}`
          document.body.appendChild(downloadLink)
          downloadLink.click()
          document.body.removeChild(downloadLink)
          URL_API.revokeObjectURL(downloadUrl)
          
          if (onExportSuccess) onExportSuccess(format)
          else setShowSuccessModal(true)
        }, mimeType, 0.95)
      }
      image.onerror = () => {
        URL_API.revokeObjectURL(blobUrl)
      }
      image.src = blobUrl
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 1. Format Selection */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-secondary uppercase">Format</label>
        <div className="grid grid-cols-4 gap-2">
          {(['svg', 'png', 'webp', 'jpeg'] as const).map(f => (
            <button
              key={f}
              disabled={!svgCode}
              onClick={() => setFormat(f)}
              className={cn(
                "py-2 rounded-lg font-bold text-xs border transition-colors uppercase",
                !svgCode
                  ? "opacity-30 cursor-not-allowed bg-white dark:bg-bg-base border-border text-secondary"
                  : format === f
                  ? "bg-orange text-white border-orange shadow-sm"
                  : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle"
              )}
            >
              {f}
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
                disabled={!svgCode || format === 'jpeg'}
                className={cn(
                  "py-2 rounded-lg font-bold text-xs border transition-colors",
                  !svgCode
                    ? "opacity-30 cursor-not-allowed bg-white dark:bg-bg-base border-border text-secondary"
                    : bg === 'transparent'
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/50"
                    : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle",
                  format === 'jpeg' && "opacity-50 cursor-not-allowed bg-bg-muted"
                )}
              >
                Transparent
              </button>
              <button
                onClick={() => setBg('white')}
                disabled={!svgCode}
                className={cn(
                  "py-2 rounded-lg font-bold text-xs border transition-colors",
                  !svgCode
                    ? "opacity-30 cursor-not-allowed bg-white dark:bg-bg-base border-border text-secondary"
                    : bg === 'white'
                    ? "bg-blue-500/10 text-blue-500 border-blue-500/50"
                    : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle"
                )}
              >
                White
              </button>
              <div className={cn(
                "flex items-center gap-1 border rounded-lg bg-white dark:bg-bg-base overflow-hidden px-1 transition-colors",
                !svgCode && "opacity-30 cursor-not-allowed",
                bg === 'custom' ? "border-blue-500/50 bg-blue-500/10" : "border-border"
              )}>
                <input 
                  type="color" 
                  disabled={!svgCode}
                  value={customBg} 
                  onChange={e => { setCustomBg(e.target.value); setBg('custom') }}
                  className="w-6 h-6 border-0 p-0 cursor-pointer bg-transparent disabled:cursor-not-allowed"
                />
                <span className={cn("text-xs font-bold flex-1 text-center", bg === 'custom' ? "text-blue-500" : "text-primary")}>Custom</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary uppercase">Resolution / Scale</label>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[1, 2, 4, 8].map(s => (
                <button
                  key={s}
                  disabled={!svgCode}
                  onClick={() => handleScaleChange(s)}
                  className={cn(
                    "py-1.5 rounded-lg font-bold text-xs border transition-colors",
                    !svgCode
                      ? "opacity-30 cursor-not-allowed bg-white dark:bg-bg-base border-border text-secondary"
                      : scale === s
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/50"
                      : "bg-white dark:bg-bg-base border-border text-primary hover:bg-bg-subtle"
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
                  disabled={!svgCode}
                  value={targetWidth} 
                  onChange={handleWidthChange}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono bg-white dark:bg-bg-base focus:outline-none focus:ring-1 focus:ring-orange disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>
              <div className="mt-4 text-tertiary">
                <RefreshCw size={14} className="opacity-50" />
              </div>
              <div className="flex flex-col flex-1">
                <span className="text-[10px] text-tertiary font-medium mb-1">Height (px)</span>
                <input 
                  type="number" 
                  disabled={!svgCode}
                  value={targetHeight} 
                  onChange={handleHeightChange}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm font-mono bg-white dark:bg-bg-base focus:outline-none focus:ring-1 focus:ring-orange disabled:opacity-30 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <button 
        disabled={!svgCode}
        onClick={handleExport}
        className={cn(
          "w-full py-3 font-bold rounded-xl flex justify-center items-center gap-2 transition-all shadow-sm",
          !svgCode
            ? "bg-bg-muted border border-border text-secondary/40 opacity-30 cursor-not-allowed shadow-none"
            : "bg-orange hover:bg-orange/90 text-white active:scale-[0.99]"
        )}
      >
        <Download size={18} />
        Export {format.toUpperCase()}
      </button>

      {!onExportSuccess && (
        <ExportSuccessModal
          open={showSuccessModal}
          onClose={() => setShowSuccessModal(false)}
          format={format}
        />
      )}
    </div>
  )
}
