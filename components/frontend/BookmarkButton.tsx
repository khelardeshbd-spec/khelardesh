'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
  sport: string;
  mediaType: string;
  mediaUrl: string;
  byline: string;
  publishedAt: Date | string;
}

export default function BookmarkButton({ 
  article, 
  variant = 'default' 
}: { 
  article: Article; 
  variant?: 'default' | 'circle';
}) {
  const [isSaved, setIsSaved] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('khelardesh_saved') || '[]');
      setIsSaved(saved.some((a: Article) => a.id === article.id));
    } catch (err) {
      console.error(err);
    }
  }, [article.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation if inside a Link
    
    if (!session) {
      signIn('google');
      return;
    }

    try {
      let saved = JSON.parse(localStorage.getItem('khelardesh_saved') || '[]');
      if (isSaved) {
        saved = saved.filter((a: Article) => a.id !== article.id);
      } else {
        // ensure we don't save duplicate and keep it clean
        saved.push(article);
      }
      localStorage.setItem('khelardesh_saved', JSON.stringify(saved));
      setIsSaved(!isSaved);
      // Optional: dispatch custom event so other components could listen
      window.dispatchEvent(new Event('khelardesh_saved_changed'));
    } catch (err) {
      console.error('Failed to toggle bookmark', err);
    }
  };

  const buttonClasses = variant === 'circle'
    ? "w-8 h-8 rounded-full flex items-center justify-center border hover:bg-[var(--ink-ghost)] transition-colors cursor-pointer text-[var(--ink-muted)] hover:text-[var(--ink)] flex-shrink-0"
    : "text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors p-1";

  const buttonStyles = variant === 'circle'
    ? {
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--ink-border)',
      }
    : undefined;

  return (
    <button
      onClick={toggleBookmark}
      aria-label={isSaved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
      title={isSaved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
      className={buttonClasses}
      style={buttonStyles}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
