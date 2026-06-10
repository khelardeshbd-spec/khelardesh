export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
    return NextResponse.json({ item })
  } catch (error) {
    console.error('[PUT /api/admin/sidebar-content/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { error } = await supabaseAdmin
    .from('SidebarContent')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
