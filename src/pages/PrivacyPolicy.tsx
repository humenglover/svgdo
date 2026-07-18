import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DEFAULT_LANGUAGE } from '@/locales/config'

import PageSEO from "@/components/PageSEO"

export default function PrivacyPolicy() {
  const { t, i18n } = useTranslation()
  const sections = t('pages.privacy.sections', { returnObjects: true }) as any[]

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PageSEO seoKey="privacy" />
      <header className="h-14 flex items-center px-4 md:px-8 border-b border-border bg-bg-surface sticky top-0 z-10">
        <Link to={i18n.language === DEFAULT_LANGUAGE ? '/' : `/${i18n.language}/`} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors">
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">{t('pages.privacy.back')}</span>
        </Link>
      </header>
      
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-8">{t('pages.privacy.title')}</h1>
        
        <div className="prose dark:prose-invert max-w-none text-secondary text-[15px] leading-relaxed space-y-4">
          <p><strong>{t('pages.privacy.lastUpdated')}</strong></p>
          <p>{t('pages.privacy.intro')}</p>
          
          {Array.isArray(sections) && sections.map((section, idx) => (
            <div key={idx} className="mt-8">
              {section.title && <h3 className="text-lg font-bold text-primary mb-4">{section.title}</h3>}
              
              {Array.isArray(section.subsections) && section.subsections.map((sub: any, subIdx: number) => (
                <div key={subIdx} className="mb-4">
                  {sub.title && <h4 className="text-base font-semibold text-primary mb-2">{sub.title}</h4>}
                  {Array.isArray(sub.paragraphs) && sub.paragraphs.map((p: string, pIdx: number) => (
                    <p key={pIdx} className="mb-2">{p}</p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
