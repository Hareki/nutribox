import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AccountService } from 'backend/services/account/account.service';
import type { CredentialInputs } from 'backend/types/auth';
import type { FullyPopulatedAccountModel } from 'models/account.model';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const castedUser = user as FullyPopulatedAccountModel;
      if (castedUser) {
        token.accountId = castedUser.id;
        token.employeeRole = castedUser.employee?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accountId) {
        const account = await AccountService.getAccount(
          { id: token.accountId },
          'customer',
        );

        session.account = account!;
        delete session.account.password;
        delete session.account.verificationToken;
        delete session.account.verificationTokenExpiry;
        delete session.account.forgotPasswordToken;
        delete session.account.forgotPasswordTokenExpiry;
      }

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
        /* 
        INSTRUCTIONS:
        
        - Default property is "name, email, image" (id is NEEDED to identify the user, but not included by default)
        The complete user object (All fields returned included) is available at the jwt, signIn callback (user),
        NOT AVAILABLE AT THE USER OBJECT IN SESSION CALLBACK

        - All other properties would be ignored unless we manually add them at the session callback 
        */

        if (!credentials) return null;

        const castedCredentials = credentials as CredentialInputs;
        const { email, password, userType } = castedCredentials;
        const account = await AccountService.getAccount(
          {
            email,
            password,
          },
          userType,
        );

        if (!account) return null;

        if (!account.verified) throw new Error('Account.Verified.Invalid');
        if (account.disabled) throw new Error('Account.Disabled.True');

        return account;
      },
    }),
  ],
};
export default NextAuth(authOptions);
