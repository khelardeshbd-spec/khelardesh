export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/user/notifications
 * Fetch notifications for the logged-in user
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: notifications, error } = await supabaseAdmin
      .from('UserNotification')
      .select(`
        *,
        Comment (
          body,
          createdAt,
          userImage,
          articleSlug
        )
      `)
      .eq('userEmail', session.user.email)
      .order('createdAt', { ascending: false })
      .limit(30);

    if (error) throw error;

    return NextResponse.json({ notifications: notifications || [] });
  } catch (error) {
    console.error('[GET /api/user/notifications]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/user/notifications
 * Mark user notifications as read
 */
export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ids } = await request.json(); // array of notification IDs to mark as read

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseAdmin
      .from('UserNotification')
      .update({ isRead: true })
      .in('id', ids)
      .eq('userEmail', session.user.email); // Security constraint

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATCH /api/user/notifications]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
