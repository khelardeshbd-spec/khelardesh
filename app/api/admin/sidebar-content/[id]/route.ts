export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as any
    const { tab_type, content, display_order, active, event_date } = body

    const { data: item, error } = await supabaseAdmin
      .from('SidebarContent')
      .update({ tab_type, content, display_order, active, event_date: event_date ?? null })
      .eq('id', params.id)
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'sidebar.update',
      targetType: 'sidebar-content',
      targetId: String(params.id),
      targetLabel: `${item.tab_type}: ${item.content?.title || 'Sidebar Item'}`,
    })

    return NextResponse.json({ item })
  } catch (error) {
    console.error('[PUT /api/admin/sidebar-content/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // Fetch details before deleting so we can log it
    const { data: item } = await supabaseAdmin
      .from('SidebarContent')
      .select('tab_type, content')
      .eq('id', params.id)
      .single()

    const { error } = await supabaseAdmin
      .from('SidebarContent')
      .delete()
      .eq('id', params.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await logActivity({
      actor: user,
      action: 'sidebar.delete',
      targetType: 'sidebar-content',
      targetId: String(params.id),
      targetLabel: item ? `${item.tab_type}: ${item.content?.title || 'Sidebar Item'}` : `Sidebar Item ID ${params.id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/sidebar-content/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
