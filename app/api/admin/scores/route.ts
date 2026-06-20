export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * GET /api/admin/scores — list all score cards
 * POST /api/admin/scores — create score card
 */
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: scores, error } = await supabaseAdmin
    .from('ScoreCard')
    .select('*')
    .order('isLive', { ascending: false })
    .order('displayOrder', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ scores: scores ?? [] })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as any
    const {
      league, teamA, scoreA, teamB, scoreB,
      winnerTeam, status, isLive = false,
      sofascoreId, displayOrder = 0,
    } = body

    if (!league || !teamA || !teamB || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: score, error } = await supabaseAdmin
      .from('ScoreCard')
      .insert({
        league, teamA, scoreA: scoreA ?? '0', teamB, scoreB: scoreB ?? '0',
        winnerTeam: winnerTeam || null,
        status, isLive,
        sofascoreId: sofascoreId || null,
        displayOrder,
      })
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'score.create',
      targetType: 'score-card',
      targetId: String(score.id),
      targetLabel: `${score.teamA} vs ${score.teamB} (${score.league})`,
    })

    return NextResponse.json({ score }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/scores]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
