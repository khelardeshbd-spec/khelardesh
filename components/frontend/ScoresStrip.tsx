'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import ScoreCard from './ScoreCard';
import { useLiveScores } from '@/hooks/useLiveScores';
import { translateTeamName } from '@/lib/teamTranslations';

export default function ScoresStrip() {
  const { data, isLoading, isError } = useLiveScores();
  
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || !data || data.length === 0) return;

    let frameId: number;
    let x = xRef.current; // start with the persisted position
    let startX = 0;
    let dragStartX = 0;
    let isDragging = false;
    let lastTime = performance.now();
    let pausedUntil = 0; // timestamp to pause scrolling

    const speed = 40; // Pixels per second scroll speed

    const step = (time: number) => {
      const now = Date.now();
      if (!isDragging && now > pausedUntil) {
        const delta = (time - lastTime) / 1000;
        // Cap delta to prevent huge jumps (e.g., if tab is hidden/suspended)
        const cappedDelta = Math.min(delta, 0.1);
        x -= speed * cappedDelta;

        const halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) {
          if (Math.abs(x) >= halfWidth) {
            x = 0; // Wrap around seamlessly
          }
        }
        track.style.transform = `translate3d(${x}px, 0, 0)`;
        xRef.current = x; // Persist updated position
      }
      lastTime = time;
      frameId = requestAnimationFrame(step);
    };

    const triggerPause = () => {
      pausedUntil = Date.now() + 4000;
    };

    const onHoverPause = () => {
      if (window.matchMedia('(hover: hover)').matches) {
        triggerPause();
      }
    };

    // Drag start
    const onStart = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      triggerPause();
      startX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      dragStartX = x;
    };

    // Drag move
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      triggerPause();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - startX;
      x = dragStartX + deltaX;

      // Wrap around boundary limits seamlessly during manual drag
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        if (x > 0) {
          x = -halfWidth + x;
        } else if (Math.abs(x) >= halfWidth) {
          x = x + halfWidth;
        }
      }

      track.style.transform = `translate3d(${x}px, 0, 0)`;
      xRef.current = x; // Persist position
    };

    // Drag end
    const onEnd = () => {
      if (isDragging) {
        isDragging = false;
        triggerPause();
        lastTime = performance.now(); // Reset lastTime so step() has correct starting baseline
      }
    };

    // Desktop events
    container.addEventListener('mousedown', onStart);
    container.addEventListener('mouseenter', onHoverPause);
    container.addEventListener('mousemove', onHoverPause);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    // Mobile events
    container.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);

    frameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(frameId);
      xRef.current = x; // Ensure last frame position is saved
      
      container.removeEventListener('mousedown', onStart);
      container.removeEventListener('mouseenter', onHoverPause);
      container.removeEventListener('mousemove', onHoverPause);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);

      container.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [data]);

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  // Sort matches: live first, then chronological by startTime
  const sorted = [...data].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
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
          লাইভ ও রিসেন্ট স্কোর
        </h2>
      </div>

      {/* Swipeable auto-scrolling container */}
      <div 
        ref={containerRef}
        className="overflow-hidden w-full relative py-1 cursor-grab active:cursor-grabbing select-none"
        style={{ touchAction: 'pan-y' }}
      >
        <div 
          ref={trackRef}
          className="flex gap-6 items-start pb-2 px-6"
          style={{ width: 'max-content', willChange: 'transform' }}
        >
          {/* First set of cards */}
          {sorted.map((match) => {
            let winnerTeam: "A" | "B" | null = null;
            if (match.isFinished) {
               if (match.home.isWinner) winnerTeam = "A";
               if (match.away.isWinner) winnerTeam = "B";
            }

            return (
              <Link key={match.id} href={`/scores/${match.id}`} className="flex-shrink-0 block hover:no-underline select-none">
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
                  isFinished={match.isFinished}
                  startTime={match.startTime}
                />
              </Link>
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
              <Link key={`${match.id}-dup`} href={`/scores/${match.id}`} className="flex-shrink-0 block hover:no-underline select-none">
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
                  isFinished={match.isFinished}
                  startTime={match.startTime}
                />
              </Link>
            );
          })}        </div>
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
