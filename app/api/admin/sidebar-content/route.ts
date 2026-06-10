export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/admin/sidebar-content?tab=trivia|history|fixture|tv
 * POST /api/admin/sidebar-content
 *
 * Requires a 'SidebarContent' table in Supabase with columns:
 *   id (int8, pk), tab_type (text), content (jsonb),
 *   display_order (int4), active (bool), event_date (date, nullable),
 *   created_at (timestamptz)
 */
export async function GET(request: Request) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab')

  let query = supabaseAdmin
    .from('SidebarContent')
    .select('*')
    .order('display_order', { ascending: true })

  if (tab) {
    query = query.eq('tab_type', tab) as typeof query
  }

  const { data: items, error } = await query

  if (error) {
    // Table might not exist yet — return empty gracefully
    console.warn('[GET /api/admin/sidebar-content]', error.message)
    return NextResponse.json({ items: [] })
  }
  return NextResponse.json({ items: items ?? [] })
}

export async function POST(request: Request) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as any
    const { tab_type, content, display_order = 0, active = true, event_date } = body

    if (!tab_type || !content) {
      return NextResponse.json({ error: 'tab_type and content are required' }, { status: 400 })
    }

    const { data: item, error } = await supabaseAdmin
      .from('SidebarContent')
      .insert({ tab_type, content, display_order, active, event_date: event_date ?? null })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/sidebar-content]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
