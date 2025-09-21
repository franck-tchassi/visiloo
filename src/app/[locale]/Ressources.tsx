"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';

const Ressources = () => {
  const [isOpen, setIsOpen] = useState(false);

  const resourcesItems = {
    readingList: {
      title: "LISTE DE LECTURE",
      icon: BookOpenIcon,
      items: [
        {
          name: "Optimisation profil Google 2025",
          href: "/ressources/optimisation-profil-google-2025"
        },
        {
          name: "Avis non affichés sur Google",
          href: "/ressources/avis-google-maps-search"
        },
      ]
    },
    knowledgeCenter: {
      title: "CENTRE DE CONNAISSANCES",
      icon: AcademicCapIcon,
      items: [
        {
          name: "Blog",
          description: "Stratégies marketing local et référencement",
          href: "/blog"
        },
        {
          name: "Dictionnaire marketing",
          description: "Termes essentiels du marketing expliqués",
          href: "/dictionnaire-marketing"
        },
        {
          name: "Tutoriels vidéo",
          description: "Guides pour maîtriser Visiloo",
          href: "/tutoriels-video"
        },
      ]
    },
    successSupport: {
      title: "SUCCÈS & SUPPORT",
      icon: TrophyIcon,
      items: [
        {
          name: "Histoires de réussite",
          description: "Résultats concrets avec Visiloo",
          href: "/success-stories"
        },
        {
          name: "Centre d'aide",
          description: "Réponses à vos questions",
          href: "/centre-aide"
        },
        {
          name: "Changelog",
          description: "Nouvelles fonctionnalités",
          href: "/changelog"
        },
      ]
    },
    about: {
      title: "À PROPOS",
      icon: QuestionMarkCircleIcon,
      items: [
        {
          name: "Contact",
          description: "Notre équipe est là pour vous aider",
          href: "/contact"
        },
      ]
    }
  };

  return (
    <div className="relative">
      <HoverCard openDelay={100} closeDelay={100} onOpenChange={setIsOpen}>
        <HoverCardTrigger asChild>
          <button className="text-sm font-medium text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-md">
            Ressources
          </button>
        </HoverCardTrigger>

        <HoverCardContent
          className="p-4 bg-gray-800 shadow-xl border border-gray-700 rounded-lg w-[800px]"
          sideOffset={10}
          align="start"
          side="bottom"
          avoidCollisions={true}
        >
          <div className="grid grid-cols-4 gap-4">
            {/* Liste de lecture */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                  <BookOpenIcon className="size-4 text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{resourcesItems.readingList.title}</h4>
              </div>
              <ul className="space-y-2">
                {resourcesItems.readingList.items.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className="block text-xs text-gray-400 hover:text-white transition-colors py-1.5 px-2 rounded-md hover:bg-white/5"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Centre de connaissances */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                  <AcademicCapIcon className="size-4 text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{resourcesItems.knowledgeCenter.title}</h4>
              </div>
              <ul className="space-y-2">
                {resourcesItems.knowledgeCenter.items.map((item) => (
                  <li key={item.name} className="group">
                    <a 
                      href={item.href} 
                      className="block p-2 rounded-md transition-colors hover:bg-white/5"
                    >
                      <div className="text-xs font-medium text-white group-hover:text-indigo-300">
                        {item.name}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Succès et support */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                  <TrophyIcon className="size-4 text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{resourcesItems.successSupport.title}</h4>
              </div>
              <ul className="space-y-2">
                {resourcesItems.successSupport.items.map((item) => (
                  <li key={item.name} className="group">
                    <a 
                      href={item.href} 
                      className="block p-2 rounded-md transition-colors hover:bg-white/5"
                    >
                      <div className="text-xs font-medium text-white group-hover:text-indigo-300">
                        {item.name}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* À propos */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                  <QuestionMarkCircleIcon className="size-4 text-gray-400" />
                </div>
                <h4 className="text-sm font-semibold text-white">{resourcesItems.about.title}</h4>
              </div>
              <ul className="space-y-2">
                {resourcesItems.about.items.map((item) => (
                  <li key={item.name} className="group">
                    <a 
                      href={item.href} 
                      className="block p-2 rounded-md transition-colors hover:bg-white/5"
                    >
                      <div className="text-xs font-medium text-white group-hover:text-indigo-300">
                        {item.name}
                      </div>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
};

export default Ressources;