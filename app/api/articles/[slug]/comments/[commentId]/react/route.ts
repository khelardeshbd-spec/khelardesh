import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: { slug: string, commentId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type } = await request.json(); // 'LIKE' or 'DISLIKE'
    if (type !== 'LIKE' && type !== 'DISLIKE') {
      return NextResponse.json({ error: 'Invalid reaction type' }, { status: 400 });
    }

    const userEmail = session.user.email;
    const commentId = parseInt(params.commentId, 10);

    // Get the comment to find the owner
    const { data: comment } = await supabaseAdmin
      .from('Comment')
      .select('*')
      .eq('id', commentId)
      .single();

    if (!comment) return NextResponse.json({ error: 'Comment not found' }, { status: 404 });

    // Check existing reaction
    const { data: existing } = await supabaseAdmin
      .from('CommentReaction')
      .select('*')
      .eq('commentId', commentId)
      .eq('userEmail', userEmail)
      .single();

    if (existing) {
      if (existing.type === type) {
        // Toggle off
        await supabaseAdmin.from('CommentReaction').delete().eq('id', existing.id);
        
        // Decrement
        const col = type === 'LIKE' ? 'likes' : 'dislikes';
        await supabaseAdmin.from('Comment').update({ [col]: Math.max(0, (comment[col] || 0) - 1) }).eq('id', commentId);
        
        return NextResponse.json({ success: true, action: 'removed' });
      } else {
        // Switch reaction
        await supabaseAdmin.from('CommentReaction').update({ type }).eq('id', existing.id);
        
        const oldCol = existing.type === 'LIKE' ? 'likes' : 'dislikes';
        const newCol = type === 'LIKE' ? 'likes' : 'dislikes';
        
        await supabaseAdmin.from('Comment').update({ 
          [oldCol]: Math.max(0, (comment[oldCol] || 0) - 1),
          [newCol]: (comment[newCol] || 0) + 1 
        }).eq('id', commentId);

        // Notify the comment owner if someone else liked/disliked
        if (comment.userEmail !== userEmail) {
          await supabaseAdmin.from('UserNotification').insert({
            userEmail: comment.userEmail,
            type: type,
            commentId: commentId,
            actorName: session.user.name || 'Alguien'
          });
        }

        return NextResponse.json({ success: true, action: 'switched' });
      }
    } else {
      // New reaction
      await supabaseAdmin.from('CommentReaction').insert({
        commentId,
        userEmail,
        type
      });

      const col = type === 'LIKE' ? 'likes' : 'dislikes';
      await supabaseAdmin.from('Comment').update({ [col]: (comment[col] || 0) + 1 }).eq('id', commentId);

      // Notify the comment owner if someone else liked/disliked
      if (comment.userEmail !== userEmail) {
        await supabaseAdmin.from('UserNotification').insert({
          userEmail: comment.userEmail,
          type: type,
          commentId: commentId,
          actorName: session.user.name || 'Alguien'
        });
      }

      return NextResponse.json({ success: true, action: 'added' });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
