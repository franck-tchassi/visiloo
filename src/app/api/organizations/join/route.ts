// app/api/join/route.ts
import { prisma } from '@/lib/prismadb'
import { NextResponse } from 'next/server'
import { getCurrentUser } from "@/actions/getCurrentUser";


export async function POST(req: Request) {
  try {
    // 1. Récupération de la session
    const session = await getCurrentUser()

    // 2. Vérification de l'authentification
    if (!session) {
      return NextResponse.json(
        { error: 'Non autorisé - Utilisateur non connecté' },
        { status: 401 }
      )
    }

    // 3. Validation des données
    const { orgId } = await req.json()
    if (!orgId) {
      return NextResponse.json(
        { error: 'Le paramètre orgId est requis' },
        { status: 400 }
      )
    }

    // 4. Vérification si l'utilisateur est déjà membre
    const existingMembership = await prisma.membership.findFirst({
      where: {
        organizationId: orgId,
        userId: session.id
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { success: true, message: 'Déjà membre de cette organisation' },
        { status: 200 }
      )
    }

    // 5. Création du membership
    await prisma.membership.create({
      data: {
        userId: session.id,
        organizationId: orgId,
        role: 'MEMBER'
      }
    })

    // 6. Réponse de succès
    return NextResponse.json(
      { success: true, message: 'Vous avez rejoint l\'organisation avec succès' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Erreur dans /api/join:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}