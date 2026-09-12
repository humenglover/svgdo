import { useEffect, useRef, useState } from 'react'

interface AdsterraBannerProps {
  className?: string
  maxWidth?: string
  variant?: 'default' | 'wechat'
  wechatLabel?: string
}

const PLACEMENT_KEY = 'c09508683a9407b940e412230887259e'

export function AdsterraBanner({
  className = '',
  maxWidth = 'max-w-4xl',
  variant = 'default',
  wechatLabel
}: AdsterraBannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = useState<number>(160)

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
      width: 100%;
      background: transparent;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #container-${PLACEMENT_KEY} {
      width: 100%;
      min-height: 100px;
    }
  </style>
</head>
<body>
  <script async="async" data-cfasync="false" src="https://pl31227383.profitableratecpmnetwork.com/${PLACEMENT_KEY}/invoke.js"><\/script>
  <div id="container-${PLACEMENT_KEY}"></div>
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

    // Continuously sync height with rendered ad cards
    const intervalId = setInterval(() => {
      try {
        const body = iframe.contentDocument?.body
        const container = iframe.contentDocument?.getElementById(`container-${PLACEMENT_KEY}`)
        if (body && container) {
          const contentHeight = Math.max(body.scrollHeight, container.scrollHeight)
          if (contentHeight > 50) {
            setHeight(contentHeight + 4)
          }
        }
      } catch {
        // Ignore cross-origin issues
      }
    }, 300)

    const timeoutId = setTimeout(() => clearInterval(intervalId), 15000)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [])

  const isWechat = variant === 'wechat'

  return (
    <div className={`w-full my-8 flex flex-col items-center justify-center ${className}`}>
      {isWechat ? (
        <div className={`w-full ${maxWidth} flex items-center justify-center gap-3 mb-2.5 select-none`}>
          <span className="h-px bg-border/60 flex-1 max-w-[60px] sm:max-w-[100px]" />
          <span className="text-[11px] font-medium tracking-widest text-secondary/45 uppercase">
            {wechatLabel || 'Sponsored Content'}
          </span>
          <span className="h-px bg-border/60 flex-1 max-w-[60px] sm:max-w-[100px]" />
        </div>
      ) : (
        <div className={`w-full ${maxWidth} text-right text-[10px] text-secondary/50 uppercase tracking-wider mb-1.5 px-1`}>
          Advertisement
        </div>
      )}
      <div
        className={`w-full ${maxWidth} flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-border/80 bg-bg-surface/50 dark:bg-bg-surface/30 p-2 shadow-[0_2px_12px_rgba(0,0,0,0.02)]`}
      >
        <iframe
          ref={iframeRef}
          title="Advertisement"
          style={{ width: '100%', height: `${height}px`, border: 'none', overflow: 'hidden' }}
          scrolling="no"
        />
      </div>
    </div>
  )
}

export default AdsterraBanner
