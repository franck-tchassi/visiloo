"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  RocketLaunchIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const Fonctionnalites = () => {
  const [isOpen, setIsOpen] = useState(false);

  const featuresItems = {
    aiStrategy: {
      title: "STRATÉGIE IA",
      icon: RocketLaunchIcon,
      items: [
        {
          name: "Vérificateur classement local",
          description: "Voyez où se classe votre entreprise",
          href: "/features/verificateur-classement"
        },
        {
          name: "Générateur schéma LocalBusiness",
          description: "Code pour améliorer votre visibilité locale",
          href: "/features/schema-generator"
        },
        {
          name: "Agent IA",
          description: "Stratégies personnalisées pour votre entreprise",
          href: "/features/agent-ia"
        },
        {
          name: "Tâches référencement local",
          description: "Tâches hebdomadaires prioritaires",
          href: "/features/taches-seo"
        },
        {
          name: "Suivi classement local",
          description: "Surveillez vos classements Google",
          href: "/features/suivi-classement"
        },
        {
          name: "Audit GBP",
          description: "Améliorations pour vos classements locaux",
          href: "/features/audit-gbp"
        },
      ]
    },
    multiPublication: {
      title: "PUBLICATION MULTI-PLATEFORME",
      icon: CloudArrowUpIcon,
      items: [
        {
          name: "Créateur publications",
          description: "Créez et planifiez des publications captivantes",
          href: "/features/planificateur-publications"
        },
        {
          name: "Statistiques profil",
          description: "Métriques de performance pour décisions",
          href: "/features/statistiques-profil"
        },
        {
          name: "Gestionnaire citations",
          description: "Citations pour renforcer présence locale",
          href: "/features/gestionnaire-citations"
        },
        {
          name: "Créateur site web",
          description: "Site web professionnel qui convertit",
          href: "/features/createur-site-web"
        },
      ]
    },
    customerRelations: {
      title: "RELATIONS CLIENTS",
      icon: UserGroupIcon,
      items: [
        {
          name: "Affiche avis Google",
          description: "Générez une affiche QR pour plus d'avis",
          href: "/features/affiche-avis-google"
        },
        {
          name: "Gestionnaire d'avis",
          description: "Répondez à chaque avis personnellement",
          href: "/features/gestionnaire-avis"
        },
      ]
    }
  };

  return (
    <HoverCard openDelay={100} closeDelay={100} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <button className="text-sm font-medium text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-md data-[state=open]:text-gray-300">
          Fonctionnalités
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        className="p-4 bg-gray-800 shadow-xl border border-gray-700 rounded-lg w-[780px] max-w-[90vw]"
        sideOffset={10}
        align="start"
        side="bottom"
        avoidCollisions={true}
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Stratégie de croissance IA */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                <RocketLaunchIcon className="size-4 text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">{featuresItems.aiStrategy.title}</h4>
            </div>
            <ul className="space-y-2">
              {featuresItems.aiStrategy.items.map((item) => (
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

          {/* Plateforme multi publication */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                <CloudArrowUpIcon className="size-4 text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">{featuresItems.multiPublication.title}</h4>
            </div>
            <ul className="space-y-2">
              {featuresItems.multiPublication.items.map((item) => (
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

          {/* Construire des relations clients */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                <UserGroupIcon className="size-4 text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">{featuresItems.customerRelations.title}</h4>
            </div>
            <ul className="space-y-2">
              {featuresItems.customerRelations.items.map((item) => (
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
  );
};

export default Fonctionnalites;