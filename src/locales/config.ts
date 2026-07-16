/**
 * ─── 语言配置 · 单文件真相源 ───
 * 新增语言只需改这一个文件 + 加对应的 locales/{code}/ 目录
 */
export interface Language {
  code: string
  nativeLabel: string       // 母语名称（下拉菜单用）
  shortLabel: string        // 短标签（按钮用）
  detection: string[]       // navigator.language 前缀匹配
  ogLocale: string          // Open Graph locale
  htmlLang: string          // HTML lang 属性
}

export const LANGUAGES: Language[] = [
  {
    code: 'en',
    nativeLabel: 'English',
    shortLabel: 'EN',
    detection: ['en'],
    ogLocale: 'en_US',
    htmlLang: 'en',
  },
  {
    code: 'zh',
    nativeLabel: '中文',
    shortLabel: '中文',
    detection: ['zh'],
    ogLocale: 'zh_CN',
    htmlLang: 'zh',
  },
  {
    code: 'ja',
    nativeLabel: '日本語',
    shortLabel: '日本語',
    detection: ['ja'],
    ogLocale: 'ja_JP',
    htmlLang: 'ja',
  },
  {
    code: 'ko',
    nativeLabel: '한국어',
    shortLabel: '한국어',
    detection: ['ko'],
    ogLocale: 'ko_KR',
    htmlLang: 'ko',
  },
]

export const DEFAULT_LANGUAGE = 'en'
export const FALLBACK_LANGUAGE = 'en'
