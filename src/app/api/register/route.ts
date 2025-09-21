//api/register/route.ts

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prismadb";
import { validateEmail, validatePassword } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // Validation des champs requis
    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Le nom est requis" },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation du mot de passe
    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      return NextResponse.json(
        { error: passwordValidation },
        { status: 400 }
      );
    }

    // Vérification de l'unicité de l'email
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 409 }
      );
    }

    // Hachage sécurisé du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'utilisateur
    const result = await prisma.$transaction(async (prisma) => {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          hashedPassword,
        },
      });

      const organization = await prisma.organization.create({
        data: {
          name: `${name}'s Organization`,
          memberships: {
            create: {
              userId: user.id,
              role: "ADMIN",
            },
          },
        },
        include: {
          memberships: true,
        },
      });

      return { user, organization };
    });

    // Mettre à jour currentOrganizationId de l'utilisateur
    await prisma.user.update({
      where: { id: result.user.id },
      data: {
        currentOrganizationId: result.organization.id,
      },
    });

    // Réponse formatée
    return NextResponse.json({
      user: result.user,
      organization: result.organization
    }, { status: 201 });

  } catch (error) {
    console.error('[REGISTRATION_ERROR]', error);
    return NextResponse.json(
      { error: "Erreur lors de l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}