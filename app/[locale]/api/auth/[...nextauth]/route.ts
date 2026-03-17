import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { getClass } from '@/services/ApiServices';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your-email@example.com' },
        password: { label: 'Password', type: 'password', placeholder: '********' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const user = await getClass.login({
          email: credentials.email,
          password: credentials.password,
        });

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
});

export { handler as GET, handler as POST };
