'use client';

import { useEffect, useState } from 'react';

interface AdsterraAdProps {
  htmlCode?: string | null;
  type?: 'header' | 'homepage' | 'article';
}

export default function AdsterraAd({ type = 'homepage' }: AdsterraAdProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !type) return null;

  let width = 728;
  let height = 90;

  if (type === 'header') {
    width = 320;
    height = 50;
  } else if (type === 'article') {
    width = 300;
    height = 250;
  }

  return (
    <div className="w-full flex justify-center items-center my-4 overflow-hidden">
      <iframe
        src={`/api/ad?type=${type}`}
        width={width}
        height={height}
        style={{ border: 'none', overflow: 'hidden', display: 'block', maxWidth: '100%' }}
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}
