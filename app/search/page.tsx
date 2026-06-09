'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ArticleCard from '@/components/ArticleCard';
import Link from 'next/link';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('Article')
        .select('*')
        .or(`headline.ilike.%${query}%,headlineBn.ilike.%${query}%,deck.ilike.%${query}%`)
        .order('publishedAt', { ascending: false })
        .limit(10);

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', padding: '120px 24px 48px' }}>
      <div className="max-w-[720px] mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1
            style={{
              fontFamily: "Georgia, 'Times New Roman', Times, serif",
              fontWeight: 900,
              fontSize: 'clamp(28px, 4vw, 36px)',
              color: 'var(--ink)',
            }}
          >
            অনুসন্ধান (Search)
          </h1>
          <Link
            href="/"
            style={{
              fontFamily: "'Kalpurush', sans-serif",
              fontSize: '14px',
              textDecoration: 'underline',
              color: 'var(--ink-muted)'
            }}
          >
            ফিরে যান (Back)
          </Link>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="খবর খুঁজুন (Search news...)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '16px',
              fontFamily: "'Kalpurush', sans-serif",
              border: '1.5px solid var(--ink)',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface)',
              color: 'var(--ink)',
              outline: 'none'
            }}
          />
          {loading && (
            <span style={{ position: 'absolute', right: 16, top: 14, color: 'var(--ink-muted)', fontFamily: "'Kalpurush', sans-serif" }}>
              খোঁজা হচ্ছে...
            </span>
          )}
        </div>

        <div>
          {results.length > 0 ? (
            <div className="flex flex-col gap-2">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            query.trim() && !loading && (
              <p style={{ color: 'var(--ink-muted)', fontFamily: "'Kalpurush', sans-serif" }}>
                কোনো খবর পাওয়া যায়নি।
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
