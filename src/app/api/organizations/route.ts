// app/api/new-organization/route.ts

import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    // 1. Authentification - Récupération de la session complète
    const session = await getCurrentUser();

    // Vérification de la session et de l'utilisateur
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Authentification requise" },
        { status: 401 }
      );
    }

    // 2. Validation des données
    const { name } = await req.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Nom d'organisation invalide" },
        { status: 400 }
      );
    }

    // 3. Création de l'organisation
    const newOrganization = await prisma.organization.create({
      data: {
        name,
        memberships: {
          create: {
            userId: session.id, // Utilisation de l'ID utilisateur de la session
            role: "ADMIN"
          }
        }
      },
      include: {
        memberships: true
      }
    });

    return NextResponse.json(newOrganization);

  } catch (error) {
    console.error("Erreur création organisation:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};


export const GET = async () => {
  try {
    const session = await getCurrentUser();

    if (!session?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      );
    }

    const organizations = await prisma.organization.findMany({
      where: {
        memberships: {
          some: {
            userId: session.id
          }
        }
      },
      select: {
        id: true,
        name: true
      },
      orderBy: {
        createdAt: "asc"
      }
    });

    return NextResponse.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
};