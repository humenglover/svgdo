import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh'
import en from './en'
import ja from './ja'

const SUPPORTED_LANGS = ['zh', 'en', 'ja'] as const

export function getDefaultLanguage(): string {
  // 1. Saved preference
  const saved = localStorage.getItem('lang')
  if (saved && SUPPORTED_LANGS.includes(saved as typeof SUPPORTED_LANGS[number])) return saved

  // 2. Browser language detection
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('ja')) return 'ja'
  if (browserLang.startsWith('en')) return 'en'

  // 3. Default: English (SEO primary)
  return 'en'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
      ja: { translation: ja },
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  })

export default i18n
