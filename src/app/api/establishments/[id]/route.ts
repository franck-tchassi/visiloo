//api/establishments/[id]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
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

export async function PUT(req: Request, { params }: Params) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!user.currentOrganizationId) {
    return NextResponse.json({ error: "No organization selected" }, { status: 400 });
  }

  const body = await req.json();

  try {
    // Vérifie que l'établissement existe bien et appartient à l'organisation
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

export async function DELETE(_req: Request, { params }: Params) {
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
