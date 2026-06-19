export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * PUT /api/admin/composers/[id] — update composer
 * DELETE /api/admin/composers/[id] — delete composer
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
  const { getServerSession } = require('next-auth')
  const { authOptions } = require('@/lib/auth')
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const id = parseInt(params.id, 10)
    const { error } = await supabaseAdmin.from('Composer').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/composers/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
