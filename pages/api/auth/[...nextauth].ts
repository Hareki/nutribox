import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import type { AuthenticatedAccount } from '../../../types/next-auth';

import { AccountService } from 'backend/services/account/account.service';
import type { CredentialInputs } from 'backend/types/auth';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/sign-in',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      const castedUser = user as AuthenticatedAccount;
      if (castedUser) {
        token.accountId = castedUser.id;
        token.userType = castedUser.userType;
        token.employeeRole = (castedUser?.employee as any)?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.accountId && token.userType) {
        if (token.userType === 'customer') {
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
        } else {
          const account = await AccountService.getAccount(
            { id: token.accountId },
            'employee',
          );
          session.employeeAccount = account!;
          delete session.employeeAccount.password;
          delete session.employeeAccount.verificationToken;
          delete session.employeeAccount.verificationTokenExpiry;
          delete session.employeeAccount.forgotPasswordToken;
          delete session.employeeAccount.forgotPasswordTokenExpiry;
        }
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

        if (!account.verified) throw new Error('Account.Verified.False');
        if (account.disabled) throw new Error('Account.Disabled.True');

        return {
          ...account,
          userType,
        };
      },
    }),
  ],
};
export default NextAuth(authOptions);
