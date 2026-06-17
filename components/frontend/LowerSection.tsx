import Link from 'next/link';
import CategoryColumnFeed from './CategoryColumnFeed';

interface LowerSectionProps {
  articles: any[];
}

export default function LowerSection({ articles }: LowerSectionProps) {
  return (
    <section 
      aria-label="খেলাধুলা বিভাগসমূহ"
      className="bg-[var(--bg-surface)] border border-[var(--ink-border)] rounded-[12px] p-6 md:p-8 transition-all duration-300 mb-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
        {/* Column 1: Football */}
        <div className="border-b md:border-b-0 md:border-r border-[var(--ink-border)] pb-6 md:pb-0 md:pr-6">
          <h3 className="font-bold text-lg mb-4 border-b-2 border-[var(--ink)] pb-1.5 uppercase tracking-wider text-[var(--ink)]">
            ফুটবল
          </h3>
          <div className="w-full h-48 mb-4 border border-[var(--ink-border)] rounded-[4px] overflow-hidden bg-[var(--bg-page)] p-1">
            {articles[0]?.mediaUrl ? (
              <img src={articles[0].mediaUrl} className="w-full h-full object-cover rounded-[2px]" alt="Football" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.6rem] font-bold mb-3 leading-tight text-[var(--ink)] hover:underline">
            <Link href={`/article/${articles[0]?.slug || '#'}`}>
              {articles[0]?.headlineBn || articles[0]?.headline}
            </Link>
          </h2>
          <p className="text-xs font-bold italic mb-3 text-[var(--ink-muted)]">{articles[0]?.byline || 'Staff Reporter'}</p>
          <p className="text-xs text-justify leading-relaxed line-clamp-4 text-[var(--ink)] opacity-90">
            {articles[0]?.deck || 'বিস্তারিত খবর আসছে...'}
          </p>
          <div className="text-right mt-3 mb-6">
            <Link href={`/article/${articles[0]?.slug || '#'}`} className="text-[11px] font-bold text-[var(--live-red)] hover:underline">
              আরো পড়ুন
            </Link>
          </div>

          {/* Additional Article Previews */}
          <div className="border-t border-[var(--ink-border)] pt-4 flex flex-col gap-4">
            <CategoryColumnFeed category="football" skipIds={articles[0] ? [articles[0].id] : []} />
          </div>
        </div>
        
        {/* Column 2: Cricket */}
        <div className="border-b md:border-b-0 md:border-r border-[var(--ink-border)] py-6 md:py-0 md:px-6">
          <h3 className="font-bold text-lg mb-4 border-b-2 border-[var(--ink)] pb-1.5 uppercase tracking-wider text-[var(--ink)]">
            ক্রিকেট
          </h3>
          <div className="w-full h-48 mb-4 border border-[var(--ink-border)] rounded-[4px] overflow-hidden bg-[var(--bg-page)] p-1">
            {articles[1]?.mediaUrl ? (
              <img src={articles[1].mediaUrl} className="w-full h-full object-cover rounded-[2px]" alt="Cricket" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.6rem] font-bold mb-3 leading-tight text-[var(--ink)] hover:underline">
            <Link href={`/article/${articles[1]?.slug || '#'}`}>
              {articles[1]?.headlineBn || articles[1]?.headline}
            </Link>
          </h2>
          <p className="text-xs font-bold italic mb-3 text-[var(--ink-muted)]">{articles[1]?.byline || 'Staff Reporter'}</p>
          <p className="text-xs text-justify leading-relaxed line-clamp-4 text-[var(--ink)] opacity-90">
            {articles[1]?.deck || 'বিস্তারিত খবর আসছে...'}
          </p>
          <div className="text-right mt-3 mb-6">
            <Link href={`/article/${articles[1]?.slug || '#'}`} className="text-[11px] font-bold text-[var(--live-red)] hover:underline">
              আরো পড়ুন
            </Link>
          </div>

          {/* Additional Article Previews */}
          <div className="border-t border-[var(--ink-border)] pt-4 flex flex-col gap-4">
            <CategoryColumnFeed category="cricket" skipIds={articles[1] ? [articles[1].id] : []} />
          </div>
        </div>
        
        {/* Column 3: Others */}
        <div className="pt-6 md:pt-0 md:pl-6">
          <h3 className="font-bold text-lg mb-4 border-b-2 border-[var(--ink)] pb-1.5 uppercase tracking-wider text-[var(--ink)]">
            অন্যান্য
          </h3>
          <div className="w-full h-48 mb-4 border border-[var(--ink-border)] rounded-[4px] overflow-hidden bg-[var(--bg-page)] p-1">
            {articles[2]?.mediaUrl ? (
              <img src={articles[2].mediaUrl} className="w-full h-full object-cover rounded-[2px]" alt="Other Sports" />
            ) : (
              <div className="w-full h-full bg-gray-200" />
            )}
          </div>
          <h2 style={{ fontFamily: 'var(--font-headline)' }} className="text-[1.6rem] font-bold mb-3 leading-tight text-[var(--ink)] hover:underline">
            <Link href={`/article/${articles[2]?.slug || '#'}`}>
              {articles[2]?.headlineBn || articles[2]?.headline}
            </Link>
          </h2>
          <p className="text-xs font-bold italic mb-3 text-[var(--ink-muted)]">{articles[2]?.byline || 'Staff Reporter'}</p>
          <p className="text-xs text-justify leading-relaxed line-clamp-4 text-[var(--ink)] opacity-90">
            {articles[2]?.deck || 'বিস্তারিত খবর আসছে...'}
          </p>
          <div className="text-right mt-3 mb-6">
            <Link href={`/article/${articles[2]?.slug || '#'}`} className="text-[11px] font-bold text-[var(--live-red)] hover:underline">
              আরো পড়ুন
            </Link>
          </div>

          {/* Additional Article Previews */}
          <div className="border-t border-[var(--ink-border)] pt-4 flex flex-col gap-4">
            <CategoryColumnFeed category="other" skipIds={articles[2] ? [articles[2].id] : []} />
          </div>
        </div>
      </div>
    </section>
  );
}
