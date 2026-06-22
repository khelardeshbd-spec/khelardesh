export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

/**
 * GET /api/admin/sponsors — list all sponsors
 * POST /api/admin/sponsors — create sponsor
 */
export async function GET() {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: sponsors, error } = await supabaseAdmin
    .from('Sponsor')
    .select('*')
    .order('displayOrder', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ sponsors: sponsors ?? [] })
}

export async function POST(request: Request) {
  const user = await getSessionUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role === 'employee') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  try {
    const body = await request.json() as any
    const {
      label = 'Sponsor', title = '', subtitle = '', ctaText = '',
      ctaUrl, placement = 'inline', isActive = true, displayOrder = 0,
      imageUrl = null, useAdsterra = false, adsterraCode = null
    } = body

    if (!useAdsterra && imageUrl && !ctaUrl) {
      return NextResponse.json({ error: 'Missing CTA URL' }, { status: 400 })
    }

    const { data: sponsor, error } = await supabaseAdmin
      .from('Sponsor')
      .insert({ 
        label, 
        title, 
        subtitle, 
        ctaText, 
        ctaUrl: useAdsterra ? '' : (ctaUrl || ''), 
        placement, 
        isActive, 
        displayOrder,
        imageUrl,
        useAdsterra,
        adsterraCode
      })
      .select()
      .single()

    if (error) throw error

    await logActivity({
      actor: user,
      action: 'sponsor.create',
      targetType: 'sponsor',
      targetId: String(sponsor.id),
      targetLabel: `${sponsor.label}: ${sponsor.title || 'Untitled'}`,
    })

    return NextResponse.json({ sponsor }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/admin/sponsors]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
