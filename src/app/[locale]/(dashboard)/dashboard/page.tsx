// app/dashboard/page.tsx
'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import SelectedEstablishmentCard from './components/SelectedEstablishmentCard';
import OpeningHoursCard from './components/OpeningHoursCard';


const fetchCurrentEstablishment = async (): Promise<any> => {
  const res = await fetch('/api/user/current-establishment');
  if (!res.ok) throw new Error('Erreur de récupération');
  const data = await res.json();
  return data.establishment;
};

const Dashboard = () => {
  const { data: establishment, isLoading, error } = useQuery({
    queryKey: ['currentEstablishment'],
    queryFn: fetchCurrentEstablishment,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header avec l'établissement */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tableau de bord</h1>
        <SelectedEstablishmentCard
          name={establishment?.name}
          address={establishment?.address}
          imageUrl={establishment?.imageUrl}
          isLoading={isLoading}
        />
      </div>

      {/* Grille avec les horaires et autres informations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carte des horaires d'ouverture */}
        <OpeningHoursCard
          openingHours={establishment?.openingHours}
          isLoading={isLoading}
        />

        {/* Autres cartes d'information */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Aperçu</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Visibilité en ligne</p>
              <p>Engagement clients</p>
              <p>Performances</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Statistiques</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Visites du profil</p>
              <p>Recherches</p>
              <p>Interactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Deuxième ligne */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Actions</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Mettre à jour les infos</p>
            <p>Répondre aux avis</p>
            <p>Publier une offre</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Notifications</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Avis récents</p>
            <p>Messages</p>
            <p>Alertes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;