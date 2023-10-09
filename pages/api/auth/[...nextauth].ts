import type { AuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';

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
      // const freshUser = await CommonService.getRecord({
      //   entity: AccountEntity,
      //   filter: {
      //     id: token.userId,
      //   },
      //   relations: ['lecturer'],
      // });
      // session.user = freshUser;

      // delete session.user.password;
      // delete session.user.createdAt;
      // delete session.user.updatedAt;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'MCE',
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

        // const { email, password } = credentials;
        // const user = await AccountService.checkCredentials(
        //   {
        //     email,
        //   },
        //   password,
        // );
        // if (user) {
        //   if (!user.enable) {
        //     throw new Error('account is not activated!');
        //   }
        //   if (!user.active) {
        //     throw new Error('account is disabled!');
        //   }
        //   return user;
        // }
        return null;
      },
    }),
  ],
};
export default NextAuth(authOptions);
