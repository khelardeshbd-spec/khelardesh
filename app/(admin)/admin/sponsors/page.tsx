import { redirect } from 'next/navigation';
import AdminShell from '../AdminShell';
import SponsorsClient from './SponsorsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSponsorsPage() {
  const { getServerSession } = require('next-auth');
  const { authOptions } = require('@/lib/auth');
  const session = await getServerSession(authOptions);
  
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
