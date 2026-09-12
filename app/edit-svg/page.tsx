import type { Metadata } from 'next';
import EditorPage from '@/components/EditorPage';

export const metadata: Metadata = {
  title: 'Edit SVG Online - Free Vector Graphics Editor',
  description: 'Edit SVG files online directly in your browser. Modify vector shapes, colors, strokes, and transforms with zero software install and 100% client-side privacy.',
  keywords: ['edit svg', 'edit svg online', 'edit svg file online', 'online svg editor free', 'change svg color online', 'free svg editor'],
  alternates: {
    canonical: 'https://svgdo.com/edit-svg/',
  },
};

export default function EditSvgPage() {
  return <EditorPage />;
}
