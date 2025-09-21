// utils/photoUtils.ts

import { prisma } from "./prismadb";


export function getEstablishmentImageUrl(est: any): string {
  const defaultImage = '/default-logo.png';
  
  if (!est) return defaultImage;
  
  // Vérification sécurisée des photos
  if (est.photos && typeof est.photos === 'object') {
    try {
      // Pour Prisma JSON, on doit parfois parser
      const photos = typeof est.photos === 'string' 
        ? JSON.parse(est.photos) 
        : est.photos;
      
      if (Array.isArray(photos) && photos.length > 0) {
        const firstPhoto = photos[0];
        if (firstPhoto && firstPhoto.photo_reference) {
          return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${firstPhoto.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        }
      }
    } catch (error) {
      console.error('Error parsing photos:', error);
    }
  }
  
  return defaultImage;
}

export async function syncEstablishmentPhotos(est: any) {
  if (!est.placeId) return null;
  
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${est.placeId}&fields=name,photos,formatted_address,geometry,rating,user_ratings_total,opening_hours&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.result && data.result.photos) {
      // Mettre à jour l'établissement avec les nouvelles données
      const updateData: any = {
        photos: data.result.photos,
        lastSyncedAt: new Date()
      };
      
      // Mettre à jour d'autres champs si nécessaire
      if (data.result.rating) updateData.rating = data.result.rating;
      if (data.result.user_ratings_total) updateData.reviews = data.result.user_ratings_total;
      if (data.result.opening_hours) {
        updateData.openingHours = data.result.opening_hours;
        updateData.isOpen = data.result.opening_hours.open_now || false;
      }
      
      const updatedEst = await prisma.establishment.update({
        where: { id: est.id },
        data: updateData
      });
      
      return updatedEst;
    }
  } catch (error) {
    console.error('Error syncing establishment photos:', error);
  }
  
  return null;
}