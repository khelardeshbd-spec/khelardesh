export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/admin/notifications
 * Fetch unread and recent admin notifications
 */
export async function GET() {
  try {
    const { getSessionUser, requireAdmin } = require('@/lib/rbac');
    const user = await getSessionUser();
    const err = requireAdmin(user);
    if (err) return err;


    const { data: notifications, error } = await supabaseAdmin
      .from('AdminNotification')
      .select(`
        *,
        Comment (
          body,
          createdAt,
          userImage
        )
      `)
      .order('createdAt', { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ notifications: notifications || [] });
  } catch (error) {
    console.error('[GET /api/admin/notifications]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/notifications
 * Mark notifications as read
 */
export async function PATCH(request: Request) {
  try {
    const { getSessionUser, requireAdmin } = require('@/lib/rbac');
    const user = await getSessionUser();
    const err = requireAdmin(user);
    if (err) return err;


    const { ids } = await request.json(); // array of notification IDs to mark as read

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: true });
    }

    const { error } = await supabaseAdmin
      .from('AdminNotification')
      .update({ read: true })
      .in('id', ids);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[PATCH /api/admin/notifications]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
