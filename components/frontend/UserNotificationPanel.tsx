'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, Check } from 'lucide-react';
import Link from 'next/link';
import { timeAgo } from '@/lib/timeAgo';

interface UserNotif {
  id: number;
  type: string;
  commentId: number;
  actorName: string;
  isRead: boolean;
  createdAt: string;
  Comment: {
    articleSlug: string;
  };
}

export default function UserNotificationPanel() {
  const { data: session } = useSession();
  const [notifs, setNotifs] = useState<UserNotif[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      fetchNotifs();
    }
  }, [session]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifs = async () => {
    try {
      const res = await fetch('/api/user/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifs(data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching user notifs', err);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      await fetch(`/api/user/notifications/${id}/read`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  if (!session) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[var(--ink-ghost)] transition-colors text-[var(--ink)]"
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-3 border-b border-[var(--ink-border)] flex justify-between items-center bg-[var(--bg-page)]">
            <h3 className="text-sm font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>Notifications</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="p-6 text-center text-xs text-[var(--ink-muted)]">
                No new notifications.
              </div>
            ) : (
              <ul className="divide-y divide-[var(--ink-border)]">
                {notifs.map(n => {
                  let text = '';
                  if (n.type === 'LIKE') text = 'liked your comment.';
                  else if (n.type === 'DISLIKE') text = 'disliked your comment.';
                  else if (n.type === 'REPLY') text = 'replied to your comment.';

                  return (
                    <li key={n.id} className={`p-3 transition-colors hover:bg-[var(--ink-ghost)] ${!n.isRead ? 'bg-blue-50/20' : ''}`}>
                      <Link 
                        href={`/article/${n.Comment?.articleSlug || ''}#comments`}
                        onClick={() => {
                          markAsRead(n.id);
                          setIsOpen(false);
                        }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-1">
                          <p className="text-xs text-[var(--ink)] leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                            <span className="font-bold">{n.actorName}</span> {text}
                          </p>
                          <p className="text-[10px] text-[var(--ink-muted)] mt-1">
                            {timeAgo(n.createdAt, 'en')}
                          </p>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
