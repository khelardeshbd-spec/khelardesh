import { AuthOptions } from 'next-auth';

let cachedAuthOptions: AuthOptions | null = null;

export function getAuthOptions(): AuthOptions {
  if (cachedAuthOptions) return cachedAuthOptions;

  const CredentialsProvider = require('next-auth/providers/credentials').default;

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
    ],
    pages: {
      signIn: '/admin',
    },
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60 * 24, // 24 hours
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) token.role = 'admin';
        return token;
      },
      async session({ session, token }) {
        if (session.user) {
          (session.user as typeof session.user & { role: string }).role = token.role as string;
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

