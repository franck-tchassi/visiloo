
"use client";

import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import Script from "next/script"; // <--- important
import Link from "next/link";

interface PlaceResult {
  id: string;
  nom: string;
  adresse: string;
  note: number | null;
  nombreAvis: number;
  photos: { url: string }[];
  telephone?: string;
  siteWeb?: string; // Optionnel car pas toujours disponible
  latitude?: number;
  longitude?: number;
  pays?: string;
  langue?: string;
  lienMaps?: string;
  typeEtablissement?: string;
  types?: string[]; // ← Nouveau: types Google
  horaires?: string[];
  
}

function ResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-4 flex gap-4 border rounded-lg">
          <Skeleton className="w-20 h-16 rounded-lg flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const LocalBusiness = () => {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);


  // Recherche d’établissements
  const {
    data: results,
    isPending: isSearching,
    error: searchError,
    mutate: searchPlaces
  } = useMutation({
    mutationFn: async (searchQuery: string) => {
      const res = await fetch(`/api/search?query=${encodeURIComponent(searchQuery)}`);
      if (!res.ok) throw new Error("Erreur lors de la recherche");
      return res.json();
    }
  });

  // Récupération des détails
  const fetchPlaceDetails = async (placeId: string) => {
    const res = await fetch(`/api/details?place_id=${placeId}`);
    if (!res.ok) throw new Error("Erreur lors de la récupération des détails");
    return res.json();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchPlaces(query);
  };

  const handleSelectPlace = async (place: PlaceResult) => {
    try {
      const details = await fetchPlaceDetails(place.id);
      setSelectedPlace({ ...place, ...details });
      setStep(2);
    } catch (err) {
      console.error("Erreur récupération détails:", err);
    }
  };

  // Helper pour transformer les types Google en texte lisible
  const formatTypes = (types?: string[]) =>
    (types || []).map((t) => t.replace(/_/g, " "));

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Étape 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Trouvez votre établissement</h2>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nom de votre établissement, adresse..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 flex items-center gap-2"
                disabled={isSearching}
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                {isSearching ? "Recherche..." : "Rechercher"}
              </button>
            </div>
          </form>

          {searchError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {(searchError as Error).message}
            </div>
          )}

          <div className="space-y-3">
            {isSearching ? (
              <ResultsSkeleton />
            ) : results && results.length > 0 ? (
              <ScrollArea className="h-[400px] w-full p-2 border rounded-lg">
                <div className="space-y-3">
                  {results.map((place: PlaceResult) => (
                    <div
                      key={place.id}
                      className="p-4 flex gap-4 border rounded-lg cursor-pointer transition hover:shadow-md hover:bg-indigo-50 hover:border-indigo-200"
                      onClick={() => handleSelectPlace(place)}
                    >
                      {place.photos[0] ? (
                        <img
                          src={place.photos[0].url}
                          alt={place.nom}
                          className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPinIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{place.nom}</h3>
                        <p className="text-sm text-gray-600 truncate mb-2">{place.adresse}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : results && results.length === 0 && (
              <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                <MapPinIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                <p className="text-lg font-medium">Aucun résultat trouvé</p>
                <p className="text-sm mt-1">Essayez avec un autre nom ou une autre adresse</p>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && selectedPlace && (
        <div className="space-y-6">
          {/* Nom + photo */}
          <div className="flex items-center gap-4">
            {selectedPlace.photos[0] ? (
              <Image
                src={selectedPlace.photos[0].url}
                alt={selectedPlace.nom}
                width={100}
                height={80}
                className="rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-10 h-10 text-gray-400" />
              </div>
            )}
            <h2 className="text-2xl font-semibold">{selectedPlace.nom}</h2>
          </div>

          {/* JSON-LD affiché + injecté */}
          <div>
            <h3 className="text-lg font-medium mb-2">Balisage LocalBusiness</h3>
            <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(
                {
                  "@context": "https://schema.org",
                  "@type": "LocalBusiness",
                  "@id": selectedPlace.siteWeb,
                  name: selectedPlace.nom,
                  image: selectedPlace.photos[0]?.url || "",
                  url: selectedPlace.siteWeb,
                  hasMap: selectedPlace.lienMaps,
                  telephone: selectedPlace.telephone || "",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: selectedPlace.adresse,
                    addressCountry: selectedPlace.pays || "",
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: selectedPlace.note ?? "",
                    ratingCount: selectedPlace.nombreAvis ?? "",
                    bestRating: "5",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: selectedPlace.latitude,
                    longitude: selectedPlace.longitude,
                  },
                  makesOffer: formatTypes(selectedPlace.types).map((t) => ({
                    "@type": "Offer",
                    name: t,
                  })),
                  sameAs: [selectedPlace.siteWeb],
                },
                null,
                2
              )}
            </pre>

            {/* Injection réelle pour SEO */}
            <Script
              id={`localbusiness-jsonld-${selectedPlace.id}`}
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "LocalBusiness",
                  "@id": selectedPlace.siteWeb,
                  name: selectedPlace.nom,
                  image: selectedPlace.photos[0]?.url || "",
                  url: selectedPlace.siteWeb,
                  hasMap: selectedPlace.lienMaps,
                  telephone: selectedPlace.telephone || "",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: selectedPlace.adresse,
                    addressCountry: selectedPlace.pays || "",
                  },
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: selectedPlace.note ?? "",
                    ratingCount: selectedPlace.nombreAvis ?? "",
                    bestRating: "5",
                  },
                  geo: {
                    "@type": "GeoCoordinates",
                    latitude: selectedPlace.latitude,
                    longitude: selectedPlace.longitude,
                  },
                  makesOffer: formatTypes(selectedPlace.types).map((t) => ({
                    "@type": "Offer",
                    name: t,
                  })),
                  sameAs: [selectedPlace.siteWeb],
                }),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};










export default function SchemaGeneratorLocalBusiness() {
   
    


  const utilisationsAffiche = [
    {
      id: 'affiche',
      title: 'Affiche',
      description: 'Captez l\'attention aux points d\'entrée/sortie',
      details: 'Placez votre affiche là où chaque client la verra—à l\'entrée ou à la sortie de votre établissement pour une visibilité maximale.',
      image: '/placeholder-titre.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'flyer',
      title: 'Flyer',
      description: 'Document personnel pour un impact durable',
      details: 'Donnez aux clients un rappel physique pour laisser un avis après avoir expérimenté votre service—parfait quand la satisfaction est encore fraîche.',
      image: '/placeholder-titre.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'menu',
      title: 'Menu',
      description: 'Intégrez à l\'expérience culinaire',
      details: 'Ajoutez l\'affiche à votre menu pour faire de l\'évaluation une étape finale naturelle de l\'expérience culinaire—recueillez des retours lorsque la satisfaction est à son maximum.',
      image: '/placeholder-titre.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'reception',
      title: 'Réception',
      description: 'Parfait pour les entreprises de service',
      details: 'Placez votre affiche aux points d\'enregistrement/de départ où les clients font déjà une pause—les hôtels, salons et cabinets médicaux obtiennent d\'excellents résultats avec ce placement.',
      image: '/placeholder-titre.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'colis',
      title: 'Colis',
      description: 'Idéal pour les entreprises e-commerce',
      details: 'Entreprise e-commerce ? Incluez une affiche d\'avis avec chaque envoi et transformez l\'excitation de l\'ouverture du colis en précieux avis Google—les clients répondent régulièrement à cette approche.',
      image: '/placeholder-titre.png',
      colorClass: 'bg-blue-600'
    }
  ];

   

  return (
    <div className="bg-gray-900 py-24 sm:py-32 ">
      <div className="mx-auto w-full px-6 lg:px-8">
        <div className="mx-auto w-full lg:text-center">
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            Générateur gratuit de balisage Schema LocalBusiness - Solution en un clic
          </h2>
          <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
        Notre générateur de balisage schema LocalBusiness transforme votre classement local en ajoutant des données structurées puissantes à votre site web. Localisez simplement votre Profil d'entreprise Google, générez votre code schema et ajoutez-le à votre site—améliorant immédiatement votre visibilité dans les résultats de recherche locaux.
      </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="gap-x-8 gap-y-10 lg:gap-y-16">
            <LocalBusiness />
          </dl>
        </div>
        
        {/* Nouvelle section: Pourquoi le balisage Schema LocalBusiness est essentiel */}
        <section className="mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-16">
                Pourquoi le balisage Schema LocalBusiness est essentiel pour votre stratégie de référencement local
              </h2>
              <p className="text-lg text-gray-300 mb-6">
                Google privilégie les sites web bien structurés dans les résultats de recherche. Le balisage schema LocalBusiness—un code qui contient des informations essentielles sur votre entreprise—crée une connexion directe entre votre site web et votre Profil d'entreprise Google.
              </p>
              <p className="text-lg text-gray-300 mb-8">
                Cette structure claire aide Google à comprendre exactement ce que vous proposez, où vous êtes situé et comment catégoriser votre entreprise, ce qui conduit à une meilleure visibilité dans les recherches locales et Google Maps, et finalement à attirer plus de clients potentiels.
              </p>
              
              {/* Bouton "Regarder la vidéo" centré */}
              <Link 
                href="/schema-generator" 
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Regarder la vidéo
              </Link>
            </div>
          </div>
        </section>
        
        {/* Section: Comment générer un balisage Schema LocalBusiness */}
        <section className="mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Colonne de gauche - Texte */}
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl mb-6">
                  Comment générer un balisage Schema LocalBusiness
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Notre générateur gratuit de balisage schema pour entreprises locales en haut de cette page crée instantanément un code statique. Pour des résultats encore meilleurs, l'application Localo fournit un balisage schema dynamique hautement optimisé qui se met à jour automatiquement.
                </p>
                
              </div>

              {/* Colonne de droite - Vidéo */}
              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-700/10 rounded-2xl p-6 border border-indigo-500/30">
                    <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-sm text-white/80">Tutoriel en vidéo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
       

        {/* Section Témoignages Clients */}
          <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8 mt-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-500),transparent)] opacity-10" />
            <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-indigo-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center" />
            <div className="mx-auto max-w-7xl">
              <h2 className="text-3xl font-bold text-center text-white mb-16">
                Ils font confiance à Visiloo
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Témoignage Avignon */}
                <div className="text-center bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
                  <blockquote className="text-lg/7 font-semibold text-white mb-6">
                    <p>
                      "Visiloo a révolutionné notre présence en ligne. Notre visibilité a augmenté de 89% 
                      en seulement 3 mois. Une solution bien plus performante que nos outils précédents."
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">A</span>
                      </div>
                    </div>
                    <div className="text-base text-gray-300 font-medium">Directeur Marketing</div>
                    <div className="text-sm text-indigo-400">Avignon</div>
                  </div>
                </div>

                {/* Témoignage Charles et Alice */}
                <div className="text-center bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
                  <blockquote className="text-lg/7 font-semibold text-white mb-6">
                    <p>
                      "L'interface intuitive de Visiloo nous fait gagner 15 heures par semaine sur la gestion 
                      de nos multiples établissements. Un gain de temps considérable !"
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">C&A</span>
                      </div>
                    </div>
                    <div className="text-base text-gray-300 font-medium">Responsable Digital</div>
                    <div className="text-sm text-green-400">Charles et Alice</div>
                  </div>
                </div>

                {/* Témoignage Juste Bios */}
                <div className="text-center bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm">
                  <blockquote className="text-lg/7 font-semibold text-white mb-6">
                    <p>
                      "Le support client de Visiloo est exceptionnel. Ils nous accompagnent sur chaque 
                      optimisation et les résultats sont visibles immédiatement dans nos analytics."
                    </p>
                  </blockquote>
                  <div className="mt-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-amber-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xl font-bold">JB</span>
                      </div>
                    </div>
                    <div className="text-base text-gray-300 font-medium">CEO</div>
                    <div className="text-sm text-amber-400">Juste Bios</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section Google Business Profile - Tout en bas sur toute la largeur */}
                <section className="bg-gray-800 py-24">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      {/* Colonne de gauche - Texte */}
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-6">
                          Plus de 26 815 Profils d'entreprise Google gérés activement avec Visiloo
                        </h2>
                        <p className="text-lg text-gray-300 mb-8">
                          Que vous soyez propriétaire d'entreprise, freelance ou agence, Visiloo fournit les outils dont vous avez besoin pour optimiser votre visibilité locale et obtenir des résultats concrets. Simplifiez la gestion de votre profil et libérez votre potentiel de croissance.
                        </p>
                        <Link 
                          href="/signin" 
                          className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                        >
                          Commencer maintenant
                        </Link>
                      </div>
          
                      {/* Colonne de droite - Image */}
                      <div className="flex justify-center">
                        <div className="relative w-full max-w-md">
                          <div className=" rounded-2xl bg-gradient-to-br overflow-hidden flex items-center justify-center">
                            <img
                              src="/profil-entreprise.png"
                              alt="Gestion de Profils Google Business avec Visiloo"
                              className="w-full h-full object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-google-business.png';
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

      </div>
    </div>
  )
}








/**

              <div className="flex justify-center">
                <div className="relative w-full max-w-md">
                  <div className="bg-gradient-to-br from-indigo-900/20 to-indigo-700/10 rounded-2xl p-6 border border-indigo-500/30">
                    <div className="aspect-video bg-black/40 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-500 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <span className="text-sm text-white/80">Regarder la vidéo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
*/