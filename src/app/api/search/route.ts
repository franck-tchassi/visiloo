// app/api/search/route.ts
import { NextResponse } from 'next/server';

// Fonction pour parser l'adresse
function parseAddress(formattedAddress: string) {
  if (!formattedAddress) return { city: '', postalCode: '', country: '' };
  
  const parts = formattedAddress.split(',');
  if (parts.length < 2) return { city: '', postalCode: '', country: '' };

  const country = parts[parts.length - 1].trim();
  const cityPart = parts[parts.length - 2].trim();
  const postalCodeMatch = cityPart.match(/\d{5}/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
  const city = cityPart.replace(postalCode, '').trim();
  
  return { city, postalCode, country };
}

// Fonction pour formater les horaires d'ouverture
function formatOpeningHours(periods: any[], weekdayText: string[]): { horaires: string[], prochaineOuverture?: string, prochaineFermeture?: string } {
  const now = new Date();
  const currentDay = now.getDay(); // 0 = dimanche, 1 = lundi, etc.
  const currentTime = now.getHours() * 100 + now.getMinutes();
  
  let prochaineOuverture: string | undefined;
  let prochaineFermeture: string | undefined;

  // Si on a les textes formatés (plus simple)
  if (weekdayText && weekdayText.length > 0) {
    const horaires = weekdayText;
    
    // Trouver l'horaire d'aujourd'hui
    const todaySchedule = weekdayText[currentDay === 0 ? 6 : currentDay - 1];
    const todayMatch = todaySchedule.match(/(\d{1,2}:\d{2}).*?–.*?(\d{1,2}:\d{2})/);
    
    if (todayMatch) {
      const openTime = parseInt(todayMatch[1].replace(':', ''));
      const closeTime = parseInt(todayMatch[2].replace(':', ''));
      
      if (currentTime >= openTime && currentTime < closeTime) {
        prochaineFermeture = todayMatch[2];
      } else if (currentTime < openTime) {
        prochaineOuverture = todayMatch[1];
      }
    }
    
    return { horaires, prochaineOuverture, prochaineFermeture };
  }

  // Fallback: formater les périodes
  const horaires: string[] = [];
  const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  periods?.forEach((period, index) => {
    if (period.open && period.close) {
      const openTime = period.open.time.slice(0, 2) + ':' + period.open.time.slice(2);
      const closeTime = period.close.time.slice(0, 2) + ':' + period.close.time.slice(2);
      horaires.push(`${jours[index]}: ${openTime} - ${closeTime}`);
    }
  });

  return { horaires, prochaineOuverture, prochaineFermeture };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const limit = searchParams.get('limit');
    const pageToken = searchParams.get('pageToken');
    const minRating = searchParams.get('minRating');

    if (!query) {
      return NextResponse.json(
        { error: 'Le paramètre "query" est requis' },
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

    // Recherche textuelle
    let searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}&language=fr`;
    
    if (minRating) {
      searchUrl += `&minrating=${minRating}`;
    }
    
    if (pageToken) {
      searchUrl += `&pagetoken=${pageToken}`;
    }
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.status !== 'OK' && searchData.status !== 'ZERO_RESULTS') {
      console.error('Erreur Google Places:', searchData.status, searchData.error_message);
      return NextResponse.json(
        {
          error: 'Erreur lors de la recherche',
          details: searchData.error_message || searchData.status
        },
        { status: 502 }
      );
    }

    const resultsToProcess = limit ? searchData.results.slice(0, parseInt(limit)) : searchData.results;

    const formattedResults = await Promise.all(
      resultsToProcess.map(async (place: any) => {
        try {
          // Appel à l'API Details pour obtenir les horaires
          const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=name,formatted_address,geometry,rating,user_ratings_total,opening_hours,photos,website,international_phone_number,types,editorialSummary,business_status&key=${apiKey}&language=fr`;
          const detailsResponse = await fetch(detailsUrl);
          const detailsData = await detailsResponse.json();

          const placeDetails = detailsData.result || {};
          const { city, postalCode, country } = parseAddress(placeDetails.formatted_address || place.formatted_address);

          // Traitement des horaires
          let horairesOuverture: string[] = [];
          let prochaineOuverture: string | undefined;
          let prochaineFermeture: string | undefined;

          if (placeDetails.opening_hours) {
            const { horaires, prochaineOuverture: ouverture, prochaineFermeture: fermeture } = formatOpeningHours(
              placeDetails.opening_hours.periods,
              placeDetails.opening_hours.weekday_text
            );
            horairesOuverture = horaires;
            prochaineOuverture = ouverture;
            prochaineFermeture = fermeture;
          }

          return {
            id: place.place_id,
            nom: placeDetails.name || place.name,
            adresse: placeDetails.formatted_address || place.formatted_address,
            description: placeDetails.editorialSummary?.overview || undefined,
            categories: placeDetails.types || [],
            website: placeDetails.website || undefined,
            businessStatus: placeDetails.business_status || 'OPERATIONAL',
            ville: city,
            codePostal: postalCode,
            pays: country,
            position: {
              lat: place.geometry?.location?.lat || 0,
              lng: place.geometry?.location?.lng || 0
            },
            note: placeDetails.rating ?? place.rating ?? null,
            nombreAvis: placeDetails.user_ratings_total ?? place.user_ratings_total ?? 0,
            ouvertMaintenant: placeDetails.opening_hours?.open_now ?? place.opening_hours?.open_now ?? null,
            horairesOuverture,
            prochaineOuverture,
            prochaineFermeture,
            telephone: placeDetails.international_phone_number || undefined,
            siteWeb: placeDetails.website || undefined,
            types: placeDetails.types || place.types || [],
            photos: placeDetails.photos?.map((photo: any) => ({
              reference: photo.photo_reference,
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
            })) || place.photos?.map((photo: any) => ({
              reference: photo.photo_reference,
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
            })) || [],
            lienMaps: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          };
        } catch (error) {
          console.error(`Erreur détails pour ${place.place_id}:`, error);
          const { city, postalCode, country } = parseAddress(place.formatted_address);
          
          return {
           
             placeId: place.place_id,
            nom: place.name,
            adresse: place.formatted_address,
            ville: city,
            codePostal: postalCode,
            pays: country,
            position: {
              lat: place.geometry?.location?.lat || 0,
              lng: place.geometry?.location?.lng || 0
            },
            note: place.rating ?? null,
            nombreAvis: place.user_ratings_total ?? 0,
            ouvertMaintenant: place.opening_hours?.open_now ?? null,
            types: place.types || [],
            photos: place.photos?.map((photo: any) => ({
              reference: photo.photo_reference,
              url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${apiKey}`
            })) || [],
            lienMaps: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`
          };
        }
      })
    );

    return NextResponse.json({
      results: formattedResults,
      nextPageToken: searchData.next_page_token || null,
    });

  } catch (error) {
    console.error('Erreur dans /api/search:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}