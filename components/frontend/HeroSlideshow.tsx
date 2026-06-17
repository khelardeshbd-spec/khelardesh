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

  useEffect(() => {
    if (articles.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [articles.length]);

  if (!articles || articles.length === 0) return null;

  const currentArticle = articles[currentIndex];

  return (
    <div className="grid grid-cols-12 gap-4 border-b border-[#e2e2e2] pb-4 mb-4">
      <div className="col-span-12 md:col-span-4 flex flex-col justify-between order-2 md:order-1 pt-2">
        <div className="animate-fade-in transition-opacity duration-300" key={currentIndex}>
          <p className="text-[#888888] font-bold text-[11px] mb-1.5 uppercase tracking-wider font-sans">
            {currentArticle.sport === 'football' ? 'ফুটবল' : currentArticle.sport === 'cricket' ? 'ক্রিকেট' : 'খেলার দেশ'}
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold leading-[1.1] mb-3 text-[#121212]" style={{ letterSpacing: '-0.02em' }}>
            {currentArticle.headlineBn || currentArticle.headline}
          </h1>
          <p className="text-sm font-bold italic mb-3 text-gray-400">{currentArticle.byline}</p>
          <p className="text-sm text-justify leading-relaxed columns-1">
            {currentArticle.deck}
          </p>
        </div>
        <div className="text-right mt-3 flex justify-between items-center">
          <div className="flex gap-2">
            {articles.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-[#d33f3f]' : 'bg-gray-300 hover:bg-gray-400'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <Link href={`/article/${currentArticle.slug}`} className="text-[11px] font-bold text-[#d33f3f] hover:underline">
            আরো পড়ুন
          </Link>
        </div>
      </div>
      <div className="col-span-12 md:col-span-8 order-1 md:order-2">
        <div className="w-full h-[240px] sm:h-[320px] lg:h-[395px] bg-gray-200 overflow-hidden border border-[#e2e2e2] p-1 relative">
           {currentArticle.slug === 'madrid-unravel-final-ten' ? (
             <Image src="/images/madrid_defeat_hero.png" fill style={{ objectFit: 'cover' }} alt="Hero Image" className="animate-fade-in" key={`img-${currentIndex}`} />
           ) : currentArticle.mediaUrl ? (
             <Image src={currentArticle.mediaUrl} fill style={{ objectFit: 'cover' }} alt="Hero Image" className="animate-fade-in" key={`img-${currentIndex}`} />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-500 italic animate-fade-in" key={`noimg-${currentIndex}`}>ছবি নেই</div>
           )}
        </div>
      </div>
    </div>
  );
}
