'use client';

import { useRef, useEffect } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Handle JS-driven auto scrolling with manual swipe overrides
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el || !data || data.length === 0) return;

    let frameId: number;
    let isUserInteracting = false;

    const onStart = () => { isUserInteracting = true; };
    const onEnd = () => {
      isUserInteracting = false;
      // Synchronize accumulator when user finishes dragging
      scrollPos = el.scrollLeft;
    };

    el.addEventListener('mouseenter', onStart);
    el.addEventListener('mouseleave', onEnd);
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('mousedown', onStart);
    el.addEventListener('mouseup', onEnd);

    // High-precision accumulator for scrolling position
    let scrollPos = el.scrollLeft;

    const step = () => {
      if (!isUserInteracting) {
        scrollPos += 0.55; // slow scroll speed

        // Reset to start seamlessly if we have scrolled past the first set of items
        const halfWidth = el.scrollWidth / 2;
        if (scrollPos >= halfWidth) {
          scrollPos = 0;
        }
        el.scrollLeft = Math.floor(scrollPos);
      } else {
        // Sync accumulator with user's scroll gesture
        scrollPos = el.scrollLeft;
      }
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      el.removeEventListener('mouseenter', onStart);
      el.removeEventListener('mouseleave', onEnd);
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('mousedown', onStart);
      el.removeEventListener('mouseup', onEnd);
    };
  }, [data]);

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  // Sort matches: live first
  const sorted = [...data].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    if (!a.isFinished && b.isFinished) return -1;
    if (a.isFinished && !b.isFinished) return 1;
    return 0;
  });

  if (sorted.length === 0) return null;

  return (
    <section 
      aria-label="খেলাসমূহ" 
      className="-mx-6 py-4 overflow-hidden"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Header */}
      <div className="px-6">
        <h2 className="text-[17px] font-bold text-[#121212] mb-4">
          Live &amp; Recent Scores
        </h2>
      </div>

      {/* Swipeable auto-scrolling track */}
      <div 
        ref={scrollContainerRef}
        className="scrollbar-none overflow-x-auto flex gap-6 items-start pb-2 px-6"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* First set of cards */}
        {sorted.map((match) => {
          let winnerTeam: "A" | "B" | null = null;
          if (match.isFinished) {
             if (match.home.isWinner) winnerTeam = "A";
             if (match.away.isWinner) winnerTeam = "B";
          }

          return (
            <div key={match.id} className="flex-shrink-0">
              <ScoreCard
                league={match.league}
                teamA={match.home.name}
                scoreA={match.home.score !== null ? String(match.home.score) : '-'}
                teamB={match.away.name}
                scoreB={match.away.score !== null ? String(match.away.score) : '-'}
                status={match.statusText}
                isLive={match.isLive}
                winnerTeam={winnerTeam}
                home_team_logo={match.home.logo}
                away_team_logo={match.away.logo}
              />
            </div>
          );
        })}
        {/* Duplicated set of cards for seamless infinite scroll */}
        {sorted.map((match) => {
          let winnerTeam: "A" | "B" | null = null;
          if (match.isFinished) {
             if (match.home.isWinner) winnerTeam = "A";
             if (match.away.isWinner) winnerTeam = "B";
          }

          return (
            <div key={`${match.id}-dup`} className="flex-shrink-0">
              <ScoreCard
                league={match.league}
                teamA={match.home.name}
                scoreA={match.home.score !== null ? String(match.home.score) : '-'}
                teamB={match.away.name}
                scoreB={match.away.score !== null ? String(match.away.score) : '-'}
                status={match.statusText}
                isLive={match.isLive}
                winnerTeam={winnerTeam}
                home_team_logo={match.home.logo}
                away_team_logo={match.away.logo}
              />
            </div>
          );
        })}
      </div>

      {/* Footer bar */}
      <div className="px-6">
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#f0f0f0]">
          <Link
            href="/scores"
            className="text-[11px] font-semibold text-[#121212] hover:underline"
          >
            View All Scores ›
          </Link>
          <span className="text-[10px] text-[#888888]">
            আপডেট করা হয়েছে: {new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </section>
  );
}
