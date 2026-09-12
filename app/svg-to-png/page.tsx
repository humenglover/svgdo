import type { Metadata } from 'next';
import EditorPage from '@/components/EditorPage';

export const metadata: Metadata = {
  title: 'SVG to PNG Converter - Free, High Resolution & Transparent',
  description: 'Convert SVG vector files to high-resolution PNG images with transparent background online for free. Fast, private in-browser processing with zero cloud uploads.',
  keywords: ['svg to png', 'svg to png converter', 'convert svg to png', 'svg to png transparent', 'svg to png high resolution', 'free svg to png online'],
  alternates: {
    canonical: 'https://svgdo.com/svg-to-png/',
  },
};

export default function SvgToPngPage() {
  return <EditorPage />;
}
