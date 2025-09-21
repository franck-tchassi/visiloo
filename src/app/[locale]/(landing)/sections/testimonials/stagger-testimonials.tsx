'use client'

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

// Business testimonials data with randomly generated icons - 8 testimonials
const testimonials = [
  {
    tempId: 0,
    testimonial:
      "Visiloo a transformé notre visibilité locale. Nous avons doublé nos leads en seulement 3 mois grâce à leur plateforme tout-en-un.",
    by: "Sarah Martin, Boutique Elegance",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SarahMartin&backgroundColor=3b82f6&textColor=ffffff",
  },
  {
    tempId: 1,
    testimonial:
      "La gestion des avis Google est maintenant un jeu d'enfant. Nos clients adorent pouvoir nous laisser des commentaires facilement.",
    by: "Michael Bernard, Café Central",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MichaelBernard&backgroundColor=10b981&textColor=ffffff",
  },
  {
    tempId: 2,
    testimonial:
      "L'analyse et les recommandations IA nous ont fait gagner un temps précieux. Nous optimisons maintenant notre référencement local en quelques clics.",
    by: "Sophie Leroux, Agence Immobilière Prestige",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=SophieLeroux&backgroundColor=8b5cf6&textColor=ffffff",
  },
  {
    tempId: 3,
    testimonial:
      "La centralisation des messages sur WhatsApp, Messenger et Instagram a révolutionné notre service client. Plus jamais de message perdu !",
    by: "David Rodriguez, Restaurant Le Gourmet",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=DavidRodriguez&backgroundColor=ef4444&textColor=ffffff",
  },
  {
    tempId: 4,
    testimonial:
      "Les factures et devis automatisés nous font économiser des heures de travail chaque semaine. Une véritable bouffée d'air frais.",
    by: "Emma Thompson, Consultant Digital",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=EmmaThompson&backgroundColor=f59e0b&textColor=ffffff",
  },
  {
    tempId: 5,
    testimonial:
      "Grâce à Visiloo, notre référencement local a explosé. Nous apparaissons maintenant en première page Google pour toutes nos phrases clés.",
    by: "Thomas Dubois, Agence Web",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=ThomasDubois&backgroundColor=6366f1&textColor=ffffff",
  },
  {
    tempId: 6,
    testimonial:
      "L'espace membre nous permet de collaborer efficacement avec toute notre équipe. La gestion des accès est intuitive et sécurisée.",
    by: "Laura Petit, Studio Créatif",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=LauraPetit&backgroundColor=ec4899&textColor=ffffff",
  },
  {
    tempId: 7,
    testimonial:
      "Les rapports détaillés nous aident à prendre des décisions éclairées pour développer notre business local. Des données précieuses !",
    by: "Marc Leroy, Centre de Formation",
    imgSrc: "https://api.dicebear.com/7.x/initials/svg?seed=MarcLeroy&backgroundColor=06b6d4&textColor=ffffff",
  },
]

interface TestimonialCardProps {
  position: number
  testimonial: (typeof testimonials)[0]
  handleMove: (steps: number) => void
  cardSize: number
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize }) => {
  const isCenter = position === 0
  
  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-8 transition-all duration-500 ease-in-out rounded-2xl",
        isCenter
          ? "z-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-2xl"
          : "z-0 bg-white text-gray-900 border-gray-200 hover:border-indigo-300 shadow-lg",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
          scale(${isCenter ? 1 : 0.9})
        `,
        opacity: isCenter ? 1 : Math.max(0.3, 1 - Math.abs(position) * 0.2),
      }}
    >
      <div className="flex items-start mb-6">
        <img
          src={testimonial.imgSrc || "/placeholder.svg"}
          alt={`${testimonial.by.split(",")[0]}`}
          className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-md"
        />
        <div className="ml-4">
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h4 className={cn("font-semibold text-sm", isCenter ? "text-white" : "text-gray-900")}>
            {testimonial.by.split(",")[0]}
          </h4>
          <p className={cn("text-xs", isCenter ? "text-indigo-100" : "text-gray-500")}>
            {testimonial.by.split(",")[1]}
          </p>
        </div>
      </div>
      
      <p className={cn("text-lg leading-relaxed mb-6", isCenter ? "text-white" : "text-gray-700")}>
        "{testimonial.testimonial}"
      </p>
      
      {/* Badge de catégorie */}
      <div className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        isCenter ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-800"
      )}>
        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        Client vérifié
      </div>
    </div>
  )
}

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(400)
  const [testimonialsList, setTestimonialsList] = useState(testimonials)

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)")
      setCardSize(matches ? 400 : 320)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="relative w-full overflow-hidden bg-white py-12 flex justify-center" style={{ height: 600 }}>
      <div className="relative  max-w-5xl mx-auto">
        {testimonialsList.map((testimonial, index) => {
          const position = index - Math.floor(testimonialsList.length / 2)
          return (
            <TestimonialCard
              key={testimonial.tempId}
              testimonial={testimonial}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          )
        })}
      </div>
      
      {/* Boutons de navigation arrondis */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
            "bg-white border-2 border-indigo-300 text-indigo-600 shadow-lg",
            "hover:bg-indigo-600 hover:text-white hover:border-indigo-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          )}
          aria-label="Témoignage précédent"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300",
            "bg-white border-2 border-indigo-300 text-indigo-600 shadow-lg",
            "hover:bg-indigo-600 hover:text-white hover:border-indigo-600",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          )}
          aria-label="Témoignage suivant"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
      
     
      
    </div>
  )
}