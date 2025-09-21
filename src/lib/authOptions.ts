//lib/authOptions.ts
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prismadb";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid email or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Stocker le rôle dans le token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // 👈 ajoute le rôle de l'utilisateur
        token.currentOrganizationId = (user as any).currentOrganizationId; // Ajoute l'ID de l'organisation actuelle
      }
      return token;
    },
    // Renvoyer le rôle dans la session côté client
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "USER" | "ADMIN"; // 👈 maintenant dispo côté front
        (session.user as any).currentOrganizationId = token.currentOrganizationId as string | undefined; // Ajoute l'ID de l'organisation actuelle
      }
      return session;
    },
  },
};
