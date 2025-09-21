import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.id) {
            return NextResponse.json(
                { error: "Non autorisé" },
                { status: 401 }
            );
        }

        return NextResponse.json({
            id: currentUser.id,
            currentOrganizationId: currentUser.currentOrganizationId,
        });
    } catch (error) {
        console.error("[GET_CURRENT_USER_ERROR]", error);
        return NextResponse.json(
            { error: "Erreur interne du serveur lors de la récupération de l'utilisateur actuel" },
            { status: 500 }
        );
    }
}




