'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import TacticalPitch from '@/components/frontend/TacticalPitch';
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
    score: number | null;
    logo: string;
  };
  away: {
    id: string;
    name: string;
    abbreviation: string;
    score: number | null;
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
  const isScheduled = !match.status.isLive && !match.status.isFinished;

  return (
    <div className="max-w-[700px] mx-auto pb-12 bg-[#f8fafc]" style={{ color: '#121212', fontFamily: 'var(--font-body)', minHeight: '100vh' }}>
      
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
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                {match.home.logo ? (
                  <img src={match.home.logo} alt={match.home.name} className="w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10 drop-shadow-2xl" />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 font-bold text-2xl relative z-10">H</div>
                )}
              </div>
              <span className="text-sm sm:text-base font-black tracking-tight text-center leading-tight drop-shadow-md">{match.home.name}</span>
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
                <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
                {match.away.logo ? (
                  <img src={match.away.logo} alt={match.away.name} className="w-20 h-20 sm:w-24 sm:h-24 object-contain relative z-10 drop-shadow-2xl" />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-300 font-bold text-2xl relative z-10">A</div>
                )}
              </div>
              <span className="text-sm sm:text-base font-black tracking-tight text-center leading-tight drop-shadow-md">{match.away.name}</span>
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
        
        {/* NAV TABS (Google-Style Segmented Control) */}
        <div className="bg-white border-b border-gray-200 flex mb-6">
          <button
            onClick={() => setActiveTab('lineup')}
            className={`flex-1 relative py-3.5 text-[13px] sm:text-sm font-medium transition-colors ${activeTab === 'lineup' ? 'text-[#1a73e8]' : 'text-[#70757a] hover:text-[#202124]'}`}
          >
            লাইনআপ (ফরমেশন)
            {activeTab === 'lineup' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#1a73e8] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 relative py-3.5 text-[13px] sm:text-sm font-medium transition-colors ${activeTab === 'stats' ? 'text-[#1a73e8]' : 'text-[#70757a] hover:text-[#202124]'}`}
          >
            পরিসংখ্যান
            {activeTab === 'stats' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#1a73e8] rounded-t-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex-1 relative py-3.5 text-[13px] sm:text-sm font-medium transition-colors ${activeTab === 'info' ? 'text-[#1a73e8]' : 'text-[#70757a] hover:text-[#202124]'}`}
          >
            দল ও স্কোয়াড
            {activeTab === 'info' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[3px] bg-[#1a73e8] rounded-t-full" />
            )}
          </button>
        </div>

        {/* TAB CONTENT */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-8">
          
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
                  <div className="grid grid-cols-2 gap-4">
                    {/* Home Team Column */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        {match.home.logo && <img src={match.home.logo} alt="" className="w-6 h-6 object-contain" />}
                        <span className="text-sm font-black text-gray-800 truncate">{match.home.name}</span>
                        <span className="ml-auto text-[10px] bg-[#326891] text-white font-bold px-2 py-0.5 rounded-full shadow-sm">{homeRoster?.formation}</span>
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
                              <span className="text-xs font-bold text-gray-800 truncate">{p.name}</span>
                              <span className="text-[10px] font-medium text-gray-500">{p.position}</span>
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
                              <span className="text-xs font-bold text-gray-600 truncate">{p.name}</span>
                              <span className="text-[9px] text-gray-400">{p.position}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Away Team Column */}
                    <div>
                      <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-lg border border-gray-100">
                        {match.away.logo && <img src={match.away.logo} alt="" className="w-6 h-6 object-contain" />}
                        <span className="text-sm font-black text-gray-800 truncate">{match.away.name}</span>
                        <span className="ml-auto text-[10px] bg-[#d33f3f] text-white font-bold px-2 py-0.5 rounded-full shadow-sm">{awayRoster?.formation}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-1 text-right">Starters</div>
                        {awayRoster?.starters?.map((p: any) => (
                          <div key={p.id} className="flex items-center justify-end text-right gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-bold text-gray-800 truncate">{p.name}</span>
                              <span className="text-[10px] font-medium text-gray-500">{p.position}</span>
                            </div>
                            <div className="relative">
                              {p.avatar ? (
                                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover bg-gray-100 border border-gray-200" />
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
                              <span className="text-xs font-bold text-gray-600 truncate">{p.name}</span>
                              <span className="text-[9px] text-gray-400">{p.position}</span>
                            </div>
                            <div className="relative">
                              {p.avatar ? (
                                <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover bg-gray-100 border border-gray-200 grayscale-[30%]" />
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
                    {homeRoster?.bench?.map((p: any) => (
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

        </div>
      </div>
    </div>
  );
}
