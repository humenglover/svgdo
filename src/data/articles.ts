export interface Article {
  slug: string
  title: Record<string, string>   // lang code → title
  date: string
  excerpt: Record<string, string> // lang code → excerpt
  tags: string[]
}

export const tagLabels: Record<string, Record<string, string>> = {
  'SVG':        { zh: 'SVG',         en: 'SVG',         ja: 'SVG' },
  'vector':     { zh: '矢量',        en: 'Vector',      ja: 'ベクター' },
  'design':     { zh: '设计',        en: 'Design',      ja: 'デザイン' },
  'guide':      { zh: '指南',        en: 'Guide',       ja: 'ガイド' },
  'tutorial':   { zh: '教程',        en: 'Tutorial',    ja: 'チュートリアル' },
  'formats':    { zh: '格式',        en: 'Formats',     ja: 'フォーマット' },
  'optimization': { zh: '优化',      en: 'Optimization', ja: '最適化' },
  'web-dev':    { zh: '前端开发',    en: 'Web Dev',     ja: 'ウェブ開発' },
  'animation':  { zh: '动画',        en: 'Animation',   ja: 'アニメーション' },
  'tips':       { zh: '技巧',        en: 'Tips',        ja: 'ヒント' },
  'beginner':   { zh: '入门',        en: 'Beginner',    ja: '初心者' },
  'comparison': { zh: '对比',        en: 'Comparison',  ja: '比較' },
}

export function getTagLabel(tag: string, lang: string): string {
  return tagLabels[tag]?.[lang] ?? tagLabels[tag]?.en ?? tag
}

export const articles: Article[] = [
  {
    slug: 'svg-basics',
    title: { zh: 'SVG 格式入门：什么是 SVG？为什么你需要它？', en: 'SVG Basics: What Is SVG and Why Do You Need It?', ja: 'SVG入門：SVGとは？なぜ必要なのか？' },
    date: '2026-07-16',
    excerpt: { zh: '从零开始了解 SVG。可缩放矢量图形是什么？它和 PNG、JPEG 有什么区别？为什么设计师和前端开发者都在用它？', en: 'Learn SVG from scratch. What is Scalable Vector Graphics? How does it differ from PNG and JPEG? Why designers and developers love it.', ja: 'SVGをゼロから学ぶ。スケーラブルベクターグラフィックスとは？PNGやJPEGとの違いは？デザイナーや開発者が愛用する理由。' },
    tags: ['SVG', 'beginner', 'guide'],
  },
  {
    slug: 'svg-vs-png',
    title: { zh: 'SVG vs PNG：什么时候该用矢量图？什么时候用位图？', en: 'SVG vs PNG: When to Use Vector and When to Use Raster', ja: 'SVG vs PNG：ベクターとラスターの使い分け' },
    date: '2026-07-16',
    excerpt: { zh: 'SVG 和 PNG 各有优势。本文从文件大小、缩放、透明度、浏览器兼容等维度全面对比，帮你选对格式。', en: 'SVG and PNG each have strengths. A comprehensive comparison across file size, scaling, transparency, and browser support to help you choose.', ja: 'SVGとPNGにはそれぞれ強みがある。ファイルサイズ、拡大縮小、透明度、ブラウザ対応まで包括的に比較し、最適な選択をサポート。' },
    tags: ['SVG', 'formats', 'comparison'],
  },
  {
    slug: 'svg-optimization',
    title: { zh: 'SVG 文件优化指南：把 SVG 压缩到极致', en: 'SVG Optimization Guide: Compress SVGs to the Minimum', ja: 'SVG最適化ガイド：SVGを限界まで圧縮する' },
    date: '2026-07-16',
    excerpt: { zh: '设计工具导出的 SVG 通常包含大量冗余代码。学习如何移除注释、简化路径、删除无用属性，让 SVG 文件体积减少 50%-80%。', en: 'SVGs from design tools often contain bloat. Learn to strip comments, simplify paths, and remove useless attributes — reducing file size by 50-80%.', ja: 'デザインツールから出力されたSVGには多くの無駄が。コメント削除、パス簡略化、不要属性の除去で、ファイルサイズを50-80%削減する方法を学ぶ。' },
    tags: ['SVG', 'optimization', 'tutorial'],
  },
  {
    slug: 'svg-animation',
    title: { zh: 'SVG 动画入门：用 CSS 让图标动起来', en: 'SVG Animation Guide: Animating Icons with CSS', ja: 'SVGアニメーション入門：CSSでアイコンを動かす' },
    date: '2026-07-17',
    excerpt: { zh: 'SVG 不只是静态图像。通过 CSS animation 和 SMIL，你可以让图标旋转、变色、变形。新手也能上手的动画教程。', en: 'SVG isn\'t just static. With CSS animation and SMIL, make icons spin, change color, and morph. A beginner-friendly animation tutorial.', ja: 'SVGは静止画だけではない。CSSアニメーションとSMILで、アイコンを回転させ、色を変え、変形させる。初心者でもできるアニメーション入門。' },
    tags: ['SVG', 'animation', 'tutorial'],
  },
  {
    slug: 'svg-icons-guide',
    title: { zh: '图标设计指南：从 SVG 开始的完整工作流', en: 'Icon Design Guide: Complete SVG Workflow', ja: 'アイコンデザインガイド：SVGワークフロー完全版' },
    date: '2026-07-17',
    excerpt: { zh: '设计一套高质量 SVG 图标的完整流程。从网格设置、描边规范到导出优化，专业图标设计师都在用的方法。', en: 'A complete workflow for designing high-quality SVG icon sets. From grid setup and stroke specs to export optimization — the methods pro designers use.', ja: '高品質なSVGアイコンセットをデザインするための完全なワークフロー。グリッド設定、ストローク仕様からエクスポート最適化まで、プロの手法を紹介。' },
    tags: ['SVG', 'design', 'guide'],
  },
  {
    slug: 'svg-in-web',
    title: { zh: '网页中使用 SVG 的 5 种方式及最佳实践', en: '5 Ways to Use SVG in Web Pages — Best Practices', ja: 'WebページでSVGを使う5つの方法とベストプラクティス' },
    date: '2026-07-17',
    excerpt: { zh: '在 HTML 中嵌入 SVG 有很多种方式：inline、img 标签、CSS background、data URI 和 sprite。了解每种方式的优劣和适用场景。', en: 'Many ways to embed SVG in HTML: inline, img tag, CSS background, data URI, and sprite. Learn the pros, cons, and best use cases for each.', ja: 'HTMLにSVGを埋め込む方法は多数：インライン、imgタグ、CSS背景、Data URI、スプライト。それぞれの長所短所と最適な使用シーンを解説。' },
    tags: ['SVG', 'web-dev', 'guide'],
  },
  {
    slug: 'svg-editor-guide',
    title: { zh: '在线 SVG 编辑器完全使用指南', en: 'Complete Guide to Using Online SVG Editors', ja: 'オンラインSVGエディタ完全活用ガイド' },
    date: '2026-07-17',
    excerpt: { zh: '掌握在线 SVG 编辑器的全部功能。从上传、编辑、优化到导出，一步步教你高效处理 SVG 文件。', en: 'Master the online SVG editor. From upload, edit, optimize to export — a step-by-step guide to processing SVG files efficiently.', ja: 'オンラインSVGエディタの全機能をマスター。アップロード、編集、最適化からエクスポートまで、SVGファイルを効率的に処理する方法をステップバイステップで解説。' },
    tags: ['SVG', 'tutorial', 'guide'],
  },
  {
    slug: 'svg-to-png-guide',
    title: { zh: 'SVG 转 PNG 完全指南：格式转换的正确姿势', en: 'SVG to PNG Guide: The Right Way to Convert', ja: 'SVGからPNGへの変換ガイド：正しい変換方法' },
    date: '2026-07-17',
    excerpt: { zh: '什么时候需要把 SVG 转成 PNG？如何选择分辨率和背景色？教你用在线工具一键完成高质量转换。', en: 'When should you convert SVG to PNG? How to choose resolution and background? One-click high-quality conversion with online tools.', ja: 'いつSVGをPNGに変換すべきか？解像度と背景色の選び方は？オンラインツールで高品質変換をワンクリックで行う方法を解説。' },
    tags: ['SVG', 'formats', 'tutorial'],
  },
]
