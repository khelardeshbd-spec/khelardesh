'use client';

import { useState, useEffect } from 'react';

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

export default function BookmarkButton({ article }: { article: Article }) {
  const [isSaved, setIsSaved] = useState(false);

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

  return (
    <button
      onClick={toggleBookmark}
      aria-label={isSaved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
      title={isSaved ? "সংরক্ষণ বাতিল করুন" : "সংরক্ষণ করুন"}
      className="text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors p-1"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
