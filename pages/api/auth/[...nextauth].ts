import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import AccountController from 'api/controllers/Account.controller';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { getAvatarUrl } from 'helpers/account.helper';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.userId) return session;

      // console.time('getSessionUser');
      await connectToDB();
      const sessionUser = await AccountController.getSessionUser(
        token.userId as string,
      );

      token.user = sessionUser.user;
      session.user = sessionUser.user;

      // console.timeEnd('getSessionUser');
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
        // Default property is "name, email, image" (id is NEEDED to identify the user, but not included by default)
        // The complete user object (All fields returned included) is available at the jwt, signIn callback (user),
        // NOT AVAILABLE AT THE USER OBJECT IN SESSION CALLBACK

        // All other properties would be ignored unless we manually add them at the session callback
        // Since we want to synchronize the the field names, we will ignore the "name" and "image" fields, replace it with "fullName" and "avatarUrl"
        // by manually add them at the session callback
        const user = {
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          fullName: account.fullName,
          email: account.email,
          avatarUrl: getAvatarUrl(account),
          role: account.role,
          verified: account.verified,
        };
        return user;
      },
    }),
  ],
};
export default NextAuth(authOptions);
