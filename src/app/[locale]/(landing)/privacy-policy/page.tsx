"use client";

import { useState } from 'react';
import { ShieldCheckIcon, EnvelopeIcon, PhoneIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState('introduction');

  const sections = [
    { id: 'introduction', title: 'Introduction' },
    { id: 'definitions', title: 'Définitions' },
    { id: 'data-collection', title: 'Données collectées' },
    { id: 'data-usage', title: 'Utilisation des données' },
    { id: 'data-sharing', title: 'Partage des données' },
    { id: 'data-retention', title: 'Conservation des données' },
    { id: 'data-transfer', title: 'Transfert des données' },
    { id: 'user-rights', title: 'Vos droits' },
    { id: 'security', title: 'Sécurité' },
    { id: 'minors', title: 'Protection des mineurs' },
    { id: 'cookies', title: 'Cookies' },
    { id: 'external-links', title: 'Liens externes' },
    { id: 'changes', title: 'Modifications' },
    { id: 'contact', title: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Politique de Confidentialité
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
              
              {/* Introduction */}
              {activeSection === 'introduction' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
                  <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                      La présente Politique de Confidentialité décrit les règles et procédures que nous appliquons 
                      concernant la collecte, l'utilisation et la divulgation de vos informations lorsque vous 
                      utilisez notre Service. Elle vous informe également sur vos droits en matière de protection 
                      des données personnelles ainsi que sur la manière dont la loi vous protège.
                    </p>
                    <p>
                      En utilisant notre Service, vous acceptez la collecte et l'utilisation de vos données 
                      conformément à cette Politique de Confidentialité.
                    </p>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                      <p className="text-blue-800">
                        <strong>Note importante :</strong> Cette politique s'applique à tous les services
                        proposés par Visiloo, y compris notre site web, applications mobiles et services associés.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Definitions */}
              {activeSection === 'definitions' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Définitions</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Compte</h3>
                      <p className="text-gray-700">Un compte unique créé pour accéder à notre Service.</p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Société</h3>
                      <p className="text-gray-700">
                        (ci-après « la Société », « Nous », « Notre » ou « Nos ») : Visiloo, 
                        dont le siège est situé au 33 Avenue Générale de Gaulle, 77610.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Données personnelles</h3>
                      <p className="text-gray-700">
                        Toute information permettant d'identifier directement ou indirectement une personne physique.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Service</h3>
                      <p className="text-gray-700">
                        Le site internet Visiloo, accessible à l'adresse www.visiloo.com.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Prestataire de services</h3>
                      <p className="text-gray-700">
                        Toute personne physique ou morale traitant des données pour le compte de la Société.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Appareil</h3>
                      <p className="text-gray-700">
                        Tout appareil permettant d'accéder au Service (ordinateur, smartphone, tablette, etc.).
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg">
                      <h3 className="font-semibold text-gray-900 mb-2">Cookies</h3>
                      <p className="text-gray-700">
                        Petits fichiers déposés sur votre appareil afin de faciliter la navigation et 
                        d'analyser l'utilisation du Service.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Collection */}
              {activeSection === 'data-collection' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Données collectées</h2>
                  <div className="space-y-8">
                    
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        2.1 Données personnelles que vous fournissez
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 mb-4">
                          Lorsque vous utilisez notre Service, nous pouvons vous demander de fournir 
                          certaines informations personnelles, telles que :
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          <li>Adresse e-mail</li>
                          <li>Prénom et nom</li>
                          <li>Numéro de téléphone</li>
                          <li>Informations de paiement</li>
                          <li>Données de profil professionnel</li>
                          <li>Contenu que vous publiez sur notre plateforme</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        2.2 Données collectées automatiquement
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700 mb-4">
                          Lors de l'utilisation du Service, certaines informations sont collectées automatiquement, comme :
                        </p>
                        <ul className="list-disc list-inside text-gray-700 space-y-2">
                          <li>L'adresse IP de votre appareil</li>
                          <li>Le type et la version du navigateur</li>
                          <li>Les pages consultées et la durée de la visite</li>
                          <li>L'identifiant unique de votre appareil</li>
                          <li>Données de diagnostic et de performance</li>
                          <li>Données de localisation (avec consentement)</li>
                        </ul>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        2.3 Données provenant de services tiers
                      </h3>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <p className="text-gray-700">
                          Si vous vous connectez via un service tiers (Google, Facebook, Instagram, Twitter, LinkedIn), 
                          nous pouvons recevoir les informations déjà associées à ce compte (nom, e-mail, photo de profil, etc.).
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Data Usage */}
              {activeSection === 'data-usage' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Utilisation de vos données</h2>
                  <div className="space-y-6">
                    <div className="bg-indigo-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-indigo-900 mb-4">
                        3. Finalités du traitement
                      </h3>
                      <p className="text-indigo-800 mb-4">
                        Vos données personnelles peuvent être utilisées pour les finalités suivantes :
                      </p>
                      <ul className="list-disc list-inside text-indigo-800 space-y-2">
                        <li>Fournir et maintenir le Service</li>
                        <li>Gérer votre compte utilisateur</li>
                        <li>Exécuter un contrat (achat de produits, services, etc.)</li>
                        <li>Vous contacter (par e-mail, notifications, téléphone, etc.)</li>
                        <li>Vous envoyer des offres, actualités et informations (sauf opposition de votre part)</li>
                        <li>Analyser et améliorer nos services et campagnes marketing</li>
                        <li>Assurer la sécurité et la prévention contre la fraude</li>
                        <li>Respecter nos obligations légales</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-green-900 mb-4">
                        3.1 Bases légales du traitement
                      </h3>
                      <p className="text-green-800">
                        Nous traitons vos données sur la base des fondements juridiques suivants :
                      </p>
                      <div className="mt-4 space-y-3">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-green-800"><strong>Consentement :</strong> Pour les communications marketing et les cookies</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-green-800"><strong>Exécution contractuelle :</strong> Pour fournir nos services</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-green-800"><strong>Intérêt légitime :</strong> Pour améliorer nos services et prévenir la fraude</p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-green-800"><strong>Obligation légale :</strong> Pour respecter les exigences réglementaires</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Sharing */}
              {activeSection === 'data-sharing' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Partage de vos données</h2>
                  <div className="space-y-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                      <p className="text-yellow-800">
                        <strong>Important :</strong> Nous ne vendons pas vos données personnelles à des tiers.
                      </p>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        4.1 Catégories de destinataires
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Vos données peuvent être partagées dans les cas suivants :
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-blue-600 text-sm">1</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Avec nos prestataires de services</p>
                            <p className="text-gray-700 text-sm">
                              Hébergeurs, processeurs de paiement, services d'analyse, fournisseurs de services marketing
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-blue-600 text-sm">2</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Dans le cadre d'une fusion, acquisition ou cession d'actifs</p>
                            <p className="text-gray-700 text-sm">
                              Vos données pourraient être transférées à la nouvelle entité
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-blue-600 text-sm">3</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Avec nos partenaires commerciaux</p>
                            <p className="text-gray-700 text-sm">
                              Uniquement dans le respect de cette politique et avec votre consentement lorsque requis
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-blue-600 text-sm">4</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Avec votre consentement explicite</p>
                            <p className="text-gray-700 text-sm">
                              Pour des services spécifiques que vous demandez explicitement
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-blue-600 text-sm">5</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Si requis par la loi ou par une autorité compétente</p>
                            <p className="text-gray-700 text-sm">
                              Pour respecter des obligations légales ou répondre à des demandes gouvernementales
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        4.2 Sous-traitants
                      </h3>
                      <p className="text-blue-800">
                        Nous exigeons de tous nos sous-traitants qu'ils respectent des standards stricts 
                        de protection des données et qu'ils signent des accords de traitement des données 
                        conformes au RGPD.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Retention */}
              {activeSection === 'data-retention' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Conservation des données</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        5. Durées de conservation
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Nous conservons vos données personnelles uniquement pendant la durée nécessaire 
                        aux finalités décrites dans cette politique, sauf obligation légale de conservation 
                        plus longue.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700">Données de compte actif</span>
                          <span className="font-medium text-gray-900">3 ans après dernière activité</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700">Données de prospect</span>
                          <span className="font-medium text-gray-900">3 ans après dernier contact</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-gray-200">
                          <span className="text-gray-700">Données de facturation</span>
                          <span className="font-medium text-gray-900">10 ans (obligation légale)</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                          <span className="text-gray-700">Cookies analytics</span>
                          <span className="font-medium text-gray-900">13 mois maximum</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        5.1 Critères de détermination
                      </h3>
                      <p className="text-blue-800">
                        Les durées de conservation sont déterminées en fonction de la finalité du traitement, 
                        des obligations légales et des délais de prescription.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Transfer */}
              {activeSection === 'data-transfer' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Transfert des données</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        6. Transferts internationaux
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Vos données peuvent être transférées en dehors de l'Union européenne. 
                        Dans ce cas, nous veillons à ce que des garanties appropriées soient mises en place.
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Clauses contractuelles types :</strong> Approuvées par la Commission Européenne
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Pays bénéficiant d'une décision d'adéquation :</strong> Garantissant un niveau de protection équivalent
                          </p>
                        </div>
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-6 w-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                            <span className="text-green-600 text-sm">✓</span>
                          </div>
                          <p className="text-gray-700">
                            <strong>Règles d'entreprise contraignantes :</strong> Pour les transferts intra-groupes
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                        6.1 Informations complémentaires
                      </h3>
                      <p className="text-yellow-800">
                        Vous pouvez obtenir des informations sur les garanties mises en place 
                        pour les transferts internationaux en contactant notre DPO.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* User Rights */}
              {activeSection === 'user-rights' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos droits (RGPD)</h2>
                  <div className="space-y-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        7. Droits des utilisateurs
                      </h3>
                      <p className="text-blue-800 mb-4">
                        Conformément au Règlement Général sur la Protection des Données (RGPD), 
                        vous disposez des droits suivants :
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Droit d'accès</h4>
                          <p className="text-gray-700 text-sm">Obtenir une copie des données que nous détenons sur vous</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Droit de rectification</h4>
                          <p className="text-gray-700 text-sm">Corriger des données inexactes ou incomplètes</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Droit à l'effacement</h4>
                          <p className="text-gray-700 text-sm">Demander la suppression de vos données</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Droit à la limitation</h4>
                          <p className="text-gray-700 text-sm">Limiter le traitement de vos données</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Droit d'opposition</h4>
                          <p className="text-gray-700 text-sm">Vous opposer au traitement de vos données</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Droit à la portabilité</h4>
                          <p className="text-gray-700 text-sm">Recevoir vos données dans un format structuré</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        7.1 Comment exercer vos droits ?
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Pour exercer vos droits, contactez notre Délégué à la Protection des Données (DPO) :
                      </p>
                      
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-700">
                          <EnvelopeIcon className="w-5 h-5 mr-3" />
                          <span>dpo@visiloo.com</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <PhoneIcon className="w-5 h-5 mr-3" />
                          <span>+33 1 23 45 67 89</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-4">
                        Nous répondrons à votre demande dans un délai d'un mois maximum. 
                        Ce délai peut être prolongé de deux mois compte tenu de la complexité 
                        et du nombre de demandes.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                        7.2 Droit de réclamation
                      </h3>
                      <p className="text-yellow-800">
                        Si vous estimez que nous ne traitons pas vos données conformément à la réglementation, 
                        vous avez le droit de déposer une plainte auprès de la 
                        <a href="https://www.cnil.fr" className="underline mx-1">CNIL</a>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Security */}
              {activeSection === 'security' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité des données</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        8. Mesures de sécurité
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Nous mettons en place des mesures techniques et organisationnelles adaptées 
                        afin de protéger vos données personnelles contre toute violation de sécurité.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Chiffrement</h4>
                          <p className="text-gray-700 text-sm">Données chiffrées en transit et au repos</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Contrôle d'accès</h4>
                          <p className="text-gray-700 text-sm">Accès restreint aux personnes autorisées</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Audits réguliers</h4>
                          <p className="text-gray-700 text-sm">Tests de sécurité et audits de conformité</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-900 mb-2">Sauvegardes</h4>
                          <p className="text-gray-700 text-sm">Sauvegardes régulières et sécurisées</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        8.1 Limitation de responsabilité
                      </h3>
                      <p className="text-blue-800">
                        Aucun système n'étant totalement sécurisé, nous ne pouvons garantir une sécurité absolue. 
                        En cas de violation de données, nous nous engageons à notifier les autorités compétentes 
                        et les personnes concernées dans les délais légaux.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Minors */}
              {activeSection === 'minors' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Protection des mineurs</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        9. Âge minimum
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Notre Service ne s'adresse pas aux personnes de moins de 16 ans. 
                        Nous ne collectons pas sciemment de données personnelles concernant des mineurs.
                      </p>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          <strong>Attention :</strong> Si vous êtes parent ou tuteur et que vous pensez que 
                          votre enfant nous a fourni des données personnelles, veuillez nous contacter 
                          immédiatement.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        9.1 Procédure de vérification
                      </h3>
                      <p className="text-blue-800">
                        Si nous découvrons que nous avons collecté des données d'un mineur sans 
                        consentement parental vérifiable, nous prendrons les mesures nécessaires 
                        pour les supprimer dans les plus brefs délais.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cookies */}
              {activeSection === 'cookies' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Politique des Cookies</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        10. Types de cookies utilisés
                      </h3>
                      
                      <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Cookies essentiels</h4>
                          <p className="text-gray-700 text-sm">
                            Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.
                          </p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Cookies de performance</h4>
                          <p className="text-gray-700 text-sm">
                            Nous aident à améliorer nos services en analysant l'usage du site.
                          </p>
                        </div>
                        <div className="border-b border-gray-200 pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Cookies de fonctionnalité</h4>
                          <p className="text-gray-700 text-sm">
                            Permettent de mémoriser vos préférences et paramètres.
                          </p>
                        </div>
                        <div className="pb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Cookies marketing</h4>
                          <p className="text-gray-700 text-sm">
                            Utilisés pour vous proposer des publicités ciblées.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        10.1 Gestion des cookies
                      </h3>
                      <p className="text-blue-800 mb-4">
                        Vous pouvez gérer vos préférences cookies à tout moment via notre 
                        <a href="/cookie-settings" className="underline mx-1">centre de préférences</a> 
                        ou directement dans les paramètres de votre navigateur.
                      </p>
                      
                      <p className="text-blue-800 text-sm">
                        La désactivation de certains cookies peut affecter le fonctionnement 
                        de certains services du site.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* External Links */}
              {activeSection === 'external-links' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Liens externes</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        11. Sites tiers
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Notre site peut contenir des liens vers d'autres sites externes. 
                        Cette Politique de Confidentialité ne s'applique qu'à notre Service.
                      </p>
                      
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <p className="text-yellow-800">
                          <strong>Recommandation :</strong> Nous vous encourageons à lire les politiques 
                          de confidentialité de tout site que vous visitez.
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        11.1 Responsabilité
                      </h3>
                      <p className="text-blue-800">
                        Nous ne sommes pas responsables des pratiques en matière de confidentialité 
                        ou du contenu des sites tiers, même s'ils sont accessibles via notre Service.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Changes */}
              {activeSection === 'changes' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Modifications de la Politique</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        12. Mises à jour
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Nous pouvons mettre à jour cette Politique de Confidentialité à tout moment. 
                        La date de dernière mise à jour sera modifiée en conséquence.
                      </p>
                      
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-blue-800 text-sm">
                          <strong>Notification :</strong> En cas de changement important, nous vous 
                          informerons par e-mail ou via une notification sur notre site.
                        </p>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                        12.1 Acceptation continue
                      </h3>
                      <p className="text-yellow-800">
                        Votre utilisation continue de notre Service après toute modification de cette 
                        Politique de Confidentialité constituera votre acceptation de ces modifications.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact */}
              {activeSection === 'contact' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        13. Coordonnées
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Délégué à la Protection des Données (DPO)</h4>
                          <div className="flex items-center text-gray-700 mb-1">
                            <EnvelopeIcon className="w-5 h-5 mr-2" />
                            <span>dpo@visiloo.com</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Support client</h4>
                          <div className="flex items-center text-gray-700 mb-1">
                            <EnvelopeIcon className="w-5 h-5 mr-2" />
                            <span>support@visiloo.com</span>
                          </div>
                          <div className="flex items-center text-gray-700">
                            <PhoneIcon className="w-5 h-5 mr-2" />
                            <span>+33 1 23 45 67 89</span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Adresse postale</h4>
                          <p className="text-gray-700">
                            Visiloo<br />
                            33 Avenue Générale de Gaulle<br />
                            77610, France
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4">
                        13.1 Délais de réponse
                      </h3>
                      <p className="text-blue-800">
                        Nous nous engageons à répondre à toute demande relative à la protection 
                        des données dans un délai maximum d'un mois. Les demandes complexes 
                        peuvent nécessiter un délai supplémentaire, dont nous vous informerons.
                      </p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-yellow-900 mb-4">
                        13.2 Autorité de contrôle
                      </h3>
                      <p className="text-yellow-800">
                        Si vous n'êtes pas satisfait de notre réponse, vous avez le droit de 
                        déposer une réclamation auprès de l'autorité française de protection 
                        des données :
                      </p>
                      <p className="text-yellow-800 mt-2">
                        <strong>CNIL</strong> - 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07<br />
                        Site web : <a href="https://www.cnil.fr" className="underline">www.cnil.fr</a>
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