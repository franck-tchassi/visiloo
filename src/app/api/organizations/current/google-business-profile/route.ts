import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prismadb';
import { getGoogleOAuthClient } from '@/lib/googleAuth';

// Fonction pour rafraîchir le jeton d'accès (à utiliser quand nécessaire)
async function refreshAccessToken(refreshToken: string) {
    const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: refreshToken,
        }),
    });

    return res.json();
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id || !(session.user as any).currentOrganizationId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizationId = (session.user as any).currentOrganizationId;
    const code = req.nextUrl.searchParams.get("code");
    const state = req.nextUrl.searchParams.get("state");

    // --- Logique de callback après l'authentification Google ---
    if (code && state) {
        try {
            const { organizationId: stateOrgId } = JSON.parse(state);

            if (stateOrgId !== organizationId) {
                return NextResponse.json({ error: 'Invalid state or organization mismatch' }, { status: 403 });
            }

            const oauth2Client = getGoogleOAuthClient();
            const { tokens } = await oauth2Client.getToken(code);

            oauth2Client.setCredentials(tokens);

            const { data } = await oauth2Client.request<{
                accounts: { name: string; accountName: string }[];
            }>({ // Assertion de type pour 'data'
                url: 'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
            });

            if (!data.accounts || data.accounts.length === 0) {
                return NextResponse.json({ error: 'No Google Business Profile accounts found' }, { status: 404 });
            }

            const googleAccountId = data.accounts[0].name; // e.g., accounts/123456789
            const accountName = data.accounts[0].accountName; // e.g., "My Business Account"

            const accessTokenExpirationDate = tokens.expiry_date
                ? new Date(tokens.expiry_date)
                : new Date(Date.now() + 3600 * 1000); // Valeur par défaut de 1 heure

            await prisma.googleBusinessProfileAccount.upsert({
                where: { googleAccountId: googleAccountId },
                update: {
                    accessToken: tokens.access_token as string,
                    refreshToken: tokens.refresh_token as string,
                    accessTokenExpires: accessTokenExpirationDate,
                    organizationId: organizationId,
                },
                create: {
                    organizationId: organizationId,
                    googleAccountId: googleAccountId,
                    accountName: accountName,
                    accessToken: tokens.access_token as string,
                    refreshToken: tokens.refresh_token as string,
                    accessTokenExpires: accessTokenExpirationDate,
                },
            });

            return NextResponse.redirect(new URL(`/${session.user.locale}/dashboard/establishment`, req.url));

        } catch (error) {
            console.error('Error connecting Google Business Profile:', error);
            return NextResponse.json({ error: 'Failed to connect Google Business Profile' }, { status: 500 });
        }
    }

    // --- Logique initiale de redirection vers Google OAuth ---
    const existingAccount = await prisma.googleBusinessProfileAccount.findFirst({
        where: { organizationId: organizationId },
    });

    if (existingAccount) {
        return NextResponse.redirect(new URL(`/${session.user.locale}/dashboard/establishment`, req.url));
    }

    const oauth2Client = getGoogleOAuthClient();

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/business.manage',
    ];

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes.join(' '),
        prompt: 'consent',
        state: JSON.stringify({ organizationId: organizationId }), // Pass organizationId through state
    });

    return NextResponse.redirect(authorizationUrl);
}
