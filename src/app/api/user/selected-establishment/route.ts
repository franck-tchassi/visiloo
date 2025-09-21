import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';
import { prisma } from '@/lib/prismadb';

export async function GET() {
  const user = await getCurrentUser();

  if (!user || !user.selectedEstablishmentId) {
    return NextResponse.json({ establishment: null });
  }

  const est = await prisma.establishment.findUnique({
    where: { id: user.selectedEstablishmentId },
  });

  return NextResponse.json({ establishment: est });
}
