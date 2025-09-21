// components/SelectedEstablishmentCard.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Building, MapPin, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface SelectedEstablishmentCardProps {
  name?: string;
  address?: string;
  imageUrl?: string;
  isLoading?: boolean;
  
}

const SelectedEstablishmentCard: React.FC<SelectedEstablishmentCardProps> = ({
  name,
  address,
  imageUrl,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </Card>
    );
  }

  if (!name) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-500 mb-4">Aucun établissement sélectionné.</p>
        <Button variant="outline" onClick={() => window.location.href = '/select-establishment'}>
          Sélectionner un établissement
        </Button>
      </Card>
    );
  }

  const hasGoogleImage = imageUrl && imageUrl.includes('googleapis.com');

  return (
    <Card className="p-6 flex items-center max-w-xl  gap-4">
        <div className='flex gap-6 items-center justify-between'>
            <div className='flex gap-6 items-center'>
                {/* Logo */}
                <div className="relative">
                    {hasGoogleImage ? (
                    <img
                        src={imageUrl}
                        alt={name}
                        className="h-16 w-16 rounded-full object-cover bg-gray-100"
                        onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                    />
                    ) : null}
                    
                    <div className={`${hasGoogleImage ? 'hidden' : 'flex'} items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600`}>
                    <Building className="h-8 w-8" />
                    </div>
                </div>
            

                {/* Nom et Adresse alignés */}
                <div className="flex-1 flex flex-col">
                    <div className="font-bold text-xl">{name}</div>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span className="truncate">{address}</span>
                    </div>

                    </div>
            </div>

            {/* Bouton pour changer d'établissement */}
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => window.location.href = '/select-establishment'}
                className="flex-shrink-0 cursor-pointer"
            >
                <ChevronRight className="h-5 w-5" />
            </Button>
        </div>
    </Card>
  );
};

export default SelectedEstablishmentCard;