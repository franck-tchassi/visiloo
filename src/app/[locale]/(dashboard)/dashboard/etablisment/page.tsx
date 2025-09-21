'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, MapPin, Building, Filter, Clock, X, Phone, Star, StarHalf } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import InteractiveMap from './InteractiveMap';
import { toast } from "sonner"
import { GoogleEstablishment } from '../../../../../../types/google';


interface Establishment {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  googleMapsUrl: string;
  isOpen: boolean;
  nextOpeningTime?: string;
  nextClosingTime?: string;
  rating: number;
  reviews: number;
  phone: string;
  description?: string;
  position: {
    lat: number;
    lng: number;
  };
}




interface SearchFilters {
  isOpenNow: boolean;
  minRating: number;
  showItinerary: boolean;
  hasPhone: boolean;
}

// Fonction pour parser l'adresse
const parseAddress = (formattedAddress: string) => {
  const parts = formattedAddress.split(',');
  if (parts.length < 2) return { city: '', postalCode: '', country: '' };

  const country = parts[parts.length - 1].trim();
  const cityPart = parts[parts.length - 2].trim();
  const postalCodeMatch = cityPart.match(/\d{5}/);
  const postalCode = postalCodeMatch ? postalCodeMatch[0] : '';
  const city = cityPart.replace(postalCode, '').trim();
  
  return { city, postalCode, country };
};

// Composant pour afficher les étoiles de notation
const StarRating = ({ rating }: { rating: number }) => {
  // Si la note est 0, afficher "Non noté"
  if (rating === 0) {
    return (
      <div className="flex items-center">
        <span className="text-sm text-gray-500">Non noté</span>
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center">
      {/* Étoiles pleines */}
      {Array.from({ length: fullStars }, (_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      ))}
      
      {/* Demi-étoile */}
      {hasHalfStar && (
        <StarHalf className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      )}
      
      {/* Étoiles vides */}
      {Array.from({ length: emptyStars }, (_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400 opacity-30" />
      ))}
      
      {/* Note numérique */}
      <span className="ml-1 text-sm text-yellow-600 font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

// Fonction pour récupérer les établissements
const searchEstablishments = async (query: string, filters: SearchFilters): Promise<Establishment[]> => {
  if (query.length < 2) return [];

  let apiUrl = `/api/search?query=${encodeURIComponent(query)}&limit=20`;
  
  if (filters.minRating > 0) {
    apiUrl += `&minRating=${filters.minRating}`;
  }

  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error('Erreur lors de la recherche');

  const data = await response.json();

  // DEBUG: Afficher les données brutes de l'API
  console.log('Données API:', data.results);

  const establishments: Establishment[] = data.results.map((place: any) => {
  const { city, postalCode, country } = parseAddress(place.adresse);

  // placeId = id du lieu Google, id MongoDB si en base
  return {
    id: place.id, // id = placeId Google, ou MongoDB
    placeId: place.placeId || place.id, // Ajouté ! (Google = placeId, Mongo = id)
    name: place.nom,
    address: place.adresse,
    city: city,
    postalCode: postalCode,
    country: country,
    googleMapsUrl: place.lienMaps,
    isOpen: place.ouvertMaintenant ?? false,
    nextOpeningTime: place.prochaineOuverture,
    nextClosingTime: place.prochaineFermeture,
    rating: place.note ?? 0,
    reviews: place.nombreAvis ?? 0,
    phone: place.telephone || "",
    description: place.description || "",
    position: place.position || { lat: 0, lng: 0 }
  };
});

  return establishments.filter(est => {
    if (filters.isOpenNow && !est.isOpen) return false;
    if (filters.hasPhone && !est.phone) return false;
    return true;
  });
};

const EtablissementSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  

  const [filters, setFilters] = useState<SearchFilters>({
    isOpenNow: false,
    minRating: 0,
    showItinerary: false,
    hasPhone: false
  });

  const { data: searchResults, isLoading: isSearching, error } = useQuery({
    queryKey: ['establishments', searchQuery, filters],
    queryFn: () => searchEstablishments(searchQuery, filters),
    enabled: searchQuery.length >= 2,
    staleTime: 5 * 60 * 1000,
  });

  const toggleFilters = () => setShowFilters(!showFilters);
  const updateFilter = (key: keyof SearchFilters, value: any) => setFilters(prev => ({ ...prev, [key]: value }));


  type AnyEstablishment = GoogleEstablishment;

  const handleSelectEstablishment = async (est: any) => {
  let body: any;
  // Cas Google (placeId ou id non-MongoDB)
  if (est.placeId || (est.id && est.id.length > 20)) {
    body = {
      placeId: est.placeId || est.id,
      name: est.name,
      formatted_address: est.address,
      geometry: { location: est.position },
      rating: est.rating,
      user_ratings_total: est.reviews,
      international_phone_number: est.phone,
      opening_hours: est.openingHours ? est.openingHours : undefined
    };
  }
  // Cas en base (id MongoDB validé)
  else if (est.id && /^[a-fA-F0-9]{24}$/.test(est.id)) {
    body = { establishmentId: est.id };
  } else {
    // Si rien de tout ça : erreur
    alert("Impossible de sélectionner cet établissement (ID inconnu)");
    return;
  }
  try {
    const response = await fetch('/api/user/current-establishment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Erreur lors de la sélection de l’établissement');
    }
    window.location.href = '/dashboard';
  } catch (error: any) {
    alert(error.message || "Impossible de sélectionner cet établissement");
  }
};


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Rechercher votre établissement</h1>
          <p className="text-gray-600">Trouvez et sélectionnez votre établissement pour gérer sa présence en ligne</p>
        </div>

        {/* Barre de recherche */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, adresse ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-blue-500"
              />
            </div>

            <Button variant="outline" onClick={toggleFilters} className="py-6 px-4">
              <Filter className="h-5 w-5 mr-2" />
              Filtres
            </Button>
          </div>

          {showFilters && (
            <Card className="p-4 mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Filtres de recherche</h3>
                  <Button variant="ghost" size="sm" onClick={toggleFilters}><X className="h-4 w-4" /></Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="open-now" checked={filters.isOpenNow} onCheckedChange={checked => updateFilter('isOpenNow', checked)} />
                    <Label htmlFor="open-now" className="flex items-center"><Clock className="h-4 w-4 mr-2" />Ouvert actuellement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="has-phone" checked={filters.hasPhone} onCheckedChange={checked => updateFilter('hasPhone', checked)} />
                    <Label htmlFor="has-phone" className="flex items-center"><Phone className="h-4 w-4 mr-2" />Avec numéro de téléphone</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="rating" className="mb-2 block">Note minimum: {filters.minRating}+</Label>
                  <Input id="rating" type="range" min="0" max="5" step="1" value={filters.minRating} onChange={e => updateFilter('minRating', parseInt(e.target.value))} className="w-full" />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    {[0,1,2,3,4,5].map(i => <span key={i}>{i}</span>)}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800">Erreur: {error.message}</p>
          </div>
        )}

        {/* Contenu principal - Layout gauche-droite */}
        {searchQuery.length >= 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne de gauche - Résultats avec scroll */}
            <div className="bg-white rounded-xl p-4 shadow-sm border h-[600px] overflow-hidden">
              {isSearching ? (
                <div className="space-y-3">
                  {[1,2,3,4,5].map(i => (
                    <Card key={i} className="p-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : searchResults && searchResults.length > 0 ? (
                <div className="space-y-3 overflow-y-auto h-[550px] pr-2">
                  {searchResults.map((est) => (
                    
                    <Card key={est.id} className="p-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{est.name}</h3>
                          <p className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {est.address}
                          </p>
                          {est.description && (
  <p className="text-sm text-gray-700 mt-1 line-clamp-3">
    {est.description}
  </p>
)}

                        </div>
                      </div>

                      <span className={`inline-flex items-center px-2 py-1 mb-2 rounded-full text-xs ${est.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            <Clock className="h-3 w-3 mr-1" />
                            {est.isOpen ? 'Ouvert' : 'Fermé'}
                            {est.isOpen && est.nextClosingTime && (
                              <span className="ml-1">• Ferme à {est.nextClosingTime}</span>
                            )}
                            {!est.isOpen && est.nextOpeningTime && (
                              <span className="ml-1">• Ouvre à {est.nextOpeningTime}</span>
                            )}
                        </span>

                      <div className="flex items-center gap-2 mb-2">
                        <StarRating rating={est.rating} />
                      </div>

                      <Button
                        size="sm"
                        variant="secondary"
                        className='cursor-pointer'
                        onClick={() => handleSelectEstablishment(est)}
                      >
                        Sélectionner cet établissement
                      </Button>
                    </div>
                  </Card>

                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Aucun établissement trouvé</p>
                  <p className="text-sm text-gray-500 mt-1">Essayez avec d'autres termes de recherche</p>
                </div>
              )}
            </div>

            {/* Colonne de droite - Carte Interactive */}
            <div className="bg-white rounded-xl p-4 shadow-sm border h-[600px]">
              <InteractiveMap establishments={searchResults || []} />
            </div>
          </div>
        )}

        {/* Message avant recherche */}
        {searchQuery.length < 2 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <Building className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Entrez au moins 2 caractères pour lancer la recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EtablissementSearch;