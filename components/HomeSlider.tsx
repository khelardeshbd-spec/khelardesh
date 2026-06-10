'use client';

import { useState, useEffect } from 'react';
import LeadStory from './LeadStory';

export default function HomeSlider({ articles }: { articles: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 6000); // 6 seconds slide interval
    return () => clearInterval(timer);
  }, [articles.length]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="relative w-full">
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out" 
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {articles.map((article) => (
            <div key={article.id} className="w-full flex-shrink-0" style={{ padding: '0 2px' }}>
              <LeadStory article={article} />
            </div>
          ))}
        </div>
      </div>

      {articles.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {articles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                idx === currentIndex ? 'bg-[var(--ink)]' : 'bg-[var(--ink-border)] hover:bg-[var(--ink-muted)]'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
