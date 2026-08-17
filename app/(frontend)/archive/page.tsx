import type { Metadata } from 'next';
import Link from 'next/link';
import ArchiveFeedClient from '@/components/frontend/ArchiveFeedClient';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'খবরের আর্কাইভ — খেলারদেশ',
  description: 'খেলারদেশের সকল পুরোনো ও অতীত ক্রীড়া সংবাদ, তারিখ অনুযায়ী খবর এবং প্রতিবেদন সংগ্রহশালা।',
  openGraph: {
    title: 'খবরের আর্কাইভ — খেলারদেশ',
    description: 'খেলারদেশের সকল পুরোনো ও অতীত ক্রীড়া সংবাদ, তারিখ অনুযায়ী খবর এবং প্রতিবেদন সংগ্রহশালা।',
    url: 'https://khelardesh.com/archive',
    siteName: 'খেলারদেশ',
    locale: 'bn_BD',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'খবরের আর্কাইভ — খেলারদেশ' }],
  },
};

interface PageProps {
  searchParams: {
    sport?: string;
    date?: string;
    q?: string;
  };
}

export default function ArchivePage({ searchParams }: PageProps) {
  const initialSport = searchParams.sport || 'all';
  const initialDate = searchParams.date || '';
  const initialQuery = searchParams.q || '';

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Breadcrumbs Header */}
      <div className="w-full max-w-[900px] mx-auto px-4 lg:px-6 pt-6 pb-2">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-[var(--ink)] hover:bg-[var(--ink-ghost)] transition-colors bg-[var(--bg-surface)] border border-[var(--ink-border)] px-3 py-1.5 rounded-full"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            ফিরে যান
          </Link>

          <div
            className="flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--ink-muted)]"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">
              মাঠ
            </Link>
            <span>/</span>
            <span className="text-[#d33f3f] font-bold">
              আর্কাইভ
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto px-4 lg:px-6 py-6 pb-16">
        {/* Page Title */}
        <div className="pb-4 mb-6 border-b-2 border-[var(--ink)] flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1
              lang="bn"
              className="text-2xl sm:text-3xl font-black text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              সংবাদ আর্কাইভ ও সংগ্রহশালা
            </h1>
            <p className="text-xs text-[var(--ink-muted)] mt-1" style={{ fontFamily: 'var(--font-body)' }}>
              তারিখ, বিভাগ বা কীওয়ার্ড নির্বাচন করে খেলারদেশের অতীতের সমস্ত ক্রীড়া সংবাদ খুঁজুন।
            </p>
          </div>
        </div>

        {/* Interactive Filter and Feed Client */}
        <ArchiveFeedClient
          initialSport={initialSport}
          initialDate={initialDate}
          initialQuery={initialQuery}
        />
      </main>

      <ScrollToTopButton />
    </div>
  );
}
