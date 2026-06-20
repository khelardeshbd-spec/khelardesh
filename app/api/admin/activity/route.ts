import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getSessionUser, requireAdmin } from '@/lib/rbac';

// GET /api/admin/activity — paginated activity log (admin only)
export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  const err = requireAdmin(user);
  if (err) return err;

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50')));
  const actorFilter = searchParams.get('actor') ?? '';
  const actionFilter = searchParams.get('action') ?? '';
  const from = (page - 1) * limit;

  let query = supabaseAdmin
    .from('ActivityLog')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, from + limit - 1);

  if (actorFilter) {
    query = query.eq('actor_id', actorFilter);
  }
  if (actionFilter) {
    query = query.eq('action', actionFilter);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    logs: data,
    total: count ?? 0,
    page,
    limit,
    totalPages: Math.ceil((count ?? 0) / limit),
  });
}
