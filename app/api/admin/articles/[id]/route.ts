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
      byline, isLead, status, tags,
    } = body

    // Fetch previous status for permission check and action type determination
    const { data: prev } = await supabaseAdmin
      .from('Article')
      .select('headline, status')
      .eq('id', id)
      .single()

    if (!prev) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const { hasPermission } = require('@/lib/rbac')
    if (prev.status === 'published' && !hasPermission(user, 'edit_published_articles')) {
      return new Response('Forbidden — You do not have permission to edit published articles', { status: 403 })
    }
    if (prev.status === 'draft' && !hasPermission(user, 'edit_drafts')) {
      return new Response('Forbidden — You do not have permission to edit drafts', { status: 403 })
    }
    if (prev.status === 'archived' && !hasPermission(user, 'edit_archives')) {
      return new Response('Forbidden — You do not have permission to edit archives', { status: 403 })
    }
    if (prev.status === 'deleted' && !hasPermission(user, 'edit_drafts')) {
      return new Response('Forbidden — You do not have permission to restore deleted articles', { status: 403 })
    }

    const updatePayload: any = {
      headline,
      headlineBn: headlineBn || null,
      deck: deck || '',
      body: articleBody,
      kicker: kicker || '',
      sport,
      mediaType,
      mediaUrl,
      mediaCaption: mediaCaption || null,
      byline,
      isLead: isLead ?? false,
      tags: tags !== undefined ? (tags || null) : undefined,
      status: status || 'published',
      updatedAt: new Date().toISOString(),
    }

    if (prev?.status !== 'published' && status === 'published') {
      updatePayload.publishedAt = new Date().toISOString()
    }

    const { data: article, error } = await supabaseAdmin
      .from('Article')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Determine action type
    let action: 'article.update' | 'article.publish' | 'article.archive' = 'article.update'
    if (prev?.status !== status) {
      if (status === 'published') action = 'article.publish'
      else if (status === 'archived') action = 'article.archive'
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
  if (!user) return new Response('Unauthorized', { status: 401 })

  try {
    const id = parseInt(params.id, 10)

    // Fetch for logging and permission check
    const { data: article } = await supabaseAdmin
      .from('Article')
      .select('headline, status')
      .eq('id', id)
      .single()

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 })
    }

    const { hasPermission } = require('@/lib/rbac')
    if (article.status === 'published' && !hasPermission(user, 'delete_articles')) {
      return new Response('Forbidden — You do not have permission to delete published articles', { status: 403 })
    }
    if (article.status === 'draft' && !hasPermission(user, 'delete_drafts')) {
      return new Response('Forbidden — You do not have permission to delete drafts', { status: 403 })
    }
    if (article.status === 'deleted' && !hasPermission(user, 'delete_drafts')) {
      return new Response('Forbidden — You do not have permission to permanently delete articles', { status: 403 })
    }

    const shouldHardDelete = article.status === 'deleted'

    if (shouldHardDelete) {
      const { error } = await supabaseAdmin.from('Article').delete().eq('id', id)
      if (error) throw error
    } else {
      const { error } = await supabaseAdmin
        .from('Article')
        .update({ status: 'deleted', updatedAt: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    }

    await logActivity({
      actor: user!,
      action: shouldHardDelete ? 'article.delete' : 'article.update', // Log as update or delete
      targetType: 'article',
      targetId: String(id),
      targetLabel: article?.headline ?? String(id),
      metadata: shouldHardDelete ? { permanent: true } : { softDelete: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[DELETE /api/admin/articles/[id]]', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
