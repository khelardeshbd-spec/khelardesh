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

    const matches = events.map(event => {
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

      return {
        id: event.id,
        league: "World Soccer", // ESPN 'all' endpoint aggregates many leagues
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
