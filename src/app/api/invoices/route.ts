

// app/api/invoices/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";
import { ObjectId } from "mongodb"; // Import important

// 📌 Obtenir l'utilisateur actuel via la session
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

// 🔐 Middleware de protection
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  return user;
}

// 📥 POST : Créer une facture vide
export async function POST(req: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const { name } = await req.json();

    // Prisma va automatiquement générer l'ObjectId grâce à @default(auto())
    const newInvoice = await prisma.invoice.create({
      data: {
        name,
        userId: user.id, // Cet ID est déjà un ObjectId
        issuerName: "",
        issuerAddress: "",
        clientName: "",
        clientAddress: "",
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        vatActive: false,
        vatRate: 20,
        status: 1,
        lines: {
          create: [] // Créer un tableau vide de lignes
        }
      },
      include: {
        lines: true // Inclure les lignes dans la réponse
      }
    });

    return NextResponse.json(newInvoice, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la facture." },
      { status: 500 }
    );
  }
}

// 📤 GET : Récupérer toutes les factures de l'utilisateur
export async function GET() {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const today = new Date();

    const invoices = await prisma.invoice.findMany({
      where: { userId: user.id },
      include: { lines: true },
    });

    // Mettre à jour le statut des factures en retard
    const updatePromises = invoices.map(async (invoice) => {
      if (!invoice.dueDate) return invoice;
      
      try {
        const due = new Date(invoice.dueDate);
        if (due < today && invoice.status === 2) {
          return await prisma.invoice.update({
            where: { id: invoice.id },
            data: { status: 5 },
            include: { lines: true },
          });
        }
        return invoice;
      } catch (error) {
        console.error("Erreur lors de la mise à jour de la facture:", error);
        return invoice;
      }
    });

    const updatedInvoices = await Promise.all(updatePromises);

    return NextResponse.json(updatedInvoices);
  } catch (error) {
    console.error("Erreur lors de la récupération des factures:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des factures." },
      { status: 500 }
    );
  }
}

// ❌ DELETE : Supprimer une facture
export async function DELETE(req: Request) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get("id");

  if (!invoiceId) {
    return NextResponse.json({ error: "ID de la facture manquant." }, { status: 400 });
  }

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice || invoice.userId !== user.id) {
      return NextResponse.json({ error: "Facture introuvable ou accès refusé." }, { status: 404 });
    }

    await prisma.invoice.delete({ where: { id: invoiceId } });

    return NextResponse.json({ message: "Facture supprimée." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la facture." },
      { status: 500 }
    );
  }
}