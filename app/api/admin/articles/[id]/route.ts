export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getSessionUser, requirePermission, isAdmin } from '@/lib/rbac'
import { logActivity } from '@/lib/activity'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  const err = requirePermission(user, 'view_articles')
  if (err) return err

  try {
    const id = parseInt(params.id, 10)
    const { data: article, error } = await supabaseAdmin
      .from('Article')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    return NextResponse.json({ article })
  } catch (error) {
    console.error('[GET /api/admin/articles/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/articles/[id] — update article
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  const err = requirePermission(user, 'write_articles')
  if (err) return err

  try {
    const id = parseInt(params.id, 10)
    const body = await request.json() as any
    const {
      headline, headlineBn, deck, body: articleBody,
      kicker, sport, mediaType, mediaUrl, mediaCaption,
      byline, isLead, status,
    } = body

    // Fetch previous status for action type determination
    const { data: prev } = await supabaseAdmin
      .from('Article')
      .select('headline, status')
      .eq('id', id)
      .single()

    const { data: article, error } = await supabaseAdmin
      .from('Article')
      .update({
        headline,
        headlineBn: headlineBn || null,
        deck,
        body: articleBody,
        kicker,
        sport,
        mediaType,
        mediaUrl,
        mediaCaption: mediaCaption || null,
        byline,
        isLead: isLead ?? false,
        status: status || 'published',
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Determine action type
    let action: 'article.update' | 'article.publish' | 'article.archive' = 'article.update'
    if (prev?.status !== status) {
      if (status === 'published') action = 'article.publish'
      else if (status === 'draft') action = 'article.archive'
    }

    await logActivity({
      actor: user!,
      action,
      targetType: 'article',
      targetId: String(id),
      targetLabel: headline || prev?.headline,
    })

    return NextResponse.json({ article })
  } catch (error) {
    console.error('[PUT /api/admin/articles/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser()
  // Only admins can delete, not employees
  if (!isAdmin(user)) {
    return user
      ? new Response('Forbidden — only admins can delete articles', { status: 403 })
      : new Response('Unauthorized', { status: 401 })
  }

  try {
    const id = parseInt(params.id, 10)

    // Fetch for logging
    const { data: article } = await supabaseAdmin
      .from('Article')
      .select('headline')
      .eq('id', id)
      .single()

    const { error } = await supabaseAdmin.from('Article').delete().eq('id', id)
    if (error) throw error

    await logActivity({
      actor: user!,
      action: 'article.delete',
      targetType: 'article',
      targetId: String(id),
      targetLabel: article?.headline ?? String(id),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/articles/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
