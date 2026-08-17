import type { Metadata } from 'next';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import ArticleCard from '@/components/frontend/ArticleCard';
import ScrollToTopButton from '@/components/frontend/ScrollToTopButton';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { tag: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const rawTag = decodeURIComponent(params.tag).replace(/^#/, '');
  const canonicalUrl = `https://khelardesh.com/tag/${encodeURIComponent(rawTag)}`;
  const title = `#${rawTag} — সব খবর ও আপডেট | খেলারদেশ`;
  const description = `${rawTag} সংক্রান্ত খেলারদেশের সর্বশেষ খবর, আপডেট ও বিশ্লেষণ।`;

  return {
    title,
    description,
    keywords: [rawTag, 'খেলারদেশ', 'sports news Bangladesh', 'tag'],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title,
      description,
      siteName: 'খেলারদেশ',
      locale: 'bn_BD',
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-default.png'],
    },
  };
}

export default async function TagPage({ params }: PageProps) {
  const rawTag = decodeURIComponent(params.tag).replace(/^#/, '');

  const { data: articles, count } = await supabaseAdmin
    .from('Article')
    .select('id, slug, headline, headlineBn, deck, sport, kicker, mediaType, mediaUrl, byline, publishedAt, tags', { count: 'exact' })
    .eq('status', 'published')
    .ilike('tags', `%${rawTag}%`)
    .order('publishedAt', { ascending: false })
    .limit(30);

  const articlesList = articles ?? [];
  const totalCount = count ?? articlesList.length;

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', color: 'var(--ink)' }}>
      {/* Breadcrumb Header */}
      <div className="w-full max-w-[800px] mx-auto px-4 lg:px-6 pt-6 pb-2">
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
            <span className="text-[var(--ink-muted)]">ট্যাগ</span>
            <span>/</span>
            <span className="text-[#d33f3f] font-bold">
              #{rawTag}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-[800px] mx-auto px-4 lg:px-6 py-6 pb-16">
        {/* Tag Banner */}
        <div
          className="pb-4 mb-6 border-b border-[var(--ink-border)] flex items-end justify-between gap-4 flex-wrap"
        >
          <div>
            <span className="text-xs font-bold text-[var(--ink-muted)] uppercase tracking-wider block mb-1">
              ট্যাগ সংগ্রহশালা
            </span>
            <h1
              lang="bn"
              className="text-2xl sm:text-3xl font-black text-[var(--ink)]"
              style={{ fontFamily: 'var(--font-headline)' }}
            >
              #{rawTag}
            </h1>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-full text-[var(--ink-muted)]">
            মোট {totalCount} টি প্রতিবেদন
          </span>
        </div>

        {/* Article Feed */}
        {articlesList.length > 0 ? (
          <div className="space-y-4">
            {articlesList.map((article) => (
              <div key={article.id}>
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-xl my-6 p-8">
            <p className="text-sm text-[var(--ink-muted)] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
              এই ট্যাগে বর্তমানে কোনো সংবাদ পাওয়া যায়নি।
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-xs font-bold text-[#d33f3f] hover:underline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              ← প্রচ্ছদে ফিরে যান
            </Link>
          </div>
        )}
      </main>

      <ScrollToTopButton />
    </div>
  );
}
