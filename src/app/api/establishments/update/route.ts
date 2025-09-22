// app/api/establishments/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prismadb";
import { getCurrentUser } from "@/actions/getCurrentUser";

export async function POST(req: Request) {
  // On récupère l'utilisateur AVANT le try/catch pour l'utiliser partout
  const user = await getCurrentUser();

  try {
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!user.currentOrganizationId) {
      return NextResponse.json({ error: "Aucune organisation sélectionnée" }, { status: 400 });
    }

    const body = await req.json();
    const {
      placeId,
      name,
      address,
      city,
      postalCode,
      country,
      rating,
      reviews,
      phone,
      lat,
      lng,
      isOpen
    } = body;

    if (!placeId) {
      return NextResponse.json({ error: "Place ID requis" }, { status: 400 });
    }

    // Préparer les données de mise à jour
    const updateData: any = {
      name: name || "Établissement",
      address: address || "",
      city: city || "",
      postalCode: postalCode || "",
      country: country || "",
      phone: phone || "",
      rating: rating || 0,
      reviews: reviews || 0,
      isOpen: isOpen || false,
      lat: lat || 0,
      lng: lng || 0,
      lastSyncedAt: new Date()
    };

    // N'inclure que les champs qui ont des valeurs
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Mettre à jour l'établissement avec la clé composite
    

    

  } catch (error: any) {
    console.error("Error updating establishment:", error);

    // Si l'établissement n'existe pas, le créer
    if (error.code === 'P2025') {
      try {
        const body = await req.json();
        const { placeId, name, address, lat, lng } = body;

        const newEstablishment = await prisma.establishment.create({
          data: {
            placeId: placeId,
            name: name || "Nouvel établissement",
            address: address || "",
            organizationId: user?.currentOrganizationId!,
            googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${placeId}`,
            lat: lat || 0,
            lng: lng || 0,
            lastSyncedAt: new Date()
          }
        });

        return NextResponse.json(newEstablishment);
      } catch (createError: any) {
        return NextResponse.json(
          { error: createError.message || "Erreur lors de la création" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}