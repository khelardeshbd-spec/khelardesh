'use client';

import { motion } from 'framer-motion';

/**
 * ScoreCard — Section 4
 * LEAGUE LABEL   9px Kalpurush uppercase --ink-muted
 * Team A [score] 12px Kalpurush / score in Kalpurush 14px bold
 * Team B [score]
 * Status badge   Bengali text: লাইভ / পূর্ণ সময় / বিরতি / minute etc.
 * Winner row is weight 700
 * Live status: ● red animated dot before status text
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
  home_team_logo?: string;
  away_team_logo?: string;
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
  home_team_logo,
  away_team_logo,
}: ScoreCardProps) {
  const winnerA = winnerTeam === 'A';
  const winnerB = winnerTeam === 'B';
  const isDraw = winnerTeam === null || winnerTeam === '';

  // Determine status badge display
  const statusIsMinute = /^\d+'?$/.test(status.trim());
  const isEnglish = (str: string) => /[a-zA-Z]/.test(str);

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="clay-card"
      style={{
        position: 'relative',
        padding: '10px 12px',
        minWidth: 160,
        maxWidth: 200,
        flexShrink: 0,
        border: isLive ? '1.5px solid rgba(220,38,38,0.4)' : undefined,
      }}
    >
      {/* Status badge (Absolute Top Right) */}
      <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
        {isLive && (
          <span
            className="live-dot"
            style={{ width: 5, height: 5, display: 'inline-block', flexShrink: 0 }}
          />
        )}
        <span
          style={{
            fontFamily: isEnglish(status) ? 'sans-serif' : "var(--font-body)",
            fontSize: 9,
            fontWeight: 600,
            color: isLive ? 'var(--live-red)' : 'var(--ink-ghost)',
            lineHeight: 1,
            letterSpacing: statusIsMinute ? 0 : '0.04em',
          }}
          lang={isEnglish(status) ? "en" : "bn"}
        >
          {status}
        </span>
      </div>

      {/* League label */}
      <p
        style={{
          fontFamily: isEnglish(league) ? 'sans-serif' : "var(--font-body)",
          fontSize: 8.5,
          fontWeight: 500,
          letterSpacing: '0.06em',
          color: 'var(--ink-muted)',
          marginBottom: 7,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          paddingRight: 40,
        }}
        lang={isEnglish(league) ? "en" : "bn"}
        title={league}
      >
        {league}
      </p>

      {/* Team A row */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {home_team_logo ? (
            <img src={home_team_logo} alt={teamA} width={16} height={16} className="rounded-full flex-shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
          ) : null}
          <div className={`w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] flex-shrink-0 ${home_team_logo ? 'hidden' : ''}`}>
            {teamA.charAt(0)}
          </div>
          <span
            style={{
              fontFamily: isEnglish(teamA) ? 'sans-serif' : "var(--font-body)",
              fontSize: 12,
              fontWeight: winnerA ? 700 : 400,
              color: winnerA ? 'var(--ink)' : isDraw ? 'var(--ink-muted)' : 'var(--ink-ghost)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            lang={isEnglish(teamA) ? "en" : "bn"}
          >
            {teamA}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            fontWeight: 700,
            color: winnerA ? 'var(--ink)' : 'var(--ink-muted)',
            flexShrink: 0,
            minWidth: 18,
            textAlign: 'right',
          }}
        >
          {scoreA}
        </span>
      </div>

      {/* Team B row */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {away_team_logo ? (
            <img src={away_team_logo} alt={teamB} width={16} height={16} className="rounded-full flex-shrink-0" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling?.classList.remove('hidden'); }} />
          ) : null}
          <div className={`w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] flex-shrink-0 ${away_team_logo ? 'hidden' : ''}`}>
            {teamB.charAt(0)}
          </div>
          <span
            style={{
              fontFamily: isEnglish(teamB) ? 'sans-serif' : "var(--font-body)",
              fontSize: 12,
              fontWeight: winnerB ? 700 : 400,
              color: winnerB ? 'var(--ink)' : isDraw ? 'var(--ink-muted)' : 'var(--ink-ghost)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            lang={isEnglish(teamB) ? "en" : "bn"}
          >
            {teamB}
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 17,
            fontWeight: 700,
            color: winnerB ? 'var(--ink)' : 'var(--ink-muted)',
            flexShrink: 0,
            minWidth: 18,
            textAlign: 'right',
          }}
        >
          {scoreB}
        </span>
      </div>

      <div style={{ height: '0.5px', backgroundColor: 'var(--ink-border)', margin: '8px 0' }} />
    </motion.div>
  );
}
