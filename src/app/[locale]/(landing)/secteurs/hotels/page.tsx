"use client"

import Link from "next/link";
import { JSX, useState } from "react";

type TabKey = 'visibility' | 'solutions' | 'competitive' | 'directories';

interface TabContent {
  title: string;
  description: string;
  image: JSX.Element;
}

interface TabContentMap {
  visibility: TabContent;
  solutions: TabContent;
  competitive: TabContent;
  directories: TabContent;
}

type AutomationTabKey = 'reviews' | 'positions' | 'content' | 'photos';

interface AutomationTabContent {
  title: string;
  description: string;
  image: JSX.Element;
}

interface AutomationTabContentMap {
  reviews: AutomationTabContent;
  positions: AutomationTabContent;
  content: AutomationTabContent;
  photos: AutomationTabContent;
}

export default function Hotels() {
   const [activeTab, setActiveTab] = useState<TabKey>('visibility');
        const [activeAutomationTab, setActiveAutomationTab] = useState<AutomationTabKey>('reviews');
      
        const tabContent: TabContentMap = {
          visibility: {
            title: "Analyses de visibilité",
            description: "Suivez l'évolution de votre visibilité et surveillez les visites et interactions des utilisateurs avec votre Profil d'entreprise Google en temps réel.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                 
                </div>
              </div>
            )
          },
          solutions: {
            title: "Solutions pour booster votre visibilité",
            description: "Visiloo génère automatiquement des tâches simples et concrètes qui améliorent constamment votre classement et votre visibilité en ligne.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          },
          competitive: {
            title: "Analyses concurrentielles",
            description: "Gardez une longueur d'avance en suivant ce qui fonctionne pour les concurrents les mieux classés dans votre région. Transformez leurs stratégies en votre avantage.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          },
          directories: {
            title: "Inscriptions stratégiques",
            description: "Visiloo identifie les annuaires précis où votre entreprise doit être référencée pour maximiser sa visibilité locale et sa crédibilité.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          }
        };
      
      
      
        const automationTabContent: AutomationTabContentMap = {
          reviews: {
            title: "Gestion des avis",
            description: "Répondez aux avis en quelques secondes, accédez même aux commentaires supprimés et générez plus d'avis grâce à des codes QR personnalisés que les clients adorent utiliser.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          },
          positions: {
            title: "Suivi de positions",
            description: "Suivez vos positions pour les termes de recherche clés et repérez les opportunités avant vos concurrents. Découvrez exactement quels mots-clés font leur succès.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          },
          content: {
            title: "Éditeur de contenu",
            description: "Créez du contenu engageant et spécifique à votre secteur avec Localo AI et publiez instantanément sur votre Profil d'entreprise Google et votre page Facebook.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          },
          photos: {
            title: "Gestion intelligente des photos",
            description: "Planifiez automatiquement le téléchargement de photos pendant que Localo AI s'assure que chaque image renforce votre présence dans le secteur et attire les bons clients.",
            image: (
              <div className="relative w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl"></div>
                <div className="relative z-10 text-center p-4">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  
                </div>
              </div>
            )
          }
        };
      
        // Fonction pour obtenir le contenu actif en toute sécurité
        const currentContent = tabContent[activeTab];
        const currentAutomationContent = automationTabContent[activeAutomationTab];

  return (
    <div className="bg-gray-900 min-h-screen">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-144.5 -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-288.75"
          />
        </div>

      </div>

      <section className="bg-gray-800 py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Colonne de gauche - Texte */}
                        <div>
                          <h2 className="text-3xl font-bold text-white mb-6">
                              Augmentez la visibilité de votre hôtel et laissez vos concurrents derrière vous
                          </h2>
                          <p className="text-lg text-gray-300 mb-8">
                              Visiloo peut vous aider à faire en sorte que les clients potentiels trouvent facilement votre entreprise sur Google Maps. Obtenez de nouveaux avis et encouragez les visiteurs de votre région à choisir votre hôtel !
                          </p>
                          <Link 
                              href="/signin" 
                              className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
                          >
                              Commencer gratuitement
                          </Link>
                        </div>
      
                        {/* Colonne de droite - Image */}
                        <div className="flex justify-center">
                          <div className="relative w-full max-w-md">
                            <div className="rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-600/20 overflow-hidden flex items-center justify-center p-2">
                              <div className="relative w-full h-80">
                                {/* Remplacez par votre image réelle */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-xl flex items-center justify-center">
                                  <span className="text-white text-lg font-medium">Image de hotel</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Nouvelle Section: Ce que les entreprises réalisent avec Visiloo */}
                  <section className="bg-gray-900 py-24">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <h2 className="text-4xl font-bold text-center text-white mb-16">
                        Ce que les entreprises réalisent avec Visiloo en seulement 3 mois :
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Première statistique */}
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                          <div className="text-5xl font-bold text-indigo-400 mb-4">+23</div>
                          <h3 className="text-xl font-semibold text-white mb-2">concurrents</h3>
                          <p className="text-gray-400">Surpassez vos concurrents</p>
                        </div>
                        
                        {/* Deuxième statistique */}
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                          <div className="text-5xl font-bold text-indigo-400 mb-4">+1300</div>
                          <h3 className="text-xl font-semibold text-white mb-2">clients</h3>
                          <p className="text-gray-400">Portée</p>
                        </div>
                        
                        {/* Troisième statistique */}
                        <div className="bg-gray-800 rounded-xl p-8 text-center">
                          <div className="text-5xl font-bold text-indigo-400 mb-4">+57%</div>
                          <h3 className="text-xl font-semibold text-white mb-2">visibilité</h3>
                          <p className="text-gray-400">Portée</p>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Nouvelle Section Interactive avec Navigation Centrale */}
                 <section className="py-24 bg-gradient-to-b from-gray-900 to-gray-800">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="flex flex-col lg:flex-row gap-16">
                        {/* Colonne de gauche - Titre, boutons et texte */}
                        <div className="lg:w-1/2">
                          <h2 className="text-4xl font-bold text-white mb-8">
                            Augmentez votre visibilité et attirez de nouveaux clients
                          </h2>
                          
                          <div className="space-y-4 mb-10">
                            {(Object.entries(tabContent) as [TabKey, TabContent][]).map(([key, feature]) => (
                              <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className={`w-full text-left p-5 rounded-xl transition-all cursor-pointer duration-300 border ${
                                  activeTab === key
                                    ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500 shadow-lg"
                                    : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-4 ${activeTab === key ? "bg-indigo-400" : "bg-gray-500"}`}></div>
                                  <span className={`text-lg font-medium ${activeTab === key ? "text-white" : "text-gray-300"}`}>
                                    {feature.title}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {/* Texte descriptif */}
                          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
                            <p className="text-gray-300 text-lg leading-relaxed">
                              { currentContent .description}
                            </p>
                          </div>
                        </div>
            
                        {/* Colonne de droite - Image dynamique qui change avec l'onglet */}
                        <div className="lg:w-1/2 flex items-center justify-center">
                          <div className="relative w-full max-w-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl transform rotate-3"></div>
                            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                              <div className="aspect-video flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                                {/* Image dynamique qui change selon l'onglet sélectionné */}
                                { currentContent.image }
                              </div>
                              
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
            
                  {/* Nouvelle Section: Mettez votre Profil d'entreprise Google en pilote automatique */}
                  <section className="py-24 bg-gradient-to-b from-gray-800 to-gray-900">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="flex flex-col lg:flex-row gap-16">
                        {/* Colonne de gauche - Titre, boutons et texte */}
                        <div className="lg:w-1/2">
                          <h2 className="text-4xl font-bold text-white mb-8">
                            Mettez votre Profil d'entreprise Google en pilote automatique
                          </h2>
                          
                          <div className="space-y-4 mb-10">
                            {(Object.entries(automationTabContent) as [AutomationTabKey, AutomationTabContent][]).map(([key, feature]) => (
                              <button
                                key={key}
                                onClick={() => setActiveAutomationTab(key)}
                                className={`w-full text-left p-5 rounded-xl transition-all duration-300 border ${
                                  activeAutomationTab === key
                                    ? "bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500 shadow-lg"
                                    : "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50"
                                }`}
                              >
                                <div className="flex items-center">
                                  <div className={`flex-shrink-0 w-3 h-3 rounded-full mr-4 ${activeAutomationTab === key ? "bg-indigo-400" : "bg-gray-500"}`}></div>
                                  <span className={`text-lg font-medium ${activeAutomationTab === key ? "text-white" : "text-gray-300"}`}>
                                    {feature.title}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                          
                          {/* Texte descriptif */}
                          <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700">
                            <p className="text-gray-300 text-lg leading-relaxed">
                              {currentAutomationContent.description}
                            </p>
                          </div>
                        </div>
            
                        {/* Colonne de droite - Image dynamique qui change avec l'onglet */}
                        <div className="lg:w-1/2 flex items-center justify-center">
                          <div className="relative w-full max-w-lg">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl transform rotate-3"></div>
                            <div className="relative bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 shadow-2xl">
                              <div className="aspect-video flex items-center justify-center rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 p-4">
                                {/* Image dynamique qui change selon l'onglet sélectionné */}
                                {currentAutomationContent.image}
                              </div>
                              
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

      {/* Section Google Business Profile - Tout en bas sur toute la largeur */}
      <section className="bg-gray-800 py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Colonne de gauche - Texte */}
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">
                Plus de 26 815 Profils d'entreprise Google gérés activement avec Visiloo
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Que vous soyez propriétaire d'entreprise, freelance ou agence, Visiloo fournit les outils dont vous avez besoin pour optimiser votre visibilité locale et obtenir des résultats concrets. Simplifiez la gestion de votre profil et libérez votre potentiel de croissance.
              </p>
              <Link 
                href="/signin" 
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
              >
                Commencer maintenant
              </Link>
            </div>

            {/* Colonne de droite - Image */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className=" rounded-2xl bg-gradient-to-br overflow-hidden flex items-center justify-center">
                  <img
                    src="/profil-entreprise.png"
                    alt="Gestion de Profils Google Business avec Visiloo"
                    className="w-full h-full object-contain"
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}