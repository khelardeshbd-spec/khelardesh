import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAuthOptions } from '@/lib/auth';
import ActivityClient from './ActivityClient';
import AdminShell from '../AdminShell';

export const metadata = { title: 'Activity Log — খেলারদেশ Admin' };

export default async function ActivityPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session) redirect('/admin');

  const user = (session.user as any);
  // Only admins can see activity log
  if (user.role === 'employee') redirect('/admin/articles');

  return (
    <AdminShell>
      <ActivityClient />
    </AdminShell>
  );
}
