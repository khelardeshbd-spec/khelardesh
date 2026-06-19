'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
  publishedAt: string;
}

interface HeroSlideshowProps {
  articles: Article[];
}

export default function HeroSlideshow({ articles }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (articles.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [articles.length, isPaused]);

  useEffect(() => {
    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, []);

  if (!articles || articles.length === 0) return null;

  const onTouchStartAction = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (e.targetTouches.length === 2) {
      setIsPaused(true);
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
      setTouchEnd(null);
      const avgClientX = (e.targetTouches[0].clientX + e.targetTouches[1].clientX) / 2;
      setTouchStart(avgClientX);
    }
  };

  const onTouchMoveAction = (e: React.TouchEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) return;
    if (e.targetTouches.length === 2 && touchStart !== null) {
      const avgClientX = (e.targetTouches[0].clientX + e.targetTouches[1].clientX) / 2;
      setTouchEnd(avgClientX);
    }
  };

  const handleManualNavigation = (newIndex: number) => {
    setCurrentIndex(newIndex);
    setIsPaused(true);
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }
    autoplayTimeoutRef.current = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
  };

  const onTouchEndAction = () => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    let nextIdx = currentIndex;
    if (distance > minSwipeDistance) {
      nextIdx = (currentIndex + 1) % articles.length;
    } else if (distance < -minSwipeDistance) {
      nextIdx = (currentIndex - 1 + articles.length) % articles.length;
    }
    
    setTouchStart(null);
    setTouchEnd(null);

    handleManualNavigation(nextIdx);
  };

  return (
    <div
      onTouchStart={onTouchStartAction}
      onTouchMove={onTouchMoveAction}
      onTouchEnd={onTouchEndAction}
      onMouseEnter={() => {
        setIsPaused(true);
        if (autoplayTimeoutRef.current) {
          clearTimeout(autoplayTimeoutRef.current);
        }
      }}
      onMouseLeave={() => {
        setIsPaused(false);
      }}
      className="border-b border-[#e2e2e2] pb-4 mb-4 overflow-hidden relative"
    >
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {articles.map((article, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            <Link
              href={`/article/${article.slug}`}
              className="block cursor-pointer text-inherit hover:no-underline"
            >
              <div className="grid grid-cols-12 gap-4">
                {/* IMAGE — full width on mobile (top), right 8-cols on desktop */}
                <div className="col-span-12 md:col-span-8 order-1 md:order-2">
                  <div className="w-full h-[210px] sm:h-[300px] md:h-[360px] lg:h-[400px] bg-gray-200 overflow-hidden border border-[#e2e2e2] p-1 relative">
                    {article.slug === 'madrid-unravel-final-ten' ? (
                      <Image src="/images/madrid_defeat_hero.png" fill style={{ objectFit: 'cover' }} alt="Hero Image" priority={idx === 0} />
                    ) : article.mediaUrl ? (
                      <Image src={article.mediaUrl} fill style={{ objectFit: 'cover' }} alt="Hero Image" priority={idx === 0} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 italic">ছবি নেই</div>
                    )}
                  </div>
                </div>

                {/* TEXT — full width on mobile (below image), left 4-cols on desktop */}
                <div className="col-span-12 md:col-span-4 flex flex-col justify-between order-2 md:order-1 pt-2 pr-1 md:pr-2">
                  <div>
                    <p className="text-[#888888] font-bold text-[11px] mb-1.5 uppercase tracking-wider font-sans">
                      {article.sport === 'football' ? 'ফুটবল' : article.sport === 'cricket' ? 'ক্রিকেট' : 'খেলার দেশ'}
                    </p>
                    <h1
                      className="text-2xl md:text-4xl lg:text-[2.5rem] font-bold leading-[1.15] mb-2 text-[#121212]"
                      style={{ letterSpacing: '-0.02em' }}
                    >
                      {article.headlineBn || article.headline}
                    </h1>
                    <p className="text-sm font-bold italic mb-2 text-gray-400">{article.byline}</p>
                    <p className="text-sm text-justify leading-relaxed line-clamp-3 md:line-clamp-5 text-gray-600">
                      {article.deck}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3 opacity-0 pointer-events-none">
                    <div className="flex items-center gap-3">
                      <div className="p-1 flex items-center justify-center">
                        <div className="w-4 h-4" />
                      </div>
                      <div className="flex gap-2">
                        {articles.map((_, dotIdx) => (
                          <div key={dotIdx} className="w-2 h-2 rounded-full" />
                        ))}
                      </div>
                      <div className="p-1 flex items-center justify-center">
                        <div className="w-4 h-4" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold">
                      আরো পড়ুন
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Static Overlay Grid for Navigation Controls */}
      <div className="absolute inset-x-0 bottom-4 pointer-events-none z-10 px-4 md:px-0">
        <div className="grid grid-cols-12 gap-4 w-full">
          {/* Aligns perfectly with the text column (col-span-12 on mobile, md:col-span-4 on desktop) */}
          <div className="col-span-12 md:col-span-4 flex items-center justify-between pointer-events-auto pr-1 md:pr-2">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleManualNavigation((currentIndex - 1 + articles.length) % articles.length);
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1 flex items-center justify-center cursor-pointer"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <div className="flex gap-2">
                {articles.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={(e) => { e.preventDefault(); handleManualNavigation(dotIdx); }}
                    className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${dotIdx === currentIndex ? 'bg-[#d33f3f]' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  handleManualNavigation((currentIndex + 1) % articles.length);
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1 flex items-center justify-center cursor-pointer"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <Link
              href={`/article/${articles[currentIndex].slug}`}
              className="text-[11px] font-bold text-[#d33f3f] hover:underline cursor-pointer"
            >
              আরো পড়ুন
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
