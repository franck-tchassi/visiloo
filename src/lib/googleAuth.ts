import { google } from 'googleapis';

const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_REDIRECT_URI || 'http://localhost:3000/api/organizations/current/google-business-profile';

export function getGoogleOAuthClient() {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUri
    );
    return oauth2Client;
}
