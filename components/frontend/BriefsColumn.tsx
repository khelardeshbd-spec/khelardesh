'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  sport: string;
}

interface SidebarItem {
  id: number;
  tab_type: 'trivia' | 'history' | 'fixture' | 'tv';
  content: {
    title?: string;
    subtitle?: string;
    body?: string;
    imageUrl?: string;
    href?: string;
    time?: string;
    channel?: string;
    teams?: string;
    league?: string;
  };
  display_order: number;
  event_date?: string | null;
}

interface BriefsColumnProps {
  articles: Article[];
}

const TABS = [
  { key: 'trivia', label: 'জানেন কি?' },
  { key: 'history', label: 'ইতিহাস' },
  { key: 'fixture', label: 'আজকের খেলা' },
  { key: 'tv', label: 'টিভি' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// Static fallbacks shown when Supabase has no data yet
const STATIC_FALLBACKS: Record<TabKey, SidebarItem[]> = {
  trivia: [
    {
      id: -1,
      tab_type: 'trivia',
      content: {
        title: 'বাংলাদেশ জাতীয় ক্রিকেট দলের প্রথম টেস্ট জয় হয় ২০০৫ সালে জিম্বাবুয়ের বিপক্ষে।',
        imageUrl: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&q=80',
        href: '#',
      },
      display_order: 0,
    },
  ],
  history: [
    {
      id: -2,
      tab_type: 'history',
      content: {
        title: '১৯৭৮ সালে আর্জেন্টিনায় ফিফা বিশ্বকাপ অনুষ্ঠিত হয়। স্বাগতিক আর্জেন্টিনা প্রথমবার শিরোপা জেতে।',
        imageUrl: 'https://images.unsplash.com/photo-1508344928928-7137b29de216?w=600&q=80',
        href: '#',
      },
      display_order: 0,
    },
  ],
  fixture: [
    {
      id: -3,
      tab_type: 'fixture',
      content: {
        teams: 'বাংলাদেশ বনাম পাকিস্তান',
        league: 'টি-টোয়েন্টি সিরিজ',
        time: '১৯:৩০',
        href: '#',
      },
      display_order: 0,
    },
  ],
  tv: [
    {
      id: -4,
      tab_type: 'tv',
      content: {
        title: 'বাংলাদেশ বনাম পাকিস্তান (টি-টোয়েন্টি)',
        channel: 'টি স্পোর্টস',
        time: '১৯:৩০',
        href: '#',
      },
      display_order: 0,
    },
  ],
};

function TriviaCard({ item }: { item: SidebarItem }) {
  const { title, imageUrl, href } = item.content;
  return (
    <Link
      href={href ?? '#'}
      className="group block relative overflow-hidden rounded-[2px]"
      style={{ aspectRatio: '16/9' }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title ?? ''}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.4,
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
          lang="bn"
        >
          {title}
        </p>
      </div>
    </Link>
  );
}

function HistoryCard({ item }: { item: SidebarItem }) {
  const { title, imageUrl, href } = item.content;
  return (
    <Link
      href={href ?? '#'}
      className="group block relative overflow-hidden rounded-[2px]"
      style={{ aspectRatio: '16/9' }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title ?? ''}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ filter: 'sepia(20%)' }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 14,
            fontWeight: 600,
            color: 'white',
            lineHeight: 1.4,
            textShadow: '0 1px 3px rgba(0,0,0,0.6)',
          }}
          lang="bn"
        >
          {title}
        </p>
      </div>
    </Link>
  );
}

function FixtureCard({ item }: { item: SidebarItem }) {
  const { teams, league, time, href } = item.content;
  return (
    <Link
      href={href ?? '#'}
      className="group flex items-start justify-between gap-2 py-3 border-b hover:bg-[var(--bg-surface)] transition-colors"
      style={{ borderColor: 'var(--ink-border)', padding: '10px 0', textDecoration: 'none' }}
    >
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 500,
            color: 'var(--ink-muted)',
            letterSpacing: '0.04em',
            marginBottom: 3,
          }}
          lang="bn"
        >
          {league}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink)',
            lineHeight: 1.35,
          }}
          lang="bn"
          className="group-hover:underline"
        >
          {teams}
        </p>
      </div>
      {time && (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--ink)',
            flexShrink: 0,
          }}
          lang="bn"
        >
          {time}
        </span>
      )}
    </Link>
  );
}

function TvCard({ item }: { item: SidebarItem }) {
  const { title, channel, time, href } = item.content;
  return (
    <Link
      href={href ?? '#'}
      className="group flex items-start gap-3 py-3 border-b hover:bg-[var(--bg-surface)] transition-colors"
      style={{ borderColor: 'var(--ink-border)', padding: '10px 0', textDecoration: 'none' }}
    >
      {/* TV icon */}
      <div
        className="flex-shrink-0 flex items-center justify-center rounded"
        style={{
          width: 32,
          height: 32,
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--ink-border)',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ink-muted)" strokeWidth="1.5">
          <rect x="2" y="7" width="20" height="15" rx="2" />
          <polyline points="17 2 12 7 7 2" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--ink)',
            lineHeight: 1.35,
            marginBottom: 3,
          }}
          lang="bn"
          className="group-hover:underline"
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            color: 'var(--ink-muted)',
          }}
          lang="bn"
        >
          {[channel, time].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  );
}

export default function BriefsColumn({ articles }: BriefsColumnProps) {
  const briefs = articles.slice(0, 6);
  const [activeTab, setActiveTab] = useState<TabKey>('trivia');
  const [tabData, setTabData] = useState<Record<TabKey, SidebarItem[] | null>>({
    trivia: null,
    history: null,
    fixture: null,
    tv: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const tab = activeTab;
    if (tabData[tab] !== null) return; // already fetched

    setLoading(true);
    fetch(`/api/sidebar-content?tab=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        setTabData((prev) => ({ ...prev, [tab]: data.items ?? [] }));
      })
      .catch(() => {
        setTabData((prev) => ({ ...prev, [tab]: [] }));
      })
      .finally(() => setLoading(false));
  }, [activeTab]);

  const currentItems: SidebarItem[] = tabData[activeTab] ?? [];
  const displayItems =
    currentItems.length > 0 ? currentItems : STATIC_FALLBACKS[activeTab];

  function renderTabContent() {
    if (loading && tabData[activeTab] === null) {
      return (
        <div className="flex flex-col gap-2 pt-2">
          {[1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 2 }} />
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-0 pt-2">
        {displayItems.map((item) => {
          if (activeTab === 'trivia') return <TriviaCard key={item.id} item={item} />;
          if (activeTab === 'history') return <HistoryCard key={item.id} item={item} />;
          if (activeTab === 'fixture') return <FixtureCard key={item.id} item={item} />;
          if (activeTab === 'tv') return <TvCard key={item.id} item={item} />;
          return null;
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8" aria-label="সংক্ষিপ্ত সংবাদ ও উইজেট">
      {/* Latest Articles */}
      <section>
        <h2
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: 'var(--ink-muted)',
            borderBottom: '1px solid var(--ink-border)',
            paddingBottom: 4,
            marginBottom: 10,
          }}
          lang="bn"
        >
          সবশেষ
        </h2>
        <div className="flex flex-col gap-5">
          {briefs.map((article) => {
            const displayTitle = article.headlineBn || article.headline;
            return (
              <Link key={article.id} href={`/article/${article.slug}`} className="group block">
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 9,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: 'var(--ink-muted)',
                    marginBottom: 2,
                  }}
                  lang="bn"
                >
                  {article.sport}
                </p>
                <h3
                  lang="bn"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontWeight: 600,
                    fontSize: 15,
                    lineHeight: 1.38,
                    color: 'var(--ink)',
                  }}
                  className="group-hover:underline"
                >
                  {displayTitle}
                </h3>
              </Link>
            );
          })}
          {briefs.length === 0 && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-1">
                  <div className="skeleton" style={{ height: 8, width: '60%' }} />
                  <div className="skeleton" style={{ height: 10, width: '100%' }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sidebar Tabs: আপনি জানেন কি / ইতিহাস / আজকের খেলা / টিভি */}
      <section aria-label="সাইডবার উইজেট">
        {/* Tab bar */}
        <div
          className="flex"
          role="tablist"
          aria-label="সাইডবার বিভাগ"
          style={{
            borderBottom: '2px solid var(--ink-border)',
            gap: 0,
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-controls={`tabpanel-${tab.key}`}
              id={`tab-${tab.key}`}
              onClick={() => setActiveTab(tab.key)}
              style={{
                flex: 1,
                fontFamily: "var(--font-body)",
                fontSize: 10,
                fontWeight: activeTab === tab.key ? 700 : 400,
                color: activeTab === tab.key ? 'var(--ink)' : 'var(--ink-muted)',
                padding: '6px 4px',
                borderBottom: activeTab === tab.key
                  ? '2px solid var(--ink)'
                  : '2px solid transparent',
                marginBottom: -2,
                background: 'none',
                border: 'none',
                borderBottomStyle: 'solid',
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.key ? 'var(--ink)' : 'transparent',
                cursor: 'pointer',
                transition: 'color 0.15s, border-color 0.15s',
                textAlign: 'center',
                letterSpacing: '0.02em',
              }}
              lang="bn"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          id={`tabpanel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab}`}
        >
          {renderTabContent()}
        </div>
      </section>
    </div>
  );
}
