import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

import { getSessionUser } from 'api/base/server-side-modules/mssql-modules';
import connectToDB from 'api/database/mongoose/databaseConnection';
import { sql } from 'api/database/mssql.config';
import { executeUsp } from 'api/helpers/mssql.helper';
import type { PoIAccountWithRoleName } from 'api/mssql/pojos/account.pojo';
import { virtuals } from 'api/mssql/virtuals';
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
      // await connectToDB();
      // const sessionUser = await AccountController.getSessionUser(
      //   token.userId as string,
      // );

      const sessionUser = await getSessionUser(token.userId as string);

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

        // const account = await AccountController.checkCredentials(
        //   email,
        //   password,
        // );

        const account = (
          await executeUsp<PoIAccountWithRoleName>('usp_Account_FetchByEmail', [
            {
              name: 'Email',
              type: sql.NVarChar,
              value: email,
            },
          ])
        ).data[0];

        if (!account) return null;

        const isPasswordMatch = await virtuals.isPasswordMatch(
          password,
          account.password,
        );
        if (!isPasswordMatch) return null;

        const accountCamelCase = {
          firstName: account.first_name,
          lastName: account.last_name,
          avatarUrl: '',
        };

        // INSTRUCTIONS:
        // Default property is "name, email, image" (id is NEEDED to identify the user, but not included by default)
        // The complete user object (All fields returned included) is available at the jwt, signIn callback (user),
        // NOT AVAILABLE AT THE USER OBJECT IN SESSION CALLBACK

        // All other properties would be ignored unless we manually add them at the session callback
        // Since we want to synchronize the the field names, we will ignore the "name" and "image" fields, replace it with "fullName" and "avatarUrl"
        // by manually add them at the session callback
        const user = {
          id: account.id,
          firstName: account.first_name,
          lastName: account.last_name,
          fullName: virtuals.getFullName(account.last_name, account.first_name),
          email: account.email,
          avatarUrl: getAvatarUrl(accountCamelCase),
          role: account.role_name as 'ADMIN' | 'CUSTOMER' | 'SUPPLIER',
          verified: account.verified,
        };
        return user;
      },
    }),
  ],
};
export default NextAuth(authOptions);
