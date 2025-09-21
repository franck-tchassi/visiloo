'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function GoogleBusinessProfile() {
  return (
    <section className="bg-gray-800 py-24 relative overflow-hidden">
      {/* Effet d'arrière-plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 z-0"></div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Colonne de gauche - Texte */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Plus de <span className="text-indigo-400">500</span> fiches Google optimisées avec <span className="text-white">Visiloo</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Visiloo accompagne les entreprises, indépendants et agences dans la gestion centralisée de leur visibilité locale. Créez, optimisez et suivez vos profils en toute simplicité pour attirer plus de clients là où ils vous recherchent.
            </p>
            <div className="flex flex-col justify-center sm:flex-row gap-4">
              <Link 
                href="/signin" 
                className="inline-flex items-center justify-center bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors"
              >
                Commencer maintenant
              </Link>
            </div>
          </motion.div>

          {/* Colonne de droite - Image */}
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl bg-gradient-to-br from-gray-700 to-gray-900 overflow-hidden flex items-center justify-center p-8 border border-gray-600/30 shadow-2xl">
                <img
                  src="/profil-entreprise.png"
                  alt="Gestion de Profils Google Business avec Visiloo"
                  className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder-google-business.png';
                  }}
                />
              </div>
              
            
            </div>
          </motion.div>
        </div>
        
       
      </div>
    </section>
  )
}