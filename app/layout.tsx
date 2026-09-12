import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CookieConsent } from '@/components/CookieConsent';
import { Toaster } from 'react-hot-toast';
import Script from 'next/script';

export const metadata: Metadata = {
  metadataBase: new URL('https://svgdo.com'),
  title: {
    default: 'Free Online SVG Editor | Edit, Optimize & Convert SVG to PNG - SVGDO',
    template: '%s - SVGDO',
  },
  description: 'The ultimate free online SVG editor and optimizer. Edit SVG elements, change colors, resize, compress code, and convert SVG to PNG with transparent background. 100% private, zero uploads.',
  keywords: ['svg editor online', 'free svg editor', 'edit svg online', 'svg to png converter', 'svg optimizer online', 'clean svg code', 'svg viewer online', 'svg to png high resolution', 'edit svg file online'],
  authors: [{ name: 'SVGDO Team' }],
  creator: 'SVGDO',
  publisher: 'SVGDO',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://svgdo.com/',
    siteName: 'SVGDO',
    title: 'Free Online SVG Editor | Edit, Optimize & Convert SVG to PNG - SVGDO',
    description: 'The ultimate free online SVG editor and optimizer. Edit SVG elements, change colors, resize, compress code, and convert SVG to PNG directly in your browser with zero cloud uploads.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SVGDO - Free Online SVG Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online SVG Editor | Edit, Optimize & Convert SVG to PNG - SVGDO',
    description: 'The ultimate free online SVG editor and optimizer. Edit SVG elements, change colors, resize, compress code, and convert SVG to PNG directly in your browser with zero cloud uploads.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://svgdo.com/#webapp',
      'name': 'SVGDO - Free Online SVG Editor',
      'url': 'https://svgdo.com/',
      'description': 'Free online browser-based SVG editor, optimizer, and SVG to PNG converter with zero cloud uploads and 100% privacy.',
      'applicationCategory': 'DesignApplication',
      'operatingSystem': 'All Web Browsers',
      'browserRequirements': 'Requires JavaScript and HTML5 Canvas support',
      'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
      },
      'featureList': [
        'Online SVG Visual & Code Editing',
        'SVG to PNG High Resolution Conversion with Transparent Background',
        'Safe & Aggressive SVG Compression / Minification',
        'Interactive SVG Element DOM Selection & Attribute Modification',
        '100% Client-Side In-Browser Execution'
      ]
    },
    {
      '@type': 'Organization',
      '@id': 'https://svgdo.com/#organization',
      'name': 'SVGDO',
      'url': 'https://svgdo.com/',
      'logo': 'https://svgdo.com/favicon.svg'
    }
  ]
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Google tag (gtag.js) */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-BR4Q68KZGR"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BR4Q68KZGR');
            `,
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8411665379717170"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-bg-base text-primary min-h-screen antialiased selection:bg-orange/30">
        <ThemeProvider>
          <Toaster position="top-center" />
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
