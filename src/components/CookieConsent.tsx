'use client';

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Info, X } from 'lucide-react'
import { cn } from '@/utils'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isRendered, setIsRendered] = useState(false)

  useEffect(() => {
    try {
      const hasConsented = localStorage.getItem('cookie_consent') === 'true'
      if (!hasConsented) {
        setIsRendered(true)
        setTimeout(() => setIsVisible(true), 500)
      }
    } catch {
      // Ignore in restricted environments
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem('cookie_consent', 'true')
    } catch {
      // Ignore
    }
    setIsVisible(false)
    setTimeout(() => setIsRendered(false), 300)
  }

  if (!isRendered) return null

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:bottom-8 z-[999] md:max-w-sm md:w-[400px]",
        "bg-white dark:bg-bg-surface border border-border rounded-2xl shadow-2xl p-5",
        "transition-all duration-500 ease-out",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-orange/10 text-orange rounded-full shrink-0">
          <Info size={20} />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <p className="text-[14px] text-primary leading-relaxed font-medium pr-6">
            We use cookies (including third-party advertising cookies like Google AdSense) to personalize content, serve targeted ads, and analyze our traffic.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <button 
              onClick={handleAccept}
              className="flex-1 bg-orange hover:bg-orange/90 text-white font-bold text-sm py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Accept
            </button>
            <Link 
              href="/privacy/"
              onClick={() => setIsVisible(false)}
              className="px-3 py-2 text-xs font-semibold text-tertiary hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Learn More
            </Link>
          </div>
        </div>
        <button 
          onClick={() => setIsVisible(false)} 
          className="p-1 -mt-1 -mr-1 text-tertiary hover:text-primary hover:bg-bg-subtle rounded-lg transition-colors absolute top-4 right-4"
          aria-label="Close"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
