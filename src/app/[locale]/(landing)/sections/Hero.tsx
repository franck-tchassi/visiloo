'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { XMarkIcon, PlayCircleIcon, GlobeAltIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { MdSupportAgent } from "react-icons/md";
import HeroVideoDialog from "./hero-video-dialog"
import { HiOutlineCurrencyDollar } from "react-icons/hi2";
import { AnimatePresence, motion } from 'framer-motion'

export default function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)

  return (
    <div className="bg-gray-900">
      <div className="relative isolate px-6 lg:px-8 pt-20">
        {/* Effet d'arrière-plan flou */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
            className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-5xl py-20 sm:py-28 lg:py-32">
          <div className="text-center">
            {/* Badge d'annonce */}
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-4 py-1 text-sm text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                🚀 Plateforme tout-en-un de marketing local et gestion d'avis
              </div>
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl">
             Centralisez votre présence en ligne et boostez votre visibilité locale
            </h1>

            {/* Sous-titre */}
            <p className="mt-8 text-xl text-pretty text-gray-300 sm:text-2xl">
              Solution complète pour gérer tous vos canaux de communication, générer plus d'avis clients,
              créer des devis et factures professionnels, et publier automatiquement du contenu optimisé par IA.
            </p>

            {/* Boutons d'action */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <a
                href="/demo"
                className="rounded-lg bg-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:bg-indigo-500 transition-colors duration-200 flex items-center justify-center"
              >
                Demander une démo
              </a>
              
              {/* Bouton pour ouvrir la vidéo */}
              <button
                onClick={() => setIsVideoDialogOpen(true)}
                className="rounded-lg bg-gray-800 px-8 py-4 cursor-pointer text-sm font-semibold text-white ring-1 ring-white/10 hover:ring-white/20 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <PlayCircleIcon className="w-6 h-6" />
                Visiloo en vidéo
              </button>
            </div>

            {/* Section Garanties */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Garantie Satisfait ou Remboursé */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center  mb-4">
                  <HiOutlineCurrencyDollar className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Garantie 30 jours</h3>
                <p className="mt-2 text-sm text-gray-400">Satisfait ou remboursé</p>
              </div>

              {/* Compatibilité internationale */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center  mb-4">
                  <GlobeAltIcon className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Multi-langues</h3>
                <p className="mt-2 text-sm text-gray-400">Fonctionne partout dans le monde</p>
              </div>

              {/* Confiance des clients */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center  mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Expertise reconnue</h3>
                <p className="mt-2 text-sm text-gray-400">Plus de 26 815 profils Google nous font confiance</p>
              </div>

              {/* Support expert */}
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center mb-4">
                  <MdSupportAgent className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Support expert</h3>
                <p className="mt-2 text-sm text-gray-400">Créé par des spécialistes du référencement local</p>
              </div>
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
            className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
          />
        </div>
      </div>

      {/* Dialog pour la vidéo */}
      <AnimatePresence>
        {isVideoDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsVideoDialogOpen(false)}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="relative mx-4 aspect-video w-full max-w-6xl md:mx-0"
            >
              <button 
                onClick={() => setIsVideoDialogOpen(false)}
                className="absolute -top-12 -right-24 cursor-pointer rounded-full bg-neutral-900/50 p-2 text-xl text-white ring-1 backdrop-blur-md dark:bg-neutral-100/50 dark:text-black"
              >
                <XMarkIcon className="size-5" />
              </button>
              <div className="relative isolate z-[1] size-full overflow-hidden rounded-2xl border-2 border-white">
                <iframe
                  src="https://www.youtube.com/embed/qh3NGpYRG3I?si=4rb-zSdDkVK9qxxb"
                  className="size-full rounded-2xl"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                ></iframe>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}