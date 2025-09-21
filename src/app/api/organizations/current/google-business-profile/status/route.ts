import { NextResponse } from "next/server";
import { getCurrentUser } from "@/actions/getCurrentUser";
import { prisma } from "@/lib/prismadb";

export async function GET(req: Request) {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser || !currentUser.id || !currentUser.currentOrganizationId) {
            return NextResponse.json({ isConnected: false, error: "Unauthorized or no current organization" }, { status: 401 });
        }

        const existingAccount = await prisma.googleBusinessProfileAccount.findFirst({
            where: {
                organizationId: currentUser.currentOrganizationId,
            },
        });

        if (existingAccount) {
            return NextResponse.json({ isConnected: true, accountName: existingAccount.accountName });
        } else {
            return NextResponse.json({ isConnected: false });
        }
    } catch (error) {
        console.error("[GET_GBP_STATUS_ERROR]", error);
        return NextResponse.json({ isConnected: false, error: "Internal Server Error" }, { status: 500 });
    }
}
