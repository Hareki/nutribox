import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/databaseConnection';

export default NextAuth({
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Nutribox',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        await connectToDB();
        const { email, password } = credentials;

        const account = await AccountController.checkCredentials(
          email,
          password,
        );

        if (!account) return null;

        // INSTRUCTIONS:
        // Default property is "name, email, image" (id is needed to identify the user, but not included by default)
        // The complete user object (All fields returned included) is available at the jwt, signIn callback (user),
        // NOT AVAILABLE AT THE USER OBJECT IN SESSION CALLBACK

        // All other properties would be ignored unless we manually add them at the session callback
        // Since we want to synchronize the the field names, we will ignore the "name" and "image" fields, replace it with "fullName" and "avatarUrl"
        // by manually add them at the session callback
        const user = {
          id: account.id,
          fullName: account.fullName,
          email: account.email,
          avatarUrl: account.avatarUrl,
          role: account.role,
        };
        return user;
      },
    }),
  ],
});