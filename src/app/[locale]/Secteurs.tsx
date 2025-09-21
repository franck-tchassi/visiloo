"use client";

import { useState } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  BuildingOfficeIcon,
  BriefcaseIcon,
} from '@heroicons/react/24/outline';

const Secteurs = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sectorsItems = {
    companyType: {
      title: "Type d'entreprise",
      items: [
        { name: 'TPE/PME', href: '/secteurs/tpe-pme' },
        { name: 'Grandes entreprises', href: '/secteurs/grandes-entreprises' },
        { name: 'Secteur public', href: '/secteurs/secteur-public' },
      ]
    },
    industryType: {
      title: "Type d'industrie",
      items: [
        { name: 'Automobile', href: '/secteurs/automobile' },
        { name: 'Avocats', href: '/secteurs/avocats' },
        { name: 'Beauté', href: '/secteurs/beaute' },
        { name: 'Hotels', href: '/secteurs/hotels' },
        { name: 'Magasins spécialisés', href: '/secteurs/magasins-specialises' },
        { name: 'Mode', href: '/secteurs/mode' },
        { name: 'Restauration', href: '/secteurs/restauration' },
        { name: 'Santé', href: '/secteurs/sante' },
      ]
    }
  };

  return (
    <HoverCard openDelay={100} closeDelay={100} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <button className="text-sm font-medium text-white hover:text-gray-300 transition-colors px-3 py-2 rounded-md data-[state=open]:text-gray-300">
          Secteurs
        </button>
      </HoverCardTrigger>

      <HoverCardContent
        className="p-4 bg-gray-800 shadow-xl border border-gray-700 rounded-lg w-[500px] max-w-[90vw]"
        sideOffset={10}
        align="center"
        side="bottom"
        avoidCollisions={true}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Type d'entreprise */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                <BuildingOfficeIcon className="size-4 text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">{sectorsItems.companyType.title}</h4>
            </div>
            <ul className="space-y-2">
              {sectorsItems.companyType.items.map((item) => (
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

          {/* Type d'industrie */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gray-700/50">
                <BriefcaseIcon className="size-4 text-gray-400" />
              </div>
              <h4 className="text-sm font-semibold text-white">{sectorsItems.industryType.title}</h4>
            </div>
            <ul className="space-y-2">
              {sectorsItems.industryType.items.map((item) => (
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
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default Secteurs;