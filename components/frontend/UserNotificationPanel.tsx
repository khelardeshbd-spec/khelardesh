'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Bell, MessageSquare, Heart, HeartOff, CheckCheck } from 'lucide-react';
import Link from 'next/link';
import ClientFormattedDate from './ClientFormattedDate';
import { supabase } from '@/lib/supabase';

interface UserNotif {
  id: number;
  type: string;
  commentId: number;
  actorName: string;
  isRead: boolean;
  createdAt: string;
  Comment: {
    articleSlug: string;
    body: string;
  };
}

export default function UserNotificationPanel() {
  const { data: session } = useSession();
  const [notifs, setNotifs] = useState<UserNotif[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = async () => {
    if (!session?.user) return;
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

  useEffect(() => {
    fetchNotifs();

    if (session?.user?.email) {
      const channel = supabase
        .channel(`user-notifs-${session.user.email.replace(/[^a-zA-Z0-9]/g, '')}`)
        .on(
          'postgres_changes',
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'UserNotification',
            filter: `userEmail=eq.${session.user.email}` 
          },
          () => {
            fetchNotifs();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
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

  const markAsRead = async (id: number) => {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    try {
      await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const unreadIds = notifs.filter(n => !n.isRead).map(n => n.id);
    if (unreadIds.length === 0) return;
    
    setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await fetch('/api/user/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: unreadIds })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  if (!session?.user) return null;

  return (
    <div className="relative" ref={panelRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[var(--ink-ghost)] transition-colors text-[var(--ink)] flex items-center justify-center"
        aria-label="Notifications"
      >
        <Bell size={18} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white border border-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[85vh]">
          <div className="p-4 border-b border-[var(--ink-border)] flex justify-between items-center bg-[var(--bg-page)]">
            <h3 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2" style={{ fontFamily: "var(--font-body)" }}>
              নোটিফিকেশন
              {unreadCount > 0 && (
                <span className="bg-[#d33f3f] text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[var(--ink-muted)] hover:text-[#d33f3f] transition-colors flex items-center gap-1"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 max-h-96">
            {notifs.length === 0 ? (
              <div className="p-8 text-center text-[var(--ink-muted)]">
                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>কোনো নোটিফিকেশন নেই</p>
              </div>
            ) : (
              <ul className="divide-y divide-[var(--ink-border)]">
                {notifs.map(n => {
                  let Icon = MessageSquare;
                  let color = 'text-blue-500';
                  let text = '';
                  if (n.type === 'LIKE') {
                    Icon = Heart;
                    color = 'text-[#d33f3f] fill-[#d33f3f]';
                    text = 'আপনার মন্তব্য পছন্দ করেছেন';
                  } else if (n.type === 'DISLIKE') {
                    Icon = HeartOff;
                    color = 'text-gray-500';
                    text = 'আপনার মন্তব্য অপছন্দ করেছেন';
                  } else if (n.type === 'REPLY') {
                    text = 'আপনার মন্তব্যের উত্তর দিয়েছেন';
                  }

                  const articleSlug = n.Comment?.articleSlug || '';

                  return (
                    <li key={n.id} className={`p-4 transition-colors hover:bg-[var(--ink-ghost)] ${!n.isRead ? 'bg-red-50/20' : ''}`}>
                      <Link 
                        href={`/article/${articleSlug}#comment-${n.commentId}`}
                        onClick={() => {
                          if (!n.isRead) markAsRead(n.id);
                          setIsOpen(false);
                        }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[var(--ink)] leading-snug" style={{ fontFamily: "var(--font-body)" }}>
                            <span className="font-bold">{n.actorName}</span> {text}
                          </p>
                          <p className="text-[10px] text-[var(--ink-muted)] mt-1 font-sans">
                            <ClientFormattedDate date={n.createdAt} mode="relative" lang="bn" />
                          </p>
                        </div>
                        {!n.isRead && <div className="w-2 h-2 rounded-full bg-[#d33f3f] flex-shrink-0 mt-1.5" />}
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
