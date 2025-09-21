"use client"

import React, { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import {
  MagnifyingGlassIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import Link from "next/link";
import Image from 'next/image';
import { FaRegFilePdf } from "react-icons/fa"; // 👈 ajoute ça en haut


interface PlaceResult {
  id: string;
  nom: string;
  adresse: string;
  note: number | null;
  nombreAvis: number;
  photos: { url: string }[];
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

function Generator() {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [color, setColor] = useState("#4F46E5"); // Indigo par défaut
  const [format, setFormat] = useState("A4");

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchPlaces(query);
  };

  const handleSelectPlace = (place: PlaceResult) => {
    setSelectedPlace(place);
    setStep(2); // Passer à l’étape suivante
  };

  return (
    <>
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      {/* Étape 1 - Localisation */}
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

      {/* Étape 2 - Personnalisation */}
      {step === 2 && selectedPlace && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Personnalisez votre affiche</h2>

          {/* Infos établissement */}
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            {selectedPlace.photos[0] ? (
              <img
                src={selectedPlace.photos[0].url}
                alt={selectedPlace.nom}
                className="w-24 h-20 object-cover rounded-lg"
              />
            ) : (
              <div className="w-24 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                <MapPinIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-gray-900">{selectedPlace.nom}</h3>
              <p className="text-sm text-gray-600">{selectedPlace.adresse}</p>
            </div>
          </div>

          {/* Couleur */}
          <div>
            <h4 className="font-medium mb-2">Associez les couleurs à votre marque</h4>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-16 h-10 border rounded cursor-pointer"
            />
          </div>

          {/* Format */}
          <div>
            <h4 className="font-medium mb-2">Choisissez le format parfait</h4>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="A4">A4 (210mm x 297mm)</option>
              <option value="A5">A5 (148.5mm x 210mm)</option>
              <option value="Letter">Letter (279mm x 216mm)</option>
            </select>
          </div>

          {/* Bouton Télécharger */}
          
            <button
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 font-medium flex items-center justify-center gap-2"
            >
            <FaRegFilePdf size={20} color="white" />

            Télécharger l'affiche PDF gratuite
            </button>

        </div>
      )}
    </div>
    <div className="text-center mt-16 space-y-6 mb-16">
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
                href="/signin" 
                className="inline-flex items-center justify-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
                Essayez 7 jours gratuitement
            </Link>
            <Link 
                href="/video" 
                className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-600"
            >
                Regarder la vidéo
            </Link>
        </div>
    </div>
    </>
  );
}



export default function GeneratorAvisGoogleQrCode() {
    const [activeFeature, setActiveFeature] = useState('titre');
    const [activeUsage, setActiveUsage] = useState('affiche');

    const pourquoiChoisirVisiloo = [
    {
      id: 1,
      title: "La preuve sociale influence les décisions d'achat",
      description: "Les clients font confiance à l'expérience des autres—cela élimine l'incertitude. Lorsque de vraies personnes confirment que votre service est fiable et précieux, les nouveaux clients se sentent confiants de vous choisir.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Les avis améliorent votre classement Google",
      description: "Votre classement dans les recherches locales dépend fortement des avis Google. La quantité, la qualité, la longueur et les mots-clés de ces avis ont un impact direct sur votre visibilité lorsque des clients potentiels effectuent des recherches.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Suivez la performance de vos avis dans le temps",
      description: "Identifiez quelles stratégies génèrent le plus d'avis en comparant vos résultats des 30 derniers jours avec votre performance historique—des données claires montrant ce qui fonctionne réellement.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Les avis établissent la crédibilité de votre entreprise",
      description: "85% des consommateurs font autant confiance aux recommandations en ligne qu'aux conseils d'amis. Vos clients potentiels connaissent la différence entre vos arguments marketing et les retours honnêtes de vrais clients.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 5,
      title: "Les avis Google augmentent directement les ventes",
      description: "Les produits avec des avis sont choisis 270% plus souvent. Encouragez les clients à partager leurs histoires personnelles—pourquoi ils vous ont choisi et quels résultats spécifiques ils ont obtenus—pour maximiser cette augmentation de conversion.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    }
  ];
  // Données pour les caractéristiques (correctement définies)
  const caracteristiquesAffiche = [
    {
      id: 'titre',
      title: 'Titre',
      description: 'Un appel à l\'action convaincant capte instantanément l\'attention du client et clarifie ce que vous demandez.',
      details: 'Placez votre affiche stratégiquement, puis regardez les avis arriver automatiquement—fini de courir après les clients pour obtenir des retours.',
      image: '/placeholder-titre.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'couleur',
      title: 'Couleur',
      description: 'Adaptez parfaitement aux couleurs de votre marque—que ce soit votre vert signature ou un magenta audacieux qui attire l\'œil.',
      details: 'Personnalisez la couleur de fond de votre affiche en quelques secondes avec notre éditeur intuitif pour renforcer l\'identité de votre marque.',
      image: '/placeholder-couleur.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'qr',
      title: 'Code QR',
      description: 'Les clients scannent simplement avec leur téléphone et arrivent directement sur votre page d\'avis Google—pas de recherche, pas de friction, juste un retour rapide.',
      details: 'Votre code QR unique est placé de manière proéminente au centre de votre affiche, impossible à manquer.',
      image: '/placeholder-qr.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'phrases',
      title: 'Phrases importantes',
      description: 'Les avis contenant des mots-clés spécifiques augmentent considérablement votre visibilité dans les recherches locales.',
      details: 'Guidez les clients pour qu\'ils mentionnent vos services clés dans leurs avis, améliorant stratégiquement votre classement pour ces termes de recherche spécifiques.',
      image: '/placeholder-phrases.png',
      colorClass: 'bg-blue-600'
    },
    {
      id: 'emploi',
      title: 'Mode d\'emploi',
      description: 'Éliminez toute incertitude du processus d\'avis.',
      details: 'Chaque affiche inclut des instructions claires en trois étapes qui éliminent la confusion et rendent le dépôt d\'un avis intuitif pour tous—même les moins à l\'aise avec la technologie.',
      image: '/placeholder-emploi.png',
      colorClass: 'bg-blue-600'
    }
  ];

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

   const currentFeature = caracteristiquesAffiche.find(feature => feature.id === activeFeature);
   const currentUsage = utilisationsAffiche.find(usage => usage.id === activeUsage);

  return (
    <div className="bg-gray-900 py-24 sm:py-32 ">
      <div className="mx-auto w-full px-6 lg:px-8">
        <div className="mx-auto w-full lg:text-center">
          <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl lg:text-balance">
            Générateur gratuit d'affiches d'avis Google et de codes QR
          </h2>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="gap-x-8 gap-y-10 lg:gap-y-16">
            <Generator />
          </dl>
        </div>
        
        {/* Section: Pourquoi les avis clients sont importants */}
       <section className="bg-gray-800 w-full py-24 mt-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                {/* En-tête centré */}
                <div className="text-center mb-16">
                <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                    POURQUOI LES AVIS CLIENTS SONT IMPORTANTS
                </h2>
                <p className="text-lg text-gray-300 mt-6 max-w-3xl mx-auto">
                    Laissez vos clients satisfaits devenir vos meilleurs commerciaux
                </p>
                <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
                    Imaginez : vous choisissez entre deux salons de coiffure. L'un a deux avis, l'autre en a plus de 100. 
                    Auquel feriez-vous confiance ? Exactement – les avis influencent les décisions.
                </p>
                </div>

                {/* Statistiques alignées à droite et à gauche */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                {/* Statistique de gauche */}
                <div className="bg-gradient-to-r from-indigo-600/20 to-indigo-800/10 p-8 rounded-2xl border border-indigo-500/30">
                    <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        </div>
                    </div>
                    <div className="ml-6">
                        <div className="text-5xl font-bold text-white">87%</div>
                        <p className="mt-2 text-lg text-gray-300">des clients lisent les avis Google avant d'acheter</p>
                    </div>
                    </div>
                </div>

                {/* Statistique de droite */}
                <div className="bg-gradient-to-r from-green-600/20 to-green-800/10 p-8 rounded-2xl border border-green-500/30">
                    <div className="flex items-center">
                    <div className="flex-shrink-0">
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        </div>
                    </div>
                    <div className="ml-6">
                        <div className="text-5xl font-bold text-white">93%</div>
                        <p className="mt-2 text-lg text-gray-300">des clients recherchent des prestataires de services en ligne</p>
                    </div>
                    </div>
                </div>
                </div>

                
            </div>
        </section>

        
        {/* Nouvelle section: Pourquoi choisir l'Affiche d'Avis Google de Visiloo */}
        <section className="mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Pourquoi choisir l'Affiche d'Avis Google de Visiloo ?
              </h2>
              <p className="text-lg text-gray-300 mt-6 max-w-3xl mx-auto">
                Découvrez comment notre solution transforme les avis clients en avantage compétitif
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pourquoiChoisirVisiloo.map((item) => (
                <div key={item.id} className="bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm border border-gray-700 hover:border-indigo-500/30 transition-all">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                      {item.icon}
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-gray-300 mt-4">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: Caractéristiques de l'Affiche d'Avis Google */}
        <section className="mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">

            {/* Navigation centrale */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex rounded-xl bg-gray-800 p-2">
                {caracteristiquesAffiche.map((feature, index) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeFeature === feature.id
                        ? `${feature.colorClass} text-white shadow-lg`
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    } ${index !== 0 ? 'ml-2' : ''}`}
                  >
                    {feature.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu avec texte à gauche et image à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              {/* Colonne de gauche - Texte */}
              <div>
                {currentFeature && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-4">{currentFeature.title}</h3>
                    <p className="text-gray-300 mb-4">{currentFeature.description}</p>
                    <p className="text-gray-300">{currentFeature.details}</p>
                  </>
                )}
              </div>

              {/* Colonne de droite - Image */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 w-full max-w-md">
                  <div className="aspect-square flex items-center justify-center bg-white/5 rounded-lg">
                    {currentFeature && (
                      <Image
                        src={currentFeature.image}
                        alt={currentFeature.title}
                        className="max-h-64 object-contain"
                        width={44}
                        height={44}
                        
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nouvelle section: Où utiliser votre affiche d'avis Google */}
        <section className="mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                OÙ UTILISER VOTRE AFFICHE D'AVIS GOOGLE
              </h2>
              <p className="text-lg text-gray-300 mt-6 max-w-3xl mx-auto">
                Des solutions flexibles pour chaque type d'entreprise
              </p>
              <p className="text-lg text-gray-300 mt-4 max-w-3xl mx-auto">
                Qu'elle soit affichée sur votre porte, incluse dans votre menu ou expédiée avec des produits, l'Affiche d'Avis Google s'adapte à la façon dont vous interagissez avec vos clients.
              </p>
            </div>

            {/* Navigation centrale */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex flex-wrap justify-center rounded-xl bg-gray-800 p-2 gap-2">
                {utilisationsAffiche.map((usage, index) => (
                  <button
                    key={usage.id}
                    onClick={() => setActiveUsage(usage.id)}
                    className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${
                      activeUsage === usage.id
                        ? `${usage.colorClass} text-white shadow-lg`
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    } ${index !== 0 ? 'ml-2' : ''}`}
                  >
                    {usage.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenu avec texte à gauche et image à droite */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-gray-800/50 p-8 rounded-2xl border border-gray-700">
              {/* Colonne de gauche - Texte */}
              <div>
                {currentUsage && (
                  <>
                    <h3 className="text-2xl font-bold text-white mb-4">{currentUsage.title}</h3>
                    <p className="text-lg text-gray-300 mb-4 font-semibold">{currentUsage.description}</p>
                    <p className="text-gray-300">{currentUsage.details}</p>
                  </>
                )}
              </div>

              {/* Colonne de droite - Placeholder visuel */}
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl p-6 w-full max-w-md">
                  <div className="aspect-square flex items-center justify-center rounded-lg">
                    {currentUsage && (
                      <Image
                        src={currentUsage.image}
                        alt={currentUsage.title}
                        className="max-h-64 object-contain"
                        width={44}
                        height={44}
                        
                      />
                    )}
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

