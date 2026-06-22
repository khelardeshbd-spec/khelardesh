import { redirect } from 'next/navigation';
import AdminShell from '../../AdminShell';
import SponsorsClient from './SponsorsClient';

import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage() {
  const session = await getServerSession(getAuthOptions());
  
  // Direct unauthorized users to the admin login page
  if (!session) {
    redirect('/admin');
  }

  const user = session.user as any;
  if (user?.role === 'employee') {
    redirect('/admin/articles');
  }

  return (
    <AdminShell>
      <SponsorsClient />
    </AdminShell>
  );
}
