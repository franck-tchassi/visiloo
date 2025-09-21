'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import { MapPin } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Establishment {
  id: string;
  name: string;
  address: string;
  city: string;
  position: {
    lat: number;
    lng: number;
  };
  rating: number;
  isOpen: boolean;
}

interface InteractiveMapProps {
  establishments: Establishment[];
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ establishments }) => {
  useEffect(() => {
    // Initialize marker cluster group
    const initMap = () => {
      if (typeof window !== 'undefined') {
        // @ts-ignore
        if (window.MarkerClusterGroup) {
          // @ts-ignore
          window.markerClusters = L.markerClusterGroup({
            chunkedLoading: true,
            maxClusterRadius: 50,
            spiderfyOnMaxZoom: true,
            showCoverageOnHover: true,
            zoomToBoundsOnClick: true,
          });
        }
      }
    };

    initMap();
  }, []);

  if (typeof window === 'undefined') {
    return <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">Chargement de la carte...</div>;
  }

  if (establishments.length === 0) {
    return (
      <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-2" />
          <p>Aucun établissement à afficher</p>
        </div>
      </div>
    );
  }

  // Calculate center of all establishments
  const centerLat = establishments.reduce((sum, est) => sum + est.position.lat, 0) / establishments.length;
  const centerLng = establishments.reduce((sum, est) => sum + est.position.lng, 0) / establishments.length;

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {establishments.map((est) => (
          <Marker
            key={est.id}
            position={[est.position.lat, est.position.lng]}
            icon={L.icon({
              iconUrl: est.isOpen 
                ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
                : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-sm mb-1">{est.name}</h3>
                <p className="text-xs text-gray-600 mb-1">{est.address}</p>
                <p className="text-xs text-gray-500 mb-1">{est.city}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    est.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {est.isOpen ? 'Ouvert' : 'Fermé'}
                  </span>
                  <span className="text-xs text-yellow-600">⭐ {est.rating}</span>
                </div>
                
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;