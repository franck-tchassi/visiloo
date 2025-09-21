import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb';
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id: searchSessionId } = await context.params;
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

        const { organizationId } = await request.json();

        if (!searchSessionId || !organizationId) {
            return NextResponse.json(
                { error: "ID de session de recherche ou ID d'organisation manquant" },
                { status: 400 }
            );
        }

        // Vérifier si la session de recherche appartient à l'organisation actuelle de l'utilisateur
        const existingSession = await prisma.searchSession.findUnique({
            where: {
                id: searchSessionId,
            },
        });

        if (!existingSession || existingSession.organizationId !== currentUser.currentOrganizationId) {
            return NextResponse.json(
                { error: "Non autorisé - Session de recherche introuvable ou n'appartient pas à l'organisation active" },
                { status: 403 }
            );
        }

        await prisma.searchSession.delete({
            where: {
                id: searchSessionId,
            },
        });

        return NextResponse.json({ message: 'Session de recherche supprimée avec succès.' }, { status: 200 });
    } catch (error) {
        console.error("[DELETE_SEARCH_SESSION_ERROR]", error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur lors de la suppression de la session de recherche.' },
            { status: 500 }
        );
    }
}




