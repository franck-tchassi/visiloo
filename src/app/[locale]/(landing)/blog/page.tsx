'use client';

import PostCard from "@/app/[locale]/(landing)/blog/post-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: {
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
    likes: number;
  };
  tags: string[];
}

// Liste des tags disponibles
const AVAILABLE_TAGS = [
  "SEO",
  "Google My Business",
  "Profil d'Entreprise Google",
  "Marketing Local",
  "Optimisation",
  "Avis"
];

const Blog = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [searchQuery, selectedTags, posts]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterPosts = () => {
    let result = posts;

    // Filtrage par recherche
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }

    // Filtrage par tags
    if (selectedTags.length > 0) {
      result = result.filter(post => 
        selectedTags.some(tag => post.tags?.includes(tag))
      );
    }

    setFilteredPosts(result);
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTags([]);
  };

  // Détection du rôle
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        {/* Effets d'arrière-plan décoratifs */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <main className="mx-auto max-w-3xl py-16">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-white">Blog SEO Local</h1>
            <p className="text-gray-300 text-lg">
              Améliorez votre visibilité locale et attirez plus de clients grâce
              à des stratégies simples et efficaces.  
              Notre blog vous propose des guides pratiques, des astuces
              concrètes et des analyses pour optimiser votre présence en ligne.  
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative mb-8">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full p-4 pl-10 text-sm rounded-lg bg-gray-800 border border-gray-700 placeholder-gray-400 text-white focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Rechercher un article..."
            />
          </div>

          {/* Filtres par tags */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Filtrer par mots-clés :</h2>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 text-sm rounded-full ${
                    selectedTags.includes(tag)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Indicateurs de filtres actifs */}
          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex items-center justify-between mb-8 p-4 bg-gray-800 rounded-lg">
              <div>
                <span className="text-gray-300 mr-2">Filtres actifs :</span>
                {searchQuery && (
                  <span className="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium bg-indigo-900 text-indigo-200 rounded-full">
                    Recherche: "{searchQuery}"
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="ml-1 text-indigo-300 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedTags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium bg-indigo-900 text-indigo-200 rounded-full">
                    {tag}
                    <button 
                      onClick={() => toggleTag(tag)}
                      className="ml-1 text-indigo-300 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button 
                onClick={clearFilters}
                className="text-sm text-indigo-400 hover:text-indigo-300"
              >
                Effacer tous les filtres
              </button>
            </div>
          )}

          {/* Bouton ajouter un post (réservé Admins) */}
          {isAdmin && (
            <div className="flex justify-end mb-8">
              <Link href="/admin/posts/new">
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Nouveau Post
                </Button>
              </Link>
            </div>
          )}

          {/* Liste des posts */}
          {loading ? (
            <div className="text-center text-gray-400 mt-12">
              Chargement des articles...
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              {posts.length === 0 ? (
                <>
                  Aucun article publié pour le moment.
                  {isAdmin && (
                    <span> Créez votre premier article pour lancer le blog !</span>
                  )}
                </>
              ) : (
                <>
                  Aucun article ne correspond à vos critères de recherche.
                  <button 
                    onClick={clearFilters}
                    className="block mt-2 text-indigo-400 hover:text-indigo-300 mx-auto"
                  >
                    Effacer les filtres
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-gray-400 text-sm">
                {filteredPosts.length} article{filteredPosts.length > 1 ? 's' : ''} trouvé{filteredPosts.length > 1 ? 's' : ''}
              </div>
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>

        {/* Effet d'arrière-plan en bas */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>
    </div>
  );
};

export default Blog;