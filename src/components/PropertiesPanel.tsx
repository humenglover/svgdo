import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'
import { updateElementAttribute, getElementAttribute, type ElementInfo } from '@/utils/svgDom'

interface Props {
  element: ElementInfo
  svgCode: string
  onUpdateSvg: (newCode: string) => void
}

export default function PropertiesPanel({ element, svgCode, onUpdateSvg }: Props) {
  const { t } = useTranslation()

  const getAttr = (name: string) => getElementAttribute(svgCode, element.id, name)

  const handleChange = (attr: string, value: string) => {
    const newCode = updateElementAttribute(svgCode, element.id, attr, value)
    if (newCode !== svgCode) onUpdateSvg(newCode)
  }

  return (
    <div className="flex flex-col h-full bg-bg-surface">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-bg-subtle/50">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange" />
          <span className="text-sm font-bold text-primary">{t('common.panel.selectedElement')}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          <span className="px-2 py-0.5 rounded-md bg-orange/10 text-orange font-bold uppercase">{element.tagName}</span>
          <span className="text-tertiary font-mono text-[11px]">{element.id}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Appearance */}
        <CollapseSection title={t('common.panel.appearance')} defaultOpen>
          <ColorField label={t('common.panel.fill')} value={getAttr('fill')}
            onChange={v => handleChange('fill', v)} />
          <ColorField label={t('common.panel.stroke')} value={getAttr('stroke')}
            onChange={v => handleChange('stroke', v)} />
          <NumberField label={t('common.panel.strokeWidth')} value={getAttr('stroke-width')}
            onChange={v => handleChange('stroke-width', v)} min={0} max={50} step={0.5} />
          <SliderField label={t('common.panel.opacity')} value={getAttr('opacity')}
            onChange={v => handleChange('opacity', v)} />
        </CollapseSection>

        {/* Transform */}
        <CollapseSection title={t('common.panel.transform')}>
          <NumberField label="X" value={getAttr('x')}
            onChange={v => handleChange('x', v)} />
          <NumberField label="Y" value={getAttr('y')}
            onChange={v => handleChange('y', v)} />
          <NumberField label={t('common.panel.rotate')} value={getAttr('data-rotate')}
            onChange={v => handleChange('data-rotate', v)} min={-360} max={360} />
          <NumberField label={t('common.panel.scale')} value={getAttr('data-scale')}
            onChange={v => handleChange('data-scale', v)} min={0.1} max={10} step={0.1} />
        </CollapseSection>

        {/* Size */}
        <CollapseSection title={t('common.panel.size')}>
          <ReadOnlyField label={t('common.panel.width')} value={getAttr('width') || '—'} />
          <ReadOnlyField label={t('common.panel.height')} value={getAttr('height') || '—'} />
        </CollapseSection>

        {/* Advanced */}
        <CollapseSection title={t('common.panel.advanced')}>
          <ReadOnlyField label={t('common.panel.elementId')} value={element.id} mono />
          <ReadOnlyField label={t('common.panel.class')} value={getAttr('class') || '—'} mono />
        </CollapseSection>
      </div>
    </div>
  )
}

// ── Sub-components ──

function CollapseSection({ title, children, defaultOpen }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-4 py-2.5 hover:bg-bg-subtle transition-colors text-left">
        <span className="text-[11px] font-extrabold text-secondary uppercase tracking-wider">{title}</span>
        {open ? <ChevronDown size={13} className="text-tertiary" /> : <ChevronRight size={13} className="text-tertiary" />}
      </button>
      {open && <div className="px-4 pb-3 space-y-2.5">{children}</div>}
    </div>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold text-tertiary">{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" value={value || '#000000'}
          onChange={e => onChange(e.target.value)}
          className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent p-0.5" />
        <input type="text" value={value || ''} placeholder="none"
          onChange={e => onChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-[11px] font-mono rounded-md border border-border bg-bg-muted text-primary focus:outline-none focus:ring-1 focus:ring-orange/30" />
      </div>
    </div>
  )
}

function NumberField({ label, value, onChange, min, max, step }: {
  label: string; value: string; onChange: (v: string) => void; min?: number; max?: number; step?: number
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-[10px] font-semibold text-tertiary shrink-0">{label}</label>
      <input type="number" value={value || ''} placeholder="—" min={min} max={max} step={step || 1}
        onChange={e => onChange(e.target.value)}
        className="w-20 px-2 py-1 text-[11px] font-mono rounded-md border border-border bg-bg-muted text-primary text-right focus:outline-none focus:ring-1 focus:ring-orange/30" />
    </div>
  )
}

function SliderField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const num = parseFloat(value)
  const opacity = isNaN(num) ? 1 : num
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-semibold text-tertiary">{label}</label>
        <span className="text-[10px] font-mono text-secondary">{Math.round(opacity * 100)}%</span>
      </div>
      <input type="range" min={0} max={1} step={0.05} value={opacity}
        onChange={e => onChange(e.target.value)}
        className={cn("w-full h-1.5 rounded-full appearance-none cursor-pointer",
          "bg-bg-muted accent-orange",
          "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:shadow-sm")} />
    </div>
  )
}

function ReadOnlyField({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <label className="text-[10px] font-semibold text-tertiary shrink-0">{label}</label>
      <span className={cn("text-[11px] text-secondary truncate max-w-[140px] text-right", mono && "font-mono")}>
        {value || '—'}
      </span>
    </div>
  )
}
