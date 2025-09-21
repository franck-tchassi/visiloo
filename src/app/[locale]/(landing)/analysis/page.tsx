'use client';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import dynamic from 'next/dynamic';
import { InformationCircleIcon, MapPinIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Chargement dynamique de la carte
const MapWithNoSSR = dynamic(() => import('./CompetitionMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
});

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

export default function AnalysisPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('keyword');
  const placeId = searchParams.get('placeId');

  const { data, isLoading, error } = useQuery<AnalysisData>({
    queryKey: ['keywordAnalysis', keyword, placeId],
    queryFn: async () => {
      const res = await fetch(`/api/analysis?keyword=${encodeURIComponent(keyword!)}&placeId=${placeId}`);
      if (!res.ok) throw new Error('Erreur lors de la récupération des données');
      return res.json();
    },
    enabled: !!keyword && !!placeId
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          Erreur : {(error as Error).message}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-lg">
          Aucune donnée disponible
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <Link href="/onboarding" className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6">
        <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
        Retour à l'onboarding
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche - Fiche entreprise */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="relative group">
              {data.currentBusiness.photoUrl ? (
                <img
                  src={data.currentBusiness.photoUrl}
                  alt={data.currentBusiness.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/placeholder-business.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-400">Aucune image disponible</span>
                </div>
              )}

              <h1 className="text-2xl font-bold text-gray-900">{data.currentBusiness.name}</h1>
              <div className="flex items-start mt-2">
                <MapPinIcon className="h-5 w-5 text-gray-500 mt-0.5 mr-1 flex-shrink-0" />
                <p className="text-gray-600">{data.currentBusiness.address}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {data.currentBusiness.website && (
                  <a
                    href={data.currentBusiness.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm flex items-center"
                  >
                    Site web
                  </a>
                )}
                <a
                  href={data.currentBusiness.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 text-sm flex items-center"
                >
                  Voir sur Maps
                </a>
              </div>

              {/* Tooltip de progression */}
              <div className="absolute hidden group-hover:block bottom-0 left-0 right-0 bg-white p-4 shadow-xl rounded-lg border z-10">
                <h3 className="font-medium text-gray-900 mb-2">Évolution récente</h3>
                <div className="space-y-3">
                  <ProgressIndicator
                    label="Visibilité"
                    value={data.currentBusiness.visibility}
                    change={data.progression.visibility}
                    max={100}
                  />
                  <ProgressIndicator
                    label="Difficulté"
                    value={data.currentBusiness.difficulty}
                    change={data.progression.difficulty}
                    max={10}
                    isDifficulty
                  />
                  <div className="text-sm text-gray-500">
                    <span>Position: </span>
                    {typeof data.currentBusiness.position === 'number' ? (
                      <span className="font-medium">
                        {data.currentBusiness.position}
                        {data.progression.position !== 0 && (
                          <span className={`ml-1 ${data.progression.position < 0 ? 'text-green-500' : 'text-red-500'}`}>
                            ({data.progression.position > 0 ? '+' : ''}{data.progression.position})
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="font-medium">{data.currentBusiness.position}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cartes de métriques */}
          <div className="space-y-4">
            <MetricCard
              title="Position actuelle"
              value={data.currentBusiness.position}
              description={`Dans les résultats pour "${data.keyword}"`}
              icon={<MapPinIcon className="h-5 w-5 text-orange-500" />}
            />

            <MetricCard
              title="Visibilité"
              value={`${data.currentBusiness.visibility}%`}
              change={data.progression.visibility}
              description="Votre visibilité dans les recherches"
              icon={<ArrowTrendingUpIcon className="h-5 w-5 text-blue-500" />}
            />

            <MetricCard
              title="Difficulté zone"
              value={`${data.currentBusiness.difficulty}/10`}
              change={data.progression.difficulty}
              description="Niveau de compétition dans votre zone"
              icon={<InformationCircleIcon className="h-5 w-5 text-red-500" />}
              isDifficulty
            />
          </div>
        </div>

        {/* Colonne droite - Carte et concurrents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte de positionnement */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Carte de positionnement - "{data.keyword}"
            </h2>
            <div className="h-96 rounded-lg overflow-hidden relative">
              <MapWithNoSSR 
                center={data.currentBusiness.location} 
                heatmapData={data.heatmap}
                currentBusiness={data.currentBusiness}
              />
            </div>
            <MapLegend />
          </div>

          {/* Liste des concurrents */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Principaux concurrents ({data.competitors.length})
            </h2>
            <div className="space-y-4">
              {data.competitors.length > 0 ? (
                data.competitors.map((competitor) => (
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
  );
}

function ProgressIndicator({
  label,
  value,
  change,
  max,
  isDifficulty = false
}: {
  label: string;
  value: number;
  change: number;
  max: number;
  isDifficulty?: boolean;
}) {
  const percentage = (value / max) * 100;
  const progressColor = isDifficulty
    ? percentage > 70 
      ? 'bg-red-500' 
      : percentage > 40 
        ? 'bg-yellow-500' 
        : 'bg-green-500'
    : percentage > 70 
      ? 'bg-green-500' 
      : percentage > 40 
        ? 'bg-yellow-500' 
        : 'bg-red-500';

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium">
          {isDifficulty ? `${value}/10` : `${value}%`}
          {change !== 0 && (
            <span className={`ml-1 ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
              ({change > 0 ? '+' : ''}{change}%)
            </span>
          )}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${progressColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

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
  // Convertir la valeur en nombre si c'est une string numérique
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