import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser, requireSuperAdmin } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

// POST /api/admin/admins/[id]/block — toggle block status (super admin only)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  const err = requireSuperAdmin(user);
  if (err) return err;

  // Prevent blocking yourself
  if (params.id === user!.id) {
    return NextResponse.json({ error: 'Cannot block your own account' }, { status: 400 });
  }

  // Fetch target admin
  const { data: target, error: fetchErr } = await supabaseAdmin
    .from('AdminUser')
    .select('id, username, role, is_blocked')
    .eq('id', params.id)
    .single();

  if (fetchErr || !target) {
    return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
  }

  // Prevent blocking another super_admin
  if (target.role === 'super_admin') {
    return NextResponse.json({ error: 'Cannot block another super admin' }, { status: 403 });
  }

  const newBlockedState = !target.is_blocked;

  const { error: updateErr } = await supabaseAdmin
    .from('AdminUser')
    .update({ is_blocked: newBlockedState, updated_at: new Date().toISOString() })
    .eq('id', params.id);

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });

  await logActivity({
    actor: user!,
    action: newBlockedState ? 'admin.block' : 'admin.unblock',
    targetType: 'admin',
    targetId: params.id,
    targetLabel: target.username,
  });

  return NextResponse.json({ success: true, is_blocked: newBlockedState });
}
