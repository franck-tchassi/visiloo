import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "MEMBER" | "ADMIN"; // Ajoutez MEMBER
      stripeCustomerId?: string | null;
      currentOrganizationId?: string | null;
      selectedEstablishmentId?: string | null;
      locale?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "USER" | "MEMBER" | "ADMIN"; // Ajoutez MEMBER
    stripeCustomerId?: string | null;
    currentOrganizationId?: string | null;
    selectedEstablishmentId?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "MEMBER" | "ADMIN"; // Ajoutez MEMBER
    stripeCustomerId?: string | null;
    currentOrganizationId?: string | null;
    selectedEstablishmentId?: string | null;
  }
}