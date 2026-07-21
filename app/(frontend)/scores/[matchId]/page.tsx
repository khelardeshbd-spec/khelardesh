'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TacticalPitch from '@/components/frontend/TacticalPitch';
import CommentSection from '@/components/frontend/CommentSection';
interface MatchDetails {
  matchId: string;
  league: string;
  category: string;
  leagueLogo?: string;
  status: {
    detail: string;
    displayClock: string;
    isLive: boolean;
    isFinished: boolean;
  };
  home: {
    id: string;
    name: string;
    abbreviation: string;
    score: number | string | null;
    logo: string;
  };
  away: {
    id: string;
    name: string;
    abbreviation: string;
    score: number | string | null;
    logo: string;
  };
  scorers: { teamId: string; athlete: string; time: string }[];
  rosters: any[];
  stats: { name: string; home: string; away: string }[];
  sport_type?: string;
}

function renderSportDetails(match: MatchDetails) {
  if (match.sport_type === 'cricket' || match.sport_type === 'bd-cricket') {
    return (
      <div className="space-y-6">
        {/* Cricket Pitch Illustration */}
        <div className="relative rounded-2xl bg-gradient-to-b from-emerald-600 to-emerald-800 p-6 shadow-md overflow-hidden text-white flex flex-col items-center">
          {/* Turf lines */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 bg-amber-100/90 border-y-4 border-dashed border-white/20 flex items-center justify-between px-12">
            {/* Wickets left */}
            <div className="flex gap-1 h-12 items-end border-b-2 border-white/40 pb-1">
              <div className="w-1 h-10 bg-amber-700/80 rounded-full" />
              <div className="w-1 h-10 bg-amber-700/80 rounded-full" />
              <div className="w-1 h-10 bg-amber-700/80 rounded-full" />
            </div>
            {/* Cricket Ball */}
            <div className="w-4 h-4 bg-red-600 rounded-full shadow-lg border border-red-700 flex items-center justify-center text-[10px]">🏏</div>
            {/* Wickets right */}
            <div className="flex gap-1 h-12 items-end border-b-2 border-white/40 pb-1">
              <div className="w-1 h-10 bg-amber-700/80 rounded-full" />
              <div className="w-1 h-10 bg-amber-700/80 rounded-full" />
              <div className="w-1 h-10 bg-amber-700/80 rounded-full" />
            </div>
          </div>
          
          <div className="relative z-10 w-full flex justify-between items-center mt-20 mb-4 px-4 sm:px-8">
            <div className="flex flex-col items-center gap-1.5 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-300 drop-shadow-md">{match.home.score || '০'}</span>
              <span className="text-xs text-emerald-100 font-semibold">{match.home.name}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-black/30 px-3 py-1 rounded-full text-emerald-300 border border-emerald-500/20">{match.status.detail}</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-amber-300 drop-shadow-md">{match.away.score || '০'}</span>
              <span className="text-xs text-emerald-100 font-semibold">{match.away.name}</span>
            </div>
          </div>
        </div>
        
        {/* Match Info Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🏏</span> ক্রিকেট ম্যাচ তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">টুর্নামেন্ট / লিগ</div>
              <div className="font-extrabold text-slate-700">{match.league}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">খেলার ধরন</div>
              <div className="font-extrabold text-slate-700">ক্রিকেট ম্যাচ</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (match.sport_type === 'tennis') {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl bg-gradient-to-b from-blue-600 to-indigo-750 p-6 shadow-md overflow-hidden text-white flex flex-col items-center">
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-white/40" />
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/40 flex items-center justify-center">
            <div className="w-16 h-4 bg-white/20 border border-white/40 rounded flex items-center justify-center text-[8px] font-bold tracking-widest text-white/90">NET</div>
          </div>
          
          <div className="relative z-10 w-full flex justify-between items-center my-12 px-4 sm:px-8">
            <div className="flex flex-col items-center gap-1 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-md">{match.home.score || '০'}</span>
              <span className="text-xs text-blue-100 font-semibold">{match.home.name}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-black/30 px-3 py-1 rounded-full text-yellow-300 border border-white/10">{match.status.detail}</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-yellow-300 drop-shadow-md">{match.away.score || '০'}</span>
              <span className="text-xs text-blue-100 font-semibold">{match.away.name}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🎾</span> টেনিস ম্যাচ তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">টুর্নামেন্ট</div>
              <div className="font-extrabold text-slate-700">{match.league}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">খেলার ধরন</div>
              <div className="font-extrabold text-slate-700">টেনিস টুর্নামেন্ট</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (match.sport_type === 'basketball') {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl bg-gradient-to-b from-amber-700 to-amber-900 p-6 shadow-md overflow-hidden text-white flex flex-col items-center">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white/20" />
          
          <div className="relative z-10 w-full flex justify-between items-center my-12 px-4 sm:px-8">
            <div className="flex flex-col items-center gap-1 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-orange-300 drop-shadow-md">{match.home.score || '০'}</span>
              <span className="text-xs text-amber-100 font-semibold">{match.home.name}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-black/30 px-3 py-1 rounded-full text-orange-300 border border-white/10">{match.status.detail}</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-orange-300 drop-shadow-md">{match.away.score || '০'}</span>
              <span className="text-xs text-amber-100 font-semibold">{match.away.name}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🏀</span> বাস্কেটবল ম্যাচ তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">টুর্নামেন্ট / লিগ</div>
              <div className="font-extrabold text-slate-700">{match.league}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">খেলার ধরন</div>
              <div className="font-extrabold text-slate-700">বাস্কেটবল টুর্নামেন্ট</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (match.sport_type === 'f1') {
    return (
      <div className="space-y-6">
        <div className="relative rounded-2xl bg-gradient-to-b from-zinc-700 to-zinc-900 p-6 shadow-md overflow-hidden text-white flex flex-col items-center">
          <div className="absolute inset-y-0 inset-x-8 border-x-4 border-dashed border-white/20 pointer-events-none" />
          
          <div className="relative z-10 w-full flex justify-between items-center my-12 px-4 sm:px-8">
            <div className="flex flex-col items-center gap-1 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-red-400 drop-shadow-md">{match.home.score || '—'}</span>
              <span className="text-xs text-zinc-300 font-semibold">{match.home.name}</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-[10px] uppercase font-extrabold tracking-widest bg-black/30 px-3 py-1 rounded-full text-red-400 border border-white/10">{match.status.detail}</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1 text-center">
              <span className="text-xl sm:text-2xl font-black text-red-400 drop-shadow-md">{match.away.score || '—'}</span>
              <span className="text-xs text-zinc-300 font-semibold">{match.away.name}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
            <span>🏎️</span> ফর্মুলা ওয়ান তথ্য
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">গ্র্যান্ড প্রিক্স / ইভেন্ট</div>
              <div className="font-extrabold text-slate-700">{match.league}</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <div className="text-xs text-slate-400 font-bold uppercase mb-1">খেলার ধরন</div>
              <div className="font-extrabold text-slate-700">মোটরস্পোর্ট রেস</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Generic fallback
  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl bg-gradient-to-b from-slate-700 to-slate-900 p-6 shadow-md overflow-hidden text-white flex flex-col items-center">
        <div className="relative z-10 w-full flex justify-between items-center my-12 px-4 sm:px-8">
          <div className="flex flex-col items-center gap-1 flex-1 text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-300 drop-shadow-md">{match.home.score || '০'}</span>
            <span className="text-xs text-slate-200 font-semibold">{match.home.name}</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[10px] uppercase font-extrabold tracking-widest bg-black/30 px-3 py-1 rounded-full text-slate-300 border border-white/10">{match.status.detail}</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1 text-center">
            <span className="text-xl sm:text-2xl font-black text-slate-300 drop-shadow-md">{match.away.score || '০'}</span>
            <span className="text-xs text-slate-200 font-semibold">{match.away.name}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
        <h3 className="text-base font-black text-slate-800 border-b border-slate-100 pb-3 flex items-center gap-2">
          <span>🏆</span> ম্যাচ তথ্য
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-50 p-3 rounded-xl">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">টুর্নামেন্ট / লিগ</div>
            <div className="font-extrabold text-slate-700">{match.league}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl">
            <div className="text-xs text-slate-400 font-bold uppercase mb-1">খেলার ধরন</div>
            <div className="font-extrabold text-slate-700">{match.category || 'স্পোর্টস'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MatchCenterPage({ params }: { params: { matchId: string } }) {
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'lineup' | 'stats' | 'info'>('lineup');

  useEffect(() => {
    async function fetchDetails() {
      try {
        const res = await fetch(`/api/scores/${params.matchId}`);
        if (!res.ok) throw new Error('Failed to load match details');
        const data = await res.json();
        setMatch(data);

        const isFoot = data.sport_type === 'football' || data.sport_type === 'bd-football' || !data.sport_type;
        if (!isFoot) {
          setActiveTab('info');
        } else {
          const homeR = data.rosters?.find((r: any) => r.teamId === data.home.id) || data.rosters?.[0];
          const awayR = data.rosters?.find((r: any) => r.teamId === data.away.id) || data.rosters?.[1];
          const hasLine = homeR?.starters?.length > 0 && awayR?.starters?.length > 0;
          
          if (!hasLine && data.stats && data.stats.length > 0) {
            setActiveTab('stats');
          } else {
            setActiveTab('lineup');
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
    
    // Refresh live match details every 15 seconds if active
    const iv = setInterval(fetchDetails, 15000);
    return () => clearInterval(iv);
  }, [params.matchId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]" style={{ backgroundColor: '#ffffff' }}>
        <div style={{ display: 'inline-block', width: 32, height: 32, border: '3px solid var(--ink-border)', borderTopColor: 'var(--live-red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p className="mt-4 text-sm font-semibold text-gray-500" style={{ fontFamily: 'var(--font-body)' }}>ম্যাচ তথ্য লোড হচ্ছে...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="max-w-[700px] mx-auto px-4 py-16 text-center" style={{ backgroundColor: '#ffffff', fontFamily: 'var(--font-body)' }}>
        <p className="text-base text-gray-500">ম্যাচ বিস্তারিত পাওয়া যায়নি।</p>
        <Link href="/scores" className="mt-4 inline-block text-xs font-bold text-[#d33f3f] hover:underline">
          ← লাইভ স্কোরবোর্ড
        </Link>
      </div>
    );
  }

  const homeRoster = match.rosters?.find(r => r.teamId === match.home.id) || match.rosters?.[0];
  const awayRoster = match.rosters?.find(r => r.teamId === match.away.id) || match.rosters?.[1];

  const hasLineup = homeRoster?.starters?.length > 0 && awayRoster?.starters?.length > 0;
  const isScheduled = !match.status.isLive && !match.status.isFinished;
  const isFootball = match.sport_type === 'football' || match.sport_type === 'bd-football' || !match.sport_type;

  return (
    <div className="max-w-[700px] mx-auto pb-12 bg-[#f8fafc]" style={{ color: '#121212', fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', minHeight: '100vh' }}>
      
      {/* MATCH HEADER (GRADIENT) */}
      <div className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 pt-6 pb-8 shadow-xl relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
        
        <div className="relative z-10 max-w-[700px] mx-auto">
          {/* Back & League Badge Row */}
          <div className="flex justify-between items-center mb-6">
            <Link href="/scores" className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-white transition-colors bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
              লাইভ স্কোরবোর্ড
            </Link>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/5 rounded-full px-3 py-1.5">
              {match.leagueLogo && (
                <img src={match.leagueLogo} alt="" className="w-4 h-4 object-contain filter drop-shadow-sm" />
              )}
              <span className="text-[10px] font-bold text-gray-200 uppercase tracking-widest">
                {match.league}
              </span>
            </div>
          </div>

          {/* SCOREBOARD CORE */}
          <div className="flex items-center justify-between mb-4 mt-2">
            {/* Home Team */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full"></div>
                {match.home.logo ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/15 shadow-2xl flex items-center justify-center bg-slate-800 relative z-10">
                    <img src={match.home.logo} alt={match.home.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 font-bold text-2xl relative z-10">H</div>
                )}
              </div>
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-center leading-tight drop-shadow-md text-slate-100" style={{ fontFamily: 'system-ui, sans-serif' }}>{match.home.name}</span>
            </div>

            {/* Scores & Status */}
            <div className="flex flex-col items-center justify-center flex-shrink-0 px-2 sm:px-4">
              <div className="flex items-center justify-center mb-1">
                {match.status.isLive && (
                  <span className="flex h-2 w-2 relative mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                <span className={`text-[10px] uppercase font-black tracking-widest ${match.status.isLive ? 'text-red-400' : 'text-gray-400'}`}>
                  {match.status.isLive ? 'LIVE' : match.status.isFinished ? 'FINAL' : 'SCHEDULED'}
                </span>
              </div>
              
              <div className="flex items-center gap-3 sm:gap-4 my-1">
                <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter drop-shadow-lg">
                  {match.home.score !== null ? match.home.score : '-'}
                </span>
                <span className="text-white/30 text-2xl font-black mb-1">:</span>
                <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter drop-shadow-lg">
                  {match.away.score !== null ? match.away.score : '-'}
                </span>
              </div>

              <div className="mt-2 text-center">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md border ${match.status.isLive ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-white/10 text-gray-300 border-white/10'}`}>
                  {match.status.displayClock || match.status.detail}
                </span>
              </div>
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative mb-3">
                <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full"></div>
                {match.away.logo ? (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white/15 shadow-2xl flex items-center justify-center bg-slate-800 relative z-10">
                    <img src={match.away.logo} alt={match.away.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 font-bold text-2xl relative z-10">A</div>
                )}
              </div>
              <span className="text-sm sm:text-base font-extrabold tracking-tight text-center leading-tight drop-shadow-md text-slate-100" style={{ fontFamily: 'system-ui, sans-serif' }}>{match.away.name}</span>
            </div>
          </div>

        {/* Goal Scorers list */}
          {match.scorers && match.scorers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-[11px] sm:text-xs text-gray-300">
              {/* Home scorers */}
              <div className="text-left space-y-1">
                {match.scorers.filter(s => s.teamId === match.home.id).map((s, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                    <span className="font-semibold text-white">{s.athlete}</span>
                    <span className="text-white/50">{s.time}</span>
                  </div>
                ))}
              </div>
              {/* Away scorers */}
              <div className="text-right space-y-1">
                {match.scorers.filter(s => s.teamId === match.away.id).map((s, idx) => (
                  <div key={idx} className="flex items-center justify-end gap-1.5">
                    <span className="text-white/50">{s.time}</span>
                    <span className="font-semibold text-white">{s.athlete}</span>
                    <svg className="w-3 h-3 text-white/50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="max-w-[700px] mx-auto px-4 -mt-4 relative z-20">
        
        {/* NAV TABS (Modern Premium Segmented Control) */}
        {isFootball && (
          <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1.5 mb-6 border border-slate-200/50 shadow-inner">
            <button
              onClick={() => setActiveTab('lineup')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 border-none cursor-pointer ${
                activeTab === 'lineup' 
                  ? 'bg-white text-slate-800 shadow-sm scale-102' 
                  : 'text-slate-500 hover:text-slate-850 hover:bg-white/40'
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              লাইনআপ (ফরমেশন)
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 border-none cursor-pointer ${
                activeTab === 'stats' 
                  ? 'bg-white text-slate-800 shadow-sm scale-102' 
                  : 'text-slate-500 hover:text-slate-850 hover:bg-white/40'
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              পরিসংখ্যান
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all duration-200 border-none cursor-pointer ${
                activeTab === 'info' 
                  ? 'bg-white text-slate-800 shadow-sm scale-102' 
                  : 'text-slate-500 hover:text-slate-850 hover:bg-white/40'
              }`}
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              দল ও স্কোয়াড
            </button>
          </div>
        )}

        {/* TAB CONTENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          {isFootball ? (
            <>
              {/* LINEUP TAB */}
              {activeTab === 'lineup' && (
            <div>
              {hasLineup ? (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base font-black text-gray-800">Starting XI & Substitutes</h3>
                  </div>
                  
                  {/* TACTICAL PITCH VISUALIZATION */}
                  <div className="mb-8">
                    <TacticalPitch homeRoster={homeRoster} awayRoster={awayRoster} />
                  </div>

                  {/* Player List View */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    {/* Home Team Column */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-4 p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-100 min-w-0">
                        {match.home.logo && <img src={match.home.logo} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" />}
                        <span className="text-xs sm:text-sm font-black text-gray-800 truncate leading-tight">{match.home.name}</span>
                        <span className="ml-auto text-[9px] sm:text-[10px] bg-[#326891] text-white font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap flex-shrink-0 leading-tight">{homeRoster?.formation}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1">Starters</div>
                        {homeRoster?.starters?.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="relative">
                              {p.avatar ? (
                                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold text-xs">{p.jersey || p.name.slice(0, 2)}</div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#326891] rounded-full flex items-center justify-center text-[9px] font-black text-white border border-white shadow-sm">
                                {p.jersey}
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-gray-800 truncate">{p.name}</span>
                                {p.goals > 0 && <span className="text-xs" title={`${p.goals} Goals`}>⚽{p.goals > 1 ? `x${p.goals}` : ''}</span>}
                                {p.cards?.map((c: string, i: number) => (
                                  <span key={i} className={`inline-block w-2 h-3 rounded-xs border border-white shadow-xs ${c === 'red' ? 'bg-[#d93025]' : 'bg-[#f9ab00]'}`} />
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                                <span>{p.position}</span>
                                {p.subbedOut && <span className="text-[9px] text-[#d93025] font-semibold">↓ {p.subbedOut}</span>}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-6 mb-2 px-1">Substitutes</div>
                        {homeRoster?.bench?.map((p: any) => (
                          <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl opacity-80 hover:opacity-100 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                            <div className="relative">
                              {p.avatar ? (
                                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200 grayscale-[30%]" />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-[10px]">{p.jersey || p.name.slice(0, 2)}</div>
                              )}
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-[8px] font-black text-white border border-white">
                                {p.jersey}
                              </div>
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-gray-600 truncate">{p.name}</span>
                                {p.goals > 0 && <span className="text-xs">⚽{p.goals > 1 ? `x${p.goals}` : ''}</span>}
                                {p.cards?.map((c: string, i: number) => (
                                  <span key={i} className={`inline-block w-2 h-3 rounded-xs border border-white shadow-xs ${c === 'red' ? 'bg-[#d93025]' : 'bg-[#f9ab00]'}`} />
                                ))}
                              </div>
                              <div className="flex items-center gap-1.5 text-[9px] text-gray-400">
                                <span>{p.position}</span>
                                {p.subbedIn && <span className="text-[9px] text-[#1e8e3e] font-semibold">↑ {p.subbedIn}</span>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Away Team Column */}
                    <div>
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-4 p-1.5 sm:p-2 bg-gray-50 rounded-lg border border-gray-100 min-w-0">
                        {match.away.logo && <img src={match.away.logo} alt="" className="w-5 h-5 sm:w-6 sm:h-6 object-contain flex-shrink-0" />}
                        <span className="text-xs sm:text-sm font-black text-gray-800 truncate leading-tight">{match.away.name}</span>
                        <span className="ml-auto text-[9px] sm:text-[10px] bg-[#d33f3f] text-white font-bold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap flex-shrink-0 leading-tight">{awayRoster?.formation}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1 text-right">Starters</div>
                        {awayRoster?.starters?.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-end text-right gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center justify-end gap-1.5">
                                {p.cards?.map((c: string, i: number) => (
                                  <span key={i} className={`inline-block w-2 h-3 rounded-xs border border-white shadow-xs ${c === 'red' ? 'bg-[#d93025]' : 'bg-[#f9ab00]'}`} />
                                ))}
                                {p.goals > 0 && <span className="text-xs" title={`${p.goals} Goals`}>⚽{p.goals > 1 ? `x${p.goals}` : ''}</span>}
                                <span className="text-xs font-bold text-gray-800 truncate">{p.name}</span>
                              </div>
                              <div className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-gray-500">
                                {p.subbedOut && <span className="text-[9px] text-[#d93025] font-semibold">↓ {p.subbedOut}</span>}
                                <span>{p.position}</span>
                              </div>
                            </div>
                            <div className="relative">
                              {p.avatar ? (
                                <div className="w-10 h-10 rounded-full relative overflow-hidden bg-gray-100 border border-gray-200">
                                  <img 
                                    src={p.avatar} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover z-10" 
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-xs z-0">{p.name.slice(0, 2)}</div>
                                </div>
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 flex items-center justify-center text-gray-500 font-bold text-xs">{p.jersey || p.name.slice(0, 2)}</div>
                              )}
                              <div className="absolute -bottom-1 -left-1 w-5 h-5 bg-[#d33f3f] rounded-full flex items-center justify-center text-[9px] font-black text-white border border-white shadow-sm">
                                {p.jersey}
                              </div>
                            </div>
                          </div>
                        ))}

                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-6 mb-2 px-1 text-right">Substitutes</div>
                        {awayRoster?.bench?.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-end text-right gap-3 p-2 rounded-xl opacity-80 hover:opacity-100 hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100">
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center justify-end gap-1.5">
                                {p.cards?.map((c: string, i: number) => (
                                  <span key={i} className={`inline-block w-2 h-3 rounded-xs border border-white shadow-xs ${c === 'red' ? 'bg-[#d93025]' : 'bg-[#f9ab00]'}`} />
                                ))}
                                {p.goals > 0 && <span className="text-xs">⚽{p.goals > 1 ? `x${p.goals}` : ''}</span>}
                                <span className="text-xs font-bold text-gray-600 truncate">{p.name}</span>
                              </div>
                              <div className="flex items-center justify-end gap-1.5 text-[9px] text-gray-400">
                                {p.subbedIn && <span className="text-[9px] text-[#1e8e3e] font-semibold">↑ {p.subbedIn}</span>}
                                <span>{p.position}</span>
                              </div>
                            </div>
                            <div className="relative">
                              {p.avatar ? (
                                <div className="w-8 h-8 rounded-full relative overflow-hidden bg-gray-100 border border-gray-200 grayscale-[30%]">
                                  <img 
                                    src={p.avatar} 
                                    alt={p.name} 
                                    className="w-full h-full object-cover z-10"
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-[10px] z-0">{p.name.slice(0, 2)}</div>
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-[10px]">{p.jersey || p.name.slice(0, 2)}</div>
                              )}
                              <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-[8px] font-black text-white border border-white">
                                {p.jersey}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : isScheduled ? (
                <div className="py-20 px-4 text-center rounded-2xl bg-gray-50 w-full animate-in fade-in duration-500 border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="font-black text-base text-gray-800">Match has not started yet</p>
                  <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">Lineups are typically released 30–60 minutes before kick-off. Check back later!</p>
                </div>
              ) : (
                <div className="py-20 px-4 text-center rounded-2xl bg-gray-50 w-full animate-in fade-in duration-500 border border-dashed border-gray-200">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                    <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </div>
                  <p className="font-black text-base text-gray-800">Lineup not available</p>
                  <p className="text-sm text-gray-500 mt-2">Check the Stats tab for match statistics.</p>
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-8">
              {match.stats && match.stats.length > 0 ? (
                <div className="flex flex-col gap-6 pt-2">
                  {match.stats.map((stat, idx) => {
                    const homeVal = parseFloat(stat.home) || 0;
                    const awayVal = parseFloat(stat.away) || 0;
                    const total = homeVal + awayVal || 1;
                    const homePct = (homeVal / total) * 100;
                    const awayPct = (awayVal / total) * 100;

                    return (
                      <div key={idx} className="flex flex-col w-full px-2 sm:px-6">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[13px] sm:text-sm font-bold text-[#202124] w-10 text-left">{stat.home}</span>
                          <span className="text-[12px] sm:text-[13px] text-[#70757a] text-center">{stat.name}</span>
                          <span className="text-[13px] sm:text-sm font-bold text-[#202124] w-10 text-right">{stat.away}</span>
                        </div>
                        <div className="flex w-full h-[6px] gap-1">
                          <div className="h-full bg-[#f1f3f4] flex-1 rounded-l-sm overflow-hidden flex justify-end">
                            <div className="h-full bg-[#1a73e8] transition-all duration-1000 ease-out" style={{ width: `${homePct}%` }} />
                          </div>
                          <div className="h-full bg-[#f1f3f4] flex-1 rounded-r-sm overflow-hidden flex justify-start">
                            <div className="h-full bg-[#ea4335] transition-all duration-1000 ease-out" style={{ width: `${awayPct}%` }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-16 text-center text-[#70757a] font-medium">
                  <p>Match has not started yet</p>
                </div>
              )}
            </div>
          )}

          {/* SQUAD INFO TAB */}
          {activeTab === 'info' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              {/* Home Squad Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {match.home.logo && <img src={match.home.logo} alt="" className="w-8 h-8 object-contain filter drop-shadow-sm" />}
                    <h3 className="text-base font-black text-gray-800">{match.home.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-50">
                    {homeRoster?.formation || 'N/A'}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Starters</div>
                  <div className="grid grid-cols-1 gap-2">
                    {homeRoster?.starters?.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          {p.avatar ? (
                            <div className="w-8 h-8 rounded-full relative overflow-hidden bg-gray-100 border border-gray-200">
                              <img 
                                src={p.avatar} 
                                alt={p.name} 
                                className="w-full h-full object-cover z-10" 
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-bold text-[10px] z-0">{p.name.slice(0, 2)}</div>
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-[10px]">{p.jersey || p.name.slice(0, 2)}</div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-gray-800 truncate">{p.name}</span>
                            <span className="text-[10px] font-medium text-gray-500">{p.position}</span>
                          </div>
                        </div>
                        <span className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-600 shadow-sm border border-gray-200">
                          {p.jersey}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] font-black text-gray-400 mt-6 mb-3 uppercase tracking-widest">Substitutes</div>
                  <div className="grid grid-cols-1 gap-2">
                    {homeRoster?.bench?.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-xl opacity-80 hover:opacity-100 hover:bg-gray-50 transition-all">
                        <div className="flex items-center gap-3">
                          {p.avatar ? (
                            <div className="w-6 h-6 rounded-full relative overflow-hidden bg-gray-100 border border-gray-200 grayscale-[30%]">
                              <img 
                                src={p.avatar} 
                                alt={p.name} 
                                className="w-full h-full object-cover z-10"
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-bold text-[9px] z-0">{p.name.slice(0, 2)}</div>
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-[9px]">{p.jersey || p.name.slice(0, 2)}</div>
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-gray-600 truncate">{p.name}</span>
                            <span className="text-[9px] text-gray-400">{p.position}</span>
                          </div>
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 w-5 text-right">{p.jersey}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Away Squad Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#f8fafc] to-[#f1f5f9] p-4 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {match.away.logo && <img src={match.away.logo} alt="" className="w-8 h-8 object-contain filter drop-shadow-sm" />}
                    <h3 className="text-base font-black text-gray-800">{match.away.name}</h3>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-white px-2.5 py-1 rounded-md shadow-sm border border-gray-50">
                    {awayRoster?.formation || 'N/A'}
                  </span>
                </div>
                
                <div className="p-4">
                  <div className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">Starters</div>
                  <div className="grid grid-cols-1 gap-2">
                    {awayRoster?.starters?.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-[10px]">{p.jersey}</div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-800">{p.name}</span>
                            <span className="text-[10px] text-gray-500">{p.position}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-gray-300 w-6 text-right">#{p.jersey}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-[10px] font-black text-gray-400 mt-6 mb-3 uppercase tracking-widest">Substitutes</div>
                  <div className="grid grid-cols-1 gap-1">
                    {awayRoster?.bench?.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors opacity-80 hover:opacity-100">
                        <div className="flex items-center gap-2">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover grayscale-[50%]" />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-[8px]">{p.jersey}</div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-[11px] font-bold text-gray-700">{p.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400">{p.position}</span>
                          <span className="text-[10px] font-black text-gray-300 w-5 text-right">#{p.jersey}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}
            </>
          ) : (
            renderSportDetails(match)
          )}
        </div>

        {/* COMMENT SECTION */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8 mt-6">
          <CommentSection articleSlug={`match-${params.matchId}`} />
        </div>

      </div>
    </div>
  );
}
