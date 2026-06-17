'use client';

import { useState, useEffect } from 'react';
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

  const minSwipeDistance = 50;

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [articles.length, currentIndex]);

  if (!articles || articles.length === 0) return null;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    } else if (isRightSwipe) {
      setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }
  };

  return (
    <div 
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="border-b border-[#e2e2e2] pb-4 mb-4 relative overflow-hidden h-[480px] sm:h-[360px] md:h-[420px] lg:h-[430px]"
    >
      {articles.map((article, idx) => {
        // Calculate offset for each slide (-100%, 0%, 100%, etc.)
        const offset = (idx - currentIndex) * 100;
        return (
          <Link 
            key={idx} 
            href={`/article/${article.slug}`}
            className="absolute top-0 left-0 w-full h-full grid grid-cols-12 gap-4 transition-transform duration-500 ease-in-out cursor-pointer text-inherit hover:no-underline"
            style={{ transform: `translateX(${offset}%)` }}
          >
            {/* TEXT COLUMN */}
            <div className="col-span-12 md:col-span-4 flex flex-col justify-between order-2 md:order-1 pt-2 h-[220px] sm:h-[260px] md:h-full pr-2">
              <div className="overflow-hidden">
                <p className="text-[#888888] font-bold text-[11px] mb-1.5 uppercase tracking-wider font-sans">
                  {article.sport === 'football' ? 'ফুটবল' : article.sport === 'cricket' ? 'ক্রিকেট' : 'খেলার দেশ'}
                </p>
                <h1 className="text-3xl md:text-4xl lg:text-[2.5rem] font-bold leading-[1.1] mb-3 text-[#121212] line-clamp-3" style={{ letterSpacing: '-0.02em' }}>
                  {article.headlineBn || article.headline}
                </h1>
                <p className="text-sm font-bold italic mb-3 text-gray-400">{article.byline}</p>
                <p className="text-sm text-justify leading-relaxed columns-1 line-clamp-4">
                  {article.deck}
                </p>
              </div>
              <div className="text-right mt-2 flex justify-end items-center mb-8 md:mb-12">
                <span className="text-[11px] font-bold text-[#d33f3f] hover:underline">
                  আরো পড়ুন
                </span>
              </div>
            </div>
            
            {/* IMAGE COLUMN */}
            <div className="col-span-12 md:col-span-8 order-1 md:order-2">
              <div className="w-full h-[240px] sm:h-[320px] md:h-[360px] lg:h-[395px] bg-gray-200 overflow-hidden border border-[#e2e2e2] p-1 relative">
                 {article.slug === 'madrid-unravel-final-ten' ? (
                   <Image src="/images/madrid_defeat_hero.png" fill style={{ objectFit: 'cover' }} alt="Hero Image" priority={idx === 0} />
                 ) : article.mediaUrl ? (
                   <Image src={article.mediaUrl} fill style={{ objectFit: 'cover' }} alt="Hero Image" priority={idx === 0} />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-500 italic">ছবি নেই</div>
                 )}
              </div>
            </div>
          </Link>
        );
      })}
      
      {/* STATIC DOTS */}
      <div className="absolute bottom-2 md:bottom-6 left-0 flex gap-2 z-10">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#d33f3f]' : 'bg-gray-300 hover:bg-gray-400'}`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
