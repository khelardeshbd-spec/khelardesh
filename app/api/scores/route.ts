export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch all scorecards that are marked visible
    const { data: cards, error } = await supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .eq('is_visible', true)
      .order('isLive', { ascending: false })
      .order('is_pinned', { ascending: false })
      .order('displayOrder', { ascending: true })
      .order('createdAt', { ascending: false });

    if (error) {
      throw error;
    }

    const matches = (cards || []).map(card => {
      // Determine finished status
      const isFinished = !card.isLive && (
        card.status === 'পূর্ণ সময়' || 
        card.status === 'FT' || 
        (card.winnerTeam !== null && card.winnerTeam !== '')
      );

      return {
        id: String(card.id),
        league: card.league,
        startTime: card.last_synced_at || card.updatedAt || card.createdAt || new Date().toISOString(),
        home: {
          name: card.teamA,
          score: card.scoreA, // Support strings (e.g. wickets, overs, or translated digits)
          logo: card.home_team_logo || '',
          isWinner: card.winnerTeam === 'A',
        },
        away: {
          name: card.teamB,
          score: card.scoreB, // Support strings
          logo: card.away_team_logo || '',
          isWinner: card.winnerTeam === 'B',
        },
        isLive: card.isLive,
        isFinished,
        statusText: card.status,
      };
    });

    const response = NextResponse.json({ source: 'supabase', matches });
    response.headers.set('Cache-Control', 's-maxage=15, stale-while-revalidate=30');
    return response;
  } catch (error) {
    console.error('[GET /api/scores] Error fetching from Supabase:', error);
    return NextResponse.json(
      { error: 'failed to fetch live scores' },
      { status: 503 }
    );
  }
}
