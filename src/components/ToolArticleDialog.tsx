import { X, Info, HelpCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/utils'

interface ToolArticleDialogProps {
  open: boolean
  onClose: () => void
  toolKey: string // e.g. "collage"
}

export function ToolArticleBody({ toolKey }: { toolKey: string }) {
  const { t } = useTranslation()
  const baseKey = `pages.${toolKey}.article`

  // Try to get data; fall back to empty array to avoid errors
  const badges = t(`${baseKey}.badges`, { returnObjects: true }) as string[]
  const steps = t(`${baseKey}.steps`, { returnObjects: true }) as Array<{ title: string, desc: string }>
  const features = t(`${baseKey}.features`, { returnObjects: true }) as Array<{ title: string, desc: string }>

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* 1. Tool Intro */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
          <span className="w-1.5 h-6 bg-orange rounded-full"></span>
          {t(`${baseKey}.introTitle`)}
        </h3>
        <div className="text-secondary leading-relaxed space-y-4 text-[15px]">
          <p>{t(`${baseKey}.introDesc`)}</p>
          
          {Array.isArray(badges) && badges.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((badge, idx) => (
                <span key={idx} className="px-3 py-1 bg-orange/10 text-orange border border-orange/20 text-xs font-semibold rounded-full">
                  {badge}
                </span>
              ))}
            </div>
          )}

          <p className="p-4 bg-bg-subtle rounded-xl text-sm border border-border-default">
            {t(`${baseKey}.principle`)}
          </p>
        </div>
      </section>

      {/* 2. How to Use */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-5">
          <span className="w-1.5 h-6 bg-orange rounded-full"></span>
          {t(`${baseKey}.howToUse`)}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.isArray(steps) && steps.map((step, idx) => (
            <div key={idx} className="p-5 bg-bg-surface border border-border-default rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-6 h-6 rounded-full bg-orange/10 text-orange flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-primary">{step.title}</h4>
              </div>
              <p className="text-sm text-secondary leading-relaxed pl-9">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Features */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
          <span className="w-1.5 h-6 bg-orange rounded-full"></span>
          {t(`${baseKey}.whatIs`)}
        </h3>
        <div className="text-secondary leading-relaxed space-y-4 text-[15px]">
          <p>{t(`${baseKey}.whatIsDesc1`)}</p>
          <p>{t(`${baseKey}.whatIsDesc2`)}</p>
          
          <div className="mt-4 space-y-3">
            {Array.isArray(features) && features.map((feature, idx) => (
              <div key={idx} className="flex gap-3 items-start p-4 bg-bg-subtle rounded-xl border border-border-default">
                <Info className="w-5 h-5 text-orange shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-primary mb-1">{feature.title}</h4>
                  <p className="text-sm text-secondary leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function ToolArticleDialog({ open, onClose, toolKey }: ToolArticleDialogProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
      {/* Overlay backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Dialog body */}
      <div className={cn(
        "relative w-full max-w-4xl max-h-full bg-bg-surface rounded-2xl shadow-2xl flex flex-col",
        "animate-in fade-in zoom-in-95 duration-200"
      )}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default shrink-0">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <HelpCircle className="w-5 h-5 text-orange" />
            <span>{t(`pages.${toolKey}.title`)}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-secondary hover:text-primary hover:bg-bg-subtle rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <ToolArticleBody toolKey={toolKey} />
        </div>
      </div>
    </div>
  )
}
