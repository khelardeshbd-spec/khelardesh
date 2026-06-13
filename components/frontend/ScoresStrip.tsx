'use client';

import Link from 'next/link';
import ScoreCard from './ScoreCard';
import { useLiveScores } from '@/hooks/useLiveScores';
import { translateTeamName } from '@/lib/teamTranslations';

function toBengaliNumerals(numStr: string | number | null): string {
  if (numStr === null || numStr === undefined) return '';
  const bnNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(numStr).replace(/[0-9]/g, w => bnNumerals[parseInt(w, 10)]);
}

function translateStatus(status: string): string {
  const s = status.toLowerCase();
  if (s === 'ft' || s === 'full time') return 'পূর্ণ সময়';
  if (s === 'ht' || s === 'half time') return 'বিরতি';
  if (s === 'scheduled') return 'আসন্ন';
  if (s === 'live') return 'লাইভ';
  if (s === 'postponed') return 'স্থগিত';
  if (s === 'canceled' || s === 'cancelled') return 'বাতিল';
  if (s.includes("'")) return toBengaliNumerals(s);
  return status; // fallback
}

export default function ScoresStrip() {
  const { data, isLoading, isError } = useLiveScores();

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  // Sort matches: live first
  const sorted = [...data].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    // active games over finished games
    if (!a.isFinished && b.isFinished) return -1;
    if (a.isFinished && !b.isFinished) return 1;
    return 0;
  });

  if (sorted.length === 0) return null;

  // Format today's date in Bengali (e.g. "১৩ জুনের খেলাসমূহ")
  const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const d = new Date();
  const dayBn = toBengaliNumerals(d.getDate());
  const todayStr = `${dayBn} ${bnMonths[d.getMonth()]}-এর খেলাসমূহ`;

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
      <div className="scrollbar-none overflow-x-auto flex gap-6 items-start pb-2">
        {sorted.map((match, idx) => {
          let winnerTeam: "A" | "B" | null = null;
          if (match.isFinished) {
             if (match.home.isWinner) winnerTeam = "A";
             if (match.away.isWinner) winnerTeam = "B";
          }

          return (
            <ScoreCard
              key={match.id}
              league={match.league}
              teamA={translateTeamName(match.home.name)}
              scoreA={match.home.score !== null ? toBengaliNumerals(match.home.score) : '-'}
              teamB={translateTeamName(match.away.name)}
              scoreB={match.away.score !== null ? toBengaliNumerals(match.away.score) : '-'}
              status={translateStatus(match.statusText)}
              isLive={match.isLive}
              winnerTeam={winnerTeam}
              home_team_logo={match.home.logo}
              away_team_logo={match.away.logo}
            />
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#f0f0f0]">
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
