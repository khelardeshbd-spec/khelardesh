import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser, requireAdmin } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

// GET /api/admin/team — list all employees
export async function GET() {
  const user = await getSessionUser();
  const err = requireAdmin(user);
  if (err) return err;

  const { data, error } = await supabaseAdmin
    .from('EmployeeUser')
    .select('id, username, display_name, is_active, permissions, created_at')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ employees: data });
}

// POST /api/admin/team — create a new employee
export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  const err = requireAdmin(user);
  if (err) return err;

  const body = await req.json();
  const { username, password, displayName, permissions } = body;

  if (!username || !password || !displayName) {
    return NextResponse.json({ error: 'username, password and displayName are required' }, { status: 400 });
  }

  // Validate username format
  if (!/^[a-z0-9_]{3,32}$/.test(username)) {
    return NextResponse.json({ error: 'Username must be 3-32 chars, lowercase letters/numbers/underscore only' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 12);

  const defaultPermissions = {
    write_articles: true,
    view_articles: true,
    ...permissions,
  };

  const { data, error } = await supabaseAdmin
    .from('EmployeeUser')
    .insert({
      username,
      password_hash,
      display_name: displayName,
      is_active: true,
      permissions: defaultPermissions,
      created_by: user!.id || null,
    })
    .select('id, username, display_name, is_active, permissions, created_at')
    .single();

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    actor: user!,
    action: 'employee.create',
    targetType: 'employee',
    targetId: data.id,
    targetLabel: username,
  });

  return NextResponse.json({ employee: data }, { status: 201 });
}
