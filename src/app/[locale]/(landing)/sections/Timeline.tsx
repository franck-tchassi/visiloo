'use client'

import { JSX, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { 
  PlayCircleIcon, 
  ChartBarIcon, 
  RocketLaunchIcon, 
  ArrowTrendingUpIcon,
  UserGroupIcon,
  CloudArrowUpIcon,
  StarIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'

interface FeatureEntry {
  id: number
  image: string
  alt: string
  title: string
  description: string
  category: string
  layout: "left" | "right"
}

interface FeaturesProps {
  features: FeatureEntry[]
  className?: string
}

export default function FeaturesShowcase({ features, className }: FeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  // Fonction pour obtenir l'icône par catégorie
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, JSX.Element> = {
      'stratégie': <ChartBarIcon className="w-5 h-5 text-white" />,
      'publication': <CloudArrowUpIcon className="w-5 h-5 text-white" />,
      'relations': <UserGroupIcon className="w-5 h-5 text-white" />,
      'analytics': <ArrowTrendingUpIcon className="w-5 h-5 text-white" />,
      'gestion': <BuildingStorefrontIcon className="w-5 h-5 text-white" />,
      'default': <RocketLaunchIcon className="w-5 h-5 text-white" />
    }
    return icons[category.toLowerCase()] || icons.default
  }

  // Couleurs par catégorie
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'stratégie': 'bg-blue-600',
      'publication': 'bg-purple-600',
      'relations': 'bg-pink-600',
      'analytics': 'bg-green-600',
      'gestion': 'bg-orange-600',
      'default': 'bg-indigo-600'
    }
    return colors[category.toLowerCase()] || colors.default
  }

  return (
    <section className="bg-gray-900 py-24 relative overflow-hidden">
      {/* Effets d'arrière-plan similaires au Hero */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* En-tête de section */}
        <div className="text-center mb-20">
          {/* Badge d'annonce - style similaire au Hero */}
          <div className="mb-8 flex justify-center">
            <div className="relative rounded-full px-4 py-1 text-sm text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
              ✨ Des outils puissants pour chaque aspect de votre business local
            </div>
          </div>

          {/* Titre principal */}
          <h2 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-4xl">
             97 % des consommateurs recherchent des entreprises locales en ligne
          </h2>

          {/* Sous-titre */}
          <p className="mt-8 text-xl text-pretty text-gray-300 sm:text-2xl max-w-4xl mx-auto">
            Optimisez votre fiche Google en suivant des recommandations adaptées à votre activité, améliorez votre visibilité dans les recherches locales et attirez davantage de clients. Grâce à Visiloo, vous bénéficiez d’un accompagnement simple et efficace pour renforcer votre présence en ligne et faire rayonner votre entreprise là où vos clients vous cherchent.
          </p>
        </div>

        {/* Timeline des fonctionnalités */}
        <div ref={containerRef} className="relative">
          {/* Ligne centrale décorative */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 transform -translate-x-1/2 z-0 opacity-50" />
          
          {/* Ligne animée */}
          <motion.div
            className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 transform -translate-x-1/2 origin-top z-0"
            style={{ height: lineHeight }}
          />

          <div className="space-y-32">
            {features.map((feature, index) => (
              <FeatureItem 
                key={feature.id} 
                feature={feature} 
                index={index} 
                getCategoryIcon={getCategoryIcon}
                getCategoryColor={getCategoryColor}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Effet d'arrière-plan bas */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
        />
      </div>
    </section>
  )
}

function FeatureItem({ 
  feature, 
  index, 
  getCategoryIcon,
  getCategoryColor 
}: { 
  feature: FeatureEntry
  index: number
  getCategoryIcon: (category: string) => JSX.Element
  getCategoryColor: (category: string) => string
}) {
  const itemRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [80, 0, -80])
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.9])

  const isLeft = feature.layout === "left"

  return (
    <motion.div 
      ref={itemRef} 
      style={{ opacity, y, scale }}
      className="relative group"
    >
      {/* Point sur la timeline - avec couleur de catégorie */}
      <motion.div
        className={`absolute left-1/2 top-1/2 w-14 h-14 ${getCategoryColor(feature.category)} rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center shadow-lg border-2 border-white/20 group-hover:border-white/40 transition-all duration-300`}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        transition={{
          duration: 0.6,
          delay: index * 0.2,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        viewport={{ once: true }}
        whileHover={{ 
          scale: 1.1,
          rotate: 5
        }}
      >
        {getCategoryIcon(feature.category)}
      </motion.div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-28 items-center">
          {/* Contenu à gauche pour les éléments pairs */}
          {isLeft && (
            <div className="md:pr-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2 + 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Badge de catégorie */}
                <div className={`inline-flex items-center gap-2 ${getCategoryColor(feature.category)}/20 px-4 py-2 rounded-full text-sm font-medium text-gray-200 border border-gray-700/30`}>
                  <span className="text-xs uppercase tracking-wider">{feature.category}</span>
                </div>
                
                {/* Titre de la fonctionnalité */}
                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Bouton CTA */}
                <div className="flex items-center gap-4 pt-4">
                  <button className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors duration-300 text-sm">
                    <span>En savoir plus</span>
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Image au centre, alignée avec la timeline */}
          <div className="relative">
            
            
            <motion.div
              className="relative overflow-hidden rounded-2xl aspect-video bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border border-gray-700/50 z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true }}
            >
              <img
                src={feature.image || "/placeholder.svg"}
                alt={feature.alt}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Overlay d'effet premium */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-purple-900/10 mix-blend-overlay" />
              
              {/* Badge de catégorie sur l'image */}
              <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-medium text-white ${getCategoryColor(feature.category)} backdrop-blur-sm`}>
                {feature.category}
              </div>
            </motion.div>
          </div>

          {/* Contenu à droite pour les éléments impairs */}
          {!isLeft && (
            <div className="md:pl-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2 + 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {/* Badge de catégorie */}
                <div className={`inline-flex items-center gap-2 ${getCategoryColor(feature.category)}/20 px-4 py-2 rounded-full text-sm font-medium text-gray-200 border border-gray-700/30`}>
                  <span className="text-xs uppercase tracking-wider">{feature.category}</span>
                </div>
                
                {/* Titre de la fonctionnalité */}
                <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-500">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-lg text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Bouton CTA */}
                <div className="flex items-center gap-4 pt-4">
                  <button className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-200 transition-colors duration-300 text-sm">
                    <span>En savoir plus</span>
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}