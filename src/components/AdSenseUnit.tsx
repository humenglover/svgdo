'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AdSenseUnitProps {
  adClient?: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function AdSenseUnit({
  adClient = 'ca-pub-8411665379717170',
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = 'true',
  style = { display: 'block' },
  className = '',
}: AdSenseUnitProps) {
  const pathname = usePathname();
  const isLoaded = React.useRef(false);

  useEffect(() => {
    if (isLoaded.current) return;
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        isLoaded.current = true;
        // @ts-ignore
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, [pathname]);

  return (
    <div className={`adsense-container my-8 w-full flex flex-col items-center justify-center border border-border-default/40 rounded-xl p-3 bg-bg-surface/50 ${className}`}>
      <span className="text-[10px] uppercase font-bold tracking-wider text-secondary/60 mb-1.5 self-start px-1">
        Advertisement
      </span>
      <div className="w-full min-h-[100px] overflow-hidden flex items-center justify-center">
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client={adClient}
          data-ad-slot={adSlot}
          data-ad-format={adFormat}
          data-full-width-responsive={fullWidthResponsive}
        />
      </div>
    </div>
  );
}
