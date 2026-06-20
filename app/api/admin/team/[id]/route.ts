import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser, requireAdmin } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

// PUT /api/admin/team/[id] — update employee permissions or active status
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  const err = requireAdmin(user);
  if (err) return err;

  const body = await req.json();
  const { is_active, permissions, display_name } = body;

  // Fetch current employee
  const { data: existing, error: fetchErr } = await supabaseAdmin
    .from('EmployeeUser')
    .select('id, username, display_name, is_active, permissions')
    .eq('id', params.id)
    .single();

  if (fetchErr || !existing) {
    return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof is_active === 'boolean') updates.is_active = is_active;
  if (permissions !== undefined) updates.permissions = permissions;
  if (display_name !== undefined) updates.display_name = display_name;

  const { data, error } = await supabaseAdmin
    .from('EmployeeUser')
    .update(updates)
    .eq('id', params.id)
    .select('id, username, display_name, is_active, permissions')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Determine action type for activity log
  let action: 'employee.update_permissions' | 'employee.activate' | 'employee.deactivate' = 'employee.update_permissions';
  if (typeof is_active === 'boolean') {
    action = is_active ? 'employee.activate' : 'employee.deactivate';
  }

  await logActivity({
    actor: user!,
    action,
    targetType: 'employee',
    targetId: params.id,
    targetLabel: existing.username,
    metadata: { changes: updates },
  });

  return NextResponse.json({ employee: data });
}

// DELETE /api/admin/team/[id] — remove an employee account
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getSessionUser();
  const err = requireAdmin(user);
  if (err) return err;

  const { data: existing } = await supabaseAdmin
    .from('EmployeeUser')
    .select('username')
    .eq('id', params.id)
    .single();

  const { error } = await supabaseAdmin
    .from('EmployeeUser')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({
    actor: user!,
    action: 'employee.delete',
    targetType: 'employee',
    targetId: params.id,
    targetLabel: existing?.username ?? params.id,
  });

  return NextResponse.json({ success: true });
}
