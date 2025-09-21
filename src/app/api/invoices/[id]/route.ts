// app/api/invoices/[id]/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prismadb";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { lines: true },
    });

    if (!invoice || invoice.userId !== user.id) {
      return NextResponse.json({ error: "Facture introuvable ou accès refusé." }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error("Erreur lors de la récupération de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la facture." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    
    // Vérifier que l'utilisateur possède cette facture
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { lines: true }, // Inclure les lignes existantes
    });

    if (!existingInvoice || existingInvoice.userId !== user.id) {
      return NextResponse.json({ error: "Facture introuvable ou accès refusé." }, { status: 404 });
    }

    // 1. Mettre à jour la facture elle-même
    const updatedInvoice = await prisma.invoice.update({
      where: { id: params.id },
      data: {
        name: body.name,
        issuerName: body.issuerName,
        issuerAddress: body.issuerAddress,
        clientName: body.clientName,
        clientAddress: body.clientAddress,
        invoiceDate: body.invoiceDate,
        dueDate: body.dueDate,
        vatActive: body.vatActive,
        vatRate: body.vatRate,
        status: body.status,
      },
    });

    // 2. Gérer les lignes de facture
    if (body.lines && Array.isArray(body.lines)) {
      // Supprimer les anciennes lignes
      await prisma.invoiceLine.deleteMany({
        where: { invoiceId: params.id },
      });

      // Créer les nouvelles lignes
      const linesToCreate = body.lines.map((line: any) => ({
        description: line.description || "",
        quantity: line.quantity || 0,
        unitPrice: line.unitPrice || 0,
        invoiceId: params.id,
      }));

      if (linesToCreate.length > 0) {
        await prisma.invoiceLine.createMany({
          data: linesToCreate,
        });
      }
    }

    // 3. Récupérer la facture complète avec les nouvelles lignes
    const finalInvoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: { lines: true },
    });

    return NextResponse.json(finalInvoice);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour de la facture." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
    });

    if (!invoice || invoice.userId !== user.id) {
      return NextResponse.json({ error: "Facture introuvable ou accès refusé." }, { status: 404 });
    }

    await prisma.invoice.delete({ where: { id: params.id } });

    return NextResponse.json({ message: "Facture supprimée." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la facture." },
      { status: 500 }
    );
  }
}