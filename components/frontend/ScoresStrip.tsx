'use client';

import Link from 'next/link';
import { useLiveScores } from '@/hooks/useLiveScores';

function formatStatus(isLive: boolean, minute: string | null, utcTime?: string, homeScore?: number | null) {
  if (isLive) {
    return {
      text: minute || 'Live',
      isLive: true
    };
  }
  
  if (homeScore !== null) {
    return {
      text: 'পূর্ণ সময়',
      isLive: false
    };
  }

  if (!utcTime) return { text: '', isLive: false };

  try {
    const date = new Date(utcTime);
    // Format to e.g., "3:00 PM"
    return {
      text: date.toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit', hour12: true }),
      isLive: false
    };
  } catch (e) {
    return { text: '', isLive: false };
  }
}

export default function ScoresStrip({ scores }: { scores?: any[] }) {
  const { data, isLoading, isError } = useLiveScores();

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  // Flatten the match cards to render them in a clean vertical-border layout
  const allMatches = data.flatMap((leagueData) =>
    leagueData.matches.map((match) => ({
      ...match,
      league: leagueData.league,
    }))
  );

  // Sort matches: live first
  const sorted = [...allMatches].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return 0;
  });

  if (sorted.length === 0) return null;

  // Format today's date in Bengali (e.g. "১৩ জুনের খেলাসমূহ")
  const todayStr = new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long' }) + '-এর খেলাসমূহ';

  return (
    <section 
      aria-label="খেলাসমূহ" 
      className="w-full bg-[#fcfcfc] py-4 px-6 border-y border-[#e2e2e2]"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Header */}
      <h2 className="text-[17px] font-bold text-[#121212] mb-4">
        {todayStr}
      </h2>

      {/* Horizontal Scroll Area */}
      <div className="scrollbar-none overflow-x-auto flex gap-6 items-start">
        {sorted.map((match, idx) => {
          const statusInfo = formatStatus(match.isLive, match.minute, match.utcTime, match.homeScore);
          const showScore = match.homeScore !== null && match.awayScore !== null;

          return (
            <div 
              key={match.id}
              className={`flex-shrink-0 min-w-[200px] flex flex-col gap-2 ${
                idx > 0 ? 'border-l border-[#e2e2e2] pl-6' : ''
              }`}
            >
              {/* Kickoff time or Status */}
              <div className="flex items-center gap-1.5">
                {statusInfo.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse flex-shrink-0" />
                )}
                <span className={`text-[11px] font-semibold tracking-wide ${
                  statusInfo.isLive ? 'text-red-600' : 'text-[#666666]'
                }`}>
                  {statusInfo.text}
                </span>
              </div>

              {/* Teams List */}
              <div className="flex flex-col gap-1.5">
                {/* Home Team */}
                <div className="flex items-center justify-between text-[13px] font-medium text-[#222222]">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    {/* Placeholder flag/circle */}
                    <div className="w-4 h-4 rounded-sm bg-[#e2e2e2] flex items-center justify-center text-[9px] font-bold text-[#555] flex-shrink-0">
                      {match.home.charAt(0)}
                    </div>
                    <span className="truncate" title={match.home}>{match.home}</span>
                  </div>
                  {showScore && (
                    <span className="font-bold text-[#121212] ml-auto">{match.homeScore}</span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex items-center justify-between text-[13px] font-medium text-[#222222]">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    {/* Placeholder flag/circle */}
                    <div className="w-4 h-4 rounded-sm bg-[#e2e2e2] flex items-center justify-center text-[9px] font-bold text-[#555] flex-shrink-0">
                      {match.away.charAt(0)}
                    </div>
                    <span className="truncate" title={match.away}>{match.away}</span>
                  </div>
                  {showScore && (
                    <span className="font-bold text-[#121212] ml-auto">{match.awayScore}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0f0f0]">
        <Link
          href="/scores"
          className="text-[11px] font-semibold text-[#121212] hover:underline"
        >
          সব স্কোর দেখুন ›
        </Link>
        <span className="text-[10px] text-[#888888]">
          আপডেট করা হয়েছে: {new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </section>
  );
}
