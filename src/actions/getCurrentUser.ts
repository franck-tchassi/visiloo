//actions/getCurrentUser.ts

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { getServerSession } from "next-auth";
// import { NextRequest } from "next/server"; // Suppression de l'import NextRequest

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function getCurrentUser() {

  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session?.user?.email }
    });
    // Si l'utilisateur n'existe pas, retourner null
    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      updatedAt: currentUser.updatedAt.toISOString(),
      emailVerified: currentUser.emailVerified ? currentUser.emailVerified.toISOString() : null,
    }


  } catch (error) {

    console.error("Erreur lors de la récupération de l'utilisateur actuel:", error);
    return null;
  }
}