export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'

interface PlayerStat {
  name: string;
  value: number;
}

interface ESPNAthlete {
  id: string;
  shortName: string;
  fullName: string;
  displayName: string;
  jerseyImages?: { href: string }[];
}

interface ESPNPosition {
  name: string;
  displayName: string;
  abbreviation: string;
}

interface ESPNPlayer {
  active: boolean;
  starter: boolean;
  jersey: string;
  formationPlace?: string;
  athlete: ESPNAthlete;
  position: ESPNPosition;
  stats?: PlayerStat[];
}

interface ESPNTeamRoster {
  homeAway: string;
  winner: boolean;
  formation?: string;
  team: {
    id: string;
    displayName: string;
    abbreviation: string;
    logos?: { href: string }[];
    color?: string;
  };
  roster?: ESPNPlayer[];
}

// Helper: Calculate a realistic rating based on match stats
function calculateRating(player: ESPNPlayer): number {
  let rating = 6.0; // Baseline
  
  if (!player.stats) return rating;

  const statMap: Record<string, number> = {};
  player.stats.forEach(s => {
    statMap[s.name] = s.value;
  });

  const isGK = player.position.abbreviation === 'G' || player.position.name === 'Goalkeeper';
  const isDF = player.position.abbreviation.includes('D') || player.position.name.includes('Defender') || player.position.name.includes('Back');

  // Goals & Assists
  if (statMap.totalGoals) {
    rating += statMap.totalGoals * 1.5;
  }
  if (statMap.goalAssists) {
    rating += statMap.goalAssists * 1.0;
  }

  // Cards
  if (statMap.yellowCards) {
    rating -= statMap.yellowCards * 1.0;
  }
  if (statMap.redCards) {
    rating -= statMap.redCards * 3.0;
  }
  if (statMap.ownGoals) {
    rating -= statMap.ownGoals * 2.0;
  }

  // Goalkeeper Specifics
  if (isGK) {
    if (statMap.saves) {
      rating += statMap.saves * 0.4;
    }
    if (statMap.goalsConceded) {
      rating -= statMap.goalsConceded * 0.6;
    }
  }

  // Defender Specifics (incentivize clean sheet/less goals conceded)
  if (isDF) {
    if (statMap.goalsConceded) {
      rating -= statMap.goalsConceded * 0.3;
    }
  }

  // general action points
  if (statMap.shotsOnTarget) {
    rating += statMap.shotsOnTarget * 0.2;
  }
  if (statMap.foulsCommitted) {
    rating -= statMap.foulsCommitted * 0.1;
  }
  if (statMap.foulsSuffered) {
    rating += statMap.foulsSuffered * 0.1;
  }

  // Clamp rating between 3.0 and 10.0
  return Math.min(10.0, Math.max(3.0, parseFloat(rating.toFixed(1))));
}

export async function GET(
  request: Request,
  { params }: { params: { matchId: string } }
) {
  const matchId = params.matchId;
  if (!matchId) {
    return NextResponse.json({ error: 'Missing match ID' }, { status: 400 });
  }

  try {
    const url = `http://site.api.espn.com/apis/site/v2/sports/soccer/all/summary?event=${matchId}`;
    const res = await fetch(url, {
      next: { revalidate: 15 } // Match summary details revalidate faster
    });

    if (!res.ok) {
      throw new Error(`ESPN Summary API failed with status ${res.status}`);
    }

    const data = await res.json();

    // 1. Parse Scoreboard / Header details
    const header = data.header || {};
    const competitions = header.competitions?.[0] || {};
    const status = competitions.status || {};
    const detail = status.type?.shortDetail || '';
    const displayClock = status.displayClock || '';
    const isLive = status.type?.state === 'in';
    const isFinished = status.type?.state === 'post';

    // 2. Parse Teams
    const competitors = competitions.competitors || [];
    const homeComp = competitors.find((c: any) => c.homeAway === 'home') || {};
    const awayComp = competitors.find((c: any) => c.homeAway === 'away') || {};

    const scorers: { teamId: string; athlete: string; time: string }[] = [];
    // Extract goal scorers list if available in keyEvents or commentary
    // We can look at summary details or header.competitions[0].details
    const details = competitions.details || [];
    details.forEach((d: any) => {
      if (d.type?.text === 'Goal') {
        scorers.push({
          teamId: d.team?.id || '',
          athlete: d.athletesInvolve?.[0]?.displayName || d.participants?.[0]?.athlete?.displayName || 'Goal',
          time: d.clock?.displayValue || ''
        });
      }
    });

    // 3. Parse Rosters / Lineups
    const rawRosters: ESPNTeamRoster[] = data.rosters || [];
    const rosters = rawRosters.map((teamRoster) => {
      const isHome = teamRoster.homeAway === 'home';
      const starterList = (teamRoster.roster || [])
        .filter(p => p.starter)
        .map(p => ({
          id: p.athlete.id,
          name: p.athlete.shortName || p.athlete.displayName,
          fullName: p.athlete.fullName,
          jersey: p.jersey,
          position: p.position.displayName,
          positionAbbr: p.position.abbreviation,
          formationPlace: p.formationPlace || '',
          rating: calculateRating(p),
          avatar: p.athlete.jerseyImages?.[0]?.href || ''
        }));

      const benchList = (teamRoster.roster || [])
        .filter(p => !p.starter)
        .map(p => ({
          id: p.athlete.id,
          name: p.athlete.shortName || p.athlete.displayName,
          fullName: p.athlete.fullName,
          jersey: p.jersey,
          position: p.position.displayName,
          positionAbbr: p.position.abbreviation,
          rating: calculateRating(p),
          avatar: p.athlete.jerseyImages?.[0]?.href || ''
        }));

      return {
        teamId: teamRoster.team.id,
        name: teamRoster.team.displayName,
        abbreviation: teamRoster.team.abbreviation,
        logo: teamRoster.team.logos?.[0]?.href || '',
        color: teamRoster.team.color || (isHome ? 'd72b2c' : '312519'),
        formation: teamRoster.formation || '4-4-2',
        starters: starterList,
        bench: benchList
      };
    });

    // Extract stats
    const stats: { name: string; home: string; away: string }[] = [];
    const boxscore = data.boxscore || {};
    const teamsStats = boxscore.statistics || [];
    const homeStats = teamsStats.find((s: any) => s.team?.id === homeComp.id) || {};
    const awayStats = teamsStats.find((s: any) => s.team?.id === awayComp.id) || {};
    
    // Map team statistics
    const statKeys = ['shots', 'shotsOnTarget', 'possessionPercent', 'foulsCommitted', 'yellowCards', 'redCards', 'offsides', 'cornerKicks', 'saves'];
    statKeys.forEach(key => {
      const hStat = (homeStats.statistics || []).find((s: any) => s.name === key);
      const aStat = (awayStats.statistics || []).find((s: any) => s.name === key);
      if (hStat || aStat) {
        stats.push({
          name: hStat?.displayName || aStat?.displayName || key,
          home: hStat?.displayValue || '0',
          away: aStat?.displayValue || '0'
        });
      }
    });

    // Parse league details
    const leagueData = header.league || {};
    const leagueName = leagueData.name || 'International';
    const leagueLogo = leagueData.logos?.[0]?.href || '';
    
    // Normalize league function (local copy)
    const normalizeLeagueLocal = (raw: string): string => {
      const name = raw.trim();
      const lower = name.toLowerCase();
      if (lower.includes('fifa world cup') || lower.includes('world cup')) return 'FIFA World Cup';
      if (lower.includes('world cup qualifier') || lower.includes('conmebol') && lower.includes('qualifier')) return 'World Cup Qualifier';
      if (lower.includes('fifa') && lower.includes('qualifier')) return 'FIFA Qualifier';
      if (lower.includes('uefa champions league')) return 'UEFA Champions League';
      if (lower.includes('uefa europa league') && lower.includes('conference')) return 'UEFA Conference League';
      if (lower.includes('uefa europa league')) return 'UEFA Europa League';
      if (lower.includes('uefa nations league')) return 'UEFA Nations League';
      if (lower.includes('euro') && lower.includes('qualification')) return 'UEFA Euro Qualifier';
      if (lower.includes('euro 20') || lower.includes('european championship')) return 'UEFA Euro';
      if (lower.includes('english premier league') || lower.includes('premier league')) return 'Premier League';
      if (lower.includes('la liga') || lower.includes('laliga')) return 'LaLiga';
      if (lower.includes('bundesliga') && !lower.includes('2.')) return 'Bundesliga';
      if (lower.includes('2. bundesliga') || lower.includes('2nd bundesliga')) return '2. Bundesliga';
      if (lower.includes('ligue 1')) return 'Ligue 1';
      if (lower.includes('serie a') && !lower.includes('brasileiro')) return 'Serie A';
      if (lower.includes('eredivisie')) return 'Eredivisie';
      if (lower.includes('primeira liga') || lower.includes('liga portugal')) return 'Primeira Liga';
      if (lower.includes('super lig')) return 'Süper Lig';
      if (lower.includes('copa america')) return 'Copa América';
      if (lower.includes('copa libertadores')) return 'Copa Libertadores';
      if (lower.includes('brasileirao') || lower.includes('série a brasileiro')) return 'Brasileirão';
      if (lower.includes('afc asian cup') || (lower.includes('asian') && lower.includes('cup'))) return 'AFC Asian Cup';
      if (lower.includes('afc') && lower.includes('qualifier')) return 'AFC Qualifier';
      if (lower.includes('caf') || lower.includes('africa cup')) return 'AFCON';
      if (lower.includes('concacaf')) return 'CONCACAF';
      if (lower.includes('gold cup')) return 'Gold Cup';
      if (lower.includes('international friendly') || lower.includes('friendly')) return 'International Friendly';
      if (lower.includes('world soccer') || lower === 'all soccer') return 'International';
      return name || 'Football';
    };

    const headerUid = header.uid || '';
    const isFIFAOrInt = 
      leagueName.toLowerCase().includes('fifa') || 
      leagueName.toLowerCase().includes('world cup') || 
      leagueName.toLowerCase().includes('friendly') || 
      leagueName.toLowerCase().includes('nations league') || 
      leagueName.toLowerCase().includes('euro') || 
      leagueName.toLowerCase().includes('copa america') || 
      leagueName.toLowerCase().includes('afcon') || 
      leagueName.toLowerCase().includes('asian cup') ||
      leagueName.toLowerCase().includes('international') ||
      (header.season?.name && header.season.name.toLowerCase().includes('world cup')) ||
      (headerUid && (headerUid.includes('l:606') || headerUid.includes('l:609') || headerUid.includes('l:612') || headerUid.includes('l:614') || headerUid.includes('l:600')));

    const homeScoreParsed = homeComp.score !== undefined && homeComp.score !== null && homeComp.score !== '' && !isNaN(parseInt(homeComp.score, 10)) ? parseInt(homeComp.score, 10) : null;
    const awayScoreParsed = awayComp.score !== undefined && awayComp.score !== null && awayComp.score !== '' && !isNaN(parseInt(awayComp.score, 10)) ? parseInt(awayComp.score, 10) : null;

    const matchDetails = {
      matchId,
      league: normalizeLeagueLocal(leagueName),
      category: isFIFAOrInt ? 'FIFA / International' : 'Club Match',
      leagueLogo,
      status: {
        detail,
        displayClock,
        isLive,
        isFinished
      },
      home: {
        id: homeComp.id,
        name: homeComp.team?.displayName || 'Home Team',
        abbreviation: homeComp.team?.abbreviation || 'HOME',
        score: homeScoreParsed,
        logo: homeComp.team?.logo || homeComp.team?.logos?.[0]?.href || ''
      },
      away: {
        id: awayComp.id,
        name: awayComp.team?.displayName || 'Away Team',
        abbreviation: awayComp.team?.abbreviation || 'AWAY',
        score: awayScoreParsed,
        logo: awayComp.team?.logo || awayComp.team?.logos?.[0]?.href || ''
      },
      scorers,
      rosters,
      stats
    };

    const response = NextResponse.json(matchDetails);
    response.headers.set('Cache-Control', 's-maxage=10, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error(`[GET /api/scores/${matchId}] Error:`, error);
    return NextResponse.json(
      { error: 'failed to fetch match details' },
      { status: 503 }
    );
  }
}
