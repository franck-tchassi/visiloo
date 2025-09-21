//api/establishments/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

// GET
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: "No organization selected" }, { status: 400 });
  }

  try {
    const establishment = await prisma.establishment.findFirst({
      where: {
        id: params.id,
        organizationId: user.currentOrganizationId,
      }
    });

    if (!establishment) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 });
    }

    return NextResponse.json(establishment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: "No organization selected" }, { status: 400 });
  }

  const body = await req.json();

  try {
    const existing = await prisma.establishment.findFirst({
      where: {
        id: params.id,
        organizationId: user.currentOrganizationId
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 });
    }

    const updated = await prisma.establishment.update({
      where: { id: params.id },
      data: {
        name: body.name,
        address: body.address,
        city: body.city,
        postalCode: body.postalCode,
        country: body.country,
        phone: body.phone,
        rating: body.rating,
        reviews: body.reviews,
        isOpen: body.isOpen,
        googleMapsUrl: body.googleMapsUrl,
        placeId: body.placeId,
        openingHours: body.openingHours,
        lat: body.lat,
        lng: body.lng,
        lastSyncedAt: new Date(),
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: "No organization selected" }, { status: 400 });
  }

  try {
    const existing = await prisma.establishment.findFirst({
      where: {
        id: params.id,
        organizationId: user.currentOrganizationId
      }
    });

    if (!existing) {
      return NextResponse.json({ error: "Establishment not found" }, { status: 404 });
    }

    await prisma.establishment.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
