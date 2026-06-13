export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

interface ESPNTeam {
  displayName: string;
  abbreviation: string;
  logo: string;
}

interface ESPNCompetitor {
  homeAway: string;
  score: string;
  winner: boolean;
  team: ESPNTeam;
}

interface ESPNEvent {
  id: string;
  name: string;
  season?: { slug?: string; year?: number };
  league?: { name?: string; abbreviation?: string; slug?: string };
  competitions: {
    status: {
      type: {
        state: string; // "pre", "in", "post"
        shortDetail: string; // e.g. "FT", "HT", "Scheduled"
      };
      displayClock: string;
    };
    competitors: ESPNCompetitor[];
  }[];
}

/** Normalize ESPN league names to clean, recognizable labels */
function normalizeLeague(raw: string): string {
  const name = raw.trim();
  const lower = name.toLowerCase();

  // FIFA World Cup (and qualifiers)
  if (lower.includes('fifa world cup') || lower.includes('world cup')) return 'FIFA World Cup';
  if (lower.includes('world cup qualifier') || lower.includes('conmebol') && lower.includes('qualifier')) return 'World Cup Qualifier';
  if (lower.includes('fifa') && lower.includes('qualifier')) return 'FIFA Qualifier';

  // UEFA
  if (lower.includes('uefa champions league')) return 'UEFA Champions League';
  if (lower.includes('uefa europa league') && lower.includes('conference')) return 'UEFA Conference League';
  if (lower.includes('uefa europa league')) return 'UEFA Europa League';
  if (lower.includes('uefa nations league')) return 'UEFA Nations League';
  if (lower.includes('euro') && lower.includes('qualification')) return 'UEFA Euro Qualifier';
  if (lower.includes('euro 20') || lower.includes('european championship')) return 'UEFA Euro';

  // Top 5 Leagues
  if (lower.includes('english premier league') || lower.includes('premier league')) return 'Premier League';
  if (lower.includes('la liga') || lower.includes('laliga')) return 'LaLiga';
  if (lower.includes('bundesliga') && !lower.includes('2.')) return 'Bundesliga';
  if (lower.includes('2. bundesliga') || lower.includes('2nd bundesliga')) return '2. Bundesliga';
  if (lower.includes('ligue 1')) return 'Ligue 1';
  if (lower.includes('serie a') && !lower.includes('brasileiro')) return 'Serie A';

  // Other European
  if (lower.includes('eredivisie')) return 'Eredivisie';
  if (lower.includes('primeira liga') || lower.includes('liga portugal')) return 'Primeira Liga';
  if (lower.includes('super lig')) return 'Süper Lig';

  // Copa / CONMEBOL
  if (lower.includes('copa america')) return 'Copa América';
  if (lower.includes('copa libertadores')) return 'Copa Libertadores';
  if (lower.includes('brasileirao') || lower.includes('série a brasileiro')) return 'Brasileirão';

  // AFC / CAF / CONCACAF
  if (lower.includes('afc asian cup') || (lower.includes('asian') && lower.includes('cup'))) return 'AFC Asian Cup';
  if (lower.includes('afc') && lower.includes('qualifier')) return 'AFC Qualifier';
  if (lower.includes('caf') || lower.includes('africa cup')) return 'AFCON';
  if (lower.includes('concacaf')) return 'CONCACAF';
  if (lower.includes('gold cup')) return 'Gold Cup';

  // Internationals
  if (lower.includes('international friendly') || lower.includes('friendly')) return 'International Friendly';
  if (lower.includes('world soccer') || lower === 'all soccer') return 'International';

  return name || 'Football';
}

export async function GET() {
  try {
    const url = 'https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard';
    const res = await fetch(url, {
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      throw new Error(`ESPN API failed with status ${res.status}`);
    }

    const data = await res.json();
    const events: ESPNEvent[] = data.events || [];

    // ESPN may surface a top-level league name for the scoreboard
    const topLeagueName: string = data.leagues?.[0]?.name || data.league?.name || '';

    const matches = events.map((event: ESPNEvent) => {
      const comp = event.competitions[0];
      if (!comp) return null;

      const homeComp = comp.competitors.find(c => c.homeAway === 'home');
      const awayComp = comp.competitors.find(c => c.homeAway === 'away');

      if (!homeComp || !awayComp) return null;

      const isLive = comp.status.type.state === 'in';
      const isFinished = comp.status.type.state === 'post';
      
      let statusText = comp.status.type.shortDetail;
      if (isLive) {
        statusText = comp.status.displayClock || 'Live';
      }

      // Extract real league name from event data
      const rawLeague =
        event.league?.name ||
        topLeagueName ||
        'International';

      return {
        id: event.id,
        league: normalizeLeague(rawLeague),
        home: {
          name: homeComp.team.displayName || homeComp.team.abbreviation,
          score: homeComp.score !== undefined ? parseInt(homeComp.score, 10) : null,
          logo: homeComp.team.logo,
          isWinner: homeComp.winner
        },
        away: {
          name: awayComp.team.displayName || awayComp.team.abbreviation,
          score: awayComp.score !== undefined ? parseInt(awayComp.score, 10) : null,
          logo: awayComp.team.logo,
          isWinner: awayComp.winner
        },
        isLive,
        isFinished,
        statusText
      };
    }).filter(Boolean);

    const response = NextResponse.json({ source: 'espn', matches });
    response.headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    return response;
  } catch (error) {
    console.error('[GET /api/scores] Error fetching from ESPN:', error);
    return NextResponse.json(
      { error: 'failed to fetch live scores' },
      { status: 503 }
    );
  }
}
