'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import TacticalPitch from '@/components/frontend/TacticalPitch';

interface MatchDetails {
  matchId: string;
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
    score: number;
    logo: string;
  };
  away: {
    id: string;
    name: string;
    abbreviation: string;
    score: number;
    logo: string;
  };
  scorers: { teamId: string; athlete: string; time: string }[];
  rosters: any[];
  stats: { name: string; home: string; away: string }[];
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

        // Switch default tab to stats if lineups are empty but statistics are available
        const homeR = data.rosters?.find((r: any) => r.teamId === data.home.id) || data.rosters?.[0];
        const awayR = data.rosters?.find((r: any) => r.teamId === data.away.id) || data.rosters?.[1];
        const hasLine = homeR?.starters?.length > 0 && awayR?.starters?.length > 0;
        
        if (!hasLine && data.stats && data.stats.length > 0) {
          setActiveTab('stats');
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

  return (
    <div className="max-w-[700px] mx-auto px-4 py-6" style={{ backgroundColor: '#ffffff', color: '#121212', fontFamily: 'var(--font-body)' }}>
      {/* Back button */}
      <div className="mb-4">
        <Link href="/scores" className="text-xs font-bold text-gray-500 hover:text-[#121212] transition-colors">
          ← লাইভ স্কোরবোর্ড
        </Link>
      </div>

      {/* SCOREBOARD HEADER */}
      <div className="border border-[#e2e2e2] rounded-lg p-5 mb-6 shadow-sm bg-white">
        <div className="grid grid-cols-12 items-center gap-3">
          {/* Home Team */}
          <div className="col-span-4 flex flex-col items-center text-center">
            {match.home.logo ? (
              <img src={match.home.logo} alt={match.home.name} className="w-14 h-14 object-contain mb-2" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold mb-2">H</div>
            )}
            <span className="text-sm font-bold leading-tight">{match.home.name}</span>
          </div>

          {/* Scores & Clock */}
          <div className="col-span-4 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 mb-1">
              {match.status.isLive ? 'LIVE' : match.status.isFinished ? 'FINAL' : 'SCHEDULED'}
            </span>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-black">{match.home.score}</span>
              <span className="text-gray-300 text-lg font-bold">:</span>
              <span className="text-3xl font-black">{match.away.score}</span>
            </div>
            <span 
              className={`text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full ${match.status.isLive ? 'bg-red-50 text-[var(--live-red)]' : 'bg-gray-100 text-gray-500'}`}
            >
              {match.status.displayClock || match.status.detail}
            </span>
          </div>

          {/* Away Team */}
          <div className="col-span-4 flex flex-col items-center text-center">
            {match.away.logo ? (
              <img src={match.away.logo} alt={match.away.name} className="w-14 h-14 object-contain mb-2" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold mb-2">A</div>
            )}
            <span className="text-sm font-bold leading-tight">{match.away.name}</span>
          </div>
        </div>

        {/* Goal Scorers list */}
        {match.scorers && match.scorers.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#f0f0f0] grid grid-cols-2 gap-4 text-[11px] text-gray-500">
            {/* Home scorers */}
            <div className="text-left">
              {match.scorers.filter(s => s.teamId === match.home.id).map((s, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="font-semibold text-gray-700">{s.athlete}</span>
                  <span>({s.time})</span>
                </div>
              ))}
            </div>
            {/* Away scorers */}
            <div className="text-right">
              {match.scorers.filter(s => s.teamId === match.away.id).map((s, idx) => (
                <div key={idx} className="flex items-center justify-end gap-1.5">
                  <span>({s.time})</span>
                  <span className="font-semibold text-gray-700">{s.athlete}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NAV TABS */}
      <div className="flex border-b border-[#e2e2e2] mb-6">
        <button
          onClick={() => setActiveTab('lineup')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'lineup' ? 'border-[#d33f3f] text-[#d33f3f]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          লাইনআপ (ফরমেশন)
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'stats' ? 'border-[#d33f3f] text-[#d33f3f]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          পরিসংখ্যান
        </button>
        <button
          onClick={() => setActiveTab('info')}
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'info' ? 'border-[#d33f3f] text-[#d33f3f]' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          দল ও স্কোয়াড
        </button>
      </div>

      {/* TAB CONTENT */}
      <div>
        {activeTab === 'lineup' && (
          <div className="flex flex-col items-center">
            {hasLineup ? (
              <TacticalPitch homeRoster={homeRoster} awayRoster={awayRoster} />
            ) : (!match.status.isLive && !match.status.isFinished && match.home.score === 0 && match.away.score === 0) ? (
              <div className="py-16 px-4 text-center border border-[#e2e2e2] rounded-lg bg-gray-50 w-full">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zM14.25 15h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15z" />
                </svg>
                <p className="font-bold text-sm text-gray-700">ম্যাচটি এখনও শুরু হয়নি</p>
                <p className="text-xs text-gray-400 mt-1">ম্যাচ শুরু হওয়ার ৩০-৬০ মিনিট আগে সাধারণত দলগুলোর লাইনআপ এবং ফরমেশন প্রকাশ করা হয়।</p>
              </div>
            ) : (
              <div className="py-16 px-4 text-center border border-[#e2e2e2] rounded-lg bg-gray-50 w-full">
                <p className="font-bold text-sm text-gray-700">লাইনআপ পাওয়া যায়নি</p>
                <p className="text-xs text-gray-400 mt-1">এই ম্যাচের জন্য লাইনআপ বা ফরমেশনের তথ্য উপলব্ধ নেই। অনুগ্রহ করে পরিসংখ্যান ট্যাবটি দেখুন।</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="border border-[#e2e2e2] rounded-lg p-5 bg-white shadow-sm">
            <h3 className="text-sm font-bold mb-4 border-b pb-2 text-gray-700">ম্যাচ পরিসংখ্যান</h3>
            {match.stats && match.stats.length > 0 ? (
              <div className="flex flex-col gap-5">
                {match.stats.map((stat, idx) => {
                  const homeVal = parseFloat(stat.home) || 0;
                  const awayVal = parseFloat(stat.away) || 0;
                  const total = homeVal + awayVal || 1;
                  const homePct = (homeVal / total) * 100;
                  const awayPct = (awayVal / total) * 100;

                  return (
                    <div key={idx} className="flex flex-col">
                      <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                        <span>{stat.home}</span>
                        <span className="text-gray-400 font-medium">{stat.name}</span>
                        <span>{stat.away}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-[#326891]" style={{ width: `${homePct}%` }} />
                        <div className="h-full bg-[#d33f3f]" style={{ width: `${awayPct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-12 text-center text-gray-400 text-sm">
                পরিসংখ্যান এখনও উপলব্ধ নয়।
              </div>
            )}
          </div>
        )}

        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Home Team Squad */}
            <div className="border border-[#e2e2e2] rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-[#326891] border-b pb-2 mb-3 flex justify-between">
                <span>{match.home.name}</span>
                <span className="text-xs text-gray-400">ফরমেশন: {homeRoster?.formation || 'N/A'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-gray-400 mt-1 uppercase">Starters</div>
                {homeRoster?.starters?.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-gray-400 font-bold">#{p.jersey}</span>
                      <span className="font-semibold">{p.name}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{p.position}</span>
                  </div>
                ))}
                
                <div className="text-xs font-bold text-gray-400 mt-4 uppercase">Substitutes</div>
                {homeRoster?.bench?.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-gray-400 font-bold">#{p.jersey}</span>
                      <span className="font-semibold">{p.name}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{p.position}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Away Team Squad */}
            <div className="border border-[#e2e2e2] rounded-lg p-4 bg-white shadow-sm">
              <h3 className="text-sm font-bold text-[#d33f3f] border-b pb-2 mb-3 flex justify-between">
                <span>{match.away.name}</span>
                <span className="text-xs text-gray-400">ফরমেশন: {awayRoster?.formation || 'N/A'}</span>
              </h3>
              <div className="flex flex-col gap-2">
                <div className="text-xs font-bold text-gray-400 mt-1 uppercase">Starters</div>
                {awayRoster?.starters?.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-gray-400 font-bold">#{p.jersey}</span>
                      <span className="font-semibold">{p.name}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{p.position}</span>
                  </div>
                ))}
                
                <div className="text-xs font-bold text-gray-400 mt-4 uppercase">Substitutes</div>
                {awayRoster?.bench?.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-gray-50">
                    <span className="flex items-center gap-2">
                      <span className="w-5 text-gray-400 font-bold">#{p.jersey}</span>
                      <span className="font-semibold">{p.name}</span>
                    </span>
                    <span className="text-[10px] text-gray-400">{p.position}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
