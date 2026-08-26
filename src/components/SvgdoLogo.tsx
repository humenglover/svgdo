import { useId } from 'react'

export function SvgdoLogo({ className }: { className?: string }) {
  const uniqueId = useId().replace(/:/g, '')
  const gradientId = `do-grad-${uniqueId}`

  // Use absolute URL for SVG gradient to prevent breaking when page has a hash anchor (#)
  const isBrowser = typeof window !== 'undefined'
  const currentUrl = isBrowser ? window.location.pathname + window.location.search : ''
  const gradientUrl = `url(${currentUrl}#${gradientId})`

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 50" className={className}>
      <defs>
        <style>
          {`
            .logo-font {
              font-family: 'Outfit', 'Inter', 'Montserrat', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            .text-svg {
              font-weight: 900;
              font-size: 36px;
              letter-spacing: -1.5px;
            }
            .text-do {
              font-weight: 500;
              font-size: 36px;
              letter-spacing: -0.5px;
            }
          `}
        </style>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>
      </defs>
      
      {/* SVG 极粗排版，体现稳重工具感 */}
      <text x="2" y="38" className="logo-font text-svg" fill="currentColor">
        SVG
      </text>
      
      {/* do 中等字重+活力渐变色，形成强烈视觉对比 */}
      <text x="76" y="38" className="logo-font text-do" fill={gradientUrl}>
        do
      </text>

      {/* 强调小圆点，赋予设计灵气 */}
      <circle cx="122" cy="36" r="4" fill="#fbbf24" />

      {/* 一抹带手写感的橘色飞线，恰到好处打破死板 */}
      <path 
        d="M 4,45 Q 60,40 128,45" 
        fill="none" 
        stroke={gradientUrl} 
        strokeWidth="3.5" 
        strokeLinecap="round" 
      />
    </svg>
  )
}
