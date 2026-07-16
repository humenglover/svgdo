import { SvgdoLogo } from "./SvgdoLogo"

export function LogoIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" className={className}>
      <path d="M 22 58 C 45 90, 65 15, 95 35" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
      <rect x="42" y="65" width="12" height="12" rx="2" fill="#f97316" stroke="currentColor" strokeWidth="3" />
      <circle cx="22" cy="58" r="6" fill="#818cf8" stroke="currentColor" strokeWidth="3" />
      <circle cx="95" cy="35" r="6" fill="#818cf8" stroke="currentColor" strokeWidth="3" />
      <g transform="translate(68, 48) scale(2.4) rotate(-8)">
        <path d="M 0,0 L 0,14 L 3.5,10.5 L 6.5,17 L 9,15.5 L 6,9 L 10.5,9 Z" fill="#2dd4bf" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      </g>
    </svg>
  )
}

export function FullLogo({ className, iconClassName, textClassName }: { className?: string, iconClassName?: string, textClassName?: string }) {
  return (
    <div className={`flex items-center gap-2 md:gap-2.5 ${className || ''}`}>
      <LogoIcon className={`drop-shadow-sm text-slate-800 dark:text-slate-200 transition-colors shrink-0 ${iconClassName || ''}`} />
      <SvgdoLogo className={`w-auto text-primary dark:text-white shrink-0 ${textClassName || ''}`} />
    </div>
  )
}
