// components/OpeningHoursCard.tsx
'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface OpeningHoursPeriod {
  open: { day: number; time: string };
  close: { day: number; time: string };
}

interface OpeningHours {
  open_now?: boolean;
  weekday_text?: string[];
  periods?: OpeningHoursPeriod[];
}

interface OpeningHoursCardProps {
  openingHours?: OpeningHours | null | string;
  isLoading?: boolean;
}

interface FormattedHour {
  day: string;
  hours: string;
}

const OpeningHoursCard: React.FC<OpeningHoursCardProps> = ({
  openingHours: rawOpeningHours,
  isLoading = false
}) => {
  // Normalisation des horaires d'ouverture
  const normalizeOpeningHours = (hours: any): OpeningHours | null => {
    if (!hours) return null;
    if (typeof hours === 'string') {
      try {
        return JSON.parse(hours);
      } catch (error) {
        return null;
      }
    }
    if (typeof hours === 'object' && hours !== null) {
      return hours as OpeningHours;
    }
    return null;
  };

  const openingHours = normalizeOpeningHours(rawOpeningHours);

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!openingHours || Object.keys(openingHours).length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Horaires d'ouverture</h3>
        </div>
        <p className="text-gray-500 text-sm">Aucun horaire disponible</p>
      </Card>
    );
  }

  // Fonction pour convertir le format Google (HHMM) en format 24h (HH:MM)
  const formatGoogleTime = (timeStr: string): string => {
    if (!timeStr || timeStr.length !== 4) return timeStr;
    
    // Format Google: "0830" → "08:30", "1400" → "14:00"
    const hours = timeStr.slice(0, 2);
    const minutes = timeStr.slice(2);
    
    return `${hours}:${minutes}`;
  };

  // Fonction pour formater les horaires complets
  const formatOpeningHours = (hours: OpeningHours): FormattedHour[] => {
    const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

    // Utiliser weekday_text qui est déjà formaté
    if (hours.weekday_text && Array.isArray(hours.weekday_text)) {
      return hours.weekday_text.map((text: string, index: number) => {
        // Nettoyer le format: "Lundi: 08:30 – 12:00, 14:00 – 18:00" → "08:30 - 12:00 | 14:00 - 18:00"
        const cleanedHours = text
          .replace(/^[^:]+:\s*/, '') // Enlève le nom du jour
          .replace(/–/g, '-') // Remplace les tirets longs par des tirets courts
          .replace(/,/g, ' | '); // Remplace les virgules par des barres verticales
        
        return {
          day: days[index],
          hours: cleanedHours
        };
      });
    }

    // Fallback: Utiliser les périodes si weekday_text n'existe pas
    if (hours.periods && Array.isArray(hours.periods)) {
      return days.map((day, index) => {
        const dayPeriods = hours.periods?.filter((p) => p.open?.day === index) || [];
        
        if (dayPeriods.length > 0) {
          const timeRanges = dayPeriods.map(period => {
            if (period.open && period.close && period.open.time && period.close.time) {
              const openTime = formatGoogleTime(period.open.time);
              const closeTime = formatGoogleTime(period.close.time);
              return `${openTime} - ${closeTime}`;
            }
            return '';
          }).filter(Boolean);

          return {
            day,
            hours: timeRanges.join(' | ') || 'Fermé'
          };
        }
        
        return { day, hours: 'Fermé' };
      });
    }

    return days.map(day => ({ day, hours: 'Non spécifié' }));
  };

  const formattedHours = formatOpeningHours(openingHours);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Horaires d'ouverture</h3>
      </div>
      
      <div className="space-y-2">
        {formattedHours.map(({ day, hours }) => (
          <div
            key={day}
            className="flex justify-between text-sm text-gray-700"
          >
            <span className="font-medium min-w-[80px]">{day}</span>
            <span className="text-right flex-1">{hours}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default OpeningHoursCard;