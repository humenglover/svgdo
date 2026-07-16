import { useState } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import i18n from '@/locales/i18n'
import { LANGUAGES } from '@/locales/config'
import { getLanguageByCode } from '@/locales/i18n'

export function LanguageDropdown() {
  const [open, setOpen] = useState(false)
  const current = getLanguageByCode(i18n.language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-secondary hover:text-primary hover:bg-bg-subtle transition-colors"
      >
        <Globe size={16} />
        <span>{current.nativeLabel}</span>
        <ChevronDown size={14} className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-40 bg-bg-raised border border-border rounded-xl shadow-lg py-1 overflow-hidden">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code)
                  localStorage.setItem('lang', lang.code)
                  setOpen(false)
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-sm font-medium transition-colors hover:bg-bg-subtle ${i18n.language === lang.code ? 'text-blue bg-blue/5' : 'text-secondary'
                  }`}
              >
                <span>{lang.nativeLabel}</span>
                <span className="text-[11px] text-tertiary">{lang.shortLabel}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
