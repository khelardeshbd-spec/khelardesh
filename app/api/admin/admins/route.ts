import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser, requireAdmin } from '@/lib/rbac';

// GET /api/admin/admins — list all admin accounts (admin only)
export async function GET() {
  const user = await getSessionUser();
  const err = requireAdmin(user);
  if (err) return err;

  const { data, error } = await supabaseAdmin
    .from('AdminUser')
    .select('id, username, display_name, role, is_blocked, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const isSuperAdmin = user?.role === 'super_admin';
  const sanitizedAdmins = data.map(admin => {
    if (!isSuperAdmin && admin.role === 'super_admin') {
      return { ...admin, role: 'admin' };
    }
    return admin;
  });

  return NextResponse.json({ admins: sanitizedAdmins });
}
