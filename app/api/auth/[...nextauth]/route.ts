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
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const user = await getClass.login(credentials);

        // If no error and we have user data, return it
        if (user) {
          return user;
        } else {
          return null;
        }
        // Return null if user data could not be retrieved
      },
    }),
  ],
});

export { handler as GET, handler as POST };
