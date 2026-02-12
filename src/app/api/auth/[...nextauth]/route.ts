import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

const isProduction = process.env.NODE_ENV === 'production';

const authOptions: NextAuthOptions = {
  providers: [],
  session: { strategy: 'jwt' },
  cookies: isProduction
    ? {
        sessionToken: {
          name: 'next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'lax' as const,
            path: '/',
            secure: true,
            domain: '.plancraft.co.kr',
          },
        },
      }
    : undefined,
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
