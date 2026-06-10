'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ArticleCard from '@/components/ArticleCard';
import Masthead from '@/components/Masthead';

interface SearchResult {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  deck: string;
  sport: string;
  mediaType: string;
  mediaUrl: string;
  byline: string;
  publishedAt: string;
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!searchQuery.trim()) { 
      setResults([]); 
      setHasSearched(false);
      return; 
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);
      try {
        const { data } = await supabase
          .from('Article')
          .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
          .or(`headline.ilike.%${searchQuery}%,headlineBn.ilike.%${searchQuery}%,deck.ilike.%${searchQuery}%`)
          .order('publishedAt', { ascending: false })
          .limit(20);
        if (data) setResults(data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh' }}>
      <div className="max-w-[800px] mx-auto px-4 lg:px-6 py-8 pb-12">
        <div className="hidden lg:block mb-8">
          <Masthead />
        </div>
        
        {/* Search Input */}
        <div className="relative mb-8">
          <svg 
            width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="22" y2="22" />
          </svg>
          <input
            type="text"
            placeholder="খেলার খবর খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-[var(--bg-surface)] border border-[var(--ink-border)] outline-none text-[var(--ink)] py-3 pl-12 pr-4 transition-colors"
            style={{ 
              fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif", 
              fontSize: 16,
              borderRadius: 2 
            }}
            lang="bn"
          />
          {loading && (
            <span 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)]"
              style={{ fontFamily: "'Kalpurush', sans-serif", fontSize: 12 }}
            >
              খোঁজা হচ্ছে...
            </span>
          )}
        </div>

        {/* Results */}
        <div className="flex flex-col">
          {results.length > 0 ? (
            results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))
          ) : hasSearched && !loading ? (
            <div className="py-12 text-center text-[var(--ink-muted)]">
              <p
                lang="bn"
                style={{
                  fontFamily: "'Kalpurush', 'Hind Siliguri', sans-serif",
                  fontSize: 16,
                }}
              >
                কোনো ফলাফল পাওয়া যায়নি।
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
