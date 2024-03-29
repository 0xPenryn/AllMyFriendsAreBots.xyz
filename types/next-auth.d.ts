import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: {
    //   name
    //   email
    //   image
    // } & DefaultSession["user"]
    access_token: string
    refresh_token: string
  }
  interface JWT {
    access_token: string
    refresh_token: string
}
}