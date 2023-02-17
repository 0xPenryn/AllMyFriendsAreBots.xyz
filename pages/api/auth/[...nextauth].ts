// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  callbacks: {
    session({ session, token, user }) {
      // console.log("session AAAAAAA", session);
      // console.log("token AAAAAAA", token);
      // console.log("token account", token.token.account);
      session.accessToken = token.token.account.access_token;
      session.refreshToken = token.token.account.refresh_token;
      // session.user = token.token.user;
      return session; // The return type will match the one returned in `useSession()`
    },
    jwt(token, user, account = {}, profile, isNewUser) {
      // console.log("token EEEEEE", token);
      // if ( account.provider && !token[account.provider] ) {
      //   token[account.provider] = {};
      // }

      // token[account.provider].oauth_token = token.account.access_token;
      

      // if ( account.refresh_token ) {
      //   token[account.provider].oauth_token_secret = account.refresh_token;
      // }

      return token;
    },
  },
  
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
    })
  ]
});