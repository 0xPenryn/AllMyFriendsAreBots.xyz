// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  callbacks: {
    async session({ session, token, user }) {
      session.accessToken = token.credentials.authToken
      session.accessSecret = token.credentials.authSecret
      session.user.id = token.id
      return session; // The return type will match the one returned in `useSession()`
    },
    async jwt({token, user, account, profile, isNewUser}) {
      if (profile) {
          token['userProfile'] = {
              followersCount: profile.followers_count,
              twitterHandle: profile.screen_name,
              userID: profile.id
          };
      }
      if (account) {
          token['credentials'] = {
              authToken: account.access_token,
              authSecret: account.oauth_token_secret,
          }
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