export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * PUT /api/admin/scores/[id] — update score card
 * DELETE /api/admin/scores/[id] — delete score card
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id, 10)
    const body = await request.json() as any
    const {
      league, teamA, scoreA, teamB, scoreB,
      winnerTeam, status, isLive,
      sofascoreId, displayOrder,
    } = body

    const { data: score, error } = await supabaseAdmin
      .from('ScoreCard')
      .update({
        league, teamA, scoreA, teamB, scoreB,
        winnerTeam: winnerTeam || null,
        status, isLive,
        sofascoreId: sofascoreId || null,
        displayOrder,
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
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
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id, 10)
    const { error } = await supabaseAdmin.from('ScoreCard').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/scores/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
