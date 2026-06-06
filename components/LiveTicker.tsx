'use client';

import { useEffect, useState } from 'react';
import { fetchLiveFootball, formatStatus, type SofaScoreEvent } from '@/lib/sofascore';

/**
 * LiveTicker — Section 10.7 / 9
 * Desktop only: full-width bar with ink background
 * Left: "● লাইভ" blinking label
 * Items scroll (CSS marquee) or static if ≤ 3 events
 * Polls every 30 seconds
 */
export default function LiveTicker() {
  const [events, setEvents] = useState<SofaScoreEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refresh = async () => {
      const live = await fetchLiveFootball();
      setEvents(live);
      setLoading(false);
    };

    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div
        className="hidden lg:flex items-center px-4 gap-3"
        style={{
          height: 30,
          backgroundColor: 'var(--ink)',
          color: 'var(--bg-page)',
          overflow: 'hidden',
        }}
      >
        <span
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.12em',
            opacity: 0.5,
          }}
        >
          ● লাইভ
        </span>
        <span style={{ fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif", fontSize: 10, opacity: 0.4 }}>
          লোড হচ্ছে...
        </span>
      </div>
    );
  }

  if (events.length === 0) return null;

  const tickerItems = events.map((e) => {
    const { text } = formatStatus(e);
    return `${e.homeTeam.shortName} ${e.homeScore.current}–${e.awayScore.current} ${e.awayTeam.shortName}  ${text}`;
  });

  const shouldScroll = tickerItems.length > 3;
  const tickerContent = tickerItems.join('     ·     ');
  // Double for seamless loop
  const display = shouldScroll ? `${tickerContent}     ·     ${tickerContent}` : tickerContent;

  return (
    <div
      className="hidden lg:flex items-center overflow-hidden"
      style={{
        height: 30,
        backgroundColor: 'var(--ink)',
        color: 'var(--bg-page)',
      }}
    >
      {/* Live label */}
      <div
        className="flex-shrink-0 flex items-center gap-1.5 px-4 border-r"
        style={{ borderColor: 'rgba(255,255,255,0.15)', height: '100%' }}
      >
        <span className="live-dot" style={{ backgroundColor: 'var(--live-red)' }} />
        <span
          style={{
            fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
          }}
        >
          লাইভ
        </span>
      </div>

      {/* Scrolling content */}
      <div className="flex-1 overflow-hidden relative">
        {shouldScroll ? (
          <div className="ticker-track">
            <span
              style={{
                fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
                fontSize: 11,
                letterSpacing: '0.04em',
                paddingLeft: 16,
                paddingRight: 16,
                whiteSpace: 'nowrap',
              }}
            >
              {display}
            </span>
          </div>
        ) : (
          <span
            style={{
              fontFamily: "'Abu JM Akkas', 'Hind Siliguri', sans-serif",
              fontSize: 11,
              letterSpacing: '0.04em',
              paddingLeft: 16,
              whiteSpace: 'nowrap',
            }}
          >
            {tickerContent}
          </span>
        )}
      </div>
    </div>
  );
}
