export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * PUT /api/admin/sponsors/[id] — update sponsor
 * DELETE /api/admin/sponsors/[id] — delete sponsor
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
    const { label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder, imageUrl } = body

    const { data: sponsor, error } = await supabaseAdmin
      .from('Sponsor')
      .update({ label, title, subtitle, ctaText, ctaUrl, placement, isActive, displayOrder, imageUrl })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'sponsor.update',
      targetType: 'sponsor',
      targetId: String(id),
      targetLabel: `${sponsor.label}: ${sponsor.title || 'Untitled'}`,
    })

    return NextResponse.json({ sponsor })
  } catch (error) {
    console.error('[PUT /api/admin/sponsors/[id]]', error)
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
    
    // Fetch sponsor details before deleting so we can log its name/label
    const { data: sponsor } = await supabaseAdmin
      .from('Sponsor')
      .select('label, title')
      .eq('id', id)
      .single()

    const { error } = await supabaseAdmin.from('Sponsor').delete().eq('id', id)
    if (error) throw error

    await logActivity({
      actor: user,
      action: 'sponsor.delete',
      targetType: 'sponsor',
      targetId: String(id),
      targetLabel: sponsor ? `${sponsor.label}: ${sponsor.title || 'Untitled'}` : `Sponsor ID ${id}`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/sponsors/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
