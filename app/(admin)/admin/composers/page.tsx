import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AdminShell from '../AdminShell';
import ComposersClient from './ComposersClient';

import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminComposersPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session) redirect('/admin');

  const user = session.user as any;
  if (user?.role === 'employee') {
    redirect('/admin/articles');
  }

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
