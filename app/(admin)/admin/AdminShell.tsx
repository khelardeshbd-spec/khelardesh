'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import AdminLogout from './AdminLogout';
import { LayoutDashboard, Pencil, Megaphone, Users, Menu, X, UsersRound, Activity, Shield } from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { href: '/admin/articles', label: 'Articles', icon: <Pencil size={15} /> },
  { href: '/admin/sponsors', label: 'Sponsors', icon: <Megaphone size={15} /> },
  { href: '/admin/composers', label: 'Composers', icon: <Users size={15} /> },
  { href: '/admin/team', label: 'Team', icon: <UsersRound size={15} /> },
  { href: '/admin/admins', label: 'Admins', icon: <Shield size={15} /> },
  { href: '/admin/activity', label: 'Activity Log', icon: <Activity size={15} /> },
];

const EMPLOYEE_NAV = [
  { href: '/admin/articles', label: 'Articles', icon: <Pencil size={15} /> },
];

function NavList({ items, pathname, onClose }: { items: typeof ADMIN_NAV; pathname: string; onClose?: () => void }) {
  return (
    <>
      {items.map(({ href, label, icon }) => {
        const active = pathname === href || (href !== '/admin/dashboard' && pathname.startsWith(href));
        return (
          <div key={href} className="hover:bg-[var(--ink-ghost)] rounded-[6px] mx-2 mb-1 transition-colors duration-150">
            <Link
              href={href}
              onClick={onClose}
              className="flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: active ? 'var(--ink)' : 'transparent',
                borderRadius: 6,
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
    </>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const isEmployee = role === 'employee';
  const navItems = isEmployee ? EMPLOYEE_NAV : ADMIN_NAV;

  return (
    <div className="flex min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className="hidden lg:flex flex-col flex-shrink-0"
        style={{
          width: 220,
          height: '100vh',
          position: 'sticky',
          top: 0,
          backgroundColor: 'var(--bg-page)',
          borderRight: '1px solid var(--ink-border)',
          borderTopRightRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        {/* Logo area */}
        <div
          className="px-5 py-4 border-b flex flex-col items-center justify-center"
          style={{ borderColor: 'var(--ink-border)' }}
        >
          <Link href="/" target="_blank" className="hover:opacity-90 transition-opacity">
            <img
              src="/images/khelardesh_logo.png"
              alt="খেলারদেশ"
              style={{
                height: '38px',
                objectFit: 'contain',
                display: 'block',
                marginBottom: '4px',
              }}
            />
          </Link>
          <div className="flex flex-col items-center">
            <p
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                fontSize: 9,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-muted)',
              }}
            >
              Admin Panel
            </p>
            <Link
              href="/"
              target="_blank"
              className="mt-1.5 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              মাঠে যান ↗
            </Link>
          </div>
        </div>

        {/* Role pill */}
        {role && (
          <div className="px-5 pt-3 pb-1">
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded"
              style={{
                fontFamily: "'Hind Siliguri', sans-serif",
                background: role === 'super_admin' ? '#E74C3C15' : role === 'admin' ? '#3498DB15' : '#27AE6015',
                color: role === 'super_admin' ? '#E74C3C' : role === 'admin' ? '#3498DB' : '#27AE60',
                border: `1px solid ${role === 'super_admin' ? '#E74C3C30' : role === 'admin' ? '#3498DB30' : '#27AE6030'}`,
              }}
            >
              {role === 'super_admin' ? '★ Super Admin' : role === 'admin' ? 'Admin' : 'Employee'}
            </span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto" aria-label="Admin navigation">
          <NavList items={navItems} pathname={pathname} />
        </nav>

        {/* Footer */}
        <div className="border-t px-4 py-4 flex flex-col gap-2" style={{ borderColor: 'var(--ink-border)' }}>
          <AdminLogout />
        </div>
      </aside>

      {/* ── MOBILE BACKDROP & DRAWER ── */}
      <div
        className="lg:hidden fixed inset-0 z-50 transition-opacity duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.5)',
          opacity: isMobileOpen ? 1 : 0,
          pointerEvents: isMobileOpen ? 'auto' : 'none',
        }}
        onClick={() => setIsMobileOpen(false)}
      />

      <aside
        className="lg:hidden fixed top-0 bottom-0 left-0 z-50 flex flex-col flex-shrink-0 transition-transform duration-300"
        style={{
          width: 240,
          backgroundColor: 'var(--bg-page)',
          borderRight: '1px solid var(--ink-border)',
          transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
        }}
      >
        {/* Mobile Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--ink-border)', height: 52 }}>
          <Link href="/" target="_blank" className="hover:opacity-90 transition-opacity">
            <img
              src="/images/khelardesh_logo.png"
              alt="খেলারদেশ"
              style={{
                height: '32px',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            style={{ color: 'var(--ink-muted)' }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Nav links */}
        <nav className="flex-1 py-3 overflow-y-auto" aria-label="Admin mobile navigation">
          <NavList items={navItems} pathname={pathname} onClose={() => setIsMobileOpen(false)} />
        </nav>

        {/* Mobile Footer */}
        <div className="border-t px-4 py-4 flex flex-col gap-2" style={{ borderColor: 'var(--ink-border)' }}>
          <AdminLogout />
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderBottom: '1px solid var(--ink-border)',
          height: 52,
        }}
      >
        <button
          onClick={() => setIsMobileOpen(true)}
          style={{ color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

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

        {/* Empty placeholder to balance the logo/title center */}
        <div style={{ width: 22 }} />
      </div>

      {/* Main content */}
      <main className="flex-1 lg:min-h-screen pt-[52px] lg:pt-0 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
