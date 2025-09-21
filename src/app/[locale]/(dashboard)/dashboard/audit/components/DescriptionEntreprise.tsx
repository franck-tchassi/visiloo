import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Establishment {
  id: string;
  description: string;
  organizationId: string;
}

interface Props {
  data: Establishment | null;
}

const DescriptionEntreprise = ({ data }: Props) => {
  const [description, setDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.description) {
      setDescription(data.description);
      const words = data.description.trim().split(/\s+/);
      setWordCount(words.length);
    } else {
      setDescription('');
      setWordCount(0);
    }
  }, [data]);

  const updateDescriptionMutation = useMutation({
    mutationFn: async (newDescription: string) => {
      if (!data?.id) {
        throw new Error('Aucun établissement sélectionné');
      }

      const response = await fetch('/api/establishment/update-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          establishmentId: data.id,
          description: newDescription.trim(),
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['establishment'] });
    },
  });

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    
    const words = newDescription.trim().split(/\s+/);
    const count = newDescription.trim() === '' ? 0 : words.length;
    setWordCount(count);
  };

  const handleSave = () => {
    if (data?.id && description.trim() !== (data.description || '')) {
      updateDescriptionMutation.mutate(description.trim());
    }
  };

  const renderAnalysis = () => {
    const wordsNeeded = Math.max(0, 30 - wordCount);
    
    if (wordCount < 30) {
      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center mb-2">
            <span className="text-red-600 font-bold text-lg mr-2">✕</span>
            <span className="text-red-600 font-semibold">Longueur</span>
          </div>
          <p className="text-red-700 text-sm mb-3">
            {wordsNeeded > 0 
              ? `Ajoutez au moins ${wordsNeeded} mot${wordsNeeded !== 1 ? 's' : ''} à la description de votre entreprise pour des résultats optimaux.`
              : 'La description est trop courte pour un référencement optimal.'}
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
            Parfait ! La longueur de la description de votre entreprise est optimale.
          </p>
          
        </div>
      );
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Description de l'Entreprise</h2>
      
      {renderAnalysis()}

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <label htmlFor="company-description" className="block text-sm font-medium text-gray-700 mb-2">
          {data ? 'Modifiez la description de votre établissement' : 'Créez la description de votre établissement'} pour optimiser le référencement :
        </label>
        <textarea
          id="company-description"
          value={description}
          onChange={handleDescriptionChange}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Décrivez votre entreprise, vos services, votre histoire, etc..."
          disabled={updateDescriptionMutation.isPending || !data?.id}
        />
        <div className="mt-2 text-sm text-gray-500">
          {wordCount} mot{wordCount !== 1 ? 's' : ''} • {description.length} caractères
          {wordCount > 0 && (
            <span className="ml-3">
              {wordCount < 15 ? '❌ Trop court' : 
               wordCount < 30 ? '⚠️ Peut être amélioré' : 
               '✅ Longueur optimale'}
            </span>
          )}
        </div>
        
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={updateDescriptionMutation.isPending || description.trim() === (data?.description || '') || !data?.id}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {updateDescriptionMutation.isPending ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </span>
            ) : (
              'Publier sur Google'
            )}
          </button>
          
          {updateDescriptionMutation.isError && (
            <span className="text-red-600 text-sm">
              {updateDescriptionMutation.error.message}
            </span>
          )}
          
          {updateDescriptionMutation.isSuccess && (
            <span className="text-green-600 text-sm">
              ✓ Description mise à jour avec succès
            </span>
          )}
        </div>
      </div>


      

      {!data?.id && (
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Information</h3>
          <p className="text-yellow-700 text-sm">
            Aucun établissement n'est actuellement sélectionné. Veuillez d'abord sélectionner ou créer un établissement pour pouvoir modifier sa description.
          </p>
        </div>
      )}
    </div>
  );
};

export default DescriptionEntreprise;