import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser } from '@/lib/rbac';
import { logActivity } from '@/lib/activity';

// GET /api/admin/profile — get current user's profile
export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const table = user.role === 'employee' ? 'EmployeeUser' : 'AdminUser';
  const { data, error } = await supabaseAdmin
    .from(table)
    .select('id, username, display_name, created_at')
    .eq('id', user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

  return NextResponse.json({ profile: { ...data, role: user.role } });
}

// PUT /api/admin/profile — update display name
export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const { displayName } = body;

  if (!displayName?.trim()) {
    return NextResponse.json({ error: 'Display name cannot be empty' }, { status: 400 });
  }

  const table = user.role === 'employee' ? 'EmployeeUser' : 'AdminUser';
  const { error } = await supabaseAdmin
    .from(table)
    .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
    .eq('id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({
    actor: user,
    action: 'article.update', // reuse closest action type
    targetType: 'profile',
    targetId: user.id,
    targetLabel: `Display name → ${displayName.trim()}`,
  });

  return NextResponse.json({ success: true });
}
