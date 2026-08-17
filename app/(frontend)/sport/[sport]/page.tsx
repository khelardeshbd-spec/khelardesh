import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase';
import LeadStory from '@/components/frontend/LeadStory';
import ArticleCard from '@/components/frontend/ArticleCard';
import SponsorBlock from '@/components/frontend/SponsorBlock';
import Sidebar from '@/components/frontend/Sidebar';
import Masthead from '@/components/frontend/Masthead';
import BriefsColumn from '@/components/frontend/BriefsColumn';

export const dynamic = 'force-dynamic';




interface PageProps {
  params: { sport: string };
}

const SPORT_NAMES: Record<string, string> = {
  football: 'ফুটবল',
  'bd-football': 'দেশের ফুটবল',
  'club-football': 'পাড়া মহল্লার ফুটবল',
  'international-football': 'বিদেশের ফুটবল',
  'world-cup-2026': 'ফুটবল বিশ্বকাপ ২০২৬',
  cricket: 'ক্রিকেট',
  'bd-cricket': 'দেশের ক্রিকেট',
  'international-cricket': 'বিদেশের ক্রিকেট',
  'local-cricket': 'পাড়া মহল্লার ক্রিকেট',
  basketball: 'বাস্কেটবল',
  tennis: 'টেনিস',
  f1: 'ফর্মুলা ওয়ান',
  'table-tennis': 'টেবিল টেনিস',
  golf: 'গল্ফ',
  rugby: 'রাগবি',
  athletics: 'অ্যাথলেটিক্স',
  interview: 'ইন্টারভিউ',
  feature: 'ফিচার',
  special: 'খেলার দেশ বিশেষ',
  'guest-column': 'অতিথি কলাম',
  'on-this-day': 'এই দিনে',
  other: 'অন্যান্য',
};

const VALID_SPORTS = Object.keys(SPORT_NAMES);


export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sportBn = SPORT_NAMES[params.sport];
  if (!sportBn) return { title: 'Sport Not Found' };

  const canonicalUrl = `https://khelardesh.com/sport/${params.sport}`;
  const description = `${sportBn} সংক্রান্ত সর্বশেষ খবর, বিশ্লেষণ ও আপডেট — খেলারদেশে পড়ুন।`;

  return {
    title: `${sportBn} | খেলারদেশ`,
    description,
    keywords: [sportBn, 'খেলারদেশ', 'sports news Bangladesh', params.sport],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${sportBn} — খেলারদেশ`,
      description,
      siteName: 'খেলারদেশ',
      locale: 'bn_BD',
      images: [{ url: '/og-default.png', width: 1200, height: 630, alt: `${sportBn} — খেলারদেশ` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${sportBn} — খেলারদেশ`,
      description,
      images: ['/og-default.png'],
    },
  };
}



/**
 * Sport-filtered feed page — Section 4
 * Same layout as homepage but filtered to one sport
 */
const SPORT_MAPPING: Record<string, string[]> = {
  football: ['football', 'bd-football', 'international-football', 'club-football', 'world-cup-2026'],
  cricket: ['cricket', 'bd-cricket', 'international-cricket', 'local-cricket'],
  other: ['other', 'basketball', 'rugby', 'f1', 'table-tennis', 'golf', 'tennis', 'athletics'],
};

import CategoryFeedWithLoadMore from '@/components/frontend/CategoryFeedWithLoadMore';

export default async function SportPage({ params }: PageProps) {
  if (!VALID_SPORTS.includes(params.sport)) notFound();

  const sportsToQuery = SPORT_MAPPING[params.sport] || [params.sport];

  const [{ data: leadArr }, { data: articles }, { data: scores }, { data: sponsors }] = await Promise.all([
    supabaseAdmin
      .from('Article')
      .select('*')
      .in('sport', sportsToQuery)
      .eq('isLead', true)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(1),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .in('sport', sportsToQuery)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(20),
    supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .eq('is_visible', true)
      .order('isLive', { ascending: false })
      .order('displayOrder', { ascending: true }),
    supabaseAdmin
      .from('Sponsor')
      .select('*')
      .eq('isActive', true)
      .order('displayOrder', { ascending: true }),
  ]);

  const lead = leadArr?.[0] ?? null;
  const articlesList = articles ?? [];
  const sportBn = SPORT_NAMES[params.sport];

  return (
    <div style={{ backgroundColor: 'var(--bg-page)', minHeight: '100vh', color: 'var(--ink)' }}>
      
      {/* Back button / Breadcrumbs */}
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
            <span className="text-[#1a5c2e] font-bold">
              {sportBn}
            </span>
          </div>
        </div>
      </div>

      {/* Main Feed Container */}
      <div className="max-w-[800px] mx-auto px-4 lg:px-6 pb-16">
        <div className="pt-6">
          {/* Sport heading */}
          <div
            className="pb-3 mb-6 flex items-center justify-between border-b-2 border-[var(--ink)]"
          >
            <h1
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 900,
                fontSize: 'clamp(26px, 4vw, 36px)',
                letterSpacing: '-0.01em',
                color: 'var(--ink)',
                marginBottom: 0,
              }}
            >
              <span lang="bn">{sportBn}</span>
            </h1>
            <Link
              href={`/archive?sport=${encodeURIComponent(params.sport)}`}
              className="text-xs font-bold text-[#d33f3f] hover:underline"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              পুরোনো আর্কাইভ →
            </Link>
          </div>

          {lead && <div className="mb-8 mt-2"><LeadStory article={lead} /></div>}

          <CategoryFeedWithLoadMore
            initialArticles={articlesList}
            sport={params.sport}
            sportsToQuery={sportsToQuery}
            sportBn={sportBn}
          />
        </div>
      </div>
    </div>
  );
}
