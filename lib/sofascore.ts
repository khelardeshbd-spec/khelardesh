/**
 * sofascore.ts — Typed wrappers around the SofaScore proxy endpoint
 * Section 9: Key endpoints and data shapes
 */

export interface SofaScoreTeam {
  id: number;
  name: string;
  shortName: string;
  nameCode: string;
}

export interface SofaScoreScore {
  current: number;
  display: number;
  period1?: number;
  period2?: number;
  overtime?: number;
  penalties?: number;
}

export interface SofaScoreStatus {
  code: number;
  description: string;
  type: 'inprogress' | 'finished' | 'notstarted' | 'postponed' | 'canceled';
}

export interface SofaScoreTime {
  played?: number;
  periodLength?: number;
  extra?: number;
  initialPeriodLength?: number;
  initialExtraPeriodLength?: number;
}

export interface SofaScoreTournament {
  id: number;
  name: string;
  slug: string;
  uniqueTournament?: {
    id: number;
    name: string;
  };
}

export interface SofaScoreEvent {
  id: number;
  homeTeam: SofaScoreTeam;
  awayTeam: SofaScoreTeam;
  homeScore: SofaScoreScore;
  awayScore: SofaScoreScore;
  status: SofaScoreStatus;
  time?: SofaScoreTime;
  startTimestamp: number;
  tournament: SofaScoreTournament;
  roundInfo?: { round: number };
  winnerCode?: number; // 1 = home, 2 = away, 3 = draw
}

export interface LiveEventsResponse {
  events: SofaScoreEvent[];
}

/**
 * Format an event status into a display string with live flag
 */
export function formatStatus(event: SofaScoreEvent): { text: string; isLive: boolean } {
  const { status, time } = event;
  if (status.type === 'inprogress') {
    if (status.description === 'Halftime') {
      return { text: 'Half Time', isLive: true };
    }
    return { text: `${time?.played ?? '?'}'`, isLive: true };
  }
  if (status.type === 'finished') {
    return { text: 'Full Time', isLive: false };
  }
  if (status.type === 'notstarted') {
    return { text: formatKickoff(event.startTimestamp), isLive: false };
  }
  if (status.description === 'Halftime') {
    return { text: 'Half Time', isLive: false };
  }
  return { text: status.description, isLive: false };
}

function formatKickoff(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Fetch live football events through server-side proxy
 */
export async function fetchLiveFootball(baseUrl = ''): Promise<SofaScoreEvent[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/proxy/sofascore?endpoint=/sport/football/events/live`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const data: LiveEventsResponse = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

/**
 * Fetch scheduled football events for a specific date
 */
export async function fetchScheduledFootball(
  date: string,
  baseUrl = ''
): Promise<SofaScoreEvent[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/proxy/sofascore?endpoint=/sport/football/scheduled-events/${date}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.events ?? [];
  } catch {
    return [];
  }
}

/**
 * Fetch a single event by ID
 */
export async function fetchEvent(eventId: string, baseUrl = ''): Promise<SofaScoreEvent | null> {
  try {
    const res = await fetch(
      `${baseUrl}/api/proxy/sofascore?endpoint=/event/${eventId}`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.event ?? null;
  } catch {
    return null;
  }
}

/**
 * Search for events by team/match name
 */
export async function searchMatches(
  query: string,
  baseUrl = ''
): Promise<SofaScoreEvent[]> {
  try {
    const res = await fetch(
      `${baseUrl}/api/proxy/sofascore?endpoint=/search/all?q=${encodeURIComponent(query)}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results?.events ?? [];
  } catch {
    return [];
  }
}

/**
 * Known tournament IDs as per Section 9
 */
export const TOURNAMENT_IDS = {
  BPL_FOOTBALL: 762,
  EPL: 17,
  UEFA_CHAMPIONS_LEAGUE: 7,
  NBA: 132,
} as const;
