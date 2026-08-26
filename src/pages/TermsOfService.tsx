import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DEFAULT_LANGUAGE } from '@/locales/config'

import PageSEO from "@/components/PageSEO"
import Navbar from "@/components/Navbar"

export default function TermsOfService() {
  const { t, i18n } = useTranslation()

  const sections = t('pages.terms.sections', { returnObjects: true }) as Array<{title: string, desc: string}>

  return (
    <div className="min-h-screen bg-bg-base flex flex-col">
      <PageSEO seoKey="terms" />
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 mb-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-primary mb-8">
          {t('pages.terms.title')}
        </h1>
        
        <div className="prose dark:prose-invert max-w-none text-secondary text-[15px] leading-relaxed space-y-6">
          <p><strong>{t('pages.terms.lastUpdated')}</strong></p>
          <p>{t('pages.terms.intro')}</p>

          {Array.isArray(sections) && sections.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-lg font-bold text-primary mt-8 mb-4">
                {section.title}
              </h3>
              <p>{section.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
