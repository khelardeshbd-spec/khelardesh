import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';
import { SessionUser, isAdmin, isEmployee } from '@/lib/rbac';

export const dynamic = 'force-dynamic';

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(getAuthOptions());
  
  if (!session || !session.user) {
    redirect('/admin'); // Redirect to login
  }

  const user = session.user as SessionUser;

  // STRICT ACCESS CONTROL:
  // If the user is a regular site user (e.g., logged in via Google frontend),
  // or they do not have employee/admin privileges, kick them out immediately.
  if (user.role === 'user' || (!isAdmin(user) && !isEmployee(user))) {
    redirect('/'); // Redirect them back to the homepage
  }

  return <>{children}</>;
}
