'use client';

import Link from 'next/link';
import ScoreCard from './ScoreCard';
import { motion } from 'framer-motion';
import { staggerContainer, slideInRight } from '@/lib/animations';
import { useLiveScores } from '@/hooks/useLiveScores';

function formatUtcTime(utcTimeStr?: string) {
  if (!utcTimeStr) return '';
  try {
    const date = new Date(utcTimeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
}

interface ScoresStripProps {
  scores?: any[];
}

export default function ScoresStrip({}: ScoresStripProps) {
  const { data, isLoading, isError, source } = useLiveScores();

  if (isLoading || isError || !data || data.length === 0) {
    return null;
  }

  // Flatten the match cards to render them in a scrollable horizontal strip
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

  const hasLive = sorted.some((s) => s.isLive);

  return (
    <section aria-label="স্কোর">
      {/* Section header */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderTop: '1px solid var(--ink-border)', paddingTop: 4 }}
      >
        <h2
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: '0.06em',
            color: 'var(--ink-muted)',
          }}
          lang="bn"
        >
          {hasLive ? (
            <span className="flex items-center gap-1.5">
              <span className="live-dot" style={{ width: 6, height: 6 }} />
              লাইভ স্কোর
            </span>
          ) : (
            'স্কোর'
          )}
        </h2>
        <Link
          href="/scores"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 9,
            color: 'var(--ink-muted)',
            textDecoration: 'none',
          }}
          lang="bn"
          className="hover:underline"
        >
          সব স্কোর দেখুন →
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div
        className="scrollbar-none overflow-x-auto"
        style={{ borderBottom: '1px solid var(--ink-border)' }}
      >
        <motion.div
          className="flex gap-3 px-3 pb-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {sorted.map((match) => {
            const homeScoreStr = match.homeScore !== null ? String(match.homeScore) : '-';
            const awayScoreStr = match.awayScore !== null ? String(match.awayScore) : '-';
            const status = match.isLive
              ? (match.minute || 'Live')
              : (match.homeScore === null
                  ? formatUtcTime(match.utcTime)
                  : 'পূর্ণ সময়');

            const winnerTeam = match.homeScore !== null && match.awayScore !== null
              ? (match.homeScore > match.awayScore ? 'A' : match.homeScore < match.awayScore ? 'B' : null)
              : null;

            return (
              <motion.div variants={slideInRight} key={match.id}>
                <ScoreCard
                  league={match.league}
                  teamA={match.home}
                  scoreA={homeScoreStr}
                  teamB={match.away}
                  scoreB={awayScoreStr}
                  winnerTeam={winnerTeam}
                  status={status}
                  isLive={match.isLive}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
