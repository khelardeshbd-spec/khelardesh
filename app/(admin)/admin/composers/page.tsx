import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AdminShell from '../AdminShell';
import ComposersClient from './ComposersClient';

export const dynamic = 'force-dynamic';

export default async function AdminComposersPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  if (!session) redirect('/admin');

  // Fetch all composers
  const { data: composers } = await supabaseAdmin
    .from('Composer')
    .select('*')
    .order('name', { ascending: true });

  const safeComposers = composers ?? [];

  return (
    <AdminShell>
      <ComposersClient initialComposers={safeComposers} />
    </AdminShell>
  );
}
