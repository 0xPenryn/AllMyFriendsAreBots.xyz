// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      // session.accessToken = token.accessToken
      // session.accessSecret = token.refreshToken
      // session.user = user
      return session; // The return type will match the one returned in `useSession()`
    },
    // async jwt(token, user, account = {}, profile, isNewUser) {
    //   if ( account.provider && !token[account.provider] ) {
    //     token[account.provider] = {};
    //   }

    //   if ( account.accessToken ) {
    //     token[account.provider].accessToken = account.accessToken;
    //   }

    //   if ( account.refreshToken ) {
    //     token[account.provider].refreshToken = account.refreshToken;
    //   }

    //   return token;
    // },
  },
  
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    })
  ]
});