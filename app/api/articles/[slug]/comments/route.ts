export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/articles/[slug]/comments
 * Fetch comments list for an article
 */
export async function GET(
  _request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data: comments, error } = await supabaseAdmin
      .from('Comment')
      .select('*')
      .eq('articleSlug', params.slug)
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
      return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }

    const session = await getServerSession(authOptions);
    let userReactions: any[] = [];
    
    if (session?.user?.email && comments && comments.length > 0) {
      const { data } = await supabaseAdmin
        .from('CommentReaction')
        .select('commentId, type')
        .eq('userEmail', session.user.email)
        .in('commentId', comments.map((c: any) => c.id));
      if (data) userReactions = data;
    }

    const enrichedComments = comments?.map((c: any) => {
      const reaction = userReactions.find(r => r.commentId === c.id);
      return { ...c, userReaction: reaction ? reaction.type : null };
    });

    return NextResponse.json({ comments: enrichedComments });
  } catch (error) {
    console.error('[GET /api/articles/[slug]/comments]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/articles/[slug]/comments
 * Post a new comment or reply
 */
export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to comment.' }, { status: 401 });
    }

    const { body, parentId } = await request.json();

    if (!body || body.trim() === '') {
      return NextResponse.json({ error: 'Comment body cannot be empty' }, { status: 400 });
    }

    const userEmail = session.user.email;
    const userName = session.user.name;
    const userImage = session.user.image;
    // News reporters / Admins have the role 'admin'
    const isReporter = (session.user as any).role === 'admin';

    const { data: newComment, error } = await supabaseAdmin
      .from('Comment')
      .insert({
        articleSlug: params.slug,
        userEmail,
        userName,
        userImage,
        body: body.trim(),
        parentId: parentId || null,
        isReporter
      })
      .select('*')
      .single();

    if (error) {
      console.error('Error inserting comment:', error);
      return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }

    // --- Notifications Logic ---
    // 1. Admin Notification: notify admins of the new comment
    await supabaseAdmin.from('AdminNotification').insert({
      type: 'NEW_COMMENT',
      articleSlug: params.slug,
      commentId: newComment.id,
      actorName: userName || 'Someone',
      actorEmail: userEmail
    });

    // 2. User Notification: if it's a reply, notify the parent comment's author
    if (parentId) {
      const { data: parentComment } = await supabaseAdmin
        .from('Comment')
        .select('userEmail')
        .eq('id', parentId)
        .single();
        
      if (parentComment && parentComment.userEmail !== userEmail) {
        await supabaseAdmin.from('UserNotification').insert({
          userEmail: parentComment.userEmail,
          type: 'REPLY',
          commentId: newComment.id,
          actorName: userName || 'Someone'
        });
      }
    }

    return NextResponse.json({ comment: newComment });
  } catch (error) {
    console.error('[POST /api/articles/[slug]/comments]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
