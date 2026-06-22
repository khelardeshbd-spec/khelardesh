import AdminShell from '../AdminShell';
import NotificationsClient from './NotificationsClient';

export const metadata = {
  title: 'Notifications | Khelardesh Admin',
};

export default function AdminNotificationsPage() {
  return (
    <AdminShell>
      <NotificationsClient />
    </AdminShell>
  );
}
