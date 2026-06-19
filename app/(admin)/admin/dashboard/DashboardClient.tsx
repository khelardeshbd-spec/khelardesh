'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Clock, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ExternalLink, 
  Pencil,
  Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Article {
  id: number;
  slug: string;
  headline: string;
  headlineBn?: string | null;
  sport: string;
  isLead: boolean;
  publishedAt: string;
}

interface DashboardClientProps {
  initialArticles: Article[];
  totalScoresCount: number;
}

export default function DashboardClient({ initialArticles, totalScoresCount }: DashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'views' | 'live' | 'publishedAt'>('live');
  const [sortAsc, setSortAsc] = useState(false);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Use real analytics data from the backend
  const [articlesData, setArticlesData] = useState(() => {
    return initialArticles.map((art) => {
      return {
        ...art,
        totalViews: (art as any).views || 0,
        liveViewers: 0,
      };
    });
  });

  const [totalLiveUsers, setTotalLiveUsers] = useState(0);

  useEffect(() => {
    const channel = supabase.channel('global_presence');
    
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      
      let totalLive = 0;
      const liveBySlug: Record<string, number> = {};
      
      for (const id in state) {
        totalLive += state[id].length;
        
        // Count by slug
        state[id].forEach((presence: any) => {
          if (presence.slug) {
            liveBySlug[presence.slug] = (liveBySlug[presence.slug] || 0) + 1;
          }
        });
      }
      
      setTotalLiveUsers(totalLive);
      
      setArticlesData((prev) => 
        prev.map((art) => ({
          ...art,
          liveViewers: liveBySlug[art.slug] || 0
        }))
      );
    });

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Compute stats
  const stats = useMemo(() => {
    const totalViews = articlesData.reduce((acc, a) => acc + a.totalViews, 0);
    const totalLive = totalLiveUsers;
    
    // Find most viewed article
    const sortedArticles = [...articlesData].sort((a, b) => b.totalViews - a.totalViews);
    const topArticle = sortedArticles.length > 0 && sortedArticles[0].totalViews > 0 ? sortedArticles[0] : null;

    // Sport breakdown
    const sportViews: Record<string, number> = {};
    articlesData.forEach(a => {
      sportViews[a.sport] = (sportViews[a.sport] || 0) + a.totalViews;
    });
    const topSportEntry = Object.entries(sportViews).sort((a, b) => b[1] - a[1])[0];
    const topSport = topSportEntry && topSportEntry[1] > 0 ? topSportEntry[0] : 'N/A';

    return {
      totalViews,
      totalLive,
      topArticle,
      topSport,
    };
  }, [articlesData]);

  // Handle Sort toggle
  const handleSort = (field: 'views' | 'live' | 'publishedAt') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Filter and sort articles list
  const processedArticles = useMemo(() => {
    let result = [...articlesData];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(a => 
        (a.headlineBn || '').toLowerCase().includes(q) || 
        a.headline.toLowerCase().includes(q) || 
        a.sport.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = 0;
      let valB: any = 0;

      if (sortField === 'views') {
        valA = a.totalViews;
        valB = b.totalViews;
      } else if (sortField === 'live') {
        valA = a.liveViewers;
        valB = b.liveViewers;
      } else if (sortField === 'publishedAt') {
        valA = new Date(a.publishedAt).getTime();
        valB = new Date(b.publishedAt).getTime();
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [articlesData, searchQuery, sortField, sortAsc]);

  // Generate visitors trend charts SVG path coordinates
  const chartData = useMemo(() => {
    // Generate real time series points (currently 0 as no backend data)
    const pointsCount = timeRange === '24h' ? 12 : timeRange === '7d' ? 7 : 15;
    
    const seededPoints = Array.from({ length: pointsCount }).map((_, i) => {
      const val = 0;
      
      let label = '';
      if (timeRange === '24h') {
        const hour = (new Date().getHours() - (pointsCount - 1 - i) * 2 + 24) % 24;
        label = `${hour}:00`;
      } else if (timeRange === '7d') {
        const d = new Date();
        d.setDate(d.getDate() - (pointsCount - 1 - i));
        label = d.toLocaleDateString('bn-BD', { weekday: 'short' });
      } else {
        const d = new Date();
        d.setDate(d.getDate() - (pointsCount - 1 - i) * 2);
        label = `${d.getDate()}/${d.getMonth() + 1}`;
      }

      return { val, label };
    });

    // Compute SVG path
    const width = 600;
    const height = 150;
    const padding = 20;
    const maxVal = 100; // Give it some scale so it doesn't crash on max=0 min=0
    const minVal = 0;
    
    const coords = seededPoints.map((p, i) => {
      const x = padding + (i / (pointsCount - 1)) * (width - padding * 2);
      const y = height - padding; // Always at bottom since val=0
      return { x, y, val: p.val, label: p.label };
    });

    let pathD = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      pathD += ` L ${coords[i].x} ${coords[i].y}`; // Just straight lines for 0
    }

    const fillD = `${pathD} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;

    return { coords, pathD, fillD, maxVal, minVal };
  }, [timeRange]);

  const formatViews = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  const getSportNameBn = (sport: string) => {
    const maps: Record<string, string> = {
      football: 'ফুটবল',
      'bd-football': 'দেশের ফুটবল',
      'club-football': 'ক্লাব ফুটবল',
      'international-football': 'আন্তর্জাতিক ফুটবল',
      cricket: 'ক্রিকেট',
      'bd-cricket': 'বাংলাদেশের ক্রিকেট',
      basketball: 'বাস্কেটবল',
      tennis: 'টেনিস',
      f1: 'ফর্মুলা ওয়ান',
      other: 'অন্যান্য'
    };
    return maps[sport] || sport.toUpperCase();
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1040, margin: '0 auto' }}>
      
      {/* Title & Live Status Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: 24, color: 'var(--ink)' }}>
            ড্যাশবোর্ড / Overview
          </h1>
          <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 12, color: 'var(--ink-muted)' }}>
            Real-time insights and readership performance analytics
          </p>
        </div>

        {/* Live system status */}
        <div 
          className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#E8F8F5] border border-[#A3E4D7] text-[#117A65]"
          style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, fontWeight: 600 }}
        >
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#117A65] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#117A65]"></span>
          </span>
          LIVE ACTIVITY MONITOR: ACTIVE
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Card 1: Active Users */}
        <div 
          className="p-5 border flex flex-col justify-between"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--ink-border)', 
            borderRadius: 6,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div className="flex items-center justify-between text-[var(--ink-muted)] mb-2">
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Live Viewers Now
              </span>
              <Users size={14} className="text-[var(--ink-ghost)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--ink)] tracking-tight">
                {stats.totalLive}
              </span>
              <span className="text-xs text-[#27AE60] font-medium flex items-center gap-0.5 animate-pulse">
                ● active
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--ink-border)] flex justify-between items-center text-[10px] text-[var(--ink-muted)]">
            <span>Tracking via Supabase</span>
            <span className="font-semibold text-[var(--ink)]">Articles: {articlesData.reduce((acc, a) => acc + a.liveViewers, 0)}</span>
          </div>
        </div>

        {/* Card 2: Total Views */}
        <div 
          className="p-5 border flex flex-col justify-between"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--ink-border)', 
            borderRadius: 6,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div className="flex items-center justify-between text-[var(--ink-muted)] mb-2">
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Total Article Views
              </span>
              <Eye size={14} className="text-[var(--ink-ghost)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--ink)] tracking-tight">
                {formatViews(stats.totalViews)}
              </span>
              <span className="text-xs text-[var(--ink-muted)]">
                across {initialArticles.length} stories
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--ink-border)] flex justify-between items-center text-[10px] text-[var(--ink-muted)]">
            <span>Avg. per story:</span>
            <span className="font-semibold text-[var(--ink)]">
              {formatViews(Math.round(stats.totalViews / Math.max(1, initialArticles.length)))}
            </span>
          </div>
        </div>

        {/* Card 3: Top Performing */}
        <div 
          className="p-5 border flex flex-col justify-between"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--ink-border)', 
            borderRadius: 6,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div className="flex items-center justify-between text-[var(--ink-muted)] mb-2">
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Top Article views
              </span>
              <TrendingUp size={14} className="text-[var(--ink-ghost)]" />
            </div>
            {stats.topArticle ? (
              <div className="min-h-10">
                <p 
                  className="text-xs font-semibold line-clamp-2 text-[var(--ink)] hover:underline leading-snug"
                  lang="bn"
                >
                  {stats.topArticle.headlineBn || stats.topArticle.headline}
                </p>
                <p className="text-[10px] text-[var(--ink-muted)] mt-1">
                  Views: {formatViews(stats.topArticle.totalViews)}
                </p>
              </div>
            ) : (
              <p className="text-xs text-[var(--ink-muted)]">No articles yet</p>
            )}
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--ink-border)] flex justify-between items-center text-[10px] text-[var(--ink-muted)]">
            <span>Sport:</span>
            <span className="font-semibold text-[var(--ink)] uppercase">
              {stats.topArticle?.sport || 'N/A'}
            </span>
          </div>
        </div>

        {/* Card 4: Engagement */}
        <div 
          className="p-5 border flex flex-col justify-between"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderColor: 'var(--ink-border)', 
            borderRadius: 6,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}
        >
          <div>
            <div className="flex items-center justify-between text-[var(--ink-muted)] mb-2">
              <span style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>
                Avg. Read Duration
              </span>
              <Clock size={14} className="text-[var(--ink-ghost)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-[var(--ink)] tracking-tight">
                0m 0s
              </span>
              <span className="text-xs text-[var(--ink-muted)] font-medium">
                data unavailable
              </span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-[var(--ink-border)] flex justify-between items-center text-[10px] text-[var(--ink-muted)]">
            <span>Primary Category:</span>
            <span className="font-semibold text-[var(--ink)] uppercase">{stats.topSport}</span>
          </div>
        </div>

      </div>

      {/* Visitors' Insight Section */}
      <section 
        className="p-6 border mb-8"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--ink-border)', 
          borderRadius: 6,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
              ভিজিটর ইনসাইট / Visitors&apos; Insights
            </h2>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>
              Reader traffic trend and dynamic session spikes
            </p>
          </div>
          
          {/* Time range selector */}
          <div className="flex rounded border border-[var(--ink-border)] overflow-hidden">
            {(['24h', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className="px-3 py-1 text-xs transition-colors"
                style={{
                  backgroundColor: timeRange === r ? 'var(--ink)' : 'transparent',
                  color: timeRange === r ? 'var(--bg-page)' : 'var(--ink-muted)',
                  fontFamily: "'Hind Siliguri', sans-serif",
                  fontWeight: timeRange === r ? 600 : 400,
                }}
              >
                {r === '24h' ? '২৪ ঘণ্টা' : r === '7d' ? '৭ দিন' : '৩০ দিন'}
              </button>
            ))}
          </div>
        </div>

        {/* Custom SVG line chart */}
        <div className="relative w-full h-[180px] mt-4 flex items-end">
          <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
            {/* Gradients */}
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--ink)" stopOpacity="0.12" />
                <stop offset="100%" stopColor="var(--ink)" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            <line x1="20" y1="20" x2="580" y2="20" stroke="var(--ink-border)" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="20" y1="65" x2="580" y2="65" stroke="var(--ink-border)" strokeWidth="0.5" strokeDasharray="3,3" />
            <line x1="20" y1="110" x2="580" y2="110" stroke="var(--ink-border)" strokeWidth="0.5" strokeDasharray="3,3" />
            
            {/* Area under the line */}
            <path d={chartData.fillD} fill="url(#chartGradient)" />

            {/* Main curved path */}
            <path d={chartData.pathD} fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" />

            {/* Data nodes */}
            {chartData.coords.map((c, i) => (
              <g key={i} className="group/node cursor-pointer">
                <circle 
                  cx={c.x} 
                  cy={c.y} 
                  r="4" 
                  fill="var(--bg-page)" 
                  stroke="var(--ink)" 
                  strokeWidth="2" 
                />
                
                {/* Custom tooltip simulation */}
                <rect 
                  x={c.x - 30} 
                  y={c.y - 28} 
                  width="60" 
                  height="18" 
                  rx="2" 
                  fill="var(--ink)" 
                  className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-150" 
                />
                <text 
                  x={c.x} 
                  y={c.y - 16} 
                  fill="var(--bg-page)" 
                  textAnchor="middle" 
                  style={{ fontSize: '9px', fontWeight: 600, fontFamily: 'sans-serif' }}
                  className="opacity-0 group-hover/node:opacity-100 transition-opacity duration-150 pointer-events-none"
                >
                  {c.val}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Labels bar */}
        <div className="flex justify-between border-t border-[var(--ink-border)] pt-3 text-[10px] text-[var(--ink-muted)]">
          {chartData.coords.map((c, i) => (
            <span key={i} style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
              {c.label}
            </span>
          ))}
        </div>
      </section>

      {/* Quick Action buttons */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <Link href="/admin/articles/new" className="admin-btn-primary">+ New Article</Link>
        <Link href="/admin/sponsors" className="admin-btn-secondary">Manage Sponsors</Link>
      </div>

      {/* Articles Readership Performance Console */}
      <section 
        className="p-6 border"
        style={{ 
          backgroundColor: 'var(--bg-surface)', 
          borderColor: 'var(--ink-border)', 
          borderRadius: 6,
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>
              নিবন্ধ পারফরম্যান্স ও লাইভ ভিউয়ার্স / Article Performance & Live Viewers
            </h2>
            <p style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 11, color: 'var(--ink-muted)' }}>
              Real-time reader count and total views for each article
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full flex items-center">
            <Search size={14} className="absolute left-3 text-[var(--ink-ghost)] pointer-events-none" />
            <input
              type="text"
              placeholder="Search news..."
              className="admin-input"
              style={{ paddingLeft: '32px', height: '34px', fontSize: '12px' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table list */}
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink-border)' }}>
                <th className="pb-3 text-left" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>Headline</th>
                <th className="pb-3 text-left pl-4" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>Sport</th>
                
                {/* Interactive sortable headers */}
                <th className="pb-3 text-right pr-4 cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('views')}>
                  <div className="flex items-center justify-end gap-1" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'views' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Total Views
                    {sortField === 'views' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>
                
                <th className="pb-3 text-right pr-4 cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('live')}>
                  <div className="flex items-center justify-end gap-1" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'live' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Live Viewers
                    {sortField === 'live' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>

                <th className="pb-3 text-right cursor-pointer hover:text-[var(--ink)]" onClick={() => handleSort('publishedAt')}>
                  <div className="flex items-center justify-end gap-1" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: sortField === 'publishedAt' ? 'var(--ink)' : 'var(--ink-muted)' }}>
                    Published
                    {sortField === 'publishedAt' ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null}
                  </div>
                </th>
                
                <th className="pb-3 text-right" style={{ fontFamily: "'Hind Siliguri', sans-serif", fontSize: 10, fontWeight: 600, color: 'var(--ink-muted)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedArticles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-muted)', fontSize: 12 }}>
                    No matching articles found.
                  </td>
                </tr>
              ) : (
                processedArticles.map((art) => (
                  <tr key={art.id} style={{ borderBottom: '0.5px solid var(--ink-border)' }} className="hover:bg-[var(--ink-ghost)] transition-colors">
                    <td className="py-3.5 pr-2 max-w-[280px]">
                      <div className="flex flex-col">
                        <Link 
                          href={`/admin/articles/${art.id}`}
                          className="font-semibold text-sm text-[var(--ink)] hover:underline leading-snug"
                          lang="bn"
                        >
                          {art.headlineBn || art.headline}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3.5 pl-4 text-xs font-medium text-[var(--ink-muted)]">
                      {getSportNameBn(art.sport)}
                    </td>
                    <td className="py-3.5 text-right pr-4 text-sm font-semibold text-[var(--ink)]">
                      {art.totalViews.toLocaleString()}
                    </td>
                    <td className="py-3.5 text-right pr-4 text-sm font-bold text-[#E74C3C]">
                      {art.liveViewers > 0 ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="flex h-1.5 w-1.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E74C3C] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E74C3C]"></span>
                          </span>
                          <span>{art.liveViewers}</span>
                        </div>
                      ) : (
                        <span className="text-[var(--ink-muted)] font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3.5 text-right text-xs text-[var(--ink-muted)] whitespace-nowrap">
                      {new Date(art.publishedAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/admin/articles/${art.id}`}
                          className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
                          title="Edit"
                        >
                          <Pencil size={13} />
                        </Link>
                        <Link 
                          href={`/article/${art.slug}`}
                          target="_blank"
                          className="p-1 hover:bg-[var(--ink-ghost)] rounded transition-colors text-[var(--ink-muted)] hover:text-[var(--ink)]"
                          title="View Live"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
