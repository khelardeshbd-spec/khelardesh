export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * PUT /api/admin/composers/[id] — update composer
 * DELETE /api/admin/composers/[id] — delete composer
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id, 10)
    const body = await request.json() as any
    const { name, photoUrl } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: composer, error } = await supabaseAdmin
      .from('Composer')
      .update({ 
        name: name.trim(), 
        photoUrl,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'composer.update',
      targetType: 'composer',
      targetId: String(id),
      targetLabel: composer.name,
    })

    return NextResponse.json({ composer })
  } catch (error) {
    console.error('[PUT /api/admin/composers/[id]]', error)
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
    
    // Fetch composer details before deleting so we can log its name
    const { data: composer } = await supabaseAdmin
      .from('Composer')
      .select('name')
      .eq('id', id)
      .single()

    const { error } = await supabaseAdmin.from('Composer').delete().eq('id', id)
    if (error) throw error

    await logActivity({
      actor: user,
      action: 'composer.delete',
      targetType: 'composer',
      targetId: String(id),
      targetLabel: composer ? composer.name : `Composer ID ${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/composers/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
