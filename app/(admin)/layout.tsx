import type { Metadata } from 'next';
import '@/styles/globals.css';
import AdminSessionProvider from './AdminSessionProvider';

export const metadata: Metadata = {
  title: 'Khelardesh Admin Dashboard',
  description: 'Admin dashboard for Khelardesh sports news platform.',
  icons: {
    icon: '/images/khelardesh_logo.png',
    shortcut: '/images/khelardesh_logo.png',
    apple: '/images/khelardesh_logo.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="admin-layout" style={{ backgroundColor: '#F9FAFB' }}>
        <AdminSessionProvider>
          {children}
        </AdminSessionProvider>
      </body>
    </html>
  );
}

