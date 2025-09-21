// types/place.d.ts
export interface PlaceSearchResult {
  id: string;
  nom: string;
  adresse: string;
  position: {
    lat: number;
    lng: number;
  };
  note: number | null;
  nombreAvis: number;
  ouvertMaintenant: boolean | null;
  photos: {
    reference: string;
    url: string;
  }[];
  lienMaps: string;
  pays;
  langue;
}

export interface KeywordAnalysis {
  keyword: string;
  position: number;
  visibility: number; // en %
  difficulty: number; // 1-10
  competitors: {
    name: string;
    address: string;
    rating: number;
    position: number;
  }[];
}