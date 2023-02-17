import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    accessToken
    refreshToken
    // user: {
    //   id
    //   name
    // } & DefaultSession["user"]
  }
//   interface JWT {
//     oauth_token?: string
//     oauth_token_secret?: string
// }
}