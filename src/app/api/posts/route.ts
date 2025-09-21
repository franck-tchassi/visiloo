//api/posts/route.ts

import { prisma } from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


// GET : Liste tous les posts publiés
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("[POSTS_GET_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}

// POST : Créer un post (seulement pour les admins)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur est ADMIN
    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Access denied: only admins can create posts" },
        { status: 403 }
      );
    }

    // Récupérer les données envoyées

    const { title, content, published, image, tag, readingTime } = await request.json();

    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Créer le post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        published: published ?? false,
        image,
        tag,
        readingTime,
        authorId: user.id,
      },
      include: {
        author: { select: { name: true, image: true } },
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[POSTS_POST_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}
