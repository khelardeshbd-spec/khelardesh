import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser } from '@/lib/rbac';

// POST /api/admin/profile/password — change password (requires current password)
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { currentPassword, newPassword } = body;

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'Both current and new password are required' }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
  }

  if (currentPassword === newPassword) {
    return NextResponse.json({ error: 'New password must be different from current password' }, { status: 400 });
  }

  const table = user.role === 'employee' ? 'EmployeeUser' : 'AdminUser';

  // Fetch current hash
  const { data, error: fetchErr } = await supabaseAdmin
    .from(table)
    .select('password_hash')
    .eq('id', user.id)
    .single();

  if (fetchErr || !data) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Verify current password
  const valid = await bcrypt.compare(currentPassword, data.password_hash);
  if (!valid) {
    return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
  }

  // Hash new password
  const newHash = await bcrypt.hash(newPassword, 12);

  const { error: updateErr } = await supabaseAdmin
    .from(table)
    .update({ password_hash: newHash, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
