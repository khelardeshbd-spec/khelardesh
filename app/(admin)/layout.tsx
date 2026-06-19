import type { Metadata } from 'next';
import '@/styles/globals.css';
import PresenceTracker from '@/components/frontend/PresenceTracker';

export const metadata: Metadata = {
  title: 'Khelardesh Admin Dashboard',
  description: 'Admin dashboard for Khelardesh sports news platform.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ backgroundColor: '#F9FAFB' }}>
        <PresenceTracker />
        {children}
      </body>
    </html>
  );
}
