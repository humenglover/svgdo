import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { FullLogo } from '@/components/FullLogo'
import { LanguageDropdown } from '@/components/LanguageDropdown'
import { useTheme } from '@/contexts/ThemeContext'
import { DEFAULT_LANGUAGE } from '@/locales/config'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { theme, toggle: toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 h-12 md:h-14 flex items-center justify-between px-3 md:px-5 border-b border-border shrink-0 bg-bg-surface">
        <Link to={i18n.language === DEFAULT_LANGUAGE ? '/' : `/${i18n.language}/`} className="flex items-center hover:opacity-80 transition-opacity">
          <FullLogo iconClassName="w-7 h-7 md:w-8 md:h-8" textClassName="h-[30px] md:h-[34px]" />
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-6">
            <Link to={i18n.language === DEFAULT_LANGUAGE ? '/about' : `/${i18n.language}/about`} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">{t('common.nav.about')}</Link>
            <Link to={i18n.language === DEFAULT_LANGUAGE ? '/resources' : `/${i18n.language}/resources`} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">{t('common.nav.help')}</Link>
            <Link to={i18n.language === DEFAULT_LANGUAGE ? '/privacy' : `/${i18n.language}/privacy`} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">{t('common.nav.privacy')}</Link>
            <Link to={i18n.language === DEFAULT_LANGUAGE ? '/terms' : `/${i18n.language}/terms`} className="text-sm font-semibold text-secondary hover:text-primary transition-colors">{t('common.nav.terms')}</Link>
          </div>
          <div className="hidden md:block w-px h-4 bg-border mx-2"></div>
          <div className="hidden md:flex items-center gap-1">
            <LanguageDropdown />
            <button onClick={toggleTheme} className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <button onClick={() => setIsMenuOpen(true)} className="md:hidden p-1.5 -mr-1 text-secondary hover:text-primary hover:bg-bg-subtle rounded-lg transition-colors">
            <Menu size={18} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="relative flex flex-col w-64 max-w-[80%] h-full bg-bg-surface shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link to={i18n.language === DEFAULT_LANGUAGE ? '/' : `/${i18n.language}/`} onClick={() => setIsMenuOpen(false)} className="flex items-center">
                <FullLogo iconClassName="h-[20px] w-auto" textClassName="h-[22px] w-auto" />
              </Link>
              <button onClick={() => setIsMenuOpen(false)} className="p-1 text-secondary hover:text-primary rounded-lg transition-colors"><X size={18} /></button>
            </div>
            <div className="flex flex-col p-2 overflow-visible">
              <div className="flex flex-col mb-2 pb-2 border-b border-border space-y-1">
                <div className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-secondary">
                  <span>{t('common.language')}</span>
                  <LanguageDropdown />
                </div>
                <button onClick={() => { toggleTheme(); setIsMenuOpen(false); }} className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors w-full text-left">
                  <span>{t('common.theme')}</span>
                  <span className="px-2.5 py-1 bg-bg-subtle border border-border rounded-full text-xs font-bold text-primary capitalize">{theme === 'dark' ? t('common.dark') : t('common.light')}</span>
                </button>
              </div>

              <div className="p-2 flex flex-col gap-1 border-t border-border">
                <Link to={i18n.language === DEFAULT_LANGUAGE ? '/about' : `/${i18n.language}/about`} onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  {t('common.nav.about')}
                </Link>
                <Link to={i18n.language === DEFAULT_LANGUAGE ? '/resources' : `/${i18n.language}/resources`} onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  {t('common.nav.help')}
                </Link>
                <Link to={i18n.language === DEFAULT_LANGUAGE ? '/privacy' : `/${i18n.language}/privacy`} onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  {t('pages.privacy.title')}
                </Link>
                <Link to={i18n.language === DEFAULT_LANGUAGE ? '/terms' : `/${i18n.language}/terms`} onClick={() => setIsMenuOpen(false)} className="px-3 py-3 rounded-lg text-sm font-medium text-secondary hover:text-primary hover:bg-bg-subtle transition-colors">
                  {t('common.nav.terms')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
