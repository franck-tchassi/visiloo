import React from 'react';
import Link from 'next/link';

interface Establishment {
  id: string;
  name: string;
  directoryInfo?: {
    listed: boolean;
    directories: string[];
    consistency: number;
  };
}

interface Props {
  data: Establishment | null;
}

const AnnuaireEntreprise = ({ data }: Props) => {
  return (
    <div className="">
      

      <div className="flex gap-4 flex-col">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Annuaires d'entreprises</h2>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-blue-800">
              Nous avons amélioré cette fonctionnalité !
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Retrouvez-la dans l'onglet Annuaires du menu. Essayez la version améliorée en cliquant sur le bouton ci-dessous.
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <Link
                href="/dashboard/annuaires"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Aller aux Annuaires
              </Link>
            </div>
          </div>
        </div>
      </div>
        
        <div className="grid grid-cols-1  gap-6 ">
         
          
          <div className="flex  flex-col">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Pourquoi les annuaires sont importants</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Améliorez votre visibilité locale
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Renforcez votre crédibilité en ligne
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Augmentez votre référencement local
              </li>
              <li className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Obtenez plus de trafic qualifié
              </li>
            </ul>
            
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800">
                <strong>Nouveau !</strong> Découvrez notre outil de gestion des annuaires amélioré avec plus de fonctionnalités et une meilleure analyse.
              </p>
            </div>
          </div>
        </div>
        
        
      </div>
    </div>
  );
};

export default AnnuaireEntreprise;