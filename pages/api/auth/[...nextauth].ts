import NextAuth from 'next-auth';
import TwitterProvider from "next-auth/providers/twitter";



export default NextAuth({
  callbacks: {
    session({ session, token, user }) {
      session.accessToken = token.accessToken 
      session.user.id = token.id
      return session; // The return type will match the one returned in `useSession()`
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