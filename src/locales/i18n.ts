import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './zh'
import en from './en'

export function getDefaultLanguage(): string {
  const saved = localStorage.getItem('lang')
  if (saved === 'zh' || saved === 'en') return saved
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('zh')) return 'zh'
  if (browserLang.startsWith('en')) return 'en'
  return 'zh'
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      zh: { translation: zh },
      en: { translation: en },
    },
    lng: getDefaultLanguage(),
    fallbackLng: 'zh',
    interpolation: { escapeValue: false },
  })

export default i18n
