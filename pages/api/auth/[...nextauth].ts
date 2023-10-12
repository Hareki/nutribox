import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import { AccountEntity } from 'backend/entities/account.entity';
import { AccountService } from 'backend/services/account/account.service';
import { CommonService } from 'backend/services/common/common.service';
import type { CredentialInputs } from 'backend/types/auth';
import type { FullyPopulatedAccountModel } from 'models/account.model';

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
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
      const account = (await CommonService.getRecord({
        entity: AccountEntity,
        filter: {
          id: token.accountId,
        },
        relations: ['customer', 'employee'],
      })) as FullyPopulatedAccountModel;

      session.user = account;
      delete session.user.password;
      delete session.user.verificationToken;
      delete session.user.verificationTokenExpiry;
      delete session.user.forgotPasswordToken;
      delete session.user.forgotPasswordTokenExpiry;

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

      async authorize(credentials: CredentialInputs) {
        /* 
        INSTRUCTIONS:
        
        - Default property is "name, email, image" (id is NEEDED to identify the user, but not included by default)
        The complete user object (All fields returned included) is available at the jwt, signIn callback (user),
        NOT AVAILABLE AT THE USER OBJECT IN SESSION CALLBACK

        - All other properties would be ignored unless we manually add them at the session callback 
        */

        if (!credentials) return null;

        const { email, password, userType } = credentials;
        const account = await AccountService.checkCredentials(
          {
            email,
          },
          password,
          userType,
        );

        if (!account) return null;

        if (!account.verified) throw new Error('account is not verified yet!');
        if (account.disabled) throw new Error('account is disabled!');

        return account;
      },
    }),
  ],
};
export default NextAuth(authOptions);
