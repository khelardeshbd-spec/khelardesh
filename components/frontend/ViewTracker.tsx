'use client';

import { useEffect, useRef } from 'react';

export default function ViewTracker({ articleId }: { articleId: number }) {
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    
    // Only track once per component mount
    hasTracked.current = true;
    
    fetch('/api/analytics/view', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ articleId }),
    }).catch(console.error);
    
  }, [articleId]);

  return null;
}
