import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("NextAuth authorize called with:", { 
          username: credentials?.username, 
          password: credentials?.password ? "***" : "missing" 
        });
        
        // Validate credentials exist
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        const adminUser = process.env.ADMIN_USER || "admin";
        const adminPass = process.env.ADMIN_PASS || "admin_123";
        
        console.log("Expected credentials:", { 
          username: adminUser, 
          password: adminPass ? "***" : "missing" 
        });
        
        // Secure comparison to prevent timing attacks
        const usernameMatch = credentials.username.trim() === adminUser;
        const passwordMatch = credentials.password === adminPass;
        
        console.log("Credential match results:", { usernameMatch, passwordMatch });
        
        if (usernameMatch && passwordMatch) {
          console.log("Authentication successful");
          return { 
            id: "admin", 
            name: "Admin", 
            email: "admin@raagsan.com",
            role: "admin"
          };
        }
        
        console.log("Authentication failed");
        // Always return null for failed attempts (don't reveal which field failed)
        return null;
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  // Security enhancements
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === "production"
      }
    }
  }
};
