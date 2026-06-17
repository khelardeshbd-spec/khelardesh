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
    if (distance > minSwipeDistance) {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    } else if (distance < -minSwipeDistance) {
      setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
    }
  };

  const article = articles[currentIndex];

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="border-b border-[#e2e2e2] pb-4 mb-4"
    >
      <Link
        href={`/article/${article.slug}`}
        className="block cursor-pointer text-inherit hover:no-underline"
      >
        <div className="grid grid-cols-12 gap-4">
          {/* IMAGE — full width on mobile (top), right 8-cols on desktop */}
          <div className="col-span-12 md:col-span-8 order-1 md:order-2">
            <div className="w-full h-[210px] sm:h-[300px] md:h-[360px] lg:h-[400px] bg-gray-200 overflow-hidden border border-[#e2e2e2] p-1 relative">
              {article.slug === 'madrid-unravel-final-ten' ? (
                <Image src="/images/madrid_defeat_hero.png" fill style={{ objectFit: 'cover' }} alt="Hero Image" priority />
              ) : article.mediaUrl ? (
                <Image src={article.mediaUrl} fill style={{ objectFit: 'cover' }} alt="Hero Image" priority />
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
            <div className="flex items-center justify-between mt-3">
              {/* Slide dots */}
              <div className="flex gap-2">
                {articles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                    className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#d33f3f]' : 'bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#d33f3f]">
                আরো পড়ুন
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
