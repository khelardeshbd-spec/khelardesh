export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * PUT /api/admin/scores/[id] — update score card
 * DELETE /api/admin/scores/[id] — delete score card
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id, 10)
    const body = await request.json() as any;
    
    // Allow partial updates
    const updateData: any = { updatedAt: new Date().toISOString() };
    const allowedFields = ['league', 'teamA', 'scoreA', 'teamB', 'scoreB', 'winnerTeam', 'status', 'isLive', 'sofascoreId', 'displayOrder', 'is_visible', 'is_pinned', 'sport_type'];
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const { data: score, error } = await supabaseAdmin
      .from('ScoreCard')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'score.update',
      targetType: 'score-card',
      targetId: String(id),
      targetLabel: `${score.teamA} vs ${score.teamB} (${score.league})`,
    })

    return NextResponse.json({ score })
  } catch (error) {
    console.error('[PUT /api/admin/scores/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id, 10)
    
    // Fetch details before deleting so we can log it
    const { data: score } = await supabaseAdmin
      .from('ScoreCard')
      .select('teamA, teamB, league')
      .eq('id', id)
      .single()

    const { error } = await supabaseAdmin.from('ScoreCard').delete().eq('id', id)
    if (error) throw error

    await logActivity({
      actor: user,
      action: 'score.delete',
      targetType: 'score-card',
      targetId: String(id),
      targetLabel: score ? `${score.teamA} vs ${score.teamB} (${score.league})` : `Score Card ID ${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/scores/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
