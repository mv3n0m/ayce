import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, email, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        });


        const user = await res.json();

        // If the 'user' object contains an 'error' property, throw an error
        if (user.error) {
          throw new Error(user.error);
        }

        if (user) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    // auto sign out in 100 minutes
    maxAge: 6000,
  },
  callbacks: {
    async jwt({ token, user }) {
      // If user is defined, it means this callback is invoked for the first time (i.e. user signs in)
      if (user) {
        // Include all details from the user object in the token
        token.user = {...user.details};
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose the user details and token to the session
      session.user = token.user;
      session.token = token.token;
      // console.log(session);
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };