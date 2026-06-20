import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAuthOptions } from '@/lib/auth';
import AdminsClient from './AdminsClient';
import AdminShell from '../AdminShell';

export const metadata = { title: 'Admin Accounts — খেলারদেশ Admin' };

export default async function AdminsPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session) redirect('/admin');

  const user = (session.user as any);
  if (user.role !== 'super_admin') redirect('/admin/articles');

  return (
    <AdminShell>
      <AdminsClient />
    </AdminShell>
  );
}
