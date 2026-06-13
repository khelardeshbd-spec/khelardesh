'use client';

import { useEffect, useState } from 'react';

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: 'rgba(0,0,0,0.05)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <div 
        style={{
          height: '100%',
          width: `${scrollProgress}%`,
          backgroundColor: '#1a5c2e',
          transition: 'width 0.1s ease-out',
        }}
      />
    </div>
  );
}
