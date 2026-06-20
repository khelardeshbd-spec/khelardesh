import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { getAuthOptions } from '@/lib/auth';
import ProfileClient from './ProfileClient';

export const metadata = { title: 'My Profile — খেলারদেশ Admin' };

export default async function ProfilePage() {
  const session = await getServerSession(getAuthOptions());
  if (!session) redirect('/admin');
  return <ProfileClient />;
}
