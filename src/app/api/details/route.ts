// app/api/details/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('place_id');

    if (!placeId) {
      return NextResponse.json(
        { error: 'Le paramètre "place_id" est requis' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      );
    }

    // Tous les champs nécessaires pour un LocalBusiness complet
    const fields = [
      'name',
      'formatted_address',
      'geometry',
      'place_id',
      'url',
      'formatted_phone_number',
      'international_phone_number',
      'website',
      'opening_hours',
      'rating',
      'user_ratings_total',
      'photos',
      'address_components',
      'types',
      'business_status',
      'price_level',
      'reviews',
      'plus_code',
      'vicinity',
      'permanently_closed'
    ].join(',');

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}&language=fr&fields=${fields}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Erreur Google Details:', data.status, data.error_message);
      return NextResponse.json(
        {
          error: 'Erreur lors de la récupération des détails',
          details: data.error_message || data.status,
        },
        { status: 502 }
      );
    }

    const result = data.result;
    const components = result.address_components || [];
    
    // Extraction des composants d'adresse
    const countryComp = components.find((c: any) => c.types.includes('country'));
    const postalCodeComp = components.find((c: any) => c.types.includes('postal_code'));
    const localityComp = components.find((c: any) => c.types.includes('locality'));
    const routeComp = components.find((c: any) => c.types.includes('route'));
    const streetNumberComp = components.find((c: any) => c.types.includes('street_number'));

    // Traitement des horaires
    const horaires = result.opening_hours?.weekday_text || [];
    const periods = result.opening_hours?.periods || [];

    // Traitement des avis
    const reviews = result.reviews?.slice(0, 5).map((review: any) => ({
      auteur: review.author_name,
      note: review.rating,
      texte: review.text,
      temps: review.relative_time_description,
      langue: review.language,
      photo: review.profile_photo_url
    })) || [];

    const formattedResult = {
      // Informations de base
      id: result.place_id,
      nom: result.name,
      adresse: result.formatted_address,
      
      // Géolocalisation
      latitude: result.geometry?.location?.lat,
      longitude: result.geometry?.location?.lng,
      viewport: result.geometry?.viewport
        ? {
            nordEst: {
              lat: result.geometry.viewport.northeast.lat,
              lng: result.geometry.viewport.northeast.lng
            },
            sudOuest: {
              lat: result.geometry.viewport.southwest.lat,
              lng: result.geometry.viewport.southwest.lng
            }
          }
        : null,
      
      // Contact
      telephone: result.formatted_phone_number || result.international_phone_number || null,
      siteWeb: result.website || null,
      lienMaps: result.url,
      
      // Évaluation
      note: result.rating ?? null,
      nombreAvis: result.user_ratings_total ?? 0,
      niveauPrix: result.price_level ?? null,
      
      // Horaires
      horaires,
      periods,
      ouvertMaintenant: result.opening_hours?.open_now ?? null,
      
      // Types et catégories
      types: result.types || [],
      statutBusiness: result.business_status || null,
      fermeDefinitivement: result.permanently_closed || false,
      
      // Photos
      photos: result.photos?.map((photo: any, index: number) => ({
        id: `photo_${index}`,
        reference: photo.photo_reference,
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${apiKey}`,
        previewUrl: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`,
        width: photo.width,
        height: photo.height,
        htmlAttributions: photo.html_attributions || []
      })) || [],
      
      // Adresse détaillée
      adresseDetails: {
        rue: routeComp?.long_name || null,
        numero: streetNumberComp?.long_name || null,
        ville: localityComp?.long_name || null,
        codePostal: postalCodeComp?.long_name || null,
        pays: countryComp?.long_name || null,
        codePays: countryComp?.short_name || null
      },
      
      // Avis
      avis: reviews,
      totalAvis: result.user_ratings_total || 0,
      
      // Autres
      vicinity: result.vicinity || null,
      plusCode: result.plus_code?.global_code || null,
      
      // Métadonnées
      langue: 'fr',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(formattedResult);

  } catch (error) {
    console.error('Erreur dans /api/details:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
