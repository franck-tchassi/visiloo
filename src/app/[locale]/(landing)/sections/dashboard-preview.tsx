'use client'

import Image from "next/image"
import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PiBuildingBold, PiChatsCircleBold, PiShootingStarBold } from "react-icons/pi"
import { IconFileText, IconUserPlus } from "@tabler/icons-react"
import { VscFiles } from "react-icons/vsc"
import { CiViewList } from "react-icons/ci"
import { FaUsers } from "react-icons/fa"
import { AiOutlineFileSearch } from "react-icons/ai"

const features = [
  {
    id: 1,
    name: "Établissements",
    icon: PiBuildingBold,
    description: "Recherchez et gérez tous vos établissements sur Google Maps en un seul endroit. Visualisez vos positions et optimisez votre présence locale.",
    image: "/visiloo-landing.png",
    color: "text-blue-500",
  },
  {
    id: 2,
    name: "Leads",
    icon: IconUserPlus,
    description: "Détectez et qualifiez automatiquement les prospects près de chez vous. Système intelligent de scoring et intégration CRM.",
    image: "/visiloo-landing.png",
    color: "text-purple-500",
  },
  {
    id: 3,
    name: "Avis",
    icon: PiShootingStarBold,
    description: "Collectez, analysez et répondez aux avis Google My Business. Réponses automatiques personnalisables et suivi de la réputation.",
    image: "/visiloo-landing.png",
    color: "text-amber-500",
  },
  {
    id: 4,
    name: "Contenu",
    icon: VscFiles,
    description: "Publiez automatiquement du contenu sur Facebook, Google et autres plateformes. Planification et analyse des performances.",
    image: "/visiloo-landing.png",
    color: "text-green-500",
  },
  {
    id: 5,
    name: "Messages",
    icon: PiChatsCircleBold,
    description: "Centralisez WhatsApp, Messenger, Instagram et tous vos canaux de messagerie dans une interface unique.",
    image: "/visiloo-landing.png",
    color: "text-pink-500",
  },
  {
    id: 6,
    name: "Annuaire",
    icon: CiViewList,
    description: "Inscrivez votre entreprise dans les annuaires professionnels pertinents pour booster votre référencement local.",
    image: "/visiloo-landing.png",
    color: "text-indigo-500",
  },
  {
    id: 7,
    name: "Factures",
    icon: IconFileText,
    description: "Générez automatiquement factures et devis professionnels. Gestion simplifiée de la comptabilité.",
    image: "/visiloo-landing.png",
    color: "text-red-500",
  },
  {
    id: 8,
    name: "Membres",
    icon: FaUsers,
    description: "Créez un espace de travail collaboratif et invitez votre équipe à gérer votre entreprise ensemble.",
    image: "/visiloo-landing.png",
    color: "text-teal-500",
  },
  {
    id: 9,
    name: "Audit",
    icon: AiOutlineFileSearch,
    description: "Analysez les points faibles de votre profil Google My Business et recevez des recommandations personnalisées.",
    image: "/visiloo-landing.png",
    color: "text-cyan-500",
  }
]

export function DashboardPreview() {
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const currentFeature = features[currentFeatureIndex]

  const nextFeature = useCallback(() => {
    setCurrentFeatureIndex((prev) => (prev + 1) % features.length)
  }, [features.length])

  const prevFeature = useCallback(() => {
    setCurrentFeatureIndex((prev) => (prev - 1 + features.length) % features.length)
  }, [features.length])

  const selectFeature = (index: number) => {
    setCurrentFeatureIndex(index)
  }

  // Fonction pour démarrer/arrêter le défilement automatique
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Effet pour le défilement automatique
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextFeature()
      }, 3000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, nextFeature])

  // Calcul des éléments à afficher (toujours centrer l'élément actif)
  const getVisibleFeatures = () => {
    const visibleCount = 5 // Nombre d'éléments visibles
    const halfVisible = Math.floor(visibleCount / 2)
    
    let startIndex = currentFeatureIndex - halfVisible
    if (startIndex < 0) {
      startIndex = features.length + startIndex
    }
    
    const visibleFeatures = []
    for (let i = 0; i < visibleCount; i++) {
      const index = (startIndex + i) % features.length
      visibleFeatures.push(features[index])
    }
    
    return visibleFeatures
  }

  const visibleFeatures = getVisibleFeatures()

  return (
    <div className="relative isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* Background decoration */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>

      <div className="flex justify-center w-full">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Carousel des fonctionnalités */}
          <div className="mb-12">
            {/* Navigation et fonctionnalités */}
            <div className="relative">
              {/* Boutons de navigation */}
              <button
                onClick={prevFeature}
                className="absolute left-0 top-1/2 -translate-y-1/2 cursor-pointer -translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <button
                onClick={nextFeature}
                className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer translate-x-4 z-10 bg-white rounded-full p-3 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Liste des fonctionnalités */}
              <div className="overflow-hidden px-12">
                <div className="flex justify-center space-x-4 py-4">
                  {visibleFeatures.map((feature, index) => {
                    const actualIndex = features.findIndex(f => f.id === feature.id)
                    const isActive = actualIndex === currentFeatureIndex
                    const IconComponent = feature.icon
                    
                    return (
                      <button
                        key={feature.id}
                        onClick={() => selectFeature(actualIndex)}
                        className={`flex flex-col items-center p-4 rounded-2xl cursor-pointer min-w-[120px] transition-all duration-300 focus:outline-none ${
                          isActive
                            ? ' shadow-lg bg-white scale-105'
                            : 'text-gray-300  opacity-80'
                        }`}
                      >
                        <div className="p-3 rounded-full mb-2">
                          <IconComponent 
                            className={`w-6 h-6 transition-transform duration-300 ${
                              isActive 
                                ? `scale-125 ${feature.color}` 
                                : feature.color
                            }`} 
                          />
                        </div>
                        <span className="text-sm font-medium text-center">{feature.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Indicateurs de progression */}
            <div className="flex justify-center  space-x-2 mt-6">
              {features.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => selectFeature(index)}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-all focus:outline-none ${
                    index === currentFeatureIndex 
                      ? 'scale-125 bg-white' 
                      : 'bg-gray-600 hover:scale-110'
                  }`}
                  aria-label={`Aller à la fonctionnalité ${index + 1}`}
                />
              ))}
            </div>

            {/* Description de la fonctionnalité sélectionnée */}
            <div className="text-center mt-8">
              <div className="rounded-2xl p-6">
                <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                  {currentFeature.description}
                </p>
              </div>
            </div>
          </div>

          {/* Preview du dashboard */}
          <div className="bg-white rounded-3xl p-4 shadow-2xl border border-white">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={currentFeature.image || "/visiloo-landing.png"}
                alt={`Aperçu ${currentFeature.name} - Tableau de bord Visiloo`}
                width={1160}
                height={700}
                className="w-full h-auto object-cover transition-opacity duration-500"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}