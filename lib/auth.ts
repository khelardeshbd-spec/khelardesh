import { AuthOptions } from 'next-auth';

export function getAuthOptions(): AuthOptions {
  const CredentialsProvider = require('next-auth/providers/credentials').default;
  const GoogleProvider = require('next-auth/providers/google').default;

  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials: any) {
          const { username, password } = credentials ?? {};
          if (!username || !password) return null;

          const bcrypt = require('bcryptjs');
          const { supabaseAdmin } = require('@/lib/supabase');

          // ── 1. Check AdminUser table ──────────────────────────────────
          const { data: adminRow } = await supabaseAdmin
            .from('AdminUser')
            .select('id, username, password_hash, display_name, role, is_blocked, avatar_url')
            .eq('username', username)
            .single();

          if (adminRow) {
            if (adminRow.is_blocked) return null; // blocked account
            const valid = await bcrypt.compare(password, adminRow.password_hash);
            if (!valid) return null;

            return {
              id: adminRow.id,
              name: adminRow.display_name,
              email: adminRow.username + '@admin.khelardesh',
              // custom fields stored in JWT
              username: adminRow.username,
              displayName: adminRow.display_name,
              role: adminRow.role,
              permissions: null,
              avatarUrl: adminRow.avatar_url,
            };
          }

          // ── 2. Check EmployeeUser table ───────────────────────────────
          const { data: empRow } = await supabaseAdmin
            .from('EmployeeUser')
            .select('id, username, password_hash, display_name, is_active, permissions, avatar_url')
            .eq('username', username)
            .single();

          if (empRow) {
            if (!empRow.is_active) return null; // deactivated account
            const valid = await bcrypt.compare(password, empRow.password_hash);
            if (!valid) return null;

            return {
              id: empRow.id,
              name: empRow.display_name,
              email: empRow.username + '@employee.khelardesh',
              username: empRow.username,
              displayName: empRow.display_name,
              role: 'employee',
              permissions: empRow.permissions,
              avatarUrl: empRow.avatar_url,
            };
          }

          // ── 3. Legacy env-var fallback (emergency access) ────────────
          if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: 'legacy-admin',
              name: 'Admin',
              email: 'admin@field.news',
              username: 'admin',
              displayName: 'Admin',
              role: 'super_admin',
              permissions: null,
              avatarUrl: null,
            };
          }

          return null;
        },
      }),
    ],
    pages: {
      signIn: '/login',
    },
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60 * 24, // 24 hours
    },
    callbacks: {
      async jwt({ token, user, trigger, session }) {
        // On initial sign-in, attach custom fields to token
        if (user) {
          const u = user as any;
          token.id = u.id;
          
          if (u.role) {
            // Credentials login (admin/employee)
            token.username = u.username;
            token.displayName = u.displayName;
            token.role = u.role;
            token.permissions = u.permissions ?? null;
            token.avatarUrl = u.avatarUrl ?? null;
          } else {
            // Google login
            token.username = u.email;
            token.displayName = u.name;
            token.role = 'user';
            token.permissions = null;
            token.avatarUrl = u.image ?? null;
          }
        }
        if (trigger === 'update' && session?.user) {
          if (session.user.displayName !== undefined) token.displayName = session.user.displayName;
          if (session.user.avatarUrl !== undefined) token.avatarUrl = session.user.avatarUrl;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          const u = session.user as any;
          u.id = token.id as string;
          u.username = token.username as string;
          u.displayName = token.displayName as string;
          u.role = token.role as string;
          u.avatarUrl = token.avatarUrl ?? null;
          
          // Always fetch fresh permissions for employees so UI updates instantly without re-login
          if (u.role === 'employee') {
            const { supabaseAdmin } = require('@/lib/supabase');
            const { data: empRow } = await supabaseAdmin
              .from('EmployeeUser')
              .select('permissions, is_active')
              .eq('username', u.username)
              .single();
              
            if (empRow && empRow.is_active) {
              u.permissions = empRow.permissions;
            } else {
              u.permissions = {};
              // NextAuth doesn't easily let us destroy session here, 
              // but permissions={} prevents doing any harm.
            }
          } else {
            u.permissions = token.permissions ?? null;
          }
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };
}

export const authOptions = new Proxy({} as AuthOptions, {
  get(target, prop, receiver) {
    return Reflect.get(getAuthOptions(), prop, receiver);
  },
  ownKeys(target) {
    return Reflect.ownKeys(getAuthOptions());
  },
  getOwnPropertyDescriptor(target, prop) {
    return Reflect.getOwnPropertyDescriptor(getAuthOptions(), prop);
  }
});
