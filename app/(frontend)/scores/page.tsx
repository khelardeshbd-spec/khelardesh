'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

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
  if (l === 'ft' || l === 'full time') return 'পূর্ণ সময়';
  if (l === 'ht' || l === 'half time') return 'বিরতি';
  if (l === 'scheduled') return 'আসন্ন';
  if (l === 'live') return 'লাইভ';
  if (l === 'postponed') return 'স্থগিত';
  if (l === 'canceled' || l === 'cancelled') return 'বাতিল';
  if (/^\d+'?$/.test(s.trim())) return toBn(s);
  return s;
}

function formatKickoff(iso: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' });
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

// ─── Match Row ────────────────────────────────────────────────────────────────
function MatchRow({ match }: { match: ESPNMatch }) {
  const isEnglish = (str: string) => /[a-zA-Z]/.test(str);
  const status = translateStatus(match.statusText);
  const isMinute = /^[০-৯0-9]+'?$/.test(status.trim());
  const kickoff = formatKickoff(match.startTime);

  const winnerA = match.isFinished && match.home.isWinner;
  const winnerB = match.isFinished && match.away.isWinner;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '54px 1fr 52px',
        alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid var(--ink-border)',
        background: 'var(--bg-card, #fff)',
        cursor: 'default',
        transition: 'background 0.15s',
        gap: 8,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-subtle, #f9f9f9)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg-card, #fff)')}
    >
      {/* Col 1: Time / Status */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        {match.isLive ? (
          <>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--live-red)', fontFamily: isEnglish(status) ? 'sans-serif' : 'var(--font-body)' }}>
              {status}
            </span>
            <span className="live-dot" style={{ width: 6, height: 6 }} />
          </>
        ) : match.isFinished ? (
          <>
            <span style={{ fontSize: 9, color: 'var(--ink-muted)', fontFamily: 'var(--font-body)' }}>{kickoff}</span>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'var(--ink-ghost)', fontFamily: 'var(--font-body)' }}>
              {status}
            </span>
          </>
        ) : (
          <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-body)' }}>
            {kickoff || status}
          </span>
        )}
      </div>

      {/* Col 2: Teams */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, overflow: 'hidden' }}>
        {/* Home */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {match.home.logo ? (
            <img src={match.home.logo} alt="" width={16} height={16} style={{ borderRadius: '50%', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#e0e0e0', flexShrink: 0 }} />
          )}
          <span
            style={{
              fontFamily: isEnglish(match.home.name) ? 'sans-serif' : 'var(--font-body)',
              fontSize: 13,
              fontWeight: winnerA ? 700 : 400,
              color: winnerA ? 'var(--ink)' : match.isFinished ? 'var(--ink-muted)' : 'var(--ink)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
            lang={isEnglish(match.home.name) ? 'en' : 'bn'}
          >
            {match.home.name}
          </span>
        </div>
        {/* Away */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {match.away.logo ? (
            <img src={match.away.logo} alt="" width={16} height={16} style={{ borderRadius: '50%', flexShrink: 0 }} />
          ) : (
            <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#e0e0e0', flexShrink: 0 }} />
          )}
          <span
            style={{
              fontFamily: isEnglish(match.away.name) ? 'sans-serif' : 'var(--font-body)',
              fontSize: 13,
              fontWeight: winnerB ? 700 : 400,
              color: winnerB ? 'var(--ink)' : match.isFinished ? 'var(--ink-muted)' : 'var(--ink)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}
            lang={isEnglish(match.away.name) ? 'en' : 'bn'}
          >
            {match.away.name}
          </span>
        </div>
      </div>

      {/* Col 3: Scores */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            color: match.isLive
              ? 'var(--live-red)'
              : winnerA
              ? 'var(--ink)'
              : 'var(--ink-muted)',
            lineHeight: 1,
          }}
        >
          {match.home.score !== null ? toBn(match.home.score) : match.isFinished ? '০' : ''}
        </span>
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'var(--font-body)',
            color: match.isLive
              ? 'var(--live-red)'
              : winnerB
              ? 'var(--ink)'
              : 'var(--ink-muted)',
            lineHeight: 1,
          }}
        >
          {match.away.score !== null ? toBn(match.away.score) : match.isFinished ? '০' : ''}
        </span>
      </div>
    </div>
  );
}

// ─── League Group ─────────────────────────────────────────────────────────────
function LeagueGroup({ league, matches, defaultOpen }: { league: string; matches: ESPNMatch[]; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const liveCount = matches.filter((m) => m.isLive).length;

  return (
    <div style={{ borderBottom: '1.5px solid var(--ink-border)' }}>
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          width: '100%',
          padding: '10px 16px',
          background: 'var(--bg-subtle, #f5f5f5)',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', fontFamily: 'sans-serif', flex: 1 }}>
          {league}
        </span>
        {liveCount > 0 && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: '#fff',
              background: 'var(--live-red)',
              borderRadius: 99,
              padding: '1px 6px',
              lineHeight: 1.6,
            }}
          >
            {liveCount} লাইভ
          </span>
        )}
        <span style={{ fontSize: 13, color: 'var(--ink-muted)', transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </span>
      </button>

      {/* Matches */}
      {open && (
        <div>
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
    } catch {
      // silent
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

  const grouped = useMemo(() => groupByLeague(filtered), [filtered]);
  const liveCount = matches.filter((m) => m.isLive).length;
  const finishedCount = matches.filter((m) => m.isFinished && !m.isLive).length;
  const upcomingCount = matches.filter((m) => !m.isLive && !m.isFinished).length;

  const filterBtn = (f: Filter, label: string, count?: number, red?: boolean) => (
    <button
      onClick={() => setFilter(f)}
      style={{
        padding: '6px 14px',
        border: 'none',
        borderRadius: 99,
        fontFamily: 'var(--font-body)',
        fontSize: 12,
        fontWeight: filter === f ? 700 : 500,
        cursor: 'pointer',
        background: filter === f ? (red ? 'var(--live-red)' : 'var(--ink)') : 'transparent',
        color: filter === f ? '#fff' : red ? 'var(--live-red)' : 'var(--ink)',
        transition: 'all 0.15s',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            background: filter === f ? 'rgba(255,255,255,0.25)' : (red ? 'var(--live-red)' : 'var(--ink)'),
            color: filter === f ? '#fff' : '#fff',
            borderRadius: 99,
            padding: '0 5px',
            lineHeight: 1.7,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 0 80px' }}>
      {/* Page Header */}
      <div style={{ padding: '0 16px 16px', borderBottom: '2px solid var(--ink-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Link href="/" style={{ fontSize: 12, color: 'var(--ink-muted)', textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
            ← নীড়পাতা
          </Link>
          {lastUpdated && (
            <span style={{ fontSize: 10, color: 'var(--ink-ghost)', fontFamily: 'var(--font-body)' }}>
              আপডেট: {lastUpdated.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: 24, fontWeight: 700, color: 'var(--ink)', margin: '8px 0 0' }}>
          লাইভ স্কোর
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--ink-muted)', marginTop: 4 }}>
          ESPN থেকে সরাসরি আপডেট — প্রতি ৩০ সেকেন্ডে স্বয়ংক্রিয়ভাবে রিফ্রেশ হয়
        </p>
      </div>

      {/* Filter Bar */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: '10px 12px',
          borderBottom: '1px solid var(--ink-border)',
          background: 'var(--bg-card, #fff)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        {filterBtn('all', 'সব')}
        {filterBtn('live', 'লাইভ', liveCount, true)}
        {filterBtn('finished', 'শেষ', finishedCount)}
        {filterBtn('upcoming', 'আসন্ন', upcomingCount)}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid var(--ink-border)', borderTopColor: 'var(--live-red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-muted)', marginTop: 12 }}>লোড হচ্ছে...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : grouped.size === 0 ? (
        <div style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16, color: 'var(--ink-muted)' }}>
            {filter === 'live' ? 'এই মুহূর্তে কোনো লাইভ ম্যাচ নেই' : 'কোনো ম্যাচ পাওয়া যায়নি'}
          </p>
        </div>
      ) : (
        <div style={{ border: '1px solid var(--ink-border)', borderTop: 'none' }}>
          {Array.from(grouped.entries()).map(([league, leagueMatches], i) => (
            <LeagueGroup
              key={league}
              league={league}
              matches={leagueMatches}
              defaultOpen={i === 0 || leagueMatches.some((m) => m.isLive)}
            />
          ))}
        </div>
      )}

      {/* Footer note */}
      {!loading && matches.length > 0 && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--ink-ghost)', textAlign: 'center', marginTop: 24, padding: '0 16px' }}>
          তথ্যসূত্র: ESPN API · {matches.length}টি ম্যাচ
        </p>
      )}
    </div>
  );
}
