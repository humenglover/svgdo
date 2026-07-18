import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AdSenseUnitProps {
  adClient?: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSenseUnit({
  adClient = 'ca-pub-8411665379717170', // Auto-detected from index.html
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = 'true',
  style = { display: 'block' },
  className = '',
}: AdSenseUnitProps) {
  const location = useLocation();

  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [location.pathname]); // Re-trigger when the route changes

  return (
    <div className={`adsense-container ${className}`} style={{ minHeight: '100px', width: '100%', overflow: 'hidden' }}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adClient}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
}
