// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      console.log("token", token);
      session.accessToken = token.oauth_token;
      session.refreshToken = token.oauth_token_secret;
      // session.user = user
      return session; // The return type will match the one returned in `useSession()`
    },
    async jwt(token, user, account = {}, profile, isNewUser) {
      console.log("token", token);
      console.log("user", user);
      console.log("account", account);
      console.log("profile", profile);
      console.log("isNewUser", isNewUser);
      if ( account.provider && !token[account.provider] ) {
        token[account.provider] = {};
      }

      if ( account.oauth_token ) {
        token[account.provider].oauth_token = account.oauth_token;
      }

      if ( account.oauth_token_secret ) {
        token[account.provider].oauth_token_secret = account.oauth_token_secret;
      }

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