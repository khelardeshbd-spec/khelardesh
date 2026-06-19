'use client';

import { motion } from 'framer-motion';

interface ScoreCardProps {
  league: string;
  teamA: string;
  scoreA: string;
  teamB: string;
  scoreB: string;
  winnerTeam?: string | null;  // "A" | "B" | null
  status: string;
  isLive: boolean;
  isFinished?: boolean;
  startTime?: string;
  home_team_logo?: string;
  away_team_logo?: string;
}

function formatRelativeDate(iso: string): { date: string; time: string } {
  if (!iso) return { date: '', time: '' };
  try {
    const d = new Date(iso);
    const now = new Date();
    
    // Reset hours to compare calendar days
    const dDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const nowClean = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = dDate.getTime() - nowClean.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    let date = '';
    if (diffDays === 0) {
      date = 'Today';
    } else if (diffDays === 1) {
      date = 'Tomorrow';
    } else if (diffDays === 2) {
      date = '2 days later';
    } else if (diffDays === -1) {
      date = 'Yesterday';
    } else if (diffDays === -2) {
      date = '2 days ago';
    } else {
      date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    
    return { date, time };
  } catch {
    return { date: '', time: '' };
  }
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
  isFinished = false,
  startTime = '',
  home_team_logo,
  away_team_logo,
}: ScoreCardProps) {
  const winnerA = winnerTeam === 'A';
  const winnerB = winnerTeam === 'B';
  const isDraw = winnerTeam === null || winnerTeam === '';
  const isUpcoming = !isLive && !isFinished;

  // Determine status badge display
  const statusIsMinute = /^\d+'?$/.test(status.trim());
  const isEnglish = (str: string) => /[a-zA-Z]/.test(str);

  const kickoff = startTime ? formatRelativeDate(startTime) : null;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="clay-card"
      style={{
        position: 'relative',
        padding: '10px 12px',
        minWidth: 180,
        maxWidth: 240,
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
            fontFamily: 'sans-serif',
            fontSize: 9,
            fontWeight: 600,
            color: isLive ? 'var(--live-red)' : 'var(--ink-muted)',
            lineHeight: 1,
            letterSpacing: statusIsMinute ? 0 : '0.04em',
          }}
        >
          {isLive ? status : isFinished ? 'FT' : ''}
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
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            lang={isEnglish(teamA) ? "en" : "bn"}
          >
            {teamA}
          </span>
        </div>
        {!isUpcoming && (
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--ink)',
              flexShrink: 0,
              minWidth: 18,
              textAlign: 'right',
            }}
          >
            {scoreA}
          </span>
        )}
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
              color: 'var(--ink)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            lang={isEnglish(teamB) ? "en" : "bn"}
          >
            {teamB}
          </span>
        </div>
        {!isUpcoming && (
          <span
            style={{
              fontFamily: "sans-serif",
              fontSize: 17,
              fontWeight: 700,
              color: 'var(--ink)',
              flexShrink: 0,
              minWidth: 18,
              textAlign: 'right',
            }}
          >
            {scoreB}
          </span>
        )}
      </div>

      {/* Upcoming: show English date + kickoff time instead of scores */}
      {isUpcoming && kickoff && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, marginTop: -8, marginBottom: 6 }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: 10, fontWeight: 700, color: 'var(--ink)', letterSpacing: '0.02em' }}>
            {kickoff.date}
          </span>
          <span style={{ fontFamily: 'sans-serif', fontSize: 9, fontWeight: 500, color: 'var(--ink-muted)' }}>
            {kickoff.time}
          </span>
        </div>
      )}

      {/* Finished match relative date label */}
      {isFinished && kickoff && (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: -8, marginBottom: 6 }}>
          <span style={{ fontFamily: 'sans-serif', fontSize: 9, fontWeight: 700, color: 'var(--ink-muted)', letterSpacing: '0.02em' }}>
            {kickoff.date}
          </span>
        </div>
      )}

      <div style={{ height: '0.5px', backgroundColor: 'var(--ink-border)', margin: '8px 0' }} />
    </motion.div>
  );
}
