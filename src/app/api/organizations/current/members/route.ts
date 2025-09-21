import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prismadb";

export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.id) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        if (!currentUser.currentOrganizationId) {
            return NextResponse.json(
                { error: "Aucune organisation active sélectionnée" },
                { status: 400 }
            );
        }

        // Récupérer les membres de l'organisation actuelle
        const members = await prisma.membership.findMany({
            where: {
                organizationId: currentUser.currentOrganizationId,
            },
            select: {
                id: true,
                userId: true,
                organizationId: true,
                role: true,
                createdAt: true, // Assurez-vous que createdAt est sélectionné
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc", // Utiliser 'asc' ou 'desc'
            },
        });

        // Optionnel: Compter le nombre total de membres pour la pagination
        const totalMembers = await prisma.membership.count({
            where: {
                organizationId: currentUser.currentOrganizationId,
            },
        });

        return NextResponse.json({ members, totalMembers });
    } catch (error) {
        console.error("[GET_ORGANIZATION_MEMBERS_ERROR]", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des membres" },
            { status: 500 }
        );
    }
}
