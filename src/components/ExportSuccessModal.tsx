'use client';

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CheckCircle2, X } from 'lucide-react'

interface ExportSuccessModalProps {
  open: boolean
  onClose: () => void
  format: string
}

function AdModal300x250() {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <base target="_blank">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      width: 300px;
      height: 250px;
      background: transparent;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '1f014d8976e8416454b2d4d778822741',
      'format' : 'iframe',
      'height' : 250,
      'width' : 300,
      'params' : {}
    };
  <\/script>
  <script type="text/javascript" src="https://www.highrevenueformat.com/1f014d8976e8416454b2d4d778822741/invoke.js"><\/script>
</body>
</html>`

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document
      if (doc) {
        doc.open()
        doc.write(html)
        doc.close()
      }
    } catch (e) {
      console.warn('Failed to write into ad iframe:', e)
    }
  }, [])

  return (
    <div className="w-[300px] h-[250px] overflow-hidden rounded-2xl border border-border/80 bg-bg-surface/50 dark:bg-bg-surface/30 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex items-center justify-center">
      <iframe
        ref={iframeRef}
        title="Advertisement"
        width={300}
        height={250}
        style={{ width: '300px', height: '250px', border: 'none', overflow: 'hidden' }}
        scrolling="no"
      />
    </div>
  )
}

export function ExportSuccessModal({ open, onClose, format }: ExportSuccessModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Semi-transparent backdrop with click-to-close */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Dialog content */}
      <div
        className="relative z-10 w-full max-w-sm sm:max-w-md bg-white dark:bg-bg-surface border border-border rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top-right close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-secondary hover:text-primary hover:bg-bg-subtle transition-all"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Celebratory badge + title */}
        <div className="flex items-center gap-2 mb-1 text-green-600 dark:text-green-400">
          <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle2 size={20} strokeWidth={2.5} />
          </div>
          <h3 className="text-lg font-bold text-primary">
            Export Successful!
          </h3>
        </div>

        <p className="text-xs text-secondary text-center mb-3.5">
          Your .{format.toUpperCase()} file has been generated and downloaded.
        </p>

        {/* Sponsor Ad Area */}
        <div className="flex flex-col items-center justify-center w-full my-1">
          <div className="text-[10px] text-secondary/40 uppercase tracking-widest mb-1.5 select-none font-medium">
            SPONSORED · ADVERTISEMENT
          </div>
          <AdModal300x250 />
        </div>

        {/* Quick action buttons */}
        <div className="mt-4 w-full flex flex-col items-center gap-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 bg-orange text-white rounded-xl font-bold text-sm shadow-sm hover:opacity-95 active:scale-[0.99] transition-all"
          >
            Continue Editing
          </button>
          <span className="text-[11px] text-secondary/50 select-none">
            Press Esc or click outside to close
          </span>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default ExportSuccessModal
