import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(getAuthOptions());
  
  if (!session || !session.user) {
    redirect('/admin'); // Redirect to login
  }

  const user = session.user as any;

  // STRICT ACCESS CONTROL:
  // If the user is a regular site user (e.g., logged in via Google frontend),
  // or they do not have employee/admin privileges, kick them out immediately.
  const role = user?.role as string | undefined;
  if (!role || (role !== 'super_admin' && role !== 'admin' && role !== 'employee')) {
    redirect('/'); // Redirect them back to the homepage
  }

  return <>{children}</>;
}
