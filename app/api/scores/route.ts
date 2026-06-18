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
  uid: string;
  name: string;
  date: string;
  season?: { slug?: string; year?: number };
  league?: { name?: string; abbreviation?: string; slug?: string; logos?: { href: string }[] };
  competitions: {
    date: string;
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

const LEAGUE_MAP: Record<string, { name: string; category: 'FIFA / International' | 'Club Match' }> = {
  '606': { name: 'FIFA World Cup', category: 'FIFA / International' },
  '609': { name: 'FIFA World Cup Qualifier', category: 'FIFA / International' },
  '612': { name: 'FIFA World Cup Qualifier', category: 'FIFA / International' },
  '614': { name: 'FIFA World Cup Qualifier', category: 'FIFA / International' },
  '382': { name: 'Premier League', category: 'Club Match' },
  '357': { name: 'LaLiga', category: 'Club Match' },
  '268': { name: 'Bundesliga', category: 'Club Match' },
  '384': { name: 'Serie A', category: 'Club Match' },
  '379': { name: 'Ligue 1', category: 'Club Match' },
  '388': { name: 'Major League Soccer', category: 'Club Match' },
  '4002': { name: 'USL Championship', category: 'Club Match' },
  '19915': { name: 'USL League One', category: 'Club Match' },
  '19910': { name: 'USL League Two', category: 'Club Match' },
  '9875': { name: 'Argentina Primera División', category: 'Club Match' },
  '3903': { name: 'Argentina Primera Nacional', category: 'Club Match' },
  '366': { name: 'English Championship', category: 'Club Match' },
  '367': { name: 'English League One', category: 'Club Match' },
  '368': { name: 'English League Two', category: 'Club Match' },
  '380': { name: 'Eredivisie', category: 'Club Match' },
  '381': { name: 'Primeira Liga', category: 'Club Match' },
  '383': { name: 'Scottish Premiership', category: 'Club Match' },
  '387': { name: 'Copa Libertadores', category: 'Club Match' },
  '437': { name: 'UEFA Champions League', category: 'Club Match' },
  '438': { name: 'UEFA Europa League', category: 'Club Match' },
  '439': { name: 'UEFA Conference League', category: 'Club Match' },
  '2300': { name: 'UEFA Euro', category: 'FIFA / International' },
  '2298': { name: 'UEFA Nations League', category: 'FIFA / International' },
  '2403': { name: 'AFC Asian Cup', category: 'FIFA / International' },
  '2404': { name: 'AFCON', category: 'FIFA / International' },
  '2396': { name: 'Copa América', category: 'FIFA / International' },
  '2304': { name: 'CONCACAF Gold Cup', category: 'FIFA / International' },
  '600': { name: 'International Friendlies', category: 'FIFA / International' }
};

function getLeagueInfo(uid: string, topLeagueName: string, eventName?: string): { name: string; category: 'FIFA / International' | 'Club Match' } {
  const match = uid.match(/l:(\d+)/);
  const leagueId = match ? match[1] : '';
  
  if (leagueId && LEAGUE_MAP[leagueId]) {
    return LEAGUE_MAP[leagueId];
  }

  const rawName = topLeagueName || 'International';
  const lowerName = rawName.toLowerCase();
  
  const isFIFAOrInt = 
    lowerName.includes('fifa') || 
    lowerName.includes('world cup') || 
    lowerName.includes('friendly') || 
    lowerName.includes('nations league') || 
    lowerName.includes('euro') || 
    lowerName.includes('copa america') || 
    lowerName.includes('afcon') || 
    lowerName.includes('asian cup') ||
    lowerName.includes('international') ||
    (eventName && (eventName.includes('at') || eventName.includes('vs')) && !eventName.includes('FC') && !eventName.includes('Club'));

  return {
    name: normalizeLeague(rawName),
    category: isFIFAOrInt ? 'FIFA / International' : 'Club Match'
  };
}

function formatDateYYYYMMDD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const date = String(d.getDate()).padStart(2, '0');
  return `${y}${m}${date}`;
}

async function fetchMatchesForDate(dateStr: string) {
  try {
    const url = `https://site.api.espn.com/apis/site/v2/sports/soccer/all/scoreboard?dates=${dateStr}`;
    const res = await fetch(url, {
      next: { revalidate: 30 }
    });

    if (!res.ok) {
      return [];
    }

    const data = await res.json();
    const events: ESPNEvent[] = data.events || [];
    const topLeagueName: string = data.leagues?.[0]?.name || data.league?.name || '';

    return events.map((event: ESPNEvent) => {
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

      const leagueLogo = event.league?.logos?.[0]?.href || '';
      const leagueInfo = getLeagueInfo(event.uid, topLeagueName, event.name);

      return {
        id: event.id,
        league: leagueInfo.name,
        category: leagueInfo.category,
        leagueLogo,
        startTime: comp.date || event.date || '',
        home: {
          name: homeComp.team.displayName || homeComp.team.abbreviation,
          score: homeComp.score !== undefined && homeComp.score !== null && homeComp.score !== '' && !isNaN(parseInt(homeComp.score, 10)) ? parseInt(homeComp.score, 10) : null,
          logo: homeComp.team.logo || (homeComp.team as any).logos?.[0]?.href || '',
          isWinner: homeComp.winner
        },
        away: {
          name: awayComp.team.displayName || awayComp.team.abbreviation,
          score: awayComp.score !== undefined && awayComp.score !== null && awayComp.score !== '' && !isNaN(parseInt(awayComp.score, 10)) ? parseInt(awayComp.score, 10) : null,
          logo: awayComp.team.logo || (awayComp.team as any).logos?.[0]?.href || '',
          isWinner: awayComp.winner
        },
        isLive,
        isFinished,
        statusText
      };
    }).filter(Boolean);
  } catch (error) {
    console.error(`Error fetching matches for date ${dateStr}:`, error);
    return [];
  }
}

export async function GET() {
  try {
    const datesToFetch: string[] = [];
    for (let i = -2; i <= 2; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      datesToFetch.push(formatDateYYYYMMDD(d));
    }

    const results = await Promise.all(
      datesToFetch.map(dateStr => fetchMatchesForDate(dateStr))
    );

    let allMatches = results.flat();

    // Deduplicate matches by ID
    const seen = new Set<string>();
    const matches = allMatches.filter(m => {
      if (!m) return false;
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    });

    // Sort: Live matches first, then chronological by startTime
    matches.sort((a, b) => {
      if (!a || !b) return 0;
      if (a.isLive && !b.isLive) return -1;
      if (!a.isLive && b.isLive) return 1;
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

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
