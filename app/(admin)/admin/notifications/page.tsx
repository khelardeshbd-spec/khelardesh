import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import AdminShell from '../AdminShell';
import NotificationsClient from './NotificationsClient';

export const dynamic = 'force-dynamic';

export default async function AdminNotificationsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect('/api/auth/signin');
  }

  const role = (session.user as any).role;
  if (role !== 'super_admin' && role !== 'admin') {
    redirect('/admin/articles');
  }

  // Fetch comments (notifications) globally
  const { data: comments, error } = await supabaseAdmin
    .from('Comment')
    .select('id, articleSlug, userEmail, userName, body, isRead, createdAt')
    .order('createdAt', { ascending: false })
    .limit(50);

  return (
    <AdminShell>
      <NotificationsClient initialNotifs={comments || []} />
    </AdminShell>
  );
}
