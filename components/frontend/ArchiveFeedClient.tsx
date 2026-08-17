'use client';

import { useState, useEffect, useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { Calendar, Search, Filter, RotateCcw } from 'lucide-react';

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
  tags?: string | null;
}

interface Props {
  initialSport?: string;
  initialDate?: string;
  initialQuery?: string;
}

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'সব বিভাগ' },
  { value: 'football', label: 'ফুটবল' },
  { value: 'bd-football', label: 'দেশের ফুটবল' },
  { value: 'international-football', label: 'আন্তর্জাতিক ফুটবল' },
  { value: 'club-football', label: 'ক্লাব ফুটবল' },
  { value: 'world-cup-2026', label: 'বিশ্বকাপ ২০২৬' },
  { value: 'cricket', label: 'ক্রিকেট' },
  { value: 'bd-cricket', label: 'বাংলাদেশের ক্রিকেট' },
  { value: 'tennis', label: 'টেনিস' },
  { value: 'basketball', label: 'বাস্কেটবল' },
  { value: 'f1', label: 'ফর্মুলা ওয়ান' },
  { value: 'interview', label: 'ইন্টারভিউ' },
  { value: 'feature', label: 'ফিচার' },
  { value: 'special', label: 'খেলার দেশ বিশেষ' },
  { value: 'guest-column', label: 'অতিথি কলাম' },
  { value: 'other', label: 'অন্যান্য' },
];

export default function ArchiveFeedClient({ initialSport = 'all', initialDate = '', initialQuery = '' }: Props) {
  const [sport, setSport] = useState(initialSport);
  const [date, setDate] = useState(initialDate);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchArchive = useCallback(async (targetPage: number = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(targetPage));
      params.set('pageSize', '20');

      if (sport && sport !== 'all') params.set('sport', sport);
      if (date) params.set('date', date);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/articles?${params.toString()}`);
      if (!res.ok) throw new Error('Fetch failed');
      const data = await res.json() as any;

      setArticles(data.articles ?? []);
      setPage(data.pagination?.page ?? 1);
      setTotalPages(data.pagination?.totalPages ?? 1);
      setTotalCount(data.pagination?.total ?? 0);
    } catch (err) {
      console.error('Error fetching archive:', err);
    } finally {
      setLoading(false);
    }
  }, [sport, date, searchQuery]);

  useEffect(() => {
    fetchArchive(1);
  }, [fetchArchive]);

  const handleReset = () => {
    setSport('all');
    setDate('');
    setSearchQuery('');
  };

  // Quick date presets
  const setQuickDate = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    setDate(dateStr);
  };

  return (
    <div>
      {/* Filter Toolbar Card */}
      <div className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[var(--ink-border)]">
          <Filter size={18} className="text-[#d33f3f]" />
          <h2 className="text-sm font-bold text-[var(--ink)]" style={{ fontFamily: 'var(--font-body)' }}>
            আর্কাইভ ফিল্টার (Archive Search & Filters)
          </h2>
          {(sport !== 'all' || date || searchQuery) && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-xs text-[var(--ink-muted)] hover:text-[#d33f3f] flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              ফিল্টার রিসেট
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Category Dropdown */}
          <div>
            <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1.5" style={{ fontFamily: 'var(--font-body)' }}>
              বিভাগ নির্বাচন করুন:
            </label>
            <select
              value={sport}
              onChange={(e) => setSport(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f]"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1.5" style={{ fontFamily: 'var(--font-body)' }}>
              তারিখ নির্বাচন করুন:
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f]"
              />
            </div>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="text-xs font-semibold text-[var(--ink-muted)] block mb-1.5" style={{ fontFamily: 'var(--font-body)' }}>
              কীওয়ার্ড / শিরোনাম দিয়ে খুঁজুন:
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="যেমন: বিশ্বকাপ, মেসি, বিপিএল..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') fetchArchive(1);
                }}
                className="w-full p-2.5 pr-8 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-page)] text-[var(--ink)] text-xs focus:outline-none focus:border-[#d33f3f]"
                style={{ fontFamily: 'var(--font-body)' }}
              />
              <Search size={14} className="absolute right-2.5 top-3 text-[var(--ink-muted)] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Quick Date Presets */}
        <div className="mt-4 pt-3 border-t border-[var(--ink-border)] flex items-center gap-2 flex-wrap text-xs text-[var(--ink-muted)]">
          <Calendar size={13} className="text-[#d33f3f]" />
          <span className="font-semibold text-[11px]">দ্রুত নির্বাচন:</span>
          <button
            type="button"
            onClick={() => setQuickDate(0)}
            className={`px-2.5 py-1 rounded text-xs border transition-colors ${date === new Date().toISOString().split('T')[0] ? 'bg-[#d33f3f] text-white border-[#d33f3f]' : 'border-[var(--ink-border)] bg-[var(--bg-page)] hover:border-[#d33f3f]'}`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            আজকের খবর
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(1)}
            className="px-2.5 py-1 rounded text-xs border border-[var(--ink-border)] bg-[var(--bg-page)] hover:border-[#d33f3f] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            গতকাল
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(2)}
            className="px-2.5 py-1 rounded text-xs border border-[var(--ink-border)] bg-[var(--bg-page)] hover:border-[#d33f3f] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            ২ দিন আগে
          </button>
          <button
            type="button"
            onClick={() => setQuickDate(7)}
            className="px-2.5 py-1 rounded text-xs border border-[var(--ink-border)] bg-[var(--bg-page)] hover:border-[#d33f3f] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            ১ সপ্তাহ আগে
          </button>
          {date && (
            <button
              type="button"
              onClick={() => setDate('')}
              className="text-[#d33f3f] text-[11px] underline ml-2"
            >
              তারিখ ফিল্টার মুছুন
            </button>
          )}
        </div>
      </div>

      {/* Result Status Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--ink-border)]">
        <span className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider" style={{ fontFamily: 'var(--font-body)' }}>
          {loading ? 'অনুসন্ধান চলছে...' : `মোট ${totalCount} টি সংবাদ পাওয়া গেছে`}
        </span>
        {totalPages > 1 && (
          <span className="text-xs text-[var(--ink-muted)]">
            পৃষ্ঠা {page} / {totalPages}
          </span>
        )}
      </div>

      {/* Articles Feed */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#d33f3f]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-xs text-[var(--ink-muted)] font-semibold" style={{ fontFamily: 'var(--font-body)' }}>
            আর্কাইভ থেকে খবর লোড হচ্ছে...
          </p>
        </div>
      ) : articles.length > 0 ? (
        <div className="space-y-3">
          {articles.map((article) => (
            <div key={article.id}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl my-6 p-8">
          <Calendar size={40} className="mx-auto text-[var(--ink-muted)] mb-3 opacity-40" />
          <p className="text-sm font-bold text-[var(--ink)] mb-1" style={{ fontFamily: 'var(--font-body)' }}>
            নির্বাচিত ফিল্টারে কোনো সংবাদ পাওয়া যায়নি।
          </p>
          <p className="text-xs text-[var(--ink-muted)] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
            অনুগ্রহ করে অন্য কোনো তারিখ বা বিভাগ নির্বাচন করে দেখুন।
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-[var(--ink)] text-[var(--bg-page)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            সব ফিল্টার রিসেট করুন
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && !loading && (
        <div className="mt-10 flex items-center justify-center gap-3">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => fetchArchive(page - 1)}
            className="px-4 py-2 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-surface)] text-xs font-bold disabled:opacity-30 hover:bg-[var(--ink)] hover:text-[var(--bg-page)] transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            ← পূর্ববর্তী পৃষ্ঠা
          </button>
          
          <span className="text-xs font-bold text-[var(--ink-muted)]">
            পৃষ্ঠা {page} / {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => fetchArchive(page + 1)}
            className="px-4 py-2 rounded-lg border border-[var(--ink-border)] bg-[var(--bg-surface)] text-xs font-bold disabled:opacity-30 hover:bg-[var(--ink)] hover:text-[var(--bg-page)] transition-all"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            পরবর্তী পৃষ্ঠা →
          </button>
        </div>
      )}
    </div>
  );
}
