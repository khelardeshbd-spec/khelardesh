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

    // Remove any existing channel with the same name to prevent the singleton race condition
    const existingChannel = supabase.getChannels().find(c => c.topic === 'realtime:global_presence');
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
    }

    const channel = supabase.channel('global_presence', {
      config: {
        presence: {
          key: sessionId,
        },
      },
    });

    try {
      channel.on('presence', { event: 'sync' }, () => {
        // Sync happens when users join/leave
      });
    } catch (error) {
      console.warn('PresenceTracker: Channel already subscribed. Singleton race condition caught.', error);
    }

    channel.subscribe(async (status, err) => {
      if (status === 'SUBSCRIBED') {
        try {
          await channel.track({
            pathname,
            slug,
            onlineAt: new Date().toISOString(),
          });
        } catch (trackError) {
          console.error('PresenceTracker: Failed to track presence', trackError);
        }
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error(`PresenceTracker: Channel failed to connect (Status: ${status}).`, err);
        console.error('CRITICAL: Check if NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correctly set in the Vercel Production Environment Variables.');
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [pathname]);

  return null;
}
