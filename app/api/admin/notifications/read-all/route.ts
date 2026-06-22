import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST() {
  try {
    const { getSessionUser, requireAdmin } = require('@/lib/rbac');
    const user = await getSessionUser();
    const err = requireAdmin(user);
    if (err) return err;

    const { error } = await supabaseAdmin
      .from('Comment')
      .update({ isRead: true })
      .eq('isRead', false);

    if (error) {
      console.error('Error marking all as read:', error);
      return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
