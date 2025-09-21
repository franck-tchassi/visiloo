'use client';

import React from 'react';

interface Photo {
  url: string;
  caption?: string;
  photo_reference?: string;
}

interface Establishment {
  id: string;
  name: string;
  photos?: Photo[] | null;
}

interface Props {
  data: Establishment | null;
}

const Images = ({ data }: Props) => {
  const photos = data?.photos || [];
  const photoCount = Array.isArray(photos) ? photos.length : 0;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Images de l'Entreprise</h2>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-800">Galerie d'images</h3>
          <p className="text-sm text-gray-600">{photoCount} image{photoCount !== 1 ? 's' : ''} disponible{photoCount !== 1 ? 's' : ''}</p>
        </div>

        
        {photoCount < 23 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 text-sm">
             Votre profil devrait inclure au moins <strong>23 images</strong> pour un bon référencement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Images;
