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

export const dynamic = 'force-dynamic';




export const metadata: Metadata = {
  title: 'খেলারদেশ — স্পোর্টস · স্বতন্ত্র',
  description: 'স্বাধীন বাংলাদেশি স্পোর্টস নিউজ। ফুটবল, ক্রিকেট, বাস্কেটবল, টেনিস, F1 এবং আরও অনেক কিছু।',
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
  const scores = scoresResult.status === 'fulfilled' ? (scoresResult.value.data ?? []) : [];
  const sponsors = sponsorsResult.status === 'fulfilled' ? (sponsorsResult.value.data ?? []) : [];

  const inlineSponsors = sponsors.filter((s) => s.placement === 'inline');
  const leftSponsor = sponsors.find((s) => s.placement === 'header-left');
  const rightSponsor = sponsors.find((s) => s.placement === 'header-right');

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

            {/* Center Logo */}
            <div className={`col-span-1 ${
              showLeft && showRight
                ? 'lg:col-span-6'
                : showLeft || showRight
                  ? 'lg:col-span-9'
                  : 'lg:col-span-12'
            } text-center flex flex-col items-center`}>
              <img src="/images/khelardesh_logo.png" alt="খেলারদেশ" className="mx-auto select-none" style={{ maxWidth: '100%', height: 'auto', maxHeight: '75px' }} />
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
          <div className="grid grid-cols-3 items-center border-b border-gray-200 py-1 sm:py-3 mb-1.5 sm:mb-2 text-xs font-semibold uppercase w-full">
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
            <div className="flex justify-center items-center">
              {/* Desktop version */}
              <div className="flex flex-col items-center text-center text-[10px] sm:text-[11px] text-gray-500 tracking-widest justify-center hidden sm:flex font-medium font-sans">
                <span>
                  {new Intl.DateTimeFormat('bn-BD', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  }).format(new Date())}
                </span>
              </div>
              {/* Show short date on very small screens so it fits */}
              <div className="flex flex-col items-center text-center text-[9px] text-gray-500 tracking-widest justify-center sm:hidden font-medium font-sans">
                <span>
                  {new Intl.DateTimeFormat('bn-BD', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  }).format(new Date())}
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end">
              <ProfileMenu user={session?.user} />
            </div>
          </div>

          {/* Tier 3: Category Navigation Strip */}
          <div className="border-b border-[#e2e2e2] pb-1.5">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs font-semibold">
              {[
                { label: 'মাঠ', slug: '' },
                {
                  label: 'ফুটবল',
                  slug: 'football',
                  subItems: [
                    { label: 'দেশের ফুটবল', slug: 'bd-football' },
                    { label: 'বিদেশের ফুটবল', slug: 'international-football' },
                    { label: 'পাড়া মহল্লার ফুটবল', slug: 'club-football' }
                  ]
                },
                {
                  label: 'ক্রিকেট',
                  slug: 'cricket',
                  subItems: [
                    { label: 'দেশের ক্রিকেট', slug: 'bd-cricket' },
                    { label: 'বিদেশের ক্রিকেট', slug: 'international-cricket' },
                    { label: 'পাড়া মহল্লার ক্রিকেট', slug: 'local-cricket' }
                  ]
                },
                { label: 'ইন্টারভিউ', slug: 'interview' },
                { label: 'ফিচার', slug: 'feature' },
                { label: 'খেলার দেশ বিশেষ', slug: 'special' },
                { label: 'অতিথি কলাম', slug: 'guest-column' },
                { label: 'অন্যান্য', slug: 'others' }
              ].map((item, idx) => {
                const isActive = item.slug === '';
                const href = item.slug === '' ? '/' : `/sport/${item.slug}`;
                if (item.subItems) {
                  return (
                    <div key={idx} className="relative group h-full flex items-center">
                      <Link
                        href={href}
                        className="cursor-pointer hover:underline flex items-center gap-1"
                        style={{ color: isActive ? 'var(--live-red)' : '#121212' }}
                      >
                        {item.label}
                        <span className="text-[9px]">▼</span>
                      </Link>
                      <div className="absolute left-0 top-[100%] hidden group-hover:block bg-[#ffffff] border border-[#e2e2e2] shadow-md rounded-[3px] py-1 min-w-[150px] z-50 dropdown-bridge">

                        {item.subItems.map((sub, sIdx) => (
                          <Link
                            key={sIdx}
                            href={`/sport/${sub.slug}`}
                            className="block px-4 py-2 text-xs font-bold text-[#121212] hover:bg-gray-100 transition-colors"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={idx}
                    href={href}
                    className="cursor-pointer hover:underline"
                    style={{ color: isActive ? 'var(--live-red)' : '#121212' }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
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
        />

      </div>
    </div>
  );
}

