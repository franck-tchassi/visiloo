import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Establishment {
  id: string;
  name: string;
  organizationId: string;
}

interface Props {
  data: Establishment | null;
}

const NomEntreprise = ({ data }: Props) => {
  const [name, setName] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.name) {
      setName(data.name);
      const words = data.name.trim().split(/\s+/);
      setWordCount(words.length);
    } else {
      // Si pas d'établissement, initialiser avec une chaîne vide
      setName('');
      setWordCount(0);
    }
  }, [data]);

  const updateEstablishmentMutation = useMutation({
    mutationFn: async (newName: string) => {
      // Si aucun établissement existe, on doit d'abord en créer un
      if (!data?.id) {
        const response = await fetch('/api/establishment/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: newName.trim(),
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la création');
        }
        return response.json();
      } else {
        // Mise à jour d'un établissement existant
        const response = await fetch('/api/establishment/update-name', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            establishmentId: data.id,
            name: newName.trim(),
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de la mise à jour');
        }
        return response.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishment'] });
    },
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newName = e.target.value;
    setName(newName);
    
    const words = newName.trim().split(/\s+/);
    const count = newName.trim() === '' ? 0 : words.length;
    setWordCount(count);
  };

  const handleSave = () => {
    if (name.trim() !== (data?.name || '')) {
      updateEstablishmentMutation.mutate(name.trim());
    }
  };

  const renderAnalysis = () => {
    if (wordCount === 0) {
      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-red-600 font-bold text-lg mr-2">✕</span>
            <span className="text-red-600 font-semibold">Longueur</span>
          </div>
          <p className="text-red-700 text-sm mb-3">
            Envisagez d'ajouter au moins 2 mots supplémentaires au nom de votre entreprise pour une meilleure visibilité.
          </p>
        </div>
      );
    } else if (wordCount === 1) {
      return (
        <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-orange-600 font-bold text-lg mr-2">⚠</span>
            <span className="text-orange-600 font-semibold">Longueur</span>
          </div>
          <p className="text-orange-700 text-sm mb-3">
            Envisagez d'ajouter au moins 1 mot supplémentaire au nom de votre entreprise pour une meilleure visibilité.
          </p>
        </div>
      );
    } else {
      return (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-green-600 font-bold text-lg mr-2">✓</span>
            <span className="text-green-600 font-semibold">Longueur</span>
          </div>
          <p className="text-green-700 text-sm mb-3">
            Parfait ! La longueur du nom de votre entreprise est optimale.
          </p>
          
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Nom de l'Entreprise</h2>

      {renderAnalysis()}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 mb-2">
          {data ? 'Modifiez le nom de votre établissement' : 'Créez le nom de votre établissement'} pour optimiser le référencement :
        </label>
        <textarea
          id="company-name"
          value={name}
          onChange={handleNameChange}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Entrez le nom de votre entreprise..."
          disabled={updateEstablishmentMutation.isPending}
        />
        <div className="mt-2 text-sm text-gray-500">
          {wordCount} mot{wordCount !== 1 ? 's' : ''} • {name.length} caractères
        </div>
        
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={updateEstablishmentMutation.isPending || name.trim() === (data?.name || '')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {updateEstablishmentMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {data ? 'Enregistrement...' : 'Création...'}
              </span>
            ) : (
              data ? 'Publier sur Google' : 'Créer l\'établissement'
            )}
          </button>
          
          {updateEstablishmentMutation.isError && (
            <span className="text-red-600 text-sm">
              {updateEstablishmentMutation.error.message}
            </span>
          )}
          
          {updateEstablishmentMutation.isSuccess && (
            <span className="text-green-600 text-sm">
              ✓ {data ? 'Nom mis à jour avec succès' : 'Établissement créé avec succès'}
            </span>
          )}
        </div>
      </div>

      

      
    </div>
  );
};

export default NomEntreprise;