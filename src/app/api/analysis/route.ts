import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';

// Configuration
const CACHE_TTL = 3600; // 1 heure
const MAX_COMPETITORS = 50;
const RADIUS_METERS = 5000; // 5km

// Types
interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  user_ratings_total?: number;
  website?: string;
  url?: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  photos?: {
    photo_reference: string;
  }[];
  opening_hours?: {
    open_now: boolean;
  };
}

interface CompetitorAnalysis {
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

interface AnalysisResponse {
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
  competitors: CompetitorAnalysis[];
  heatmap: HeatmapCluster[];
  progression: {
    visibility: number;
    difficulty: number;
    position: number;
  };
}

// Fonction pour récupérer les détails d'un lieu
async function fetchPlaceDetails(placeId: string): Promise<PlaceDetails> {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,rating,user_ratings_total,website,url,geometry,photos,opening_hours&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.result;
}

// Fonction pour rechercher des concurrents
async function fetchCompetitors(keyword: string, location: { lat: number; lng: number }) {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword)}&location=${location.lat},${location.lng}&radius=${RADIUS_METERS}&key=${process.env.GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  return data.results || [];
}

// Fonction pour calculer la distance entre deux points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Clusterisation des concurrents
function clusterizeCompetitors(competitors: CompetitorAnalysis[], center: { lat: number; lng: number }): HeatmapCluster[] {
  const clusters: HeatmapCluster[] = [];
  const processedIds = new Set<string>();

  competitors.forEach(competitor => {
    if (processedIds.has(competitor.id)) return;

    // Trouver tous les concurrents dans un rayon de 500m
    const nearby = competitors.filter(c => 
      !processedIds.has(c.id) && 
      calculateDistance(competitor.location.lat, competitor.location.lng, c.location.lat, c.location.lng) < 0.5
    );

    // Calculer le centre du cluster
    const avgLat = nearby.reduce((sum, c) => sum + c.location.lat, 0) / nearby.length;
    const avgLng = nearby.reduce((sum, c) => sum + c.location.lng, 0) / nearby.length;

    // Calculer la difficulté du cluster
    const avgRating = nearby.reduce((sum, c) => sum + (c.rating || 0), 0) / nearby.length;
    const difficulty = Math.min(10, Math.ceil(avgRating * 1.5 + nearby.length / 5));

    clusters.push({
      lat: avgLat,
      lng: avgLng,
      radius: 0.5 + (nearby.length / 10), // Rayon en km
      count: nearby.length,
      difficulty,
      color: getClusterColor(nearby.length, difficulty)
    });

    nearby.forEach(c => processedIds.add(c.id));
  });

  return clusters;
}

function getClusterColor(count: number, difficulty: number): string {
  if (difficulty > 7) return '#ff0000'; // Rouge pour haute difficulté
  if (count > 10) return '#ff9900';    // Orange pour forte concentration
  return '#00cc00';                   // Vert pour conditions favorables
}

// Calcul des métriques
function calculateVisibility(business: PlaceDetails, position: number): number {
  const ratingScore = (business.rating || 0) * 15;
  const reviewsScore = Math.min(business.user_ratings_total || 0, 500) / 5;
  const positionScore = (1 / position) * 30;
  return Math.min(100, Math.floor(ratingScore + reviewsScore + positionScore));
}

function calculateAreaDifficulty(competitors: CompetitorAnalysis[]): number {
  if (competitors.length === 0) return 1;
  
  const avgRating = competitors.reduce((sum, c) => sum + (c.rating || 0), 0) / competitors.length;
  const avgReviews = competitors.reduce((sum, c) => sum + c.reviews, 0) / competitors.length;
  
  return Math.min(10, Math.ceil(
    (avgRating * 0.6) + 
    (Math.min(avgReviews, 500) / 50 * 0.3) +
    (competitors.length / 10 * 0.1)
  ));
}

// Cache des requêtes
const cachedFetchPlaceDetails = unstable_cache(
  fetchPlaceDetails,
  ['place-details'],
  { revalidate: CACHE_TTL }
);

const cachedFetchCompetitors = unstable_cache(
  fetchCompetitors,
  ['place-search'],
  { revalidate: CACHE_TTL }
);

// Route principale
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');
  const placeId = searchParams.get('placeId');

  if (!keyword || !placeId) {
    return NextResponse.json(
      { error: 'Les paramètres keyword et placeId sont requis' },
      { status: 400 }
    );
  }

  try {
    // 1. Récupérer les données de l'entreprise principale
    const currentBusiness = await cachedFetchPlaceDetails(placeId);
    if (!currentBusiness) {
      return NextResponse.json(
        { error: 'Établissement non trouvé' },
        { status: 404 }
      );
    }

    // 2. Récupérer les concurrents
    const competitorsData = await cachedFetchCompetitors(
      keyword, 
      currentBusiness.geometry.location
    );

    // 3. Traiter les concurrents
    const competitors = await Promise.all(
      competitorsData
        .filter((place: any) => place.place_id !== placeId)
        .slice(0, MAX_COMPETITORS)
        .map(async (place: any) => {
          const details = await cachedFetchPlaceDetails(place.place_id);
          return {
            id: place.place_id,
            name: place.name,
            address: place.formatted_address,
            rating: place.rating || null,
            reviews: place.user_ratings_total || 0,
            position: competitorsData.findIndex((p: any) => p.place_id === place.place_id) + 1,
            website: details?.website || null,
            mapsUrl: details?.url || `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            photoUrl: details?.photos?.[0] 
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${details.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
              : null,
            distance: calculateDistance(
              currentBusiness.geometry.location.lat,
              currentBusiness.geometry.location.lng,
              place.geometry.location.lat,
              place.geometry.location.lng
            ),
            location: place.geometry.location
          };
        })
    );

    // 4. Calculer la position actuelle
    const position = competitorsData.findIndex((p: any) => p.place_id === placeId) + 1;

    // 5. Générer la heatmap
    const heatmap = clusterizeCompetitors(
      competitors, 
      currentBusiness.geometry.location
    );

    // 6. Préparer la réponse
    const response: AnalysisResponse = {
      keyword,
      currentBusiness: {
        id: placeId,
        name: currentBusiness.name,
        address: currentBusiness.formatted_address,
        rating: currentBusiness.rating || null,
        reviews: currentBusiness.user_ratings_total || 0,
        website: currentBusiness.website || null,
        mapsUrl: currentBusiness.url || `https://www.google.com/maps/place/?q=place_id:${placeId}`,
        photoUrl: currentBusiness.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${currentBusiness.photos[0].photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          : null,
        position: position > 0 ? position : 'Non classé',
        visibility: calculateVisibility(currentBusiness, position || MAX_COMPETITORS),
        difficulty: calculateAreaDifficulty(competitors),
        location: currentBusiness.geometry.location
      },
      competitors,
      heatmap,
      progression: {
        visibility: Math.floor(Math.random() * 20) - 10, // Simulation - à remplacer par des données réelles
        difficulty: Math.floor(Math.random() * 5) - 2,   // Simulation - à remplacer par des données réelles
        position: Math.floor(Math.random() * 10) - 5     // Simulation - à remplacer par des données réelles
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Erreur API analysis:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de l\'analyse' },
      { status: 500 }
    );
  }
}