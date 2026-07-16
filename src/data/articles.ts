export interface Article {
  slug: string
  title: { zh: string; en: string }
  date: string
  excerpt: { zh: string; en: string }
  tags: string[]
}

export const tagLabels: Record<string, { zh: string; en: string }> = {
  'SVG':        { zh: 'SVG',         en: 'SVG' },
  'vector':     { zh: '矢量',        en: 'Vector' },
  'design':     { zh: '设计',        en: 'Design' },
  'guide':      { zh: '指南',        en: 'Guide' },
  'tutorial':   { zh: '教程',        en: 'Tutorial' },
  'formats':    { zh: '格式',        en: 'Formats' },
  'optimization': { zh: '优化',      en: 'Optimization' },
  'web-dev':    { zh: '前端开发',    en: 'Web Dev' },
  'animation':  { zh: '动画',        en: 'Animation' },
  'tips':       { zh: '技巧',        en: 'Tips' },
  'beginner':   { zh: '入门',        en: 'Beginner' },
}

export function getTagLabel(tag: string, lang: 'zh' | 'en'): string {
  return tagLabels[tag]?.[lang] ?? tag
}

export const articles: Article[] = [
  {
    slug: 'svg-basics',
    title: { zh: 'SVG 格式入门：什么是 SVG？为什么你需要它？', en: 'SVG Basics: What Is SVG and Why Do You Need It?' },
    date: '2026-07-16',
    excerpt: { zh: '从零开始了解 SVG。可缩放矢量图形是什么？它和 PNG、JPEG 有什么区别？为什么设计师和前端开发者都在用它？', en: 'Learn SVG from scratch. What is Scalable Vector Graphics? How does it differ from PNG and JPEG? Why designers and developers love it.' },
    tags: ['SVG', 'beginner', 'guide'],
  },
  {
    slug: 'svg-vs-png',
    title: { zh: 'SVG vs PNG：什么时候该用矢量图？什么时候用位图？', en: 'SVG vs PNG: When to Use Vector and When to Use Raster' },
    date: '2026-07-16',
    excerpt: { zh: 'SVG 和 PNG 各有优势。本文从文件大小、缩放、透明度、浏览器兼容等维度全面对比，帮你选对格式。', en: 'SVG and PNG each have strengths. A comprehensive comparison across file size, scaling, transparency, and browser support to help you choose.' },
    tags: ['SVG', 'formats', 'comparison'],
  },
  {
    slug: 'svg-optimization',
    title: { zh: 'SVG 文件优化指南：把 SVG 压缩到极致', en: 'SVG Optimization Guide: Compress SVGs to the Minimum' },
    date: '2026-07-16',
    excerpt: { zh: '设计工具导出的 SVG 通常包含大量冗余代码。学习如何移除注释、简化路径、删除无用属性，让 SVG 文件体积减少 50%-80%。', en: 'SVGs from design tools often contain bloat. Learn to strip comments, simplify paths, and remove useless attributes — reducing file size by 50-80%.' },
    tags: ['SVG', 'optimization', 'tutorial'],
  },
  {
    slug: 'svg-animation',
    title: { zh: 'SVG 动画入门：用 CSS 让图标动起来', en: 'SVG Animation Guide: Animating Icons with CSS' },
    date: '2026-07-17',
    excerpt: { zh: 'SVG 不只是静态图像。通过 CSS animation 和 SMIL，你可以让图标旋转、变色、变形。新手也能上手的动画教程。', en: 'SVG isn\'t just static. With CSS animation and SMIL, make icons spin, change color, and morph. A beginner-friendly animation tutorial.' },
    tags: ['SVG', 'animation', 'tutorial'],
  },
  {
    slug: 'svg-icons-guide',
    title: { zh: '图标设计指南：从 SVG 开始的完整工作流', en: 'Icon Design Guide: Complete SVG Workflow' },
    date: '2026-07-17',
    excerpt: { zh: '设计一套高质量 SVG 图标的完整流程。从网格设置、描边规范到导出优化，专业图标设计师都在用的方法。', en: 'A complete workflow for designing high-quality SVG icon sets. From grid setup and stroke specs to export optimization — the methods pro designers use.' },
    tags: ['SVG', 'design', 'guide'],
  },
  {
    slug: 'svg-in-web',
    title: { zh: '网页中使用 SVG 的 5 种方式及最佳实践', en: '5 Ways to Use SVG in Web Pages — Best Practices' },
    date: '2026-07-17',
    excerpt: { zh: '在 HTML 中嵌入 SVG 有很多种方式：inline、img 标签、CSS background、data URI 和 sprite。了解每种方式的优劣和适用场景。', en: 'Many ways to embed SVG in HTML: inline, img tag, CSS background, data URI, and sprite. Learn the pros, cons, and best use cases for each.' },
    tags: ['SVG', 'web-dev', 'guide'],
  },
  {
    slug: 'svg-editor-guide',
    title: { zh: '在线 SVG 编辑器完全使用指南', en: 'Complete Guide to Using Online SVG Editors' },
    date: '2026-07-17',
    excerpt: { zh: '掌握在线 SVG 编辑器的全部功能。从上传、编辑、优化到导出，一步步教你高效处理 SVG 文件。', en: 'Master the online SVG editor. From upload, edit, optimize to export — a step-by-step guide to processing SVG files efficiently.' },
    tags: ['SVG', 'tutorial', 'guide'],
  },
  {
    slug: 'svg-to-png-guide',
    title: { zh: 'SVG 转 PNG 完全指南：格式转换的正确姿势', en: 'SVG to PNG Guide: The Right Way to Convert' },
    date: '2026-07-17',
    excerpt: { zh: '什么时候需要把 SVG 转成 PNG？如何选择分辨率和背景色？教你用在线工具一键完成高质量转换。', en: 'When should you convert SVG to PNG? How to choose resolution and background? One-click high-quality conversion with online tools.' },
    tags: ['SVG', 'formats', 'tutorial'],
  },
]
