import type { Metadata } from 'next';
import EditorPage from '@/components/EditorPage';

export const metadata: Metadata = {
  title: 'Free Online SVG Editor | Edit, Optimize & Convert SVG to PNG - SVGDO',
  description: 'The ultimate free online SVG editor and optimizer. Edit SVG elements, change colors, resize, compress code, and convert SVG to PNG with transparent background. 100% private, zero uploads.',
  keywords: ['svg editor online', 'free svg editor', 'edit svg online', 'svg to png converter', 'svg optimizer online', 'clean svg code', 'svg viewer online', 'svg to png high resolution'],
  alternates: {
    canonical: 'https://svgdo.com/',
  },
};

export default function HomePage() {
  return <EditorPage />;
}
