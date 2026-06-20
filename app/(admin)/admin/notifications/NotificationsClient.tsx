'use client';

import { useState } from 'react';
import Link from 'next/link';
import { timeAgo } from '@/lib/timeAgo';
import { Check, CheckCircle2, MessageSquare } from 'lucide-react';

interface CommentNotif {
  id: number;
  articleSlug: string;
  userEmail: string;
  userName: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsClient({ initialNotifs }: { initialNotifs: CommentNotif[] }) {
  const [notifs, setNotifs] = useState(initialNotifs);

  const markAsRead = async (id: number) => {
    try {
      setNotifs(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      await fetch(`/api/admin/notifications/${id}/read`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifs(prev => prev.map(n => ({ ...n, isRead: true })));
      await fetch(`/api/admin/notifications/read-all`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>
            Notifications
          </h1>
          <p className="text-sm text-[var(--ink-muted)] mt-1" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
            You have {unreadCount} unread comment{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-white border border-[var(--ink-border)] rounded-md hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Check size={16} /> Mark all as read
          </button>
        )}
      </div>

      <div className="border border-[var(--ink-border)] rounded-xl bg-white shadow-sm overflow-hidden">
        {notifs.length === 0 ? (
          <div className="p-8 text-center text-[var(--ink-muted)] text-sm">
            No notifications yet.
          </div>
        ) : (
          <ul className="divide-y divide-[var(--ink-border)]">
            {notifs.map((notif) => (
              <li 
                key={notif.id} 
                className={`p-4 transition-colors hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-full mt-1 ${!notif.isRead ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                    <MessageSquare size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[var(--ink)]" style={{ fontFamily: "var(--font-body)" }}>
                      <span className="font-bold">{notif.userName || notif.userEmail}</span> commented on an article.
                    </p>
                    <p className="text-xs text-[var(--ink-muted)] mt-0.5">
                      {timeAgo(notif.createdAt, 'en')}
                    </p>
                    <div className="mt-2 p-3 bg-[var(--bg-page)] rounded-md border border-[var(--ink-border)] text-sm text-[var(--ink)]" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
                      &quot;{notif.body}&quot;
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <Link 
                        href={`/article/${notif.articleSlug}#comments`}
                        onClick={() => markAsRead(notif.id)}
                        target="_blank"
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                      >
                        View Comment
                      </Link>
                      {!notif.isRead && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="text-xs font-semibold text-gray-500 hover:text-gray-800 flex items-center gap-1 transition-colors"
                        >
                          <CheckCircle2 size={14} /> Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                  {!notif.isRead && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
