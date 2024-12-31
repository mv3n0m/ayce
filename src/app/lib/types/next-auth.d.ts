import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user: {
      id?: number,
      residency?: string,
      registrationnumber?: string,
      weaddress?: string,
      estimatedmonthlyprocessingvolume?: string,
      username?: string,
      address?: string,
      nationality?: string,
      phonenumber?: string,
      emailaddress: string,
      productandservices?: string,
      avg_transaction_size?: string,
    },
    token?: string;
  }
}
