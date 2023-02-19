// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  callbacks: {
    session({ session, token, user }) {
      console.log("session", session);
      console.log("token session", token);
      console.log("user session", user);
      // console.log("token account", token.token.account);
      // session.user = user;
      session.accessToken = token.oauth_token;
      session.refreshToken = token.oauth_token_secret;
      
      return session; // The return type will match the one returned in `useSession()`
    },
    jwt({ token, user, account = {}, profile, isNewUser }) {
      console.log("token jwt", token);
      console.log("user jwt", user);
      console.log("account jwt", account);
      console.log("profile jwt", profile);
      console.log("isNewUser jwt", isNewUser);
      // if ( account.provider && !token[account.provider] ) {
      //   token[account.provider] = {};
      // }

      token.oauth_token = account.access_token;
      

      if ( account.refresh_token ) {
        token.oauth_token_secret = account.refresh_token;
      }

      return token
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