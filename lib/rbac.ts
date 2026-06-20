/**
 * lib/rbac.ts
 * Role-based access control helpers.
 * Use in API routes and Server Components to gate access.
 */

import { getServerSession } from 'next-auth';
import { getAuthOptions } from './auth';

export type UserRole = 'super_admin' | 'admin' | 'employee';

export interface SessionUser {
  id: string;
  username: string;
  displayName: string;
  role: UserRole;
  permissions?: Record<string, boolean>;
}

/** Get the current logged-in user from the session. Returns null if not logged in. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user) return null;
  const u = session.user as any;
  
  return {
    id: u.id ?? '',
    username: u.username ?? u.email ?? '',
    displayName: u.displayName ?? u.name ?? '',
    role: u.role as UserRole,
    permissions: u.permissions ?? undefined,
  };
}

/** Returns true if user is admin (any kind) */
export function isAdmin(user: SessionUser | null): boolean {
  return user?.role === 'super_admin' || user?.role === 'admin';
}

/** Returns true if user is super admin */
export function isSuperAdmin(user: SessionUser | null): boolean {
  return user?.role === 'super_admin';
}

/** Returns true if user is an employee */
export function isEmployee(user: SessionUser | null): boolean {
  return user?.role === 'employee';
}

/** Check a specific employee permission key */
export function hasPermission(user: SessionUser | null, key: string): boolean {
  if (!user) return false;
  if (isAdmin(user)) return true; // admins have all permissions
  return user.permissions?.[key] === true;
}

/** Throw a 401/403 response if user doesn't have the required role */
export function requireAdmin(user: SessionUser | null): Response | null {
  if (!user) return new Response('Unauthorized', { status: 401 });
  if (!isAdmin(user)) return new Response('Forbidden', { status: 403 });
  return null;
}

export function requireSuperAdmin(user: SessionUser | null): Response | null {
  if (!user) return new Response('Unauthorized', { status: 401 });
  if (!isSuperAdmin(user)) return new Response('Forbidden — Super Admin only', { status: 403 });
  return null;
}

export function requirePermission(user: SessionUser | null, key: string): Response | null {
  if (!user) return new Response('Unauthorized', { status: 401 });
  if (!hasPermission(user, key)) return new Response('Forbidden', { status: 403 });
  return null;
}
