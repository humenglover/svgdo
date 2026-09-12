import type { Metadata } from 'next';
import EditorPage from '@/components/EditorPage';

export const metadata: Metadata = {
  title: 'SVG Optimizer & Minifier Online - Fast & Free',
  description: 'Compress, clean, and minify SVG code online for free. Remove redundant metadata, optimize paths, and shrink vector file size without quality loss.',
  keywords: ['svg optimizer', 'svg minifier', 'compress svg', 'clean svg code', 'svg optimizer online', 'reduce svg size', 'svg cleaner online'],
  alternates: {
    canonical: 'https://svgdo.com/svg-optimizer/',
  },
};

export default function SvgOptimizerPage() {
  return <EditorPage />;
}
