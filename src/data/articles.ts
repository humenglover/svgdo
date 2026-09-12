export interface Article {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
}

export const tagLabels: Record<string, string> = {
  'SVG': 'SVG',
  'vector': 'Vector',
  'design': 'Design',
  'guide': 'Guide',
  'tutorial': 'Tutorial',
  'formats': 'Formats',
  'optimization': 'Optimization',
  'web-dev': 'Web Dev',
  'animation': 'Animation',
  'tips': 'Tips',
  'beginner': 'Beginner',
  'comparison': 'Comparison',
}

export function getTagLabel(tag: string): string {
  return tagLabels[tag] || tag
}

export const articles: Article[] = [
  {
    slug: 'svg-advanced-animation',
    title: 'SVG Stroke Animation & Path Morphing: The Advanced Motion Design Guide That Brings Your Vector Graphics to Life',
    date: '2026-07-31',
    excerpt: 'SVG animation goes far beyond rotation and scaling. From the mathematical illusion of stroke-dashoffset line drawing and the iron rule of path morphing point matching, to scroll-driven narrative motion and 60fps performance optimization — this hardcore guide lays all the cards of advanced SVG animation on the table.',
    tags: ['SVG', 'animation', 'tutorial', 'web-dev'],
  },
  {
    slug: 'pictkit-architecture',
    title: 'Stop Leaking Your Vector Nodes to Shady Servers: The Architectural Superiority of Real-Time AST Parsing and Pure Frontend Rendering',
    date: '2026-07-22',
    excerpt: 'A deep dive into why cloud-based image editing is an architectural disaster. Explore how Pictkit leverages a 100% pure frontend, memory-level AST parsing, and zero-latency GPU rendering pipeline for ultimate superiority.',
    tags: ['SVG', 'web-dev', 'comparison'],
  },
  {
    slug: 'svg-learning-guide',
    title: 'SVG: From Beginner to God Mode. A Comprehensive Vector Guide',
    date: '2026-07-21',
    excerpt: 'Stop copy-pasting code! A massive guide with live rendering examples and funny memes, teaching you how to hand-code SVG from scratch.',
    tags: ['SVG', 'tutorial', 'beginner', 'web-dev'],
  },
  {
    slug: 'claude-svg-design-guide',
    title: "Claude AI + SVG: I'm Never Hand-Coding Those Insane Paths Again",
    date: '2026-07-21',
    excerpt: "A veteran's guide to surviving SVG: How to leverage Claude AI and our editor to generate high-quality vector graphics without losing your mind.",
    tags: ['SVG', 'tutorial', 'tips', 'web-dev'],
  },
  {
    slug: 'ai-svg-generation',
    title: 'Drawing High-Quality SVG Images with DeepSeek and Claude',
    date: '2026-07-20',
    excerpt: 'Explore how to leverage the powerful code generation capabilities of DeepSeek-V3 and Claude 3.5/3.7, combined with precise prompts, to automatically generate high-quality, professional SVG vector graphics.',
    tags: ['SVG', 'design', 'tutorial', 'tips'],
  },
  {
    slug: 'svg-basics',
    title: 'SVG Basics: What Is SVG and Why Do You Need It?',
    date: '2026-01-05',
    excerpt: 'Learn SVG from scratch. What is Scalable Vector Graphics? How does it differ from PNG and JPEG? Why designers and developers love it.',
    tags: ['SVG', 'beginner', 'guide'],
  },
  {
    slug: 'svg-vs-png',
    title: 'SVG vs PNG: When to Use Vector and When to Use Raster',
    date: '2026-01-20',
    excerpt: 'SVG and PNG each have strengths. A comprehensive comparison across file size, scaling, transparency, and browser support to help you choose.',
    tags: ['SVG', 'formats', 'comparison'],
  },
  {
    slug: 'svg-optimization',
    title: 'SVG Optimization Guide: Compress SVGs to the Minimum',
    date: '2026-02-08',
    excerpt: 'SVGs from design tools often contain bloat. Learn to strip comments, simplify paths, and remove useless attributes — reducing file size by 50-80%.',
    tags: ['SVG', 'optimization', 'tutorial'],
  },
  {
    slug: 'svg-animation',
    title: 'SVG Animation Guide: Animating Icons with CSS',
    date: '2026-02-22',
    excerpt: "SVG isn't just static. With CSS animation and SMIL, make icons spin, change color, and morph. A beginner-friendly animation tutorial.",
    tags: ['SVG', 'animation', 'tutorial'],
  },
  {
    slug: 'svg-icons-guide',
    title: 'Icon Design Guide: Complete SVG Workflow',
    date: '2026-03-10',
    excerpt: 'A complete workflow for designing high-quality SVG icon sets. From grid setup and stroke specs to export optimization — the methods pro designers use.',
    tags: ['SVG', 'design', 'guide'],
  },
  {
    slug: 'svg-in-web',
    title: '5 Ways to Use SVG in Web Pages — Best Practices',
    date: '2026-03-25',
    excerpt: 'Many ways to embed SVG in HTML: inline, img tag, CSS background, data URI, and sprite. Learn the pros, cons, and best use cases for each.',
    tags: ['SVG', 'web-dev', 'guide'],
  },
  {
    slug: 'svg-editor-guide',
    title: 'Complete Guide to Using Online SVG Editors',
    date: '2026-04-08',
    excerpt: 'Master the online SVG editor. From upload, edit, optimize to export — a step-by-step guide to processing SVG files efficiently.',
    tags: ['SVG', 'tutorial', 'guide'],
  },
  {
    slug: 'svg-to-png-guide',
    title: 'SVG to PNG Guide: The Right Way to Convert',
    date: '2026-04-22',
    excerpt: 'When should you convert SVG to PNG? How to choose resolution and background? One-click high-quality conversion with online tools.',
    tags: ['SVG', 'formats', 'tutorial'],
  },
  {
    slug: 'svg-js-interaction',
    title: 'SVG + JS Interaction: Clickable, Draggable, Highlightable Vector Graphics',
    date: '2026-07-17',
    excerpt: 'A deep dive into SVG DOM manipulation, mouse event handling, and dynamic path attribute editing. Build an interactive vector graphics editor from scratch. For frontend developers.',
    tags: ['SVG', 'web-dev', 'tutorial'],
  },
  {
    slug: 'future-of-svg',
    title: 'The Future of SVG: Beyond Simple Icons, Exploring Infinite Possibilities',
    date: '2026-07-18',
    excerpt: 'SVG is no longer just tiny icons in the corner of a webpage. With modern browsers, SVG is reshaping web design in unprecedented ways. Discover the cutting-edge applications and future trends of SVG.',
    tags: ['SVG', 'design', 'web-dev'],
  },
  {
    slug: 'svg-filters-and-effects',
    title: 'Advanced SVG Filters and Effects: Unleashing Web Design Creativity',
    date: '2026-07-19',
    excerpt: 'Go beyond basic shapes! Dive deep into the powerful world of SVG filters and learn how to use feGaussianBlur, feColorMatrix, and feTurbulence for shadows, glows, glitch art, and organic textures.',
    tags: ['SVG', 'design', 'tutorial'],
  },
  {
    slug: 'svg-performance-engineering',
    title: 'SVG Performance Engineering: Editing 100,000-Node Vector Graphics in the Browser Without Freezing',
    date: '2026-08-06',
    excerpt: 'A 750KB vector map hides 3,143 DOM nodes. From the physics of node cost and Lighthouse thresholds, to AST-first editing, viewport culling with content-visibility, LOD path simplification, and the diff/patch/rAF/GPU update pipeline — the hardcore playbook for editing 100,000-node vector files without freezing the tab.',
    tags: ['SVG', 'optimization', 'web-dev', 'beginner'],
  },
]
