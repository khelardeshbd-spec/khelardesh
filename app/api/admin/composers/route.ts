export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * GET /api/admin/composers — list all composers
 * POST /api/admin/composers — create composer
 */
export async function GET() {
  // Let this be public so that frontend dropdowns or profile features can load it
  const { data: composers, error } = await supabaseAdmin
    .from('Composer')
    .select('*')
    .order('name', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ composers: composers ?? [] })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await request.json() as any
    const { name, photoUrl = null } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const { data: composer, error } = await supabaseAdmin
      .from('Composer')
      .insert({ 
        name: name.trim(), 
        photoUrl,
        updatedAt: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'composer.create',
      targetType: 'composer',
      targetId: String(composer.id),
      targetLabel: composer.name,
    })

    return NextResponse.json({ composer }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/composers]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
