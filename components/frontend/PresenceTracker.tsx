'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function PresenceTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generate a unique ID for this browser tab/session
    const sessionId = Math.random().toString(36).substring(2, 15);
    
    // Parse article ID if we are on an article page
    let articleId = null;
    const match = pathname ? pathname.match(/\/article\/([^\/]+)/) : null;
    const slug = match ? match[1] : null;

    const channel = supabase.channel('global_presence', {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    channel.on('presence', { event: 'sync' }, () => {
      // Sync happens when users join/leave
    });

    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          pathname,
          slug,
          onlineAt: new Date().toISOString(),
        });
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname]);

  return null;
}
