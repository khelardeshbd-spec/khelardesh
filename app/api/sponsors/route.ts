export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/sponsors
 * Active sponsors, optionally filtered by placement
 * Query: ?placement=inline | ?placement=sidebar
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const placement = searchParams.get('placement')

    let query = supabaseAdmin
      .from('Sponsor')
      .select('*')
      .eq('isActive', true)
      .order('displayOrder', { ascending: true })

    if (placement) query = query.eq('placement', placement)

    const { data: sponsors, error } = await query
    if (error) throw error
    return NextResponse.json({ sponsors: sponsors ?? [] })
  } catch (error) {
    console.error('[GET /api/sponsors]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
