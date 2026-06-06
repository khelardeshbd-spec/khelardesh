import ScoreCard from './ScoreCard';

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
}

interface ScoresStripProps {
  scores: Score[];
}

/**
 * ScoresStrip — Section 8 (mobile)
 * Horizontal scroll strip of score cards
 * Sort: Live first, then by displayOrder (Section 13 rule 12)
 */
export default function ScoresStrip({ scores }: ScoresStripProps) {
  // Sort: live first, then by displayOrder
  const sorted = [...scores].sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return a.displayOrder - b.displayOrder;
  });

  if (sorted.length === 0) return null;

  return (
    <section aria-label="Live scores">
      <div
        className="scrollbar-none overflow-x-auto"
        style={{
          borderTop: '1px solid var(--ink-border)',
          borderBottom: '1px solid var(--ink-border)',
        }}
      >
        <div className="flex gap-2 p-3">
          {sorted.map((score) => (
            <ScoreCard
              key={score.id}
              league={score.league}
              teamA={score.teamA}
              scoreA={score.scoreA}
              teamB={score.teamB}
              scoreB={score.scoreB}
              winnerTeam={score.winnerTeam}
              status={score.status}
              isLive={score.isLive}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
