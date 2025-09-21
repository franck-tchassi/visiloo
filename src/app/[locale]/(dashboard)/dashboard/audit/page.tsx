"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import AnnuaireEntreprise from './components/AnnuaireEntreprise';
import DescriptionEntreprise from './components/DescriptionEntreprise';
import CategorieEntreprise from './components/CategorieEntreprise';
import AnalyseHeuresOuverture from './components/AnalyseHeuresOuverture';
import Avis from './components/Avis';
import ReponseAuxAvis from './components/ReponseAuxAvis';
import Images from './components/Images';
import Publications from './components/Publications';
import NomEntreprise from './components/NomEntreprise';

// Définir le type des clés de section
type SectionKey = 'nom' | 'description' | 'categorie' | 'analyse-heures' | 'avis' | 'reponse-avis' | 'annuaire' | 'images' | 'publications';

const AuditPage = () => {
  const [selectedSection, setSelectedSection] = useState<SectionKey>('annuaire');
  const [showPopup, setShowPopup] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(6);
  
  const sectionRefs = {
    nom: useRef<HTMLElement>(null),
    description: useRef<HTMLElement>(null),
    categorie: useRef<HTMLElement>(null),
    'analyse-heures': useRef<HTMLElement>(null),
    avis: useRef<HTMLElement>(null),
    'reponse-avis': useRef<HTMLElement>(null),
    annuaire: useRef<HTMLElement>(null),
    images: useRef<HTMLElement>(null),
    publications: useRef<HTMLElement>(null)
  };

  // Utiliser TanStack Query pour récupérer l'établissement
  const { data: establishmentData, isLoading, error } = useQuery({
    queryKey: ['establishment'],
    queryFn: async () => {
      const response = await fetch('/api/user/current-establishment');
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }
      return response.json();
    },
  });

  const establishment = establishmentData?.establishment;

  const scrollToSection = (sectionId: SectionKey) => {
    setSelectedSection(sectionId);
    const sectionRef = sectionRefs[sectionId];
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start'
      });
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-gray-600 text-lg">Chargement des données...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-600 text-lg">Erreur: {error.message}</div>;
  }

  return (
    <div className="mx-auto p-5 font-sans relative">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Audit</h1>
      
      <div className="overflow-x-auto mb-8 pb-3 border-b border-gray-200">
        <div className="flex gap-3 min-w-max">
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'nom' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('nom')}
          >
            Nom
          </button>
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'description' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('description')}
          >
            Description
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'categorie' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('categorie')}
          >
            Catégorie
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'analyse-heures' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('analyse-heures')}
          >
            Analyse des heures d'ouverture
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'avis' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('avis')}
          >
            Avis
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'reponse-avis' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('reponse-avis')}
          >
            Réponses aux avis
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'annuaire' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('annuaire')}
          >
            Annuaire des Entreprises
          </button>

          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'images' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('images')}
          >
            Images
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedSection === 'publications' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 border border-gray-300 hover:bg-gray-200'
            }`}
            onClick={() => scrollToSection('publications')}
          >
            Publications
          </button>
          
        </div>

        <div className="mt-8 p-4 bg-gray-100 border border-gray-300 rounded-lg flex justify-between items-center">
          <p className="text-gray-600 text-sm m-0">
            Nouvelles directives d'optimisation disponibles dans {daysRemaining} jours.
          </p>
          <button 
            className="text-blue-600 text-sm cursor-pointer flex items-center px-3 py-1 rounded hover:bg-blue-50 transition-colors"
            onClick={togglePopup}
          >
            ☉ Quand verrai-je des résultats ?
          </button>
        </div>

        {/* Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/25 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6 relative">
              <button 
                className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={togglePopup}
              >
                ✕
              </button>
              <h3 className="font-semibold text-lg mb-4">Quand verrai-je des résultats ?</h3>
              <div className="text-sm text-gray-700 space-y-3 max-h-96 overflow-y-auto">
                <p>Le calendrier d'amélioration varie selon l'entreprise.</p>
                <p>Améliorer la visibilité de votre Profil d'entreprise Google est un marathon, pas un sprint. Soyez patient - les résultats peuvent prendre des semaines, des mois, ou même plus longtemps sur les marchés concurrentiels. N'oubliez pas, vos concurrents travaillent également sur leurs classements.</p>
                <p className="font-medium">Les facteurs clés affectant votre calendrier incluent :</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>L'exhaustivité de votre Profil d'entreprise</li>
                  <li>La réputation de votre entreprise et l'engagement des clients</li>
                  <li>La quality et la visibilité du site web</li>
                  <li>La concurrence sur le marché local</li>
                  <li>Les efforts d'optimisation des concurrents</li>
                </ul>
                <p>Rappelez-vous : Les classements fluctuent naturellement. Les changements peuvent résulter de vos efforts d'optimisation ou des mises à jour de l'algorithme de Google. Restez constant - l'amélioration vient presque toujours avec le temps et des efforts persistants.</p>
                <p>Vous avez des questions ? Notre équipe d'assistance est là pour vous aider.</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="min-h-[500px]">
        <section 
          id="nom" 
          ref={sectionRefs.nom} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <NomEntreprise data={establishment} />
        </section>
        
        <section 
          id="description" 
          ref={sectionRefs.description} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <DescriptionEntreprise data={establishment} />
        </section>
        
        <section 
          id="categorie" 
          ref={sectionRefs.categorie} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <CategorieEntreprise  />
        </section>
        
        <section 
          id="analyse-heures" 
          ref={sectionRefs['analyse-heures']} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <AnalyseHeuresOuverture/>
        </section>
        
        <section 
          id="avis" 
          ref={sectionRefs.avis} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <Avis  />
        </section>
        
        <section 
          id="reponse-avis" 
          ref={sectionRefs['reponse-avis']} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <ReponseAuxAvis  />
        </section>
        
        <section 
          id="annuaire" 
          ref={sectionRefs.annuaire} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <AnnuaireEntreprise data={establishment} />
        </section>

        <section 
          id="images" 
          ref={sectionRefs.images} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <Images data={establishment} />
        </section>
        
        <section 
          id="publications" 
          ref={sectionRefs.publications} 
          className="mb-8 p-5 border border-gray-300 rounded-lg bg-white shadow-sm scroll-mt-5"
        >
          <Publications  />
        </section>
      </div>
    </div>
  );
};

export default AuditPage;