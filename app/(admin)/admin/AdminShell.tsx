'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminLogout from './AdminLogout';
import { LayoutDashboard, Pencil, Trophy, Megaphone, Sidebar, ExternalLink } from 'lucide-react';

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { href: '/admin/articles', label: 'Articles', icon: <Pencil size={15} /> },
  { href: '/admin/scores', label: 'Scores', icon: <Trophy size={15} /> },
  { href: '/admin/sponsors', label: 'Sponsors', icon: <Megaphone size={15} /> },
  { href: '/admin/sidebar-content', label: 'Sidebar Content', icon: <Sidebar size={15} /> },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* Sidebar */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{
          width: 220,
          backgroundColor: 'var(--bg-page)',
          borderRight: '1px solid var(--ink-border)',
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        {/* Logo area */}
        <div
          className="px-5 py-5 border-b"
          style={{ borderColor: 'var(--ink-border)' }}
        >
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 900,
              fontSize: 22,
              color: 'var(--ink)',
              letterSpacing: '-0.01em',
              lineHeight: 1,
            }}
          >
            খেলারদেশ
          </p>
          <p
            style={{
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--ink-muted)',
              marginTop: 4,
            }}
          >
            Admin Panel
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-3" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <div key={href} className="hover:bg-[var(--ink-ghost)] rounded-[6px] mx-2 mb-1 transition-colors duration-150">
                <Link
                  href={href}
                  className="flex items-center gap-3 transition-colors"
                  style={{
                    backgroundColor: active ? 'var(--ink)' : 'transparent',
                    borderRadius: 6,
                    borderLeft: 'none',
                    padding: '9px 12px',
                    color: active ? 'var(--bg-page)' : 'var(--ink-muted)',
                    fontFamily: "'Hind Siliguri', sans-serif",
                    fontSize: 13,
                    fontWeight: active ? 600 : 400,
                  }}
                  aria-current={active ? 'page' : undefined}
                >
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</span>
                  {label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Footer: View site + Logout */}
        <div className="border-t px-4 py-4 flex flex-col gap-2" style={{ borderColor: 'var(--ink-border)' }}>
          <Link
            href="/"
            target="_blank"
            style={{
              fontFamily: "'Hind Siliguri', sans-serif",
              fontSize: 11,
              color: 'var(--ink-muted)',
              textDecoration: 'underline',
              textDecorationColor: 'var(--ink-border)',
            }}
          >
            ↗ View site
          </Link>
          <AdminLogout />
        </div>
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--ink-border)',
          height: 52,
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 900,
            fontSize: 18,
            color: 'var(--ink)',
          }}
        >
          খেলারদেশ Admin
        </p>
        <div className="flex items-center gap-2">
          {NAV.map(({ href, icon }) => (
            <Link
              key={href}
              href={href}
              className="w-9 h-9 flex items-center justify-center rounded"
              style={{
                backgroundColor: pathname.startsWith(href) ? 'var(--ink)' : 'transparent',
                color: pathname.startsWith(href) ? 'var(--bg-page)' : 'var(--ink-muted)',
                fontSize: 14,
              }}
            >
              {icon}
            </Link>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 lg:min-h-screen pt-[52px] lg:pt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
