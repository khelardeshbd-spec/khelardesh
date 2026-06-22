import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseAdmin } from '@/lib/supabase';
import HeroSlideshow from '@/components/frontend/HeroSlideshow';
import LeadStory from '@/components/frontend/LeadStory';
import HomeSlider from '@/components/frontend/HomeSlider';
import ArticleCard from '@/components/frontend/ArticleCard';
import ScoresStrip from '@/components/frontend/ScoresStrip';
import SponsorBlock from '@/components/frontend/SponsorBlock';
import Sidebar from '@/components/frontend/Sidebar';
import SkeletonCard from '@/components/frontend/SkeletonCard';
import BriefsColumn from '@/components/frontend/BriefsColumn';
import { MotionDiv } from '@/components/frontend/MotionDiv';
import { staggerContainer, fadeUp } from '@/lib/animations';
import CategoryColumnFeed from '@/components/frontend/CategoryColumnFeed';
import LowerSection from '@/components/frontend/LowerSection';
import ProfileMenu from '@/components/frontend/ProfileMenu';
import HomeNav from '@/components/frontend/HomeNav';
import LiveDate from '@/components/frontend/LiveDate';

export const dynamic = 'force-dynamic';




export const metadata: Metadata = {
  title: 'খেলারদেশ | Bangla Sports News | বাংলা স্পোর্টস নিউজ',
  description: 'বাংলাদেশের নির্ভরযোগ্য স্পোর্টস নিউজ পোর্টাল। ফুটবল, ক্রিকেট, টেনিস সহ দেশ ও বিদেশের সব খেলার সর্বশেষ খবর (Bangla Sports News) এবং লাইভ আপডেট পান খেলারদেশে।',
  alternates: { canonical: 'https://khelardesh.com' },
  openGraph: {
    type: 'website',
    url: 'https://khelardesh.com',
    title: 'খেলারদেশ | Bangla Sports News | বাংলা স্পোর্টস নিউজ',
    description: 'দেশের নির্ভরযোগ্য স্পোর্টস নিউজ পোর্টাল। ফুটবল, ক্রিকেট সহ সব খেলার সর্বশেষ খবর এবং লাইভ আপডেট।',
    images: [{ url: '/og-default.png', width: 1200, height: 630, alt: 'খেলারদেশ - Bangla Sports News' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'খেলারদেশ | Bangla Sports News',
    description: 'দেশের সেরা স্পোর্টস নিউজ পোর্টাল। সব খেলার সর্বশেষ খবর (Bangla Sports News)।',
    images: ['/og-default.png'],
  },
};

export const revalidate = 30; // ISR every 30 seconds

/**
 * Homepage — Section 4 / 8
 * Mobile: Lead → Scores strip → Story feed (sponsor every 3rd)
 * Desktop: 2fr main + 1fr sidebar
 */
export default async function HomePage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);

  // Fetch data server-side via Supabase
  const [
    leadResult,
    footballResult,
    cricketResult,
    interviewResult,
    featureResult,
    specialResult,
    guestResult,
    othersResult,
    didYouKnowResult,
    onThisDayResult,
    scoresResult,
    sponsorsResult
  ] = await Promise.allSettled([
    supabaseAdmin
      .from('Article')
      .select('*')
      .eq('isLead', true)
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(4),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .in('sport', ['football', 'bd-football', 'international-football', 'club-football'])
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .in('sport', ['cricket', 'bd-cricket', 'international-cricket', 'local-cricket'])
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', 'interview')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', 'feature')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', 'special')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', 'guest-column')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .in('sport', ['others', 'other', 'basketball', 'tennis', 'f1', 'rugby', 'athletics', 'table-tennis', 'golf'])
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(10),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', 'did-you-know')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(5),
    supabaseAdmin
      .from('Article')
      .select('id, slug, headline, headlineBn, deck, sport, mediaType, mediaUrl, byline, publishedAt')
      .eq('sport', 'on-this-day')
      .eq('status', 'published')
      .order('publishedAt', { ascending: false })
      .limit(5),
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

  const leads = leadResult.status === 'fulfilled' ? (leadResult.value.data ?? []) : [];

  // TODO: Remove this mock data after testing the slideshow
  if (leads.length > 0 && leads.length < 3) {
    leads.push({
      ...leads[0],
      id: 998,
      slug: 'test-cricket-match',
      headlineBn: 'বাংলাদেশ বনাম ভারত: মিরপুরে রোমাঞ্চকর জয়',
      deck: 'মিরপুর শেরেবাংলা স্টেডিয়ামে ভারতের বিপক্ষে দুর্দান্ত জয় পেয়েছে বাংলাদেশ। শেষ ওভারে দরকার ছিল ১২ রান, এবং চমৎকার ব্যাটিংয়ে সেই লক্ষ্য পূরণ করে টাইগাররা।',
      sport: 'cricket',
      mediaUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=2862&auto=format&fit=crop'
    });
    leads.push({
      ...leads[0],
      id: 999,
      slug: 'test-football-messi',
      headlineBn: 'মেসির নতুন ম্যাজিক, ইন্টার মায়ামির জয়',
      deck: 'মেজর লিগ সকারে আবারও লিওনেল মেসির পায়ের জাদু। তার দুর্দান্ত ফ্রি-কিক গোলে নিশ্চিত পরাজয় থেকে রক্ষা পেল ইন্টার মায়ামি।',
      sport: 'football',
      mediaUrl: 'https://images.unsplash.com/photo-1518605368461-1e1296cb3b5e?q=80&w=2940&auto=format&fit=crop'
    });
  }
  const footballArticles = footballResult.status === 'fulfilled' ? (footballResult.value.data ?? []) : [];
  const cricketArticles = cricketResult.status === 'fulfilled' ? (cricketResult.value.data ?? []) : [];
  const interviewArticles = interviewResult.status === 'fulfilled' ? (interviewResult.value.data ?? []) : [];
  const featureArticles = featureResult.status === 'fulfilled' ? (featureResult.value.data ?? []) : [];
  const specialArticles = specialResult.status === 'fulfilled' ? (specialResult.value.data ?? []) : [];
  const guestArticles = guestResult.status === 'fulfilled' ? (guestResult.value.data ?? []) : [];
  const othersArticles = othersResult.status === 'fulfilled' ? (othersResult.value.data ?? []) : [];
  const didYouKnowArticles = didYouKnowResult.status === 'fulfilled' ? (didYouKnowResult.value.data ?? []) : [];
  const onThisDayArticles = onThisDayResult.status === 'fulfilled' ? (onThisDayResult.value.data ?? []) : [];
  const scores = scoresResult.status === 'fulfilled' ? (scoresResult.value.data ?? []) : [];
  const sponsors = sponsorsResult.status === 'fulfilled' ? (sponsorsResult.value.data ?? []) : [];

  const inlineSponsors = sponsors.filter((s) => s.placement === 'inline');
  const leftSponsor = sponsors.find((s) => s.placement === 'header-left');
  const rightSponsor = sponsors.find((s) => s.placement === 'header-right');
  const hpBanner1 = sponsors.find((s) => s.placement === 'homepage-banner-1');
  const hpBanner2 = sponsors.find((s) => s.placement === 'homepage-banner-2');
  const hpBanner3 = sponsors.find((s) => s.placement === 'homepage-banner-3');
  const hpBanner4 = sponsors.find((s) => s.placement === 'homepage-banner-4');
  const hpBanner5 = sponsors.find((s) => s.placement === 'homepage-banner-5');
  const hpBanner6 = sponsors.find((s) => s.placement === 'homepage-banner-6');

  const showLeft = !!(leftSponsor && leftSponsor.imageUrl);
  const showRight = !!(rightSponsor && rightSponsor.imageUrl);

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#121212', minHeight: '100vh', padding: '8px 0', fontFamily: 'var(--font-body)' }}>
      <div className="max-w-[1200px] mx-auto bg-[#ffffff] px-6 py-2" id="main-constrained">

        {/* MASTHEAD: LOGO ON TOP & REORGANIZED CONTROLS */}
        <div className="w-full text-[#121212] mb-2">
          {/* Tier 1: Logo and Sponsors (Symmetrical Layout) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center border-b border-[#e2e2e2] pb-2 mb-1.5">
            {/* Left Sponsor Block */}
            {showLeft && (
              <div className="hidden lg:flex lg:col-span-3 h-[75px] bg-[#fafafa] text-[#121212] flex-col justify-center items-center border border-[#e2e2e2] rounded-[3px] overflow-hidden">
                <a href={leftSponsor.ctaUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                  <img src={leftSponsor.imageUrl!} alt={leftSponsor.label || "Left Sponsor"} className="w-full h-full object-cover" />
                </a>
              </div>
            )}

            {/* Center Logo and Hidden H1 for SEO */}
            <div className={`col-span-1 ${
              showLeft && showRight
                ? 'lg:col-span-6'
                : showLeft || showRight
                  ? 'lg:col-span-9'
                  : 'lg:col-span-12'
            } text-center flex flex-col items-center`}>
              <h1 className="sr-only">খেলারদেশ | Bangla Sports News | বাংলা স্পোর্টস নিউজ</h1>
              <img src="/images/khelardesh_logo.png" alt="খেলারদেশ - Bangla Sports News" className="mx-auto select-none" style={{ maxWidth: '100%', height: 'auto', maxHeight: '75px' }} />
            </div>

            {/* Right Sponsor Block */}
            {showRight && (
              <div className="hidden lg:flex lg:col-span-3 h-[75px] bg-[#fafafa] text-[#121212] flex-col justify-center items-center border border-[#e2e2e2] rounded-[3px] overflow-hidden">
                <a href={rightSponsor.ctaUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
                  <img src={rightSponsor.imageUrl!} alt={rightSponsor.label || "Right Sponsor"} className="w-full h-full object-cover" />
                </a>
              </div>
            )}
          </div>

          {/* Tier 2: Controls & Info Bar */}
          <div className="grid grid-cols-3 items-center border-b border-gray-200 py-0.5 sm:py-1 mb-1 sm:mb-1.5 text-xs font-semibold uppercase w-full">
            {/* Left: Icons */}
            <div className="flex items-center justify-start">
              {/* Search */}
              <Link 
                href="/search"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#121212] hover:bg-gray-100 transition-all duration-200 cursor-pointer"
                aria-label="Search"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </Link>
            </div>

            {/* Center: Bengali Date Info */}
            <LiveDate />

            {/* Right: Actions */}
            <div className="flex items-center justify-end">
              <ProfileMenu user={session?.user} />
            </div>
          </div>

          {/* Tier 3: Category Navigation Strip */}
          <HomeNav />
        </div>

        <HeroSlideshow articles={leads.slice(0, 3)} />

        {/* SCORES STRIP */}
        <div className="mb-4">
          <ScoresStrip />
        </div>

        {/* LOWER SECTION */}
        <LowerSection
          footballArticles={footballArticles}
          cricketArticles={cricketArticles}
          interviewArticles={interviewArticles}
          featureArticles={featureArticles}
          specialArticles={specialArticles}
          guestArticles={guestArticles}
          othersArticles={othersArticles}
          didYouKnowArticles={didYouKnowArticles}
          onThisDayArticles={onThisDayArticles}
          hpBanner1={hpBanner1 && hpBanner1.isActive ? { imageUrl: hpBanner1.imageUrl, ctaUrl: hpBanner1.ctaUrl } : null}
          hpBanner2={hpBanner2 && hpBanner2.isActive ? { imageUrl: hpBanner2.imageUrl, ctaUrl: hpBanner2.ctaUrl } : null}
          hpBanner3={hpBanner3 && hpBanner3.isActive ? { imageUrl: hpBanner3.imageUrl, ctaUrl: hpBanner3.ctaUrl } : null}
          hpBanner4={hpBanner4 && hpBanner4.isActive ? { imageUrl: hpBanner4.imageUrl, ctaUrl: hpBanner4.ctaUrl } : null}
          hpBanner5={hpBanner5 && hpBanner5.isActive ? { imageUrl: hpBanner5.imageUrl, ctaUrl: hpBanner5.ctaUrl } : null}
          hpBanner6={hpBanner6 && hpBanner6.isActive ? { imageUrl: hpBanner6.imageUrl, ctaUrl: hpBanner6.ctaUrl } : null}
        />

      </div>
    </div>
  );
}

