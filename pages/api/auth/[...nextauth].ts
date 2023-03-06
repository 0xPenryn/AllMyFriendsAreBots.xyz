// @ts-nocheck
import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";

export default NextAuth({
  callbacks: {
    session({ session, token, user }) {
      // next two lines only necessary if you want to save the access token to the session, probably best to avoid in prod
      // session.access_token = token.access_token;
      // session.refresh_token = token.refresh_token;
      
      return session; // The return type will match the one returned in `useSession()`
    },
    jwt({ token, user, account = {}, profile, isNewUser }) {
      if ( account.access_token ) {
        token.access_token = account.access_token;
      }
      
      if ( account.refresh_token ) {
        token.refresh_token = account.refresh_token;
      }

      return token
    },
  },
  
  providers: [
    // for oauth2 (known working)
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      authorization: {
        url: "https://twitter.com/i/oauth2/authorize",
        params: {
          scope: "users.read tweet.read offline.access follows.write",
        },
      },
    })

    // for oauth1 (needs elevated API access)
    // TwitterProvider({
    //   clientId: process.env.TWITTER_API_KEY as string,
    //   clientSecret: process.env.TWITTER_API_KEY_SECRET as string,
    // })
  ]
});