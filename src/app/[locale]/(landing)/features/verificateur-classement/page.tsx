"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  CheckCircleIcon,
  MapPinIcon,
  TagIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ArrowTrendingUpIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import KeywordSuggestions from "./KeywordSuggestions";
import CompetitionMap from "../../analysis/CompetitionMap";
import { ChartBarIcon, PlayCircleIcon, TrophyIcon, UsersIcon } from "lucide-react";

// --- Types ---
interface PlaceResult {
  id: string;
  nom: string;
  adresse: string;
  note: number | null;
  nombreAvis: number;
  ouvertMaintenant: boolean | null;
  lienMaps: string;
  photos: { url: string }[];
  position: { lat: number; lng: number };
}

interface Competitor {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  reviews: number;
  position: number;
  website: string | null;
  mapsUrl: string;
  photoUrl: string | null;
  distance: number;
  location: {
    lat: number;
    lng: number;
  };
}

interface HeatmapCluster {
  lat: number;
  lng: number;
  radius: number;
  count: number;
  difficulty: number;
  color: string;
}

interface AnalysisData {
  keyword: string;
  currentBusiness: {
    id: string;
    name: string;
    address: string;
    rating: number | null;
    reviews: number;
    website: string | null;
    mapsUrl: string;
    photoUrl: string | null;
    position: number | string;
    visibility: number;
    difficulty: number;
    location: {
      lat: number;
      lng: number;
    };
  };
  competitors: Competitor[];
  heatmap: HeatmapCluster[];
  progression: {
    visibility: number;
    difficulty: number;
    position: number;
  };
}

// --- Squelette de chargement pour les résultats ---
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

// --- Barre des étapes ---
function StepBar({ step, setStep }: { step: number; setStep: (s: number) => void }) {
  const steps = [
    { id: 1, label: "Localisation" },
    { id: 2, label: "Mots-clés" },
    { id: 3, label: "Carte de position" },
  ];

  return (
    <nav className="max-w-4xl mx-auto mb-8">
      <ol className="flex items-center w-full">
        {steps.map(({ id, label }, index) => {
          const isDone = step > id;
          const isActive = step === id;
          return (
            <li
              key={id}
              className={`flex items-center ${index < steps.length - 1 ? 'w-full' : ''}`}
            >
              <button
                onClick={() => setStep(id)}
                className={`flex flex-col items-center ${isActive || isDone ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold border transition
                  ${isActive ? 'bg-indigo-100 border-indigo-500' : isDone ? 'bg-green-100 border-green-500' : 'bg-gray-100 border-gray-300'}
                `}>
                  {isDone ? (
                    <span className="text-green-600 text-2xl">✓</span>
                  ) : (
                    <span>{id}</span>
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${isActive || isDone ? 'text-indigo-600' : 'text-gray-500'}`}>
                  {label}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-full h-0.5 mx-2 transition-colors ${step > id ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// --- Composant ScrollBar personnalisée ---
function CustomScrollBar({ className }: { className?: string }) {
  return (
    <ScrollBar
      orientation="vertical"
      className={
        "flex touch-none select-none transition-colors " +
        "w-4 p-0.5 " +
        "bg-gray-100 rounded-full " +
        (className || "")
      }
    >
      <div className="flex flex-col items-center w-full">
        <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 mb-1">
          <ChevronUpIcon className="w-3 h-3" />
        </button>

        <div className="relative flex-1 w-2 bg-gray-300 rounded-full mx-auto">
          <div className="absolute top-0 w-full h-8 bg-indigo-500 rounded-full transition-colors hover:bg-indigo-600" />
        </div>

        <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 mt-1">
          <ChevronDownIcon className="w-3 h-3" />
        </button>
      </div>
    </ScrollBar>
  );
}

// --- Composant pour afficher les métriques ---
function MetricCard({
  title,
  value,
  change,
  description,
  icon,
  isDifficulty = false
}: {
  title: string;
  value: string | number;
  change?: number;
  description?: string;
  icon: React.ReactNode;
  isDifficulty?: boolean;
}) {
  const numericValue = typeof value === 'string' && !isNaN(Number(value)) 
    ? Number(value) 
    : typeof value === 'number' 
      ? value 
      : null;
      
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            {icon}
            <span className="ml-2">{title}</span>
          </h3>
          <p className="text-2xl font-bold mt-1">
            {value}
            {change !== undefined && change !== 0 && (
              <span className={`text-sm ml-2 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
            )}
          </p>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        {isDifficulty && numericValue !== null && (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            numericValue > 7
              ? 'bg-red-100 text-red-800'
              : numericValue > 4
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-green-100 text-green-800'
          }`}>
            {numericValue > 7
              ? 'Difficile'
              : numericValue > 4
                ? 'Moyen'
                : 'Facile'}
          </span>
        )}
      </div>
    </div>
  );
}

// --- Composant pour afficher un concurrent ---
function CompetitorCard({ competitor }: { competitor: Competitor }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          {competitor.photoUrl ? (
            <img
              src={competitor.photoUrl}
              alt={competitor.name}
              className="h-16 w-16 object-cover rounded-lg"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/placeholder-business.jpg';
              }}
            />
          ) : (
            <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400 text-center">Pas d'image</span>
            </div>
          )}
          <div>
            <h3 className="font-medium">{competitor.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{competitor.address}</p>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {competitor.distance.toFixed(1)} km
              </span>
              {competitor.rating && (
                <span className="text-sm text-yellow-600">
                  ★ {competitor.rating.toFixed(1)} ({competitor.reviews} avis)
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {competitor.website && (
            <a
              href={competitor.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Site
            </a>
          )}
          <a
            href={competitor.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            Maps
          </a>
        </div>
      </div>
    </div>
  );
}

// --- Légende de la carte ---
function MapLegend() {
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-medium text-gray-900 mb-3">Comment comprendre la carte ?</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Concentration concurrentielle</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Faible (1-10 concurrents)
            </li>
            <li className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              Moyenne (11-20)
            </li>
            <li className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              Forte (20+)
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Niveau de difficulté</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
              Facile (1-4/10)
            </li>
            <li className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
              Moyen (5-7/10)
            </li>
            <li className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
              Difficile (8-10/10)
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Symboles</h4>
          <ul className="space-y-2">
            <li className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-blue-500 mr-2"></span>
              Votre établissement
            </li>
            <li className="flex items-center">
              <span className="inline-block w-4 h-4 rounded-full border border-gray-500 mr-2"></span>
              Concurrents
            </li>
            <li className="flex items-center">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-2" />
              Visibilité en hausse
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// --- Composant d'onboarding ---
function Onboarding() {
  const [step, setStep] = useState(1);
  const [query, setQuery] = useState("");
  const [keywordInput, setKeywordInput] = useState("");
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [scanResult, setScanResult] = useState<AnalysisData | null>(null);

  // Recherche d'établissements
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
    setStep(2); // Passer directement à l'étape des mots-clés
  };

  // Fonction pour analyser un mot-clé
  const analyzeKeyword = async () => {
    if (!selectedPlace || !keywordInput.trim()) return;

    try {
      const res = await fetch(`/api/analysis?keyword=${encodeURIComponent(keywordInput.trim())}&placeId=${selectedPlace.id}`);
      if (!res.ok) throw new Error("Erreur lors de l'analyse");
      const data = await res.json();
      setScanResult(data);
      setStep(3);
    } catch (error) {
      console.error("Erreur lors de l'analyse:", error);
      // Gérer l'erreur ici (afficher un message à l'utilisateur)
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg">
      <StepBar step={step} setStep={setStep} />

      {/* Étape 1 - Localisation */}
      {step === 1 && (
        <div className="p-6">
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
                <div className="border rounded-lg overflow-hidden relative">
                  <ScrollArea className="h-[400px] w-full">
                    <div className="p-4 space-y-3">
                      {results.map((place: PlaceResult) => (
                        <div
                          key={place.id}
                          className="p-4 flex gap-4 border rounded-lg cursor-pointer transition-all hover:shadow-md hover:bg-indigo-50 hover:border-indigo-200"
                          onClick={() => handleSelectPlace(place)}
                        >
                          {place.photos[0] ? (
                            <img
                              src={place.photos[0].url}
                              alt={place.nom}
                              className="w-20 h-16 object-cover rounded-lg flex-shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.jpg';
                              }}
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
                    <CustomScrollBar />
                  </ScrollArea>
                </div>
              ) : results && results.length === 0 && (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
                  <MapPinIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium">Aucun résultat trouvé</p>
                  <p className="text-sm mt-1">Essayez avec un autre nom ou une autre adresse</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Étape 2 - Mots-clés */}
      {step === 2 && (
        <div className="p-6 space-y-6">
          <h2 className="text-xl font-semibold">Ajoutez un mot-clé</h2>
          <p className="text-gray-600">Décrivez vos services pour aider les clients à vous trouver</p>

          {selectedPlace && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <h3 className="font-medium text-indigo-900 mb-2">Établissement sélectionné :</h3>
              <p className="text-indigo-700">{selectedPlace.nom}</p>
              <p className="text-indigo-600 text-sm">{selectedPlace.adresse}</p>
            </div>
          )}

          {/* Section d'information sur les mots-clés efficaces */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-blue-900 mb-2">Comment ajouter des mots-clés efficaces</h4>
                <p className="text-blue-800 text-sm mb-3">
                  Sélectionnez des phrases que les clients potentiels pourraient taper dans Google lorsqu'ils recherchent vos services.
                </p>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-green-700 mb-2">Mots-clés efficaces</h5>
                    <div className="space-y-1">
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Plombier Marseille</div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Restaurant italien</div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">Coiffeur Bordeaux</div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-red-700 mb-2">Évitez ces phrases</h5>
                    <div className="space-y-1">
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Plombier près de chez moi</div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Pizza Mario</div>
                      <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full">Comment faire une coupe de cheveux ?</div>
                    </div>
                  </div>
                </div>

                <p className="text-blue-700 text-xs mt-3">
                  Concentrez-vous sur les termes pertinents pour votre entreprise, mais évitez d'utiliser le nom de votre entreprise.
                  Au lieu de 'près de moi', utilisez le nom de votre ville ou région.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Saisissez un mot-clé (ex: Plombier Paris)"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                onClick={analyzeKeyword}
              >
                Vérifier la position
              </button>
            </div>

            {/* Suggestions de mots-clés par IA */}
            <KeywordSuggestions
              keywordInput={keywordInput}
              selectedPlace={selectedPlace}
              onSuggestionClick={setKeywordInput}
            />
          </div>

          <div className="flex justify-between pt-6 border-t">
            <button
              className="px-6 py-3 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setStep(1)}
            >
              ← Retour
            </button>
          </div>
        </div>
      )}

      {/* Étape 3 - Résultats d'analyse */}
      {step === 3 && scanResult && (
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <button
            className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6"
            onClick={() => setStep(2)}
          >
            <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
            Tester un autre mot-clé
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne gauche - Fiche */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                {scanResult.currentBusiness.photoUrl ? (
                  <img
                    src={scanResult.currentBusiness.photoUrl}
                    alt={scanResult.currentBusiness.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder-business.jpg'; }}
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Aucune image disponible</span>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-gray-900">{scanResult.currentBusiness.name}</h1>
                <div className="flex items-center mt-2">
                  <MapPinIcon className="h-5 w-5 text-gray-500 mr-1" />
                  <p className="text-gray-600">{scanResult.currentBusiness.address}</p>
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  {scanResult.currentBusiness.website && (
                    <a href={scanResult.currentBusiness.website} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm">Site web</a>
                  )}
                  <a href={scanResult.currentBusiness.mapsUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm">Voir sur Maps</a>
                </div>
                {/* Métriques */}
                <div className="mt-6 space-y-2">
                  <MetricCard
                    title="Position actuelle"
                    value={scanResult.currentBusiness.position}
                    description={`Dans les résultats pour "${scanResult.keyword}"`}
                    icon={<MapPinIcon className="h-5 w-5 text-orange-500" />}
                  />
                  <MetricCard
                    title="Visibilité"
                    value={`${scanResult.currentBusiness.visibility}%`}
                    change={scanResult.progression.visibility}
                    description="Votre visibilité dans les recherches"
                    icon={<ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />}
                  />
                  <MetricCard
                    title="Difficulté zone"
                    value={`${scanResult.currentBusiness.difficulty}/10`}
                    change={scanResult.progression.difficulty}
                    description="Niveau de compétition dans votre zone"
                    icon={<InformationCircleIcon className="h-5 w-5 text-red-500" />}
                    isDifficulty
                  />
                </div>
              </div>
            </div>

            {/* Colonne droite - Carte + concurrents */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Carte de positionnement - "{scanResult.keyword}"</h2>
                <div className="h-96 rounded-lg overflow-hidden relative">
                  <CompetitionMap
                    center={scanResult.currentBusiness.location}
                    heatmapData={scanResult.heatmap}
                    currentBusiness={scanResult.currentBusiness}
                  />
                </div>
                <MapLegend />
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Principaux concurrents ({scanResult.competitors.length})</h2>
                <div className="space-y-4">
                  {scanResult.competitors.length > 0 ? (
                    scanResult.competitors.map((competitor) => (
                      <CompetitorCard key={competitor.id} competitor={competitor} />
                    ))
                  ) : (
                    <p className="text-gray-500">Aucun concurrent trouvé pour ce mot-clé dans votre zone</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

        <div className="mx-auto max-w-6xl py-32 sm:py-48 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
              Découvrez exactement où se positionne votre entreprise avec notre Local Rank Checker gratuit
            </h1>
          </div>

          {/* Intégration directe de l'onboarding */}
          <div className="mt-8">
            <Onboarding />
          </div>

          {/* Section de statistiques */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 px-4 rounded-xl my-16">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Les entreprises utilisant Visiloo généralement</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <UsersIcon className="h-10 w-10 text-white" />
                    <span className="text-4xl font-bold ml-2">+1300</span>
                  </div>
                  <p className="text-lg font-medium">clients en 3 mois</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <TrophyIcon className="h-10 w-10 text-white" />
                    <span className="text-4xl font-bold ml-2">+23</span>
                  </div>
                  <p className="text-lg font-medium">concurrents dépassés</p>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <ChartBarIcon className="h-10 w-10 text-white" />
                    <span className="text-4xl font-bold ml-2">57%</span>
                  </div>
                  <p className="text-lg font-medium">croissance en visibilité</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call-to-Action Section - En dessous des statistiques */}
          <div className="text-center mt-16 space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signin" 
                className="inline-flex items-center justify-center bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Essayez gratuitement pendant 7 jours
              </Link>
              <Link 
                href="/video" 
                className="inline-flex items-center justify-center bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors border border-gray-600"
              >
                Voir comment ça marche
              </Link>
            </div>
          </div>

          {/* Nouvelle section outils gratuits - Deux colonnes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start my-24">
            {/* Colonne de gauche */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Plus d'outils gratuits pour booster votre visibilité locale !
              </h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-300">
                  Au-delà de la vérification de positions, Visiloo vous offre des outils puissants pour une domination complète de la recherche locale : protection du Profil d'entreprise, surveillance de visibilité et génération d'avis – le tout conçu pour aider les petites entreprises à rivaliser avec des concurrents plus importants.
                </p>
                <Link 
                  href="/signin" 
                  className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                >
                  Commencer gratuitement
                </Link>
              </div>
            </div>

            {/* Colonne de droite */}
            <div className="space-y-8">
              {/* Outil 1 */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Vérificateur de classement local</h3>
                <p className="text-gray-300 mb-4">
                  Vérifiez la visibilité d'une entreprise et son positionnement pour des mots-clés spécifiques sur Google. Consultez les mêmes données pour vos concurrents afin de garder une longueur d'avance dans les résultats de recherche locale.
                </p>
                <Link 
                  href="/features/verificateur-classement" 
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Voir le classement actuel
                </Link>
              </div>

              {/* Outil 2 */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Générateur d'avis QR</h3>
                <p className="text-gray-300 mb-4">
                  Générez plus d'avis positifs sur Google grâce à notre affiche QR personnalisable. Placez-la dans votre entreprise où les clients peuvent scanner et laisser un commentaire en quelques secondes – aucune expertise technique requise.
                </p>
                <Link 
                  href="/features/generateur-avis-google-qr-code" 
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  En savoir plus
                </Link>
              </div>

              {/* Outil 3 */}
              <div className="bg-gray-800 rounded-2xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Générateur de Schema</h3>
                <p className="text-gray-300 mb-4">
                  Améliorez votre visibilité dans la recherche locale avec notre générateur de schema LocalBusiness GRATUIT. Créez des données structurées correctement formatées qui aident Google à mieux comprendre votre entreprise. Copiez simplement, collez dans votre site web, et améliorez votre potentiel de classement local – aucune connaissance en programmation nécessaire.
                </p>
                <Link 
                  href="/features/schema-generator" 
                  className="inline-flex items-center text-indigo-400 hover:text-indigo-300 font-medium"
                >
                  Générer maintenant !
                </Link>
              </div>
            </div>
          </div>

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
        </div>
      </div>

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
  );
}