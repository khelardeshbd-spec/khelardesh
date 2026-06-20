export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * GET /api/admin/sidebar-content?tab=trivia|history|fixture|tv
 * POST /api/admin/sidebar-content
 */
export async function GET(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const tab = searchParams.get('tab')

  let query = supabaseAdmin
    .from('SidebarContent')
    .select('*')
    .order('display_order', { ascending: true })

  if (tab) {
    query = query.eq('tab_type', tab) as typeof query
  }

  const { items, error } = await query as any

  if (error) {
    console.warn('[GET /api/admin/sidebar-content]', error.message)
    return NextResponse.json({ items: [] })
  }
  return NextResponse.json({ items: items ?? [] })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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

    await logActivity({
      actor: user,
      action: 'sidebar.create',
      targetType: 'sidebar-content',
      targetId: String(item.id),
      targetLabel: `${item.tab_type}: ${item.content?.title || 'Sidebar Item'}`,
    })

    return NextResponse.json({ item }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/sidebar-content]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
