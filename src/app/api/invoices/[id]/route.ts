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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const body = await request.json();
    const existingInvoice = await prisma.invoice.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!existingInvoice || existingInvoice.userId !== user.id) {
      return NextResponse.json({ error: "Facture introuvable ou accès refusé." }, { status: 404 });
    }

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
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

    if (body.lines && Array.isArray(body.lines)) {
      await prisma.invoiceLine.deleteMany({
        where: { invoiceId: id },
      });

      const linesToCreate = body.lines.map((line: any) => ({
        description: line.description || "",
        quantity: line.quantity || 0,
        unitPrice: line.unitPrice || 0,
        invoiceId: id,
      }));

      if (linesToCreate.length > 0) {
        await prisma.invoiceLine.createMany({
          data: linesToCreate,
        });
      }
    }

    const finalInvoice = await prisma.invoice.findUnique({
      where: { id },
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
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const user = await requireAuth();
  if (user instanceof NextResponse) return user;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
    });

    if (!invoice || invoice.userId !== user.id) {
      return NextResponse.json({ error: "Facture introuvable ou accès refusé." }, { status: 404 });
    }

    await prisma.invoice.delete({ where: { id } });

    return NextResponse.json({ message: "Facture supprimée." });
  } catch (error) {
    console.error("Erreur lors de la suppression de la facture:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la facture." },
      { status: 500 }
    );
  }
}