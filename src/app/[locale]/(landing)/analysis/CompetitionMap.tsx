'use client';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const containerStyle = {
  width: '100%',
  height: '100%'
};

interface CompetitionMapProps {
  center: {
    lat: number;
    lng: number;
  };
  heatmapData: any[];
  currentBusiness: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export default function CompetitionMap({ center, heatmapData, currentBusiness }: CompetitionMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {

    if (typeof window !== 'undefined' && !window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => setLoadError('Erreur de chargement de Google Maps');
      document.head.appendChild(script);
    } else if (window.google) {
      setMapLoaded(true);
    }
  }, []);

  if (loadError) {
    return (
      <div className="h-96 bg-red-50 text-red-600 rounded-lg flex flex-col items-center justify-center p-4">
        <p className="font-medium">{loadError}</p>
        Chargement...
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
      options={{
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }}
    >
      <Marker
        position={currentBusiness.location}
        options={{
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#FFF',
            strokeWeight: 2,
            scale: 8
          }
        }}
      />

      {heatmapData.map((cluster, idx) => (
        <Circle
          key={idx}
          center={{ lat: cluster.lat, lng: cluster.lng }}
          radius={cluster.radius * 1000}
          options={{
            fillColor: cluster.color,
            fillOpacity: 0.2,
            strokeColor: cluster.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            clickable: false
          }}
        />
      ))}
    </GoogleMap>
  );
}