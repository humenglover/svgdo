import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { LANGUAGES, DEFAULT_LANGUAGE, FALLBACK_LANGUAGE } from './config'
import zh from './zh'
import en from './en'
import ja from './ja'
import ko from './ko'
import es from './es'

const resourceMap: Record<string, typeof zh> = { zh, en, ja, ko, es }

export function getDefaultLanguage(): string {
  const saved = localStorage.getItem('lang')
  if (saved && LANGUAGES.some(l => l.code === saved)) return saved

  const browser = navigator.language.toLowerCase()
  const match = LANGUAGES.find(l => l.detection.some(p => browser.startsWith(p)))
  return match?.code || DEFAULT_LANGUAGE
}

export function getLanguageByCode(code: string): typeof LANGUAGES[0] | undefined {
  return LANGUAGES.find(l => l.code === code)
}

i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    LANGUAGES.filter(l => resourceMap[l.code]).map(l => [l.code, { translation: resourceMap[l.code] }])
  ),
  lng: getDefaultLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
})

export default i18n
