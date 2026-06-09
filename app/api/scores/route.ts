export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/scores
 * All active score cards — live first, then by displayOrder
 */
export async function GET() {
  try {
    const { data: scores, error } = await supabaseAdmin
      .from('ScoreCard')
      .select('*')
      .order('isLive', { ascending: false })
      .order('displayOrder', { ascending: true })

    if (error) throw error
    return NextResponse.json({ scores: scores ?? [] })
  } catch (error) {
    console.error('[GET /api/scores]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
