//api/establishments/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: "No organization selected" }, { status: 400 });
  }

  try {
    const establishments = await prisma.establishment.findMany({
      where: { organizationId: user.currentOrganizationId }
    });
    return NextResponse.json(establishments);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: "No organization selected" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const establishment = await prisma.establishment.create({
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        phone: body.phone,
        rating: body.rating || 0,
        reviews: body.reviews || 0,
        isOpen: body.isOpen || false,
        googleMapsUrl: body.googleMapsUrl,
        placeId: body.placeId,
        openingHours: body.openingHours,
        lat: body.lat,
        lng: body.lng,
        lastSyncedAt: new Date(),
        organizationId: user.currentOrganizationId
      }
    });
    return NextResponse.json(establishment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
