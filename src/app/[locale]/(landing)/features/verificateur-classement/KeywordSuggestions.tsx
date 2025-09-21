"use client"

// Composant pour les suggestions IA avec API réelle
import { useState, useEffect } from 'react';

interface PlaceResult {
  id: string;
  nom: string;
  adresse: string;
  note: number | null;
  nombreAvis: number;
  ouvertMaintenant: boolean | null;
  lienMaps: string;
  photos: { url: string }[];
}

interface KeywordSuggestionsProps {
  keywordInput: string;
  selectedPlace: PlaceResult | null;
  onSuggestionClick: (suggestion: string) => void;
}

function KeywordSuggestions({ keywordInput, selectedPlace, onSuggestionClick }: KeywordSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keywordInput.length < 2) {
        setSuggestions([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/ai/keyword-suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: keywordInput,
            businessType: selectedPlace?.nom || '',
            location: selectedPlace?.adresse || ''
          }),
        });

        if (!response.ok) {
          // Essayez de récupérer le message d'erreur détaillé
          let errorMessage = `Erreur HTTP: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } catch (e) {
            // Ignore si on ne peut pas parser le JSON
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        
        if (data.suggestions && Array.isArray(data.suggestions)) {
          setSuggestions(data.suggestions);
        } else {
          throw new Error('Format de réponse invalide');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des suggestions:', error);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [keywordInput, selectedPlace]);

  if (keywordInput.length < 2) return null;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Suggestions IA basées sur "{keywordInput}"
        {isLoading && (
          <span className="loading loading-spinner loading-xs text-purple-600"></span>
        )}
      </h4>
      
      {error && (
        <div className="text-red-600 text-sm mb-2">
          <p className="font-medium">Erreur: {error}</p>
          <p className="text-xs mt-1">Vérifiez votre clé API OpenAI</p>
        </div>
      )}
      
      {!isLoading && suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              className="bg-white border border-purple-200 text-purple-700 px-3 py-1 rounded-full text-sm hover:bg-purple-50 transition-colors"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {!isLoading && suggestions.length === 0 && !error && (
        <p className="text-gray-500 text-sm">Tapez plus de caractères pour obtenir des suggestions</p>
      )}
    </div>
  );
}

export default KeywordSuggestions;