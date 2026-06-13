'use client';

import { useEffect, useState } from 'react';
import { fetchLiveFootball, formatStatus, type SofaScoreEvent } from '@/lib/sofascore';

/**
 * LiveTicker — Section 4
 * Desktop only: full-width bar with ink background
 * Left: "● লাইভ" blinking label
 * Items scroll (CSS marquee) or static if ≤ 3 events
 * Polls every 30 seconds
 * Shows nothing (null) when no live matches — does NOT get stuck on "লোড হচ্ছে..."
 */
export default function LiveTicker() {
  const [events, setEvents] = useState<SofaScoreEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const refresh = async () => {
      const live = await fetchLiveFootball();
      if (!cancelled) {
        setEvents(live);
        setLoading(false);
      }
    };

    refresh();
    const interval = setInterval(refresh, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // While loading show a slim placeholder bar (not indefinite)
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
            fontFamily: "var(--font-body)",
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.06em',
            opacity: 0.5,
          }}
        >
          ● লাইভ
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize: 10,
            opacity: 0.3,
          }}
        >
          লোড হচ্ছে…
        </span>
      </div>
    );
  }

  // No live events — hide completely (no empty bar)
  if (events.length === 0) return null;

  const tickerItems = events.map((e) => {
    const { text } = formatStatus(e);
    const home = e.homeTeam.shortName || e.homeTeam.nameCode;
    const away = e.awayTeam.shortName || e.awayTeam.nameCode;
    return `${home} ${e.homeScore.current}–${e.awayScore.current} ${away}  ${text}`;
  });

  const shouldScroll = tickerItems.length > 3;
  const tickerContent = tickerItems.join('     ·     ');
  // Double for seamless loop
  const display = shouldScroll
    ? `${tickerContent}     ·     ${tickerContent}`
    : tickerContent;

  return (
    <>
      {/* Desktop ticker */}
      <div
        className="hidden lg:grid max-w-[1200px] mx-auto px-6 gap-6"
        style={{
          position: 'absolute',
          top: '72px',
          left: 0,
          right: 0,
          zIndex: 40,
          gridTemplateColumns: '18fr 82fr',
        }}
      >
        <div /> {/* Spacer for left 18% column */}
        <div
          className="flex items-center overflow-hidden"
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
                fontFamily: "var(--font-body)",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
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
                    fontFamily: "var(--font-body)",
                    fontSize: 12,
                    letterSpacing: '0.02em',
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
                  fontFamily: "var(--font-body)",
                  fontSize: 12,
                  letterSpacing: '0.02em',
                  paddingLeft: 16,
                  whiteSpace: 'nowrap',
                }}
              >
                {tickerContent}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
