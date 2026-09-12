'use client';

import { X, Info, HelpCircle } from 'lucide-react'
import { cn } from '@/utils'
import { AdsterraBanner } from './AdsterraBanner'

interface ToolArticleDialogProps {
  open: boolean
  onClose: () => void
  toolKey?: string
}

export function ToolArticleBody({ toolKey = "svgConverter", showAd = true }: { toolKey?: string; showAd?: boolean }) {
  const badges = ["100% Client-Side", "Lossless Vector Editing", "Zero Server Upload", "High-Resolution PNG"]
  
  const steps = [
    {
      title: "1. Open or Paste SVG",
      desc: "Drag and drop your .svg file into the editor, paste raw XML code, or pick from our preset vector icons library."
    },
    {
      title: "2. Visual & Code Adjustments",
      desc: "Select vector paths visually on the canvas, modify colors, strokes, opacity, viewBox, or tweak attributes in code."
    },
    {
      title: "3. Optimize Vector Code",
      desc: "Run the built-in SVG optimizer to strip unnecessary metadata, round coordinate decimals, and reduce file size."
    },
    {
      title: "4. Export Multi-Format",
      desc: "Download clean SVG code or export ultra-sharp PNG, JPEG, and WebP raster images at custom 1x to 8x resolutions."
    }
  ]

  const features = [
    {
      title: "Local Memory AST Parsing",
      desc: "Your files never leave your computer. All SVG DOM operations and rendering pipelines execute directly in browser RAM."
    },
    {
      title: "Live Bidirectional Sync",
      desc: "Changes made in the visual canvas instantly update the source code editor, and vice versa."
    },
    {
      title: "High-DPI Raster Engine",
      desc: "Convert vector paths to crisp raster images with transparent backgrounds at any custom dimensions."
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {showAd && <AdsterraBanner className="!my-0 !mb-8" />}

      {/* 1. Tool Intro */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
          <span className="w-1.5 h-6 bg-orange rounded-full"></span>
          Free Online SVG Editor & Vector Suite
        </h3>
        <div className="text-secondary leading-relaxed space-y-4 text-[15px]">
          <p>
            SVGDO is an all-in-one browser-based SVG editor designed for designers, frontend developers, and digital creators. It provides instantaneous vector editing, code formatting, path manipulation, and conversion without requiring heavy desktop software.
          </p>
          
          <div className="flex flex-wrap gap-2 pt-1">
            {badges.map((badge, idx) => (
              <span key={idx} className="px-3 py-1 bg-orange/10 text-orange border border-orange/20 text-xs font-semibold rounded-full">
                {badge}
              </span>
            ))}
          </div>

          <p className="p-4 bg-bg-subtle rounded-xl text-sm border border-border">
            <strong>Privacy Guarantee:</strong> All vector parsing and image rendering algorithms run strictly on your local device. We never upload, transmit, or store your creative files on any remote server.
          </p>
        </div>
      </section>

      {/* 2. How to Use */}
      <section>
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary mb-5">
          <span className="w-1.5 h-6 bg-orange rounded-full"></span>
          How to Use SVGDO in 4 Simple Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step, idx) => (
            <div key={idx} className="p-5 bg-bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
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
          Why Choose SVGDO?
        </h3>
        <div className="text-secondary leading-relaxed space-y-4 text-[15px]">
          <p>
            Traditional vector graphics software is heavy, expensive, and often compromises privacy through mandatory cloud synchronization. SVGDO delivers desktop-grade vector editing with the convenience of a modern Web application.
          </p>
          
          <div className="mt-4 space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex gap-3 items-start p-4 bg-bg-subtle rounded-xl border border-border">
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
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 md:p-12 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className={cn(
        "relative w-full max-w-4xl max-h-full bg-bg-surface rounded-2xl shadow-2xl flex flex-col",
        "animate-in fade-in zoom-in-95 duration-200"
      )}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 text-primary font-bold text-lg">
            <HelpCircle className="w-5 h-5 text-orange" />
            <span>SVGDO User Guide</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-secondary hover:text-primary hover:bg-bg-subtle rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <ToolArticleBody toolKey={toolKey} showAd={false} />
        </div>
      </div>
    </div>
  )
}
