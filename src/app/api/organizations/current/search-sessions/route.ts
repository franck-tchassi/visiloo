import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prismadb'; // Assurez-vous que ce chemin est correct pour votre instance Prisma
import { getCurrentUser } from "@/actions/getCurrentUser"; // Importer getCurrentUser

// Cette API simule le stockage des sessions de recherche dans une base de données.
// En production, vous interagirez ici avec votre ORM/base de données.

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { organizationId, searchSession } = body;

        if (!organizationId || !searchSession) {
            return NextResponse.json(
                { error: 'organizationId et searchSession sont requis.' },
                { status: 400 }
            );
        }

        // Ancien console.log est remplacé par l'opération Prisma
        // console.log(`[API] Nouvelle session de recherche pour l'organisation ${organizationId}:`, searchSession);

        const createdSearchSession = await prisma.searchSession.create({
            data: {
                sessionId: searchSession.sessionId,
                keyword: searchSession.keyword,
                city: searchSession.city,
                createdAt: searchSession.createdAt ? new Date(searchSession.createdAt) : new Date(), // Assurez-vous du type Date
                generatedLink: searchSession.generatedLink,
                organization: {
                    connect: { id: organizationId },
                },
            },
        });

        return NextResponse.json(
            { message: 'Session de recherche sauvegardée avec succès.', searchSession: createdSearchSession },
            { status: 200 }
        );
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de la session de recherche:', error);
        return NextResponse.json(
            { error: 'Erreur interne du serveur lors de la sauvegarde de la session de recherche.' },
            { status: 500 }
        );
    }
}

export async function GET() {
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

        const searchSessions = await prisma.searchSession.findMany({
            where: {
                organizationId: currentUser.currentOrganizationId,
            },
            orderBy: {
                createdAt: "desc", // Afficher les plus récentes en premier
            },
        });

        return NextResponse.json(searchSessions);
    } catch (error) {
        console.error("[GET_SEARCH_SESSIONS_ERROR]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de la récupération des sessions de recherche" },
            { status: 500 }
        );
    }
}
