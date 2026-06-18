import { AuthOptions } from 'next-auth';

let cachedAuthOptions: AuthOptions | null = null;

export function getAuthOptions(): AuthOptions {
  if (cachedAuthOptions) return cachedAuthOptions;

  const CredentialsProvider = require('next-auth/providers/credentials').default;
  const GoogleProvider = require('next-auth/providers/google').default;

  cachedAuthOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          username: { label: 'Username', type: 'text' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials: any) {
          const { username, password } = credentials ?? {};

          if (
            username === process.env.ADMIN_USERNAME &&
            password === process.env.ADMIN_PASSWORD
          ) {
            return {
              id: '1',
              name: 'Admin',
              email: 'admin@field.news',
            };
          }
          return null;
        },
      }),
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder-id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-secret',
      }),
    ],
    pages: {
      signIn: '/admin',
    },
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60 * 24, // 24 hours
    },
    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider === 'google') {
          const { supabaseAdmin } = require('@/lib/supabase');
          try {
            const { error } = await supabaseAdmin
              .from('SiteUser')
              .upsert({
                email: user.email,
                name: user.name,
                image: user.image,
                lastLoginAt: new Date().toISOString()
              }, { onConflict: 'email' });
            if (error) {
              console.error('Error saving user in Supabase SiteUser table:', error);
            }
          } catch (e) {
            console.error('Database save user failed:', e);
          }
        }
        return true;
      },
      async jwt({ token, user, account }) {
        if (user) {
          if (account?.provider === 'credentials') {
            token.role = 'admin';
          } else {
            token.role = 'user';
          }
          token.image = user.image;
        }
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as any).role = token.role as string;
          if (token.image) {
            session.user.image = token.image as string;
          }
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };

  return cachedAuthOptions;
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

