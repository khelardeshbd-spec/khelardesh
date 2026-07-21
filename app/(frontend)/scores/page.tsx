'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import ClientFormattedDate from '@/components/frontend/ClientFormattedDate';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ESPNMatch {
  id: string;
  league: string;
  leagueLogo?: string;
  startTime: string;
  home: { name: string; score: number | null; logo: string; isWinner: boolean };
  away: { name: string; score: number | null; logo: string; isWinner: boolean };
  isLive: boolean;
  isFinished: boolean;
  statusText: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const toBn = (n: string | number | null) =>
  n === null || n === undefined
    ? '-'
    : String(n).replace(/[0-9]/g, (d) => BN_DIGITS[+d]);

function translateStatus(s: string): string {
  const l = s.toLowerCase();
  if (l === 'ft' || l === 'full time') return 'FT';
  if (l === 'ht' || l === 'half time') return 'HT';
  if (l === 'scheduled') return 'Upcoming';
  if (l === 'live') return 'LIVE';
  if (l === 'postponed') return 'Postponed';
  if (l === 'canceled' || l === 'cancelled') return 'Cancelled';
  if (/^\d+'?$/.test(s.trim())) return s.trim();
  return s;
}

function formatKickoff(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

function groupByLeague(matches: ESPNMatch[]): Map<string, ESPNMatch[]> {
  const map = new Map<string, ESPNMatch[]>();
  for (const m of matches) {
    const list = map.get(m.league) || [];
    list.push(m);
    map.set(m.league, list);
  }
  return map;
}

// Order priority for leagues (FIFA at the top)
function getLeaguePriority(leagueName: string): number {
  const name = leagueName.toLowerCase();
  if (name.includes('fifa') || name.includes('world cup')) return 1; // Top priority
  if (name.includes('uefa') || name.includes('champions league') || name.includes('europa') || name.includes('euro')) return 2;
  if (name.includes('premier league') || name.includes('laliga') || name.includes('la liga') || name.includes('serie a') || name.includes('bundesliga') || name.includes('ligue 1')) return 3;
  return 4; // Default other leagues
}
// Client component to render match kickoff times and relative day statuses without hydration mismatch
function ClientMatchTime({ startTime, isFinished }: { startTime: string; isFinished: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!startTime) return null;
  const md = new Date(startTime);
  if (isNaN(md.getTime())) return null;
  
  const useLocal = mounted;
  const locale = 'en-US';
  const timeZoneOpt = useLocal ? {} : { timeZone: 'UTC' };
  
  const timeStr = md.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit', ...timeZoneOpt });
  
  const getRelativeLabel = () => {
    const td = new Date();
    if (!useLocal) {
      // Use UTC dates for server rendering consistency
      const utd = new Date(Date.UTC(td.getUTCFullYear(), td.getUTCMonth(), td.getUTCDate()));
      const ud = new Date(Date.UTC(md.getUTCFullYear(), md.getUTCMonth(), md.getUTCDate()));
      const diff = (utd.getTime() - ud.getTime()) / (1000 * 3600 * 24);
      const upcomingDiff = (ud.getTime() - utd.getTime()) / (1000 * 3600 * 24);
      
      if (isFinished) {
        const rounded = Math.round(diff);
        if (rounded === 0) return 'Today';
        if (rounded === 1) return 'Yesterday';
        if (rounded === 2) return '2 Days Ago';
        return timeStr || 'FT';
      } else {
        const rounded = Math.round(upcomingDiff);
        if (rounded === 0) return 'Today';
        if (rounded === 1) return 'Tomorrow';
        if (rounded === 2) return 'In 2 Days';
        return 'Upcoming';
      }
    } else {
      td.setHours(0,0,0,0);
      const d = new Date(md);
      d.setHours(0,0,0,0);
      const diff = (td.getTime() - d.getTime()) / (1000 * 3600 * 24);
      const upcomingDiff = (d.getTime() - td.getTime()) / (1000 * 3600 * 24);
      
      if (isFinished) {
        const rounded = Math.round(diff);
        if (rounded === 0) return 'Today';
        if (rounded === 1) return 'Yesterday';
        if (rounded === 2) return '2 Days Ago';
        return timeStr || 'FT';
      } else {
        const rounded = Math.round(upcomingDiff);
        if (rounded === 0) return 'Today';
        if (rounded === 1) return 'Tomorrow';
        if (rounded === 2) return 'In 2 Days';
        return 'Upcoming';
      }
    }
  };
  
  if (isFinished) {
    return (
      <>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">FT</span>
        <span className="text-[9px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md" suppressHydrationWarning>
          {getRelativeLabel()}
        </span>
      </>
    );
  } else {
    return (
      <>
        <span className="text-[11px] font-bold text-slate-800" suppressHydrationWarning>{timeStr}</span>
        <span className="text-[8px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider" suppressHydrationWarning>
          {getRelativeLabel()}
        </span>
      </>
    );
  }
}
// ─── Match Row ────────────────────────────────────────────────────────────────
function MatchRow({ match }: { match: ESPNMatch }) {
  const isEnglish = (str: string) => /[a-zA-Z]/.test(str);
  const status = translateStatus(match.statusText);
  const kickoff = formatKickoff(match.startTime);

  const winnerA = match.isFinished && match.home.isWinner;
  const winnerB = match.isFinished && match.away.isWinner;

  return (
    <Link
      href={`/scores/${match.id}`}
      className="grid grid-cols-[64px_1fr_48px] items-center py-3.5 px-4 gap-3 bg-white hover:bg-slate-50/80 transition-all border-b border-slate-100 last:border-b-0 group text-decoration-none color-inherit"
    >
      {/* Col 1: Time / Status */}
      <div className="flex flex-col items-center justify-center text-center gap-1 min-w-[64px]">
        {match.isLive ? (
          <>
            <span 
              className="text-[11px] font-black text-[#d93025] animate-pulse tracking-tight"
              style={{ fontFamily: isEnglish(status) ? 'sans-serif' : 'var(--font-body)' }}
            >
              {status}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#d93025] animate-ping" />
          </>
        ) : (
          <ClientMatchTime startTime={match.startTime} isFinished={match.isFinished} />
        )}
      </div>

      {/* Col 2: Teams */}
      <div className="flex flex-col gap-2.5 overflow-hidden pr-2">
        {/* Home Team */}
        <div className="flex items-center gap-2.5 min-w-0">
          {match.home.logo ? (
            <img src={match.home.logo} alt="" className="w-5 h-5 rounded-full object-contain bg-slate-50 p-0.5 border border-slate-100 flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-400">H</div>
          )}
          <span
            className={`text-[13px] sm:text-sm truncate leading-tight tracking-tight ${
              winnerA 
                ? 'font-black text-slate-900' 
                : match.isFinished 
                  ? 'text-slate-400 font-normal' 
                  : 'text-slate-700 font-semibold'
            }`}
            style={{ fontFamily: isEnglish(match.home.name) ? 'sans-serif' : 'var(--font-body)' }}
            lang={isEnglish(match.home.name) ? 'en' : 'bn'}
          >
            {match.home.name}
          </span>
        </div>
        
        {/* Away Team */}
        <div className="flex items-center gap-2.5 min-w-0">
          {match.away.logo ? (
            <img src={match.away.logo} alt="" className="w-5 h-5 rounded-full object-contain bg-slate-50 p-0.5 border border-slate-100 flex-shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-slate-400">A</div>
          )}
          <span
            className={`text-[13px] sm:text-sm truncate leading-tight tracking-tight ${
              winnerB 
                ? 'font-black text-slate-900' 
                : match.isFinished 
                  ? 'text-slate-400 font-normal' 
                  : 'text-slate-700 font-semibold'
            }`}
            style={{ fontFamily: isEnglish(match.away.name) ? 'sans-serif' : 'var(--font-body)' }}
            lang={isEnglish(match.away.name) ? 'en' : 'bn'}
          >
            {match.away.name}
          </span>
        </div>
      </div>

      {/* Col 3: Scores */}
      <div className="flex flex-col items-end justify-center gap-2.5 min-w-[40px] pr-2">
        <span
          className={`text-base font-black tabular-nums tracking-tighter ${
            match.isLive
              ? 'text-[#d93025]'
              : winnerA
                ? 'text-slate-900'
                : 'text-slate-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {match.home.score !== null ? toBn(match.home.score) : match.isFinished ? '০' : ''}
        </span>
        <span
          className={`text-base font-black tabular-nums tracking-tighter ${
            match.isLive
              ? 'text-[#d93025]'
              : winnerB
                ? 'text-slate-900'
                : 'text-slate-400'
          }`}
          style={{ fontFamily: 'var(--font-body)' }}
        >
          {match.away.score !== null ? toBn(match.away.score) : match.isFinished ? '০' : ''}
        </span>
      </div>
    </Link>
  );
}

// ─── League Group ─────────────────────────────────────────────────────────────
function LeagueGroup({ league, matches, defaultOpen }: { league: string; matches: ESPNMatch[]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const liveCount = matches.filter((m) => m.isLive).length;
  
  // Find league logo from the first match in the group
  const leagueLogo = matches[0]?.leagueLogo;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-4 transition-all">
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-3 w-full px-4 py-3.5 bg-gradient-to-r from-slate-50 to-white hover:from-slate-100/60 hover:to-slate-50/60 transition-colors border-none cursor-pointer text-left"
      >
        {leagueLogo && (
          <img src={leagueLogo} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
        )}
        <span 
          className="text-xs sm:text-[13px] font-black text-slate-800 flex-1 tracking-tight"
          style={{ fontFamily: 'sans-serif' }}
        >
          {league}
        </span>
        {liveCount > 0 && (
          <span className="text-[9px] font-black text-white bg-[#d93025] rounded-full px-2.5 py-0.5 tracking-wider animate-pulse uppercase">
            {liveCount} Live
          </span>
        )}
        <span className={`text-[10px] text-slate-400 transition-transform duration-300 font-bold px-1 ${open ? 'rotate-180' : 'rotate-0'}`}>
          ▼
        </span>
      </button>

      {/* Matches */}
      {open && (
        <div className="divide-y divide-slate-100">
          {matches.map((m) => (
            <MatchRow key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type Filter = 'all' | 'live' | 'finished' | 'upcoming';

export default function ScoresPage() {
  const [matches, setMatches] = useState<ESPNMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  async function fetchScores() {
    try {
      const res = await fetch('/api/scores');
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setMatches(data.matches || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to load scores:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchScores();
    const iv = setInterval(fetchScores, 30000);
    return () => clearInterval(iv);
  }, []);

  const filtered = useMemo(() => {
    let base = matches;
    if (filter === 'live') base = matches.filter((m) => m.isLive);
    if (filter === 'finished') base = matches.filter((m) => m.isFinished && !m.isLive);
    if (filter === 'upcoming') base = matches.filter((m) => !m.isLive && !m.isFinished);
    
    // sort: live first, then upcoming, then finished
    return [...base].sort((a, b) => {
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      if (!a.isFinished && b.isFinished) return -1;
      if (a.isFinished && !b.isFinished) return 1;
      return 0;
    });
  }, [matches, filter]);

  // Group matches by league
  const grouped = useMemo(() => groupByLeague(filtered), [filtered]);

  // Sort groups: FIFA / World Cup leagues at the top of the feed
  const sortedGroupedEntries = useMemo(() => {
    return Array.from(grouped.entries()).sort((a, b) => {
      const prioA = getLeaguePriority(a[0]);
      const prioB = getLeaguePriority(b[0]);
      if (prioA !== prioB) return prioA - prioB;
      return a[0].localeCompare(b[0]); // alphabetical secondary sort
    });
  }, [grouped]);

  const liveCount = matches.filter((m) => m.isLive).length;
  const finishedCount = matches.filter((m) => m.isFinished && !m.isLive).length;
  const upcomingCount = matches.filter((m) => !m.isLive && !m.isFinished).length;

  const filterBtn = (f: Filter, label: string, count?: number, red?: boolean) => {
    const isSelected = filter === f;
    return (
      <button
        onClick={() => setFilter(f)}
        className={`flex items-center gap-1.5 px-4 py-2 border-none rounded-full text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs ${
          isSelected 
            ? red 
              ? 'bg-[#d93025] text-white scale-105 shadow-sm font-black' 
              : 'bg-slate-900 text-white scale-105 shadow-sm font-black'
            : red && count && count > 0
              ? 'bg-red-50 text-[#d93025] hover:bg-red-100'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-800'
        }`}
        style={{ fontFamily: 'var(--font-body)' }}
      >
        {label}
        {count !== undefined && count > 0 && (
          <span
            className={`text-[10px] font-black rounded-full px-1.5 py-0.2 select-none ${
              isSelected 
                ? 'bg-white/25 text-white' 
                : red 
                  ? 'bg-[#d93025] text-white' 
                  : 'bg-slate-300 text-slate-700'
            }`}
          >
            {count}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 pt-6 pb-20 bg-slate-50/30 min-h-screen">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            href="/" 
            className="flex items-center gap-1 text-xs font-black text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider text-decoration-none"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            মাঠ
          </Link>
          {lastUpdated && (
            <span 
              className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200/50"
              style={{ fontFamily: 'var(--font-body)' }}
            >
              আপডেট: <ClientFormattedDate date={lastUpdated} mode="time-seconds" lang="bn" />
            </span>
          )}
        </div>
        <h1 
          className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-none"
          style={{ fontFamily: 'var(--font-headline)' }}
        >
          লাইভ স্কোর
        </h1>

      </div>

      {/* Filter Bar */}
      <div className="flex gap-2.5 overflow-x-auto py-3.5 mb-5 sticky top-0 bg-slate-50/90 backdrop-blur-md z-30 border-b border-slate-100 scrollbar-none">
        {filterBtn('all', 'সব')}
        {filterBtn('live', 'লাইভ', liveCount, true)}
        {filterBtn('finished', 'শেষ', finishedCount)}
        {filterBtn('upcoming', 'আসন্ন', upcomingCount)}
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center">
          <div style={{ display: 'inline-block', width: 32, height: 32, border: '3.5px solid #e2e8f0', borderTopColor: '#d93025', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p className="mt-4 text-xs font-black text-slate-400 uppercase tracking-widest" style={{ fontFamily: 'var(--font-body)' }}>লোড হচ্ছে...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : sortedGroupedEntries.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-400" style={{ fontFamily: 'var(--font-body)' }}>
            {filter === 'live' ? 'এই মুহূর্তে কোনো লাইভ ম্যাচ নেই' : 'কোনো ম্যাচ পাওয়া যায়নি'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {sortedGroupedEntries.map(([league, leagueMatches]) => (
            <LeagueGroup
              key={league}
              league={league}
              matches={leagueMatches}
              defaultOpen={leagueMatches.some((m) => m.isLive) || getLeaguePriority(league) === 1}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      {!loading && matches.length > 0 && (
        <p 
          className="text-[10px] font-bold text-slate-400 text-center mt-8 px-4"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          তথ্যসূত্র: ESPN API · {toBn(matches.length)}টি ম্যাচ
        </p>
      )}
    </div>
  );
}
