"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import Link from "next/link";


interface Post {
  id: string;
  title: string;
  content: string;
  image?: string;
  tag?: string;
  readingTime?: number;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
}

export default function PostCard({ post, showFullContent = false }: { post: Post; showFullContent?: boolean }) {
  const content = showFullContent
    ? post.content
    : post.content.slice(0, 200) + (post.content.length > 200 ? "..." : "");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={post.author.image || ""} />
            <AvatarFallback>{post.author.name?.[0] || "A"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString()} {post.readingTime && `• ${post.readingTime} min`}
            </p>
          </div>
        </div>
        <CardTitle className="text-xl">
          {showFullContent ? (
            post.title
          ) : (
            <Link href={`/posts/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          )}
        </CardTitle>
        {post.tag && (
          <span className="text-xs font-semibold text-blue-600 mt-1 inline-block">{post.tag}</span>
        )}
      </CardHeader>

      {post.image && (
        <img src={post.image} alt={post.title} className="w-full h-60 object-cover mt-2 rounded-md" />
      )}

      <CardContent>
        
      </CardContent>
    </Card>
  );
}
