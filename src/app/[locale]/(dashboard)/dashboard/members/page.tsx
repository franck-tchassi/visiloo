import React from 'react'
import { getCurrentUser } from '@/actions/getCurrentUser';
import { redirect } from 'next/navigation';
import { cookies, headers } from 'next/headers'; // Import pour récupérer les en-têtes
import { MembersClientPage } from './MembersClientPage'; // Nouveau composant client

interface Member {
    id: string;
    userId: string;
    organizationId: string;
    role: 'USER' | 'MEMBER' | 'ADMIN';
    user: {
        id: string;
        name: string | null;
        email: string | null;
        image: string | null;
    };
}

interface Invitation {
    id: string;
    email: string;
    organizationId: string;
    role: 'USER' | 'MEMBER' | 'ADMIN';
    token: string;
    expiresAt: Date;
    createdAt: Date;
    organization: { name: string };
}

interface MembersPageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

const MembersPage = async ({ searchParams }: MembersPageProps) => {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.id) {
        redirect('/login'); // Rediriger si non authentifié
        return null;
    }

    if (!currentUser.currentOrganizationId) {
        return (
            <div className="p-6 text-center text-gray-500">
                Veuillez sélectionner une organisation active pour gérer les membres.
            </div>
        );
    }

    const headerList = await headers();
    const host = headerList.get('host');
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    const cookieStore = await cookies(); // Ajout de 'await' ici
    const sessionCookie = cookieStore.get('next-auth.session-token'); // Ou le nom de votre cookie de session NextAuth

    const requestHeaders = { 'Content-Type': 'application/json' };
    if (sessionCookie) {
        (requestHeaders as any)['Cookie'] = `${sessionCookie.name}=${sessionCookie.value}`;
    }

    // Récupérer les membres
    const membersResponse = await fetch(`${baseUrl}/api/organizations/current/members`, {
        headers: requestHeaders,
        cache: 'no-store', // Assure que les données sont toujours à jour
    });
    const { members, totalMembers } = membersResponse.ok ? await membersResponse.json() : { members: [], totalMembers: 0 };

    // Récupérer les invitations
    const invitationsResponse = await fetch(`${baseUrl}/api/organizations/current/invitations`, {
        headers: requestHeaders,
        cache: 'no-store', // Assure que les données sont toujours à jour
    });
    const { invitations, totalInvitations } = invitationsResponse.ok ? await invitationsResponse.json() : { invitations: [], totalInvitations: 0 };

    return (
        <MembersClientPage
            initialMembers={members}
            initialTotalMembers={totalMembers}
            initialInvitations={invitations}
            initialTotalInvitations={totalInvitations}
            currentUserRole={(currentUser.role || 'USER') as 'USER' | 'MEMBER' | 'ADMIN'}
            currentOrganizationId={currentUser.currentOrganizationId}
        />
    );
};

export default MembersPage