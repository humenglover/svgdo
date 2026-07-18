import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from "react-i18next"
import { Link } from 'react-router-dom'
import { Shield, Zap, Palette, Code2, ServerOff, ArrowLeft } from "lucide-react"
import ParticleBackground from "@/components/ParticleBackground"
import TechConstellation from "@/components/TechConstellation"
import { cn } from "@/utils"
import { DEFAULT_LANGUAGE } from '@/locales/config'

// A simple reveal component to handle scroll animations
export function RevealSection({
  children,
  className,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-1000",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8",
        className
      )}
    >
      {children}
    </div>
  )
}

import PageSEO from "@/components/PageSEO"

export default function AboutPage() {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex flex-col h-[100dvh] bg-bg-base transition-colors duration-300 selection:bg-orange/30 overflow-hidden">
      <PageSEO seoKey="about" />

      {/* ------------------------------
          HEADER (Back Button)
      ------------------------------ */}
      <header className="h-14 flex items-center px-4 md:px-8 border-b border-border bg-bg-surface shrink-0 z-50">
        <Link to={i18n.language === DEFAULT_LANGUAGE ? '/' : `/${i18n.language}/`} className="flex items-center gap-2 text-secondary hover:text-primary transition-colors bg-bg-subtle/50 px-3 py-1.5 rounded-lg border border-border/50">
          <ArrowLeft size={16} />
          <span className="font-bold text-sm">{t('common.nav.backToHome', '返回主页')}</span>
        </Link>
      </header>

      {/* Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden relative">
        {/* ------------------------------
            PHASE 1: HERO
        ------------------------------ */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
          <ParticleBackground />
          <div className="relative z-10 text-center space-y-5 px-4 w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-primary leading-[1.15] tracking-tight">
              {t("pages.about.title", "关于 SVG 编辑器")}
            </h1>
            <p className="text-lg md:text-xl text-secondary max-w-xl mx-auto font-medium leading-relaxed">
              {t("pages.about.subtitle", "探索、重塑基于浏览器的矢量图形处理。原生、安全、极速。")}
            </p>
          </div>
        </section>

        {/* ------------------------------
          PHASE 2: STORY & PROCESS
      ------------------------------ */}
        <section className="relative z-10 max-w-6xl mx-auto px-4 pt-12 pb-16 md:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            <RevealSection delay={0} className="bg-bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-transform hover:-translate-y-1 duration-500 flex flex-col h-full">
              <h2 className="flex items-center gap-4 text-2xl md:text-3xl font-extrabold text-primary mb-6 tracking-tight">
                <div className="w-12 h-12 rounded-xl bg-primary text-bg-surface flex items-center justify-center shrink-0 shadow-sm">
                  <ServerOff size={24} strokeWidth={2} />
                </div>
                {t("pages.about.intent.title", "我们的初衷")}
              </h2>
              <p className="text-secondary text-[16px] leading-relaxed font-medium">
                {t("pages.about.intent.desc", "在数字化内容爆发的时代，处理 SVG 矢量图通常意味着要忍受臃肿的桌面客户端、缓慢的在线上传，或是满是广告的免费站点。我们希望打破这种现状，构建一个完全在您的浏览器本地运行的现代矢量工具箱。没有任何数据会被上传至服务器。")}
              </p>
            </RevealSection>

            <RevealSection delay={150} className="bg-bg-surface/80 backdrop-blur-xl p-8 md:p-12 rounded-[32px] border border-border shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none transition-transform hover:-translate-y-1 duration-500 flex flex-col h-full">
              <h2 className="flex items-center gap-4 text-2xl md:text-3xl font-extrabold text-primary mb-6 tracking-tight">
                <div className="w-12 h-12 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0 shadow-sm">
                  <Code2 size={24} strokeWidth={2} />
                </div>
                {t("pages.about.process.title", "工艺与架构")}
              </h2>
              <p className="text-secondary text-[16px] leading-relaxed font-medium">
                {t("pages.about.process.desc", "我们从零开始，抛弃了老旧的设计理念，全面拥抱最新的前端工程标准。每一个底层节点拦截、视图解析引擎都经过精心打磨，在追求算法极限优化的同时，不妥协于现代产品的视觉美学。它兼具了极客的严谨和设计的温度。")}
              </p>
            </RevealSection>

          </div>
        </section>

        {/* ------------------------------
          PHASE 3: CORE FEATURES
      ------------------------------ */}
        <section className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 border-t border-border">
          <RevealSection className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">
              {t("pages.about.tech.title", "核心技术")}
            </h2>
            <p className="mt-3 text-base md:text-lg text-secondary font-medium max-w-2xl mx-auto">
              {t("pages.about.tech.desc", "由现代 Web 技术驱动，带来丝滑流畅的体验：")}
            </p>
          </RevealSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {[
              { key: "privacy", icon: Shield, color: "text-green-500", bg: "bg-green-500/10" },
              { key: "performance", icon: Zap, color: "text-orange", bg: "bg-orange/10" },
              { key: "design", icon: Palette, color: "text-purple-500", bg: "bg-purple-500/10" },
            ].map((feat, idx) => (
              <RevealSection key={feat.key} delay={idx * 150} className="bg-bg-base group p-6 md:p-8 rounded-[24px] border border-border hover:border-orange/50 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.05)] dark:hover:shadow-none relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500 -translate-y-2 translate-x-2">
                  <feat.icon size={80} className={feat.color} />
                </div>
                <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5 relative z-10 transition-transform group-hover:scale-110 duration-500", feat.bg, feat.color)}>
                  <feat.icon size={22} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-primary mb-2 tracking-tight relative z-10">
                  {t(`pages.about.features.${feat.key}`)}
                </h3>
                <p className="text-secondary text-sm font-medium leading-relaxed relative z-10">
                  {t(`pages.about.features.${feat.key}Desc`)}
                </p>
              </RevealSection>
            ))}
          </div>

          {/* Tech Stack Spotlight Bento Grid */}
          <RevealSection delay={300} className="mt-16">
            <TechConstellation />
          </RevealSection>

          {/* ------------------------------
            PHASE 4: CONTACT
        ------------------------------ */}
          <RevealSection delay={400} className="mt-16 mb-20 bg-orange/5 dark:bg-orange/10 border border-orange/20 rounded-[32px] p-6 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary mb-4 tracking-tight">
              {t('pages.about.contact.title')}
            </h2>
            <p className="text-secondary text-base md:text-lg mb-6 max-w-xl mx-auto">
              {t('pages.about.contact.desc')}
            </p>
            <a href="mailto:shengqiangwang666@gmail.com" className="inline-flex w-full sm:w-auto items-center justify-center bg-orange text-white px-4 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-[15px] sm:text-lg overflow-hidden hover:opacity-90 transition-opacity shadow-lg shadow-orange/20">
              <span className="truncate">shengqiangwang666@gmail.com</span>
            </a>
          </RevealSection>
        </section>

      </div>
    </div>
  )
}
