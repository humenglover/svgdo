import type { Metadata } from 'next';
import EditorPage from '@/components/EditorPage';

export const metadata: Metadata = {
  title: 'Online SVG Viewer & Code Inspector - Free & Secure',
  description: 'View and inspect SVG vector files and raw code instantly in your browser. Pan, zoom, select DOM elements and preview vector designs with zero uploads.',
  keywords: ['svg viewer', 'online svg viewer', 'svg viewer from code', 'open svg file online', 'svg inspector', 'view svg online free'],
  alternates: {
    canonical: 'https://svgdo.com/svg-viewer/',
  },
};

export default function SvgViewerPage() {
  return <EditorPage />;
}
