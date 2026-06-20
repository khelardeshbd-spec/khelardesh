'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/timeAgo';
import { supabase } from '@/lib/supabase';
import { CheckCheck, Bell, MessageSquare } from 'lucide-react';

interface Notification {
  id: number;
  type: string;
  articleSlug: string;
  commentId: number;
  actorName: string;
  actorEmail: string;
  read: boolean;
  createdAt: string;
  Comment: {
    body: string;
    createdAt: string;
    userImage?: string;
  };
}

export default function NotificationsClient() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/admin/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Subscribe to realtime inserts
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'AdminNotification' },
        (payload) => {
          // Re-fetch to get the joined Comment data
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markAsRead = async (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await fetch('/api/admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds })
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold text-[var(--ink)] mb-6 flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#d33f3f]" />
          Notifications
        </h1>
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)] flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
            <Bell className="w-6 h-6 text-[#d33f3f]" />
            অ্যাডমিন নোটিফিকেশন
          </h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1 font-sans">
            Live comment activity across all articles.
          </p>
        </div>
        
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-[var(--ink-border)] rounded shadow-sm hover:bg-gray-50 text-[var(--ink)] transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-green-600" />
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--ink-border)] rounded-lg bg-[var(--bg-surface)]">
          <Bell className="w-10 h-10 text-[var(--ink-muted)] mx-auto mb-3 opacity-50" />
          <p className="text-[var(--ink-muted)] font-semibold">কোনো নোটিফিকেশন নেই</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`p-4 rounded-lg border transition-all ${notif.read ? 'bg-transparent border-[var(--ink-border)] opacity-80' : 'bg-white border-[#d33f3f]/30 shadow-sm'}`}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1 border border-[var(--ink-border)] overflow-hidden">
                   {notif.Comment?.userImage ? (
                     <img src={notif.Comment.userImage} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <MessageSquare className="w-4 h-4 text-gray-500" />
                   )}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <p className="text-sm text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>
                        <span className="font-bold">{notif.actorName || 'Someone'}</span> commented on an article.
                      </p>
                      <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                        {timeAgo(notif.createdAt, 'bn')}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#d33f3f] flex-shrink-0 mt-1" />
                    )}
                  </div>
                  
                  {notif.Comment && (
                    <div className="mt-3 p-3 bg-[var(--bg-page)] rounded border border-[var(--ink-border)]">
                      <p className="text-sm text-[var(--ink-muted)] italic truncate">
                        &quot;{notif.Comment.body}&quot;
                      </p>
                    </div>
                  )}

                  <div className="mt-3 flex gap-3">
                    <Link
                      href={`/sport/article/${notif.articleSlug}#comment-${notif.commentId}`}
                      onClick={() => !notif.read && markAsRead(notif.id)}
                      className="text-xs font-bold text-[#d33f3f] hover:underline"
                    >
                      View Comment
                    </Link>
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-xs font-semibold text-[var(--ink-muted)] hover:text-[var(--ink)]"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
