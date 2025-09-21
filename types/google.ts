// types/google.ts
export interface GoogleEstablishment {
  placeId: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  international_phone_number?: string;
  opening_hours?: {
    open_now: boolean;
    periods?: any[];
    weekday_text?: string[];
  };
  photos?: GooglePhoto[];
  // Nouveaux champs
  website?: string;
  types?: string[];
  editorial_summary?: {
    overview: string;
  };
  business_status?: string;
}

export interface GooglePhoto {
  height: number;
  width: number;
  photo_reference: string;
  html_attributions: string[];
}