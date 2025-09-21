import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prismadb";
import crypto from "crypto"; // Pour générer le token d'invitation

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

        // Récupérer les invitations pour l'organisation actuelle
        const invitations = await prisma.invitation.findMany({
            where: {
                organizationId: currentUser.currentOrganizationId,
                expiresAt: { gt: new Date() }, // Seulement les invitations non expirées
            },
            include: {
                organization: { select: { name: true } },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const totalInvitations = await prisma.invitation.count({
            where: {
                organizationId: currentUser.currentOrganizationId,
                expiresAt: { gt: new Date() },
            },
        });

        return NextResponse.json({ invitations, totalInvitations });
    } catch (error) {
        console.error("[GET_ORGANIZATION_INVITATIONS_ERROR]", error);
        return NextResponse.json(
            { error: "Erreur lors de la récupération des invitations" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
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

        // Vérifier les permissions (seulement les ADMIN peuvent inviter)
        const membership = await prisma.membership.findFirst({
            where: {
                userId: currentUser.id,
                organizationId: currentUser.currentOrganizationId,
                role: "ADMIN",
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Accès refusé - Seuls les administrateurs peuvent envoyer des invitations" },
                { status: 403 }
            );
        }

        const { email, role = "MEMBER" } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json(
                { error: "Email invalide" },
                { status: 400 }
            );
        }

        // Vérifier si l'email est déjà membre de l'organisation
        const existingMember = await prisma.membership.findFirst({
            where: {
                organizationId: currentUser.currentOrganizationId,
                user: { email: email },
            },
        });

        if (existingMember) {
            return NextResponse.json(
                { error: "Cet utilisateur est déjà membre de l'organisation" },
                { status: 409 }
            );
        }

        // Vérifier si une invitation en attente existe déjà pour cet email dans cette organisation
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                organizationId: currentUser.currentOrganizationId,
                email: email,
                expiresAt: { gt: new Date() },
            },
        });

        if (existingInvitation) {
            return NextResponse.json(
                { error: "Une invitation est déjà en attente pour cet email" },
                { status: 409 }
            );
        }

        // Générer un token unique pour l'invitation
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Invitation valide pour 24 heures

        const newInvitation = await prisma.invitation.create({
            data: {
                email,
                organizationId: currentUser.currentOrganizationId,
                role: role as "MEMBER" | "ADMIN",
                token,
                expiresAt,
            },
        });

        // TODO: Envoyer un email avec le lien d'invitation contenant le token
        console.log(`Invitation envoyée à ${email} pour l'organisation ${currentUser.currentOrganizationId}. Token: ${token}`);

        return NextResponse.json(newInvitation, { status: 201 });
    } catch (error) {
        console.error("[POST_ORGANIZATION_INVITATION_ERROR]", error);
        return NextResponse.json(
            { error: "Erreur lors de l'envoi de l'invitation" },
            { status: 500 }
        );
    }
}
