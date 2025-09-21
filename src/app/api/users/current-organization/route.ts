import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function PATCH(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.id) {
            return NextResponse.json(
                { error: "Authentification requise" },
                { status: 401 }
            );
        }

        const { organizationId } = await req.json();

        if (!organizationId || typeof organizationId !== "string") {
            return NextResponse.json(
                { error: "ID de l'organisation invalide" },
                { status: 400 }
            );
        }

        // Vérifier si l'utilisateur est membre de cette organisation
        const membership = await prisma.membership.findFirst({
            where: {
                userId: currentUser.id,
                organizationId: organizationId,
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Non autorisé - Vous n'êtes pas membre de cette organisation" },
                { status: 403 }
            );
        }

        // Mettre à jour l'organisation actuelle de l'utilisateur
        const updatedUser = await prisma.user.update({
            where: { id: currentUser.id },
            data: {
                currentOrganizationId: organizationId,
            },
            select: {
                id: true,
                email: true,
                currentOrganizationId: true,
            },
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("[UPDATE_CURRENT_ORGANIZATION_ERROR]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de la mise à jour de l'organisation" },
            { status: 500 }
        );
    }
}
