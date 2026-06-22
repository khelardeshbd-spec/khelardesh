import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAuthOptions } from '@/lib/auth';
import TeamClient from './TeamClient';
import AdminShell from '../../AdminShell';

export const metadata = { title: 'Employee Accounts — খেলারদেশ Admin' };

export default async function TeamPage() {
  const session = await getServerSession(getAuthOptions());
  if (!session) redirect('/admin');

  const user = (session.user as any);
  if (user.role === 'employee') redirect('/admin/articles');

  return (
    <AdminShell>
      <TeamClient />
    </AdminShell>
  );
}
