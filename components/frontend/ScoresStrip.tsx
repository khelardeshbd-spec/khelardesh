'use client';

import Link from 'next/link';
import ScoreCard from './ScoreCard';
import { motion } from 'framer-motion';
import { staggerContainer, slideInRight } from '@/lib/animations';

interface Score {
  id: number;
  league: string;
  teamA: string;
  scoreA: string;
  teamB: string;
  scoreB: string;
  winnerTeam?: string | null;
  status: string;
  isLive: boolean;
  displayOrder: number;
  home_team_logo?: string;
  away_team_logo?: string;
}

interface ScoresStripProps {
  scores: Score[];
}

/**
 * ScoresStrip — Section 4 (mobile)
 * Horizontal scroll strip of score cards
 * Sort: Live first, then by displayOrder
 */
export default function ScoresStrip({ scores }: ScoresStripProps) {
  // Sort: live first, then by displayOrder
  const sorted = [...scores].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return a.displayOrder - b.displayOrder;
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
          {sorted.map((score) => (
            <motion.div variants={slideInRight} key={score.id}>
              <ScoreCard
                league={score.league}
                teamA={score.teamA}
                scoreA={score.scoreA}
                teamB={score.teamB}
                scoreB={score.scoreB}
                winnerTeam={score.winnerTeam}
                status={score.status}
                isLive={score.isLive}
                home_team_logo={score.home_team_logo}
                away_team_logo={score.away_team_logo}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
