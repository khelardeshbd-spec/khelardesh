import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser, requireAdmin } from '@/lib/rbac';

export async function GET() {
  const user = await getSessionUser();
  if (!user || user.role !== 'super_admin') {
    return new Response('Forbidden', { status: 403 });
  }

  const { data, error } = await supabaseAdmin
    .from('AdminUser')
    .select('id, username, display_name, role, is_blocked, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ admins: data });
}
