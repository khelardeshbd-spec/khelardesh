'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * useScrollDirection — Section 7
 * Returns true when the header/nav should be visible (scroll up or near top).
 * Returns false when scrolling down and away from top.
 */
export function useScrollDirection(): boolean {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY;
      // Always show header when near the top
      if (currentY < 60) {
        setVisible(true);
        lastY.current = currentY;
        return;
      }
      setVisible(currentY < lastY.current);
      lastY.current = currentY;
    };

    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return visible;
}
