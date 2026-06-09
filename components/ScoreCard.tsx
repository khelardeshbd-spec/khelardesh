/**
 * ScoreCard — Section 10.6
 * LEAGUE LABEL   8px Hind Siliguri uppercase --ink-muted
 * Team A [score] 11px / score in Playfair Display 13px bold
 * Team B [score]
 * Status text    8px uppercase --ink-ghost
 * Winner row is weight 600
 * Live status: ● red animated dot before time
 */

interface ScoreCardProps {
  league: string;
  teamA: string;
  scoreA: string;
  teamB: string;
  scoreB: string;
  winnerTeam?: string | null;  // "A" | "B" | null
  status: string;
  isLive: boolean;
}

export default function ScoreCard({
  league,
  teamA,
  scoreA,
  teamB,
  scoreB,
  winnerTeam,
  status,
  isLive,
}: ScoreCardProps) {
  const winnerA = winnerTeam === 'A';
  const winnerB = winnerTeam === 'B';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        padding: '10px 12px',
        borderRadius: 1,
        minWidth: 160,
        flexShrink: 0,
      }}
    >
      {/* League label */}
      <p
        style={{
          fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
          fontSize: 8,
          fontWeight: 400,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-muted)',
          marginBottom: 6,
        }}
        lang="bn"
      >
        {league}
      </p>

      {/* Team A row */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 11,
            fontWeight: winnerA ? 600 : 400,
            color: winnerA ? 'var(--ink)' : 'var(--ink-muted)',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          lang="bn"
        >
          {teamA}
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            fontSize: 13,
            fontWeight: 700,
            color: winnerA ? 'var(--ink)' : 'var(--ink-muted)',
            flexShrink: 0,
          }}
        >
          {scoreA}
        </span>
      </div>

      {/* Team B row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 11,
            fontWeight: winnerB ? 600 : 400,
            color: winnerB ? 'var(--ink)' : 'var(--ink-muted)',
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          lang="bn"
        >
          {teamB}
        </span>
        <span
          style={{
            fontFamily: "Georgia, 'Times New Roman', Times, serif",
            fontSize: 13,
            fontWeight: 700,
            color: winnerB ? 'var(--ink)' : 'var(--ink-muted)',
            flexShrink: 0,
          }}
        >
          {scoreB}
        </span>
      </div>

      {/* Status */}
      <div className="flex items-center gap-1" style={{ minHeight: '8px' }}>
        {isLive && (
          <span 
            className="live-dot" 
            style={{ 
              width: 5, 
              height: 5, 
              marginRight: 2, 
              display: 'inline-block', 
              verticalAlign: 'middle', 
              flexShrink: 0 
            }} 
          />
        )}
        <span
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 8,
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: isLive ? 'var(--live-red)' : 'var(--ink-ghost)',
            display: 'inline-block',
            verticalAlign: 'middle',
            lineHeight: 1
          }}
        >
          {status}
        </span>
      </div>
    </div>
  );
}
