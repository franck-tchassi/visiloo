import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      currentOrganizationId?: string; // Ajoute l'ID de l'organisation actuelle
      locale?: string; // Ajoute la locale de l'utilisateur
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "USER" | "ADMIN";
    currentOrganizationId?: string; // Ajoute l'ID de l'organisation actuelle
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "USER" | "ADMIN";
    currentOrganizationId?: string; // Ajoute l'ID de l'organisation actuelle
  }
}
