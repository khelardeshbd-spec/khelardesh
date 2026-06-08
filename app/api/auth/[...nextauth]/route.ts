export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET(req: any, res: any) {
  const NextAuth = require('next-auth').default;
  const { authOptions } = require('@/lib/auth');
  return NextAuth(authOptions)(req, res);
}

export async function POST(req: any, res: any) {
  const NextAuth = require('next-auth').default;
  const { authOptions } = require('@/lib/auth');
  return NextAuth(authOptions)(req, res);
}



