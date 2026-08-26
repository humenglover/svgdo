export interface Article {
  slug: string
  title: Record<string, string>   // lang code → title
  date: string
  excerpt: Record<string, string> // lang code → excerpt
  tags: string[]
}

export const tagLabels: Record<string, Record<string, string>> = {
  'SVG':        { zh: 'SVG',         en: 'SVG',         ja: 'SVG',         ko: 'SVG',         es: 'SVG' },
  'vector':     { zh: '矢量',        en: 'Vector',      ja: 'ベクター',    ko: '벡터',        es: 'Vector' },
  'design':     { zh: '设计',        en: 'Design',      ja: 'デザイン',    ko: '디자인',      es: 'Diseño' },
  'guide':      { zh: '指南',        en: 'Guide',       ja: 'ガイド',      ko: '가이드',      es: 'Guía' },
  'tutorial':   { zh: '教程',        en: 'Tutorial',    ja: 'チュートリアル', ko: '튜토리얼', es: 'Tutorial' },
  'formats':    { zh: '格式',        en: 'Formats',     ja: 'フォーマット', ko: '포맷',      es: 'Formatos' },
  'optimization': { zh: '优化',      en: 'Optimization', ja: '最適化',     ko: '최적화',      es: 'Optimización' },
  'web-dev':    { zh: '前端开发',    en: 'Web Dev',     ja: 'ウェブ開発',  ko: '웹 개발',    es: 'Desarrollo Web' },
  'animation':  { zh: '动画',        en: 'Animation',   ja: 'アニメーション', ko: '애니메이션', es: 'Animación' },
  'tips':       { zh: '技巧',        en: 'Tips',        ja: 'ヒント',      ko: '팁',          es: 'Consejos' },
  'beginner':   { zh: '入门',        en: 'Beginner',    ja: '初心者',      ko: '초보자',      es: 'Principiante' },
  'comparison': { zh: '对比',        en: 'Comparison',  ja: '比較',        ko: '비교',        es: 'Comparación' },
}

export function getTagLabel(tag: string, lang: string): string {
  return tagLabels[tag]?.[lang] ?? tagLabels[tag]?.en ?? tag
}

export const articles: Article[] = [
  {
    slug: 'svg-advanced-animation',
    title: {
      zh: 'SVG 描边动画与路径变形：让你的矢量图"活"起来的高级动效指南',
      en: 'SVG Stroke Animation & Path Morphing: The Advanced Motion Design Guide That Brings Your Vector Graphics to Life',
      ja: 'SVGストロークアニメーションとパスモーフィング：ベクターグラフィックを"生き生きと"させる高度なモーションデザインガイド',
      ko: 'SVG 스트로크 애니메이션 및 패스 모핑: 벡터 그래픽을 "살아 움직이게" 만드는 고급 모션 디자인 가이드',
      es: 'Animación de Trazo SVG y Morphing de Trayectoria: La Guía Avanzada de Motion Design que Da Vida a tus Gráficos Vectoriales'
    },
    date: '2026-07-31',
    excerpt: {
      zh: 'SVG动画远不止旋转和缩放。从stroke-dashoffset描边绘制的数学障眼法、路径变形的点数匹配铁律，到滚动驱动的叙事动效和60fps性能优化——这篇硬核实战指南把SVG高级动画的全部底牌一次性摊开。',
      en: 'SVG animation goes far beyond rotation and scaling. From the mathematical illusion of stroke-dashoffset line drawing and the iron rule of path morphing point matching, to scroll-driven narrative motion and 60fps performance optimization — this hardcore guide lays all the cards of advanced SVG animation on the table.',
      ja: 'SVGアニメーションは回転と拡大縮小だけではありません。stroke-dashoffsetの線画アニメーションの数学的錯覚、パスモーフィングのポイントマッチングの鉄則、スクロール駆動のナラティブモーション、60fpsパフォーマンス最適化まで——このハードコアガイドが高度なSVGアニメーションの全てを明らかにします。',
      ko: 'SVG 애니메이션은 회전과 크기 조절을 훨씬 뛰어넘습니다. stroke-dashoffset 선 그리기의 수학적 착시, 패스 모핑의 포인트 매칭 철칙, 스크롤 기반 내러티브 모션, 60fps 성능 최적화까지 — 이 하드코어 가이드는 고급 SVG 애니메이션의 모든 카드를 테이블 위에 펼쳐놓습니다.',
      es: 'La animación SVG va mucho más allá de la rotación y el escalado. Desde la ilusión matemática del dibujo lineal con stroke-dashoffset y la regla de hierro del emparejamiento de puntos en el morphing de trayectorias, hasta el motion narrativo impulsado por scroll y la optimización de rendimiento a 60fps — esta guía hardcore pone todas las cartas de la animación SVG avanzada sobre la mesa.'
    },
    tags: ['SVG', 'animation', 'tutorial', 'web-dev'],
  },
  {
    slug: 'pictkit-architecture',
    title: { 
      zh: '别再把你的矢量节点传给野鸡服务器了：AST 实时解析与纯前端架构的降维打击', 
      en: 'Stop Leaking Your Vector Nodes to Shady Servers: The Architectural Superiority of Real-Time AST Parsing and Pure Frontend Rendering', 
      ja: 'ベクターノードを怪しいサーバーに漏らすのはやめよう：リアルタイムAST解析と純粋なフロントエンドレンダリングのアーキテクチャ的優位性', 
      ko: '벡터 노드를 수상한 서버에 유출하지 마세요: 실시간 AST 파싱과 순수 프론트엔드 렌더링의 아키텍처적 우월성', 
      es: 'Deja de Filtrar tus Nodos Vectoriales a Servidores Dudosos: La Superioridad Arquitectónica del Análisis AST en Tiempo Real y el Renderizado Frontend Puro' 
    },
    date: '2026-07-22',
    excerpt: { 
      zh: '深入剖析为什么基于云端服务器的图像编辑是架构级灾难。探索 Pictkit 如何利用 100% 纯前端、内存级 AST 解析与零延迟 GPU 渲染管线，实现降维打击。', 
      en: 'A deep dive into why cloud-based image editing is an architectural disaster. Explore how Pictkit leverages a 100% pure frontend, memory-level AST parsing, and zero-latency GPU rendering pipeline for ultimate superiority.', 
      ja: 'クラウドベースの画像編集がアーキテクチャ上の災害である理由を深掘り。Pictkitが100%純粋なフロントエンド、メモリレベルのAST解析、ゼロレイテンシのGPUレンダリングパイプラインをどのように活用して究極の優位性を実現しているかを探る。', 
      ko: '클라우드 기반 이미지 편집이 아키텍처적 재앙인 이유를 심층 분석합니다. Pictkit이 100% 순수 프론트엔드, 메모리 수준 AST 파싱 및 제로 레이턴시 GPU 렌더링 파이프라인을 활용하여 궁극적인 우위를 달성하는 방법을 살펴봅니다.', 
      es: 'Un análisis profundo de por qué la edición de imágenes basada en la nube es un desastre arquitectónico. Explora cómo Pictkit aprovecha un frontend 100% puro, análisis AST a nivel de memoria y una canalización de renderizado GPU de latencia cero para lograr una superioridad definitiva.' 
    },
    tags: ['SVG', 'web-dev', 'comparison'],
  },
  {
    slug: 'svg-learning-guide',
    title: { 
      zh: 'SVG 从入门到放弃再到超神：万字干货带你彻底征服矢量世界', 
      en: 'SVG: From Beginner to God Mode. A Comprehensive Vector Guide', 
      ja: 'SVG入門から神モードまで：ベクター世界を征服する総合ガイド', 
      ko: 'SVG 입문부터 신 모드까지: 벡터 세계를 정복하는 종합 가이드', 
      es: 'De Principiante a Modo Dios en SVG: Guía Completa de Vectores' 
    },
    date: '2026-07-21',
    excerpt: { 
      zh: '别再复制粘贴代码了！万字长文，配以实时渲染示例和逗比表情包，手把手教你从零开始徒手写 SVG。', 
      en: 'Stop copy-pasting code! A massive guide with live rendering examples and funny memes, teaching you how to hand-code SVG from scratch.', 
      ja: 'コードのコピペはもうやめよう！リアルタイムレンダリングの例と面白いミームを交え、SVGを手書きする方法をゼロから教える長編ガイド。', 
      ko: '코드 복사 붙여넣기는 이제 그만! 실시간 렌더링 예제와 재미있는 밈과 함께 처음부터 SVG를 코딩하는 방법을 알려주는 방대한 가이드.', 
      es: '¡Deja de copiar y pegar código! Una guía masiva con ejemplos de renderizado en vivo y memes, que te enseña a codificar SVG a mano desde cero.' 
    },
    tags: ['SVG', 'tutorial', 'beginner', 'web-dev'],
  },
  {
    slug: 'claude-svg-design-guide',
    title: { 
      zh: 'Claude AI + SVG：我再也不用手敲那些反人类的路径了', 
      en: "Claude AI + SVG: I'm Never Hand-Coding Those Insane Paths Again", 
      ja: 'Claude AI + SVG: もうあの地獄のようなパスを手書きするのはやめた', 
      ko: 'Claude AI + SVG: 더 이상 그 끔찍한 경로를 손으로 코딩하지 않겠다', 
      es: 'Claude AI + SVG: Nunca más volveré a picar a mano esos paths infernales' 
    },
    date: '2026-07-21',
    excerpt: { 
      zh: '老手带你避坑：利用 Claude AI 结合我们的编辑器，轻松生成高质量 SVG 矢量图的终极指南。', 
      en: 'A veteran\'s guide to surviving SVG: How to leverage Claude AI and our editor to generate high-quality vector graphics without losing your mind.', 
      ja: 'フロントエンド老兵が教える回避術：Claude AIと我々のエディタを駆使して、高品質なベクター画像を簡単に生成する究極のガイド。', 
      ko: '프론트엔드 고인물이 알려주는 생존 가이드: Claude AI와 우리의 에디터를 활용해 멘탈을 유지하며 고품질 벡터 그래픽을 생성하는 방법.', 
      es: 'La guía de supervivencia de un veterano del frontend: Cómo usar Claude AI y nuestro editor para generar gráficos vectoriales de alta calidad sin perder la cabeza.' 
    },
    tags: ['SVG', 'tutorial', 'tips', 'web-dev'],
  },
  {
    slug: 'ai-svg-generation',
    title: { 
      zh: '使用 DeepSeek 和 Claude 绘制高质量 SVG 图片', 
      en: 'Drawing High-Quality SVG Images with DeepSeek and Claude', 
      ja: 'DeepSeekとClaudeを使用して高品質なSVG画像を描画する', 
      ko: 'DeepSeek 및 Claude를 사용하여 고품질 SVG 이미지 그리기', 
      es: 'Dibujo de imágenes SVG de alta calidad con DeepSeek y Claude' 
    },
    date: '2026-07-20',
    excerpt: { 
      zh: '探索如何利用 DeepSeek-V3 和 Claude 3.5/3.7 大模型强大的代码生成能力，结合精细的提示词，自动化生成高质量、专业级的 SVG 矢量图形。', 
      en: 'Explore how to leverage the powerful code generation capabilities of DeepSeek-V3 and Claude 3.5/3.7, combined with precise prompts, to automatically generate high-quality, professional SVG vector graphics.', 
      ja: 'DeepSeek-V3およびClaude 3.5/3.7の強力なコード生成機能と正確なプロンプトを組み合わせて、高品質でプロフェッショナルなSVGベクターグラフィックスを自動生成する方法を探ります。', 
      ko: 'DeepSeek-V3 및 Claude 3.5/3.7의 강력한 코드 생성 기능과 정밀한 프롬프트를 결합하여 고품질의 전문적인 SVG 벡터 그래픽을 자동으로 생성하는 방법을 알아보세요.', 
      es: 'Explore cómo aprovechar las potentes capacidades de generación de código de DeepSeek-V3 y Claude 3.5/3.7, combinadas con indicaciones precisas, para generar automáticamente gráficos vectoriales SVG profesionales y de alta calidad.' 
    },
    tags: ['SVG', 'design', 'tutorial', 'tips'],
  },
  {
    slug: 'svg-basics',
    title: { zh: 'SVG 格式入门：什么是 SVG？为什么你需要它？', en: 'SVG Basics: What Is SVG and Why Do You Need It?', ja: 'SVG入門：SVGとは？なぜ必要なのか？', ko: 'SVG 기초: SVG란 무엇이며 왜 필요한가?' },
    date: '2026-01-05',
    excerpt: { zh: '从零开始了解 SVG。可缩放矢量图形是什么？它和 PNG、JPEG 有什么区别？为什么设计师和前端开发者都在用它？', en: 'Learn SVG from scratch. What is Scalable Vector Graphics? How does it differ from PNG and JPEG? Why designers and developers love it.', ja: 'SVGをゼロから学ぶ。スケーラブルベクターグラフィックスとは？PNGやJPEGとの違いは？デザイナーや開発者が愛用する理由。', ko: 'SVG를 처음부터 배워보세요. 스케일러블 벡터 그래픽스란? PNG 및 JPEG와의 차이점은? 디자이너와 개발자가 사랑하는 이유.', es: 'Aprende SVG desde cero. ¿Qué son los Gráficos Vectoriales Escalables? ¿En qué se diferencian de PNG y JPEG? Por qué diseñadores y desarrolladores lo adoran.' },
    tags: ['SVG', 'beginner', 'guide'],
  },
  {
    slug: 'svg-vs-png',
    title: { zh: 'SVG vs PNG：什么时候该用矢量图？什么时候用位图？', en: 'SVG vs PNG: When to Use Vector and When to Use Raster', ja: 'SVG vs PNG：ベクターとラスターの使い分け', ko: 'SVG vs PNG: 벡터와 래스터, 언제 무엇을 써야 할까?' },
    date: '2026-01-20',
    excerpt: { zh: 'SVG 和 PNG 各有优势。本文从文件大小、缩放、透明度、浏览器兼容等维度全面对比，帮你选对格式。', en: 'SVG and PNG each have strengths. A comprehensive comparison across file size, scaling, transparency, and browser support to help you choose.', ja: 'SVGとPNGにはそれぞれ強みがある。ファイルサイズ、拡大縮小、透明度、ブラウザ対応まで包括的に比較し、最適な選択をサポート。', ko: 'SVG와 PNG는 각각 장점이 있습니다. 파일 크기, 확대, 투명도, 브라우저 지원까지 포괄적으로 비교하여 최적의 선택을 도와드립니다.', es: 'SVG y PNG tienen sus fortalezas. Una comparación completa de tamaño, escalado, transparencia y soporte de navegadores para elegir el formato correcto.' },
    tags: ['SVG', 'formats', 'comparison'],
  },
  {
    slug: 'svg-optimization',
    title: { zh: 'SVG 文件优化指南：把 SVG 压缩到极致', en: 'SVG Optimization Guide: Compress SVGs to the Minimum', ja: 'SVG最適化ガイド：SVGを限界まで圧縮する', ko: 'SVG 최적화 가이드: SVG를 극한까지 압축하기' },
    date: '2026-02-08',
    excerpt: { zh: '设计工具导出的 SVG 通常包含大量冗余代码。学习如何移除注释、简化路径、删除无用属性，让 SVG 文件体积减少 50%-80%。', en: 'SVGs from design tools often contain bloat. Learn to strip comments, simplify paths, and remove useless attributes — reducing file size by 50-80%.', ja: 'デザインツールから出力されたSVGには多くの無駄が。コメント削除、パス簡略化、不要属性の除去で、ファイルサイズを50-80%削減する方法を学ぶ。', ko: '디자인 도구에서 출력된 SVG에는 많은 불필요한 코드가 있습니다. 주석 제거, 패스 간소화, 불필요 속성 제거로 파일 크기를 50-80% 줄이는 방법을 배워보세요.', es: 'Los SVG de herramientas de diseño suelen contener código innecesario. Aprende a eliminar comentarios, simplificar trazados y quitar atributos inútiles — reduce el tamaño un 50-80%.' },
    tags: ['SVG', 'optimization', 'tutorial'],
  },
  {
    slug: 'svg-animation',
    title: { zh: 'SVG 动画入门：用 CSS 让图标动起来', en: 'SVG Animation Guide: Animating Icons with CSS', ja: 'SVGアニメーション入門：CSSでアイコンを動かす', ko: 'SVG 애니메이션 입문: CSS로 아이콘 움직이기' },
    date: '2026-02-22',
    excerpt: { zh: 'SVG 不只是静态图像。通过 CSS animation 和 SMIL，你可以让图标旋转、变色、变形。新手也能上手的动画教程。', en: 'SVG isn\'t just static. With CSS animation and SMIL, make icons spin, change color, and morph. A beginner-friendly animation tutorial.', ja: 'SVGは静止画だけではない。CSSアニメーションとSMILで、アイコンを回転させ、色を変え、変形させる。初心者でもできるアニメーション入門。', ko: 'SVG는 정적인 이미지가 아닙니다. CSS 애니메이션으로 아이콘을 회전시키고, 색을 바꾸고, 변형시킬 수 있습니다. 초보자도 쉽게 따라할 수 있는 애니메이션 튜토리얼.', es: 'SVG no es solo estático. Con animación CSS, haz que los iconos giren, cambien de color y se transformen. Un tutorial para principiantes.' },
    tags: ['SVG', 'animation', 'tutorial'],
  },
  {
    slug: 'svg-icons-guide',
    title: { zh: '图标设计指南：从 SVG 开始的完整工作流', en: 'Icon Design Guide: Complete SVG Workflow', ja: 'アイコンデザインガイド：SVGワークフロー完全版', ko: '아이콘 디자인 가이드: SVG 워크플로 완전판' },
    date: '2026-03-10',
    excerpt: { zh: '设计一套高质量 SVG 图标的完整流程。从网格设置、描边规范到导出优化，专业图标设计师都在用的方法。', en: 'A complete workflow for designing high-quality SVG icon sets. From grid setup and stroke specs to export optimization — the methods pro designers use.', ja: '高品質なSVGアイコンセットをデザインするための完全なワークフロー。グリッド設定、ストローク仕様からエクスポート最適化まで、プロの手法を紹介。', ko: '고품질 SVG 아이콘 세트를 디자인하는 완전한 워크플로. 그리드 설정, 스트로크 사양부터 내보내기 최적화까지, 프로 디자이너가 사용하는 방법을 소개합니다.', es: 'Un flujo de trabajo completo para diseñar conjuntos de iconos SVG de alta calidad. Desde cuadrícula y especificaciones de trazo hasta optimización de exportación.' },
    tags: ['SVG', 'design', 'guide'],
  },
  {
    slug: 'svg-in-web',
    title: { zh: '网页中使用 SVG 的 5 种方式及最佳实践', en: '5 Ways to Use SVG in Web Pages — Best Practices', ja: 'WebページでSVGを使う5つの方法とベストプラクティス', ko: '웹에서 SVG를 사용하는 5가지 방법과 모범 사례' },
    date: '2026-03-25',
    excerpt: { zh: '在 HTML 中嵌入 SVG 有很多种方式：inline、img 标签、CSS background、data URI 和 sprite。了解每种方式的优劣和适用场景。', en: 'Many ways to embed SVG in HTML: inline, img tag, CSS background, data URI, and sprite. Learn the pros, cons, and best use cases for each.', ja: 'HTMLにSVGを埋め込む方法は多数：インライン、imgタグ、CSS背景、Data URI、スプライト。それぞれの長所短所と最適な使用シーンを解説。', ko: 'HTML에 SVG를 임베딩하는 다양한 방법: 인라인, img 태그, CSS 배경, Data URI, 스프라이트. 각 방식의 장단점과 최적의 사용 사례를 알아보세요.', es: 'Muchas formas de incrustar SVG en HTML: en línea, img, fondo CSS, Data URI y sprite. Ventajas, desventajas y mejores usos para cada método.' },
    tags: ['SVG', 'web-dev', 'guide'],
  },
  {
    slug: 'svg-editor-guide',
    title: { zh: '在线 SVG 编辑器完全使用指南', en: 'Complete Guide to Using Online SVG Editors', ja: 'オンラインSVGエディタ完全活用ガイド', ko: '온라인 SVG 에디터 완전 활용 가이드' },
    date: '2026-04-08',
    excerpt: { zh: '掌握在线 SVG 编辑器的全部功能。从上传、编辑、优化到导出，一步步教你高效处理 SVG 文件。', en: 'Master the online SVG editor. From upload, edit, optimize to export — a step-by-step guide to processing SVG files efficiently.', ja: 'オンラインSVGエディタの全機能をマスター。アップロード、編集、最適化からエクスポートまで、SVGファイルを効率的に処理する方法をステップバイステップで解説。', ko: '온라인 SVG 에디터의 모든 기능을 마스터하세요. 업로드, 편집, 최적화부터 내보내기까지 SVG 파일을 효율적으로 처리하는 방법을 단계별로 설명합니다.', es: 'Domina el editor SVG online. Desde subir, editar, optimizar hasta exportar — una guía paso a paso para procesar archivos SVG eficientemente.' },
    tags: ['SVG', 'tutorial', 'guide'],
  },
  {
    slug: 'svg-to-png-guide',
    title: { zh: 'SVG 转 PNG 完全指南：格式转换的正确姿势', en: 'SVG to PNG Guide: The Right Way to Convert', ja: 'SVGからPNGへの変換ガイド：正しい変換方法', ko: 'SVG를 PNG로 변환 가이드: 올바른 변환 방법' },
    date: '2026-04-22',
    excerpt: { zh: '什么时候需要把 SVG 转成 PNG？如何选择分辨率和背景色？教你用在线工具一键完成高质量转换。', en: 'When should you convert SVG to PNG? How to choose resolution and background? One-click high-quality conversion with online tools.', ja: 'いつSVGをPNGに変換すべきか？解像度と背景色の選び方は？オンラインツールで高品質変換をワンクリックで行う方法を解説。', ko: '언제 SVG를 PNG로 변환해야 할까요? 해상도와 배경색은 어떻게 선택할까요? 온라인 도구로 고품질 변환을 원클릭으로 하는 방법을 알려드립니다.', es: '¿Cuándo convertir SVG a PNG? ¿Cómo elegir resolución y fondo? Conversión de alta calidad con un clic usando herramientas online.' },
    tags: ['SVG', 'formats', 'tutorial'],
  },
  {
    slug: 'svg-js-interaction',
    title: { zh: 'SVG + JS 交互：实现可点击、拖拽、高亮的矢量图形', en: 'SVG + JS Interaction: Clickable, Draggable, Highlightable Vector Graphics', ja: 'SVG + JS インタラクション：クリック・ドラッグ・ハイライトできるベクターグラフィックス', ko: 'SVG + JS 인터랙션: 클릭, 드래그, 하이라이트 가능한 벡터 그래픽', es: 'SVG + JS: Gráficos vectoriales interactivos con clic, arrastre y resaltado' },
    date: '2026-07-17',
    excerpt: { zh: '深入讲解 SVG DOM 操作、鼠标事件监听、动态修改 path 属性，手把手教你实现可交互的矢量图形编辑器。适合前端开发者。', en: 'A deep dive into SVG DOM manipulation, mouse event handling, and dynamic path attribute editing. Build an interactive vector graphics editor from scratch. For frontend developers.', ja: 'SVG DOM操作、マウスイベント監視、path属性の動的変更を徹底解説。インタラクティブなベクターエディタをゼロから構築する方法。フロントエンド開発者向け。', ko: 'SVG DOM 조작, 마우스 이벤트 처리, path 속성 동적 편집까지 깊이 있게 다룹니다. 인터랙티브 벡터 그래픽 에디터를 처음부터 구축하는 방법. 프론트엔드 개발자 대상.', es: 'Una inmersión profunda en manipulación del DOM SVG, manejo de eventos de ratón y edición dinámica de atributos path. Construye un editor vectorial interactivo desde cero. Para desarrolladores frontend.' },
    tags: ['SVG', 'web-dev', 'tutorial'],
  },
  {
    slug: 'future-of-svg',
    title: { 
      zh: 'SVG 的未来：超越简单图标，探索无限可能', 
      en: 'The Future of SVG: Beyond Simple Icons, Exploring Infinite Possibilities', 
      ja: 'SVGの未来：単なるアイコンを超え、無限の可能性を探求する', 
      ko: 'SVG의 미래: 단순한 아이콘을 넘어 무한한 가능성 탐구', 
      es: 'El futuro de SVG: Más allá de los íconos simples, explorando infinitas posibilidades' 
    },
    date: '2026-07-18',
    excerpt: { 
      zh: 'SVG 早已不再只是网页角落里的小图标。随着现代浏览器的飞速发展，SVG 正以前所未有的方式重塑网页设计。本文带你领略 SVG 的前沿应用与未来趋势。', 
      en: 'SVG is no longer just tiny icons in the corner of a webpage. With modern browsers, SVG is reshaping web design in unprecedented ways. Discover the cutting-edge applications and future trends of SVG.', 
      ja: 'SVGはもはやWebページの隅にある小さなアイコンではありません。最新ブラウザと共に、SVGはかつてない方法でWebデザインを再構築しています。SVGの最先端の応用と未来のトレンドを発見しましょう。', 
      ko: 'SVG는 더 이상 웹페이지 구석의 작은 아이콘이 아닙니다. 최신 브라우저의 발전과 함께 SVG는 전례 없는 방식으로 웹 디자인을 재구성하고 있습니다. SVG의 최첨단 애플리케이션과 미래 동향을 알아보세요.', 
      es: 'SVG ya no son solo pequeños íconos. Con los navegadores modernos, SVG está remodelando el diseño web de formas sin precedentes. Descubre las aplicaciones de vanguardia y tendencias futuras de SVG.' 
    },
    tags: ['SVG', 'design', 'web-dev'],
  },
  {
    slug: 'svg-filters-and-effects',
    title: { 
      zh: '高级 SVG 滤镜与特效：释放网页设计的创造力', 
      en: 'Advanced SVG Filters and Effects: Unleashing Web Design Creativity', 
      ja: '高度なSVGフィルターとエフェクト：Webデザインの創造力を解放する', 
      ko: '고급 SVG 필터 및 효과: 웹 디자인 창의성 발휘', 
      es: 'Filtros y Efectos SVG Avanzados: Liberando la Creatividad en el Diseño Web' 
    },
    date: '2026-07-19',
    excerpt: { 
      zh: '超越基础图形！深入探索 SVG 滤镜的强大世界，学习如何使用 feGaussianBlur、feColorMatrix 和 feTurbulence 等实现阴影、发光、故障艺术和有机纹理效果。', 
      en: 'Go beyond basic shapes! Dive deep into the powerful world of SVG filters and learn how to use feGaussianBlur, feColorMatrix, and feTurbulence for shadows, glows, glitch art, and organic textures.', 
      ja: '基本図形を超えて！SVGフィルターの強力な世界に深く潜り、feGaussianBlur、feColorMatrix、feTurbulenceを使用して影、発光、グリッチアート、有機的なテクスチャを実現する方法を学びましょう。', 
      ko: '기본 도형을 넘어서! SVG 필터의 강력한 세계로 깊이 들어가 feGaussianBlur, feColorMatrix, feTurbulence를 사용하여 그림자, 발광, 글리치 아트 및 유기적 텍스처를 구현하는 방법을 배웁니다.', 
      es: '¡Ve más allá de las formas básicas! Sumérgete en el poderoso mundo de los filtros SVG y aprende a usar feGaussianBlur, feColorMatrix y feTurbulence para sombras, brillos, arte glitch y texturas orgánicas.' 
    },
    tags: ['SVG', 'design', 'tutorial'],
  },
  {
    slug: 'svg-performance-engineering',
    title: {
      zh: 'SVG 性能工程：如何在浏览器里流畅编辑 10 万节点的矢量图',
      en: 'SVG Performance Engineering: Editing 100,000-Node Vector Graphics in the Browser Without Freezing',
      ja: 'SVGパフォーマンスエンジニアリング：10万ノードのベクターグラフィックをブラウザでスムーズに編集する方法',
      ko: 'SVG 성능 엔지니어링: 브라우저에서 10만 노드 벡터 그래픽을 매끄럽게 편집하는 방법',
      es: 'Ingeniería de Rendimiento SVG: Editando Gráficos Vectoriales de 100,000 Nodos en el Navegador sin Congelarse'
    },
    date: '2026-08-06',
    excerpt: {
      zh: '一张 750KB 的矢量地图，藏着 3143 个 DOM 节点。本文从节点物理账与 Lighthouse 阈值、AST 先行、视口裁剪与 content-visibility、LOD 路径简化，到 diff/patch/rAF/GPU 更新管线，硬核拆解如何在浏览器里流畅编辑 10 万节点的矢量图而不让标签页卡死。',
      en: 'A 750KB vector map hides 3,143 DOM nodes. From the physics of node cost and Lighthouse thresholds, to AST-first editing, viewport culling with content-visibility, LOD path simplification, and the diff/patch/rAF/GPU update pipeline — the hardcore playbook for editing 100,000-node vector files without freezing the tab.',
      ja: '750KBのベクターマップには3,143個のDOMノードが隠れています。ノードコストの物理とLighthouseの閾値、AST先行の編集、content-visibilityによるビューポートカリング、LODパス簡略化、diff/patch/rAF/GPU更新パイプラインまで——タブをフリーズさせずに10万ノードのベクターファイルを編集するハードコア実践ガイド。',
      ko: '750KB 벡터 맵에는 3,143개의 DOM 노드가 숨어 있습니다. 노드 비용의 물리학과 Lighthouse 임계값, AST 우선 편집, content-visibility 기반 뷰포트 컬링, LOD 경로 단순화, diff/patch/rAF/GPU 업데이트 파이프라인까지 — 탭을 멈추지 않고 10만 노드 벡터 파일을 편집하는 하드코어 가이드.',
      es: 'Un mapa vectorial de 750KB esconde 3,143 nodos DOM. Desde la física del coste de nodos y los umbrales de Lighthouse, hasta la edición AST-first, el culling de viewport con content-visibility, la simplificación LOD de rutas y el pipeline de actualización diff/patch/rAF/GPU — el manual para editar archivos vectoriales de 100,000 nodos sin congelar la pestaña.'
    },
    tags: ['SVG', 'optimization', 'web-dev', 'beginner'],
  },
]
