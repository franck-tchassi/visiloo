"use client";

import { useState } from 'react';
import { BuildingLibraryIcon, EnvelopeIcon, PhoneIcon, ShieldCheckIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function LegalNotice() {
  const [activeSection, setActiveSection] = useState('edition');

  const sections = [
    { id: 'edition', title: 'Édition du site' },
    { id: 'property', title: 'Propriété intellectuelle' },
    { id: 'liability', title: 'Limitations de responsabilité' },
    { id: 'data', title: 'Protection des données' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'links', title: 'Liens hypertextes' },
    { id: 'jurisdiction', title: 'Droit applicable' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <BuildingLibraryIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Mentions Légales
          </h1>
          <p className="text-lg text-gray-600">
            Dernière mise à jour : 24 août 2025
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h2>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <a
                  href="/privacy-policy"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700 mb-2"
                >
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  Politique de confidentialité
                </a>
                <a
                  href="#"
                  className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Télécharger en PDF
                </a>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              
              {/* Édition du site */}
              {activeSection === 'edition' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">1 - Édition du site</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        En vertu de l'article 6 de la loi n°2004-575 du 21 juin 2004 pour la confiance 
                        dans l'économie numérique, il est précisé aux utilisateurs du site internet 
                        https://www.visiloo.com l'identité des différents intervenants dans le cadre 
                        de sa réalisation et de son suivi :
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Propriétaire du site</h3>
                        <div className="space-y-2 text-gray-700">
                          <p>Franck Tchassi</p>
                          <p>33 Avenue du Général de Gaulle, 77610</p>
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            <span>franckraulin8@gmail.com</span>
                          </div>
                          <div className="flex items-center">
                            <PhoneIcon className="w-4 h-4 mr-2" />
                            <span>06 56 83 98 96</span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Entreprise</h3>
                        <div className="space-y-2 text-gray-700">
                          <p>Visiloo</p>
                          <p>Capital social : 10 €</p>
                          <p>SIREN : [à compléter]</p>
                          <p>RCS ou RM : [à compléter]</p>
                          <p>33 Avenue du Général de Gaulle, 77610</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Directeur de la publication</h3>
                        <div className="space-y-2 text-gray-700">
                          <p>Franck Tchassi</p>
                          <div className="flex items-center">
                            <EnvelopeIcon className="w-4 h-4 mr-2" />
                            <span>franckraulin8@gmail.com</span>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Hébergement</h3>
                        <div className="space-y-2 text-gray-700">
                          <p>[Nom de l'hébergeur à compléter, ex. OVH, IONOS, etc.]</p>
                          <p>[Adresse de l'hébergeur]</p>
                          <p>[Numéro de l'hébergeur]</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4">Délégué à la Protection des Données (DPO)</h3>
                      <p className="text-blue-800">
                        [À désigner si applicable, sinon supprimer]
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Propriété intellectuelle */}
              {activeSection === 'property' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">2 - Propriété intellectuelle</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Tous les éléments accessibles sur le site (textes, images, graphismes, logo, 
                        vidéos, architecture, icônes, sons, logiciels, etc.) sont protégés par les 
                        lois en vigueur sur la propriété intellectuelle.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Protection des contenus</h3>
                      <p className="text-gray-700 mb-4">
                        Toute reproduction, représentation, modification, publication, adaptation 
                        de tout ou partie du site, par quelque moyen que ce soit, est interdite 
                        sans autorisation écrite préalable de Franck Tchassi.
                      </p>
                      <p className="text-gray-700">
                        Toute exploitation non autorisée sera considérée comme constitutive d'une 
                        contrefaçon et poursuivie conformément aux dispositions des articles 
                        L.335-2 et suivants du Code de la Propriété Intellectuelle.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-4">Marques et logos</h3>
                      <p className="text-yellow-800">
                        Les marques et logos figurant sur le site sont des marques déposées. 
                        Toute reproduction, imitation ou usage, total ou partiel, de ces 
                        signes distinctifs sans autorisation expresse est prohibé.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Limitations de responsabilité */}
              {activeSection === 'liability' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">3 - Limitations de responsabilité</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Franck Tchassi ne pourra être tenu responsable des dommages directs ou 
                        indirects causés au matériel de l'utilisateur lors de l'accès au site 
                        https://www.visiloo.com.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Obligations de l'utilisateur</h3>
                      <p className="text-gray-700 mb-4">
                        L'utilisateur s'engage à accéder au site avec un matériel récent, 
                        ne contenant pas de virus et avec un navigateur de dernière génération 
                        mis à jour.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Modération des contenus</h3>
                      <p className="text-gray-700">
                        Des espaces interactifs (contact, commentaires) sont à la disposition 
                        des utilisateurs. Franck Tchassi se réserve le droit de supprimer sans 
                        préavis tout contenu qui contreviendrait à la législation française 
                        (notamment en matière de données personnelles, racisme, injure, 
                        diffamation ou pornographie).
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4">Disponibilité du service</h3>
                      <p className="text-blue-800">
                        Franck Tchassi s'efforce d'assurer l'accès au site 24 heures sur 24, 
                        7 jours sur 7, mais ne peut garantir la continuité et la qualité des 
                        services. Une interruption pour maintenance technique peut être décidée 
                        à tout moment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Protection des données */}
              {activeSection === 'data' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">4 - Gestion des données personnelles (RGPD / CNIL)</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Conformément à la loi n°78-17 du 6 janvier 1978 modifiée et au RGPD 
                        (Règlement Général sur la Protection des Données), tout utilisateur 
                        dispose d'un droit d'accès, de rectification, de suppression, de 
                        limitation, d'opposition et de portabilité de ses données personnelles.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Exercice de vos droits</h3>
                      <p className="text-gray-700 mb-4">
                        Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante :
                      </p>
                      <div className="flex items-center text-gray-700 mb-4">
                        <EnvelopeIcon className="w-5 h-5 mr-3" />
                        <span>franckraulin8@gmail.com</span>
                      </div>
                      <p className="text-gray-700">
                        Nous nous engageons à répondre dans un délai maximum d'un mois.
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-indigo-900 mb-4">Politique de confidentialité</h3>
                      <p className="text-indigo-800 mb-4">
                        👉 Pour plus d'informations, consultez notre 
                        <a href="/privacy-policy" className="underline mx-1">Politique de confidentialité</a>.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-4">Autorité de contrôle</h3>
                      <p className="text-yellow-800">
                        En cas de difficulté dans l'exercice de vos droits, vous pouvez 
                        contacter la CNIL : 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookies */}
              {activeSection === 'cookies' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">5 - Cookies</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Le site https://www.visiloo.com utilise des cookies afin d'améliorer 
                        la navigation et de mesurer la fréquentation. Un cookie est un petit 
                        fichier stocké sur votre appareil lors de la consultation du site.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Durée de conservation</h3>
                        <p className="text-gray-700">Maximum 13 mois</p>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-6">
                        <h3 className="font-semibold text-gray-900 mb-4">Consentement</h3>
                        <p className="text-gray-700">Aucun cookie non essentiel n'est déposé sans votre accord</p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Paramétrage</h3>
                      <p className="text-gray-700 mb-4">
                        Vous pouvez refuser ou gérer les cookies depuis votre navigateur ou 
                        via notre bandeau de consentement.
                      </p>
                    </div>

                    <div className="bg-indigo-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-indigo-900 mb-4">Politique des cookies</h3>
                      <p className="text-indigo-800">
                        👉 Pour plus d'informations, consultez notre 
                        <a href="/cookie-policy" className="underline mx-1">Politique de cookies</a>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Liens hypertextes */}
              {activeSection === 'links' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">6 - Liens hypertextes</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Le site https://www.visiloo.com peut contenir des liens vers d'autres sites. 
                        Franck Tchassi décline toute responsabilité quant aux contenus et pratiques 
                        de ces sites tiers.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Liens sortants</h3>
                      <p className="text-gray-700 mb-4">
                        Les liens externes pointent vers des sites dont le contenu a été jugé 
                        pertinent au moment de la création du lien. Cependant, nous ne pouvons 
                        contrôler l'évolution de ces sites externes.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Liens entrants</h3>
                      <p className="text-gray-700">
                        L'autorisation de mise en place d'un lien hypertexte vers notre site 
                        est accordée sans réserve, sous réserve que le lien ne porte pas 
                        atteinte à notre image et qu'il s'ouvre dans une nouvelle fenêtre.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-4">Recommandation</h3>
                      <p className="text-yellow-800">
                        Nous vous encourageons à prendre connaissance des conditions d'utilisation 
                        et des politiques de confidentialité de tout site que vous visitez.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Droit applicable */}
              {activeSection === 'jurisdiction' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">7 - Droit applicable et attribution de juridiction</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Tout litige en relation avec l'utilisation du site https://www.visiloo.com 
                        est soumis au droit français.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Compétence juridictionnelle</h3>
                      <p className="text-gray-700 mb-4">
                        Sauf disposition légale contraire, compétence exclusive est attribuée 
                        aux tribunaux compétents du ressort de Paris, France.
                      </p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">Langue du contrat</h3>
                      <p className="text-gray-700">
                        Les présentes conditions générales sont rédigées en français. 
                        En cas de traduction dans une ou plusieurs langues étrangères, 
                        seul le texte français fera foi en cas de litige.
                      </p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-blue-900 mb-4">Médiation</h3>
                      <p className="text-blue-800">
                        Conformément aux articles L.611-1 et suivants du Code de la consommation, 
                        tout consommateur a le droit de recourir gratuitement à un médiateur de 
                        la consommation pour le règlement amiable du litige qui l'oppose à un 
                        professionnel.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="font-semibold text-yellow-900 mb-4">Modification des conditions</h3>
                      <p className="text-yellow-800">
                        Franck Tchassi se réserve le droit de modifier à tout moment les 
                        présentes mentions légales. Les utilisateurs sont invités à les 
                        consulter régulièrement.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}