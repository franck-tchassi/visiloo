"use client";

import { useState } from 'react'
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  InformationCircleIcon,
  ChevronRightIcon,
  BuildingOfficeIcon,
  BriefcaseIcon,
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
  RocketLaunchIcon,
  CloudArrowUpIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import LocaleSelectLanguage from '@/app/[locale]/LocaleSelectLanguage';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from 'next/image';
import Ressources from '@/app/[locale]/Ressources';
import Fonctionnalites from '@/app/[locale]/Fonctionnalites';
import Secteurs from '@/app/[locale]/Secteurs';
import APropos from '@/app/[locale]/APropos';

const resourcesItems = {
  readingList: {
    title: "LISTE DE LECTURE",
    icon: BookOpenIcon,
    items: [
      {
        name: "Optimisation du profil d'entreprise Google - comment le faire en 2025?",
        href: "/ressources/optimisation-profil-google-2025"
      },
      {
        name: "Pourquoi mes avis ne s'affichent-ils pas sur Google Maps et Google Search ?",
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
        description: "Obtenez des stratégies concrètes pour le marketing local et le référencement Google",
        href: "/blog"
      },
      {
        name: "Dictionnaire marketing",
        description: "Comprenez les termes essentiels du marketing avec des explications claires",
        href: "/dictionnaire-marketing"
      },
      {
        name: "Tutoriels vidéo",
        description: "Maîtrisez les fonctionnalités de Visiloo avec des guides vidéo étape par étape",
        href: "/tutoriels-video"
      },
    ]
  },
  successSupport: {
    title: "SUCCÈS ET SUPPORT",
    icon: TrophyIcon,
    items: [
      {
        name: "Histoires de réussite",
        description: "Découvrez comment les entreprises obtiennent des résultats concrets avec Visiloo",
        href: "/success-stories"
      },
      {
        name: "Centre d'aide",
        description: "Obtenez des réponses claires à toutes vos questions sur Visiloo",
        href: "/centre-aide"
      },
      {
        name: "Changelog",
        description: "Restez informé des nouvelles fonctionnalités et améliorations",
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
        description: "Des questions ou besoin d'aide ? Notre équipe est prête à vous aider !",
        href: "/contact"
      },
    ]
  }
}

const featuresItems = {
  aiStrategy: {
    title: "STRATÉGIE DE CROISSANCE IA",
    icon: RocketLaunchIcon,
    items: [
      {
        name: "Vérificateur de classement local gratuit",
        description: "Voyez exactement où se classe votre entreprise dans les résultats locaux",
        href: "/features/verificateur-classement"
      },
      {
        name: "Générateur de schéma LocalBusiness gratuit",
        description: "Générez instantanément du code qui améliore votre visibilité locale",
        href: "/features/generateur-schema"
      },
      {
        name: "Agent IA Nouveau",
        description: "Obtenez des stratégies personnalisées et exploitables adaptées à votre entreprise",
        href: "/features/agent-ia"
      },
      {
        name: "Tâches de référencement local",
        description: "Complétez des tâches hebdomadaires prioritaires qui génèrent des résultats concrets",
        href: "/features/taches-seo"
      },
      {
        name: "Suivi de classement local",
        description: "Surveillez vos classements Google avec précision et clarté",
        href: "/features/suivi-classement"
      },
      {
        name: "Audit GBP",
        description: "Découvrez des améliorations spécifiques qui renforcent vos classements locaux",
        href: "/features/audit-gbp"
      },
    ]
  },
  multiPublication: {
    title: "PLATEFORME MULTI PUBLICATION",
    icon: CloudArrowUpIcon,
    items: [
      {
        name: "Créateur et planificateur de publications",
        description: "Créez des publications captivantes en quelques minutes et planifiez-les pour un impact maximal",
        href: "/features/planificateur-publications"
      },
      {
        name: "Statistiques de profil d'entreprise",
        description: "Suivez les métriques de performance qui guident les décisions d'entreprise",
        href: "/features/statistiques-profil"
      },
      {
        name: "Gestionnaire de citations locales",
        description: "Créez des citations en ligne puissantes qui renforcent votre présence locale",
        href: "/features/gestionnaire-citations"
      },
      {
        name: "Créateur de site web local gratuit",
        description: "Créez un site web professionnel qui convertit les visiteurs en clients",
        href: "/features/createur-site-web"
      },
    ]
  },
  customerRelations: {
    title: "CONSTRUIRE DES RELATIONS CLIENTS",
    icon: UserGroupIcon,
    items: [
      {
        name: "Affiche gratuite d'avis Google Nouveau",
        description: "Générez une affiche QR et attirez plus d'avis Google en quelques minutes",
        href: "/features/affiche-avis-google"
      },
      {
        name: "Gestionnaire d'avis",
        description: "Répondez à chaque avis avec des messages personnalisés et opportuns",
        href: "/features/gestionnaire-avis"
      },
    ]
  }
}

const aboutItems = [
  {
    name: 'Qui sommes-nous ?',
    description: 'Rencontrez l\'équipe derrière Visiloo',
    href: '/apropos/equipe',
    icon: InformationCircleIcon,
    arrow: true
  },
]

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
      { name: 'Avocats', href: '/secteurs/avocat' },
      { name: 'Beauté', href: '/secteurs/beaute' },
      { name: 'Hotels', href: '/secteurs/hotels' },
      { name: 'Magasins spécialisés', href: '/secteurs/magasins-specialises' },
      { name: 'Mode', href: '/secteurs/mode' },
      { name: 'Restauration', href: '/secteurs/restauration' },
      { name: 'Santé', href: '/secteurs/sante' },
    ]
  }
}

const ListItem = ({ className, title, children, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "block select-none space-y-2 rounded-lg p-4 leading-none no-underline outline-none transition-colors hover:bg-accent/20 hover:text-accent-foreground focus:bg-accent/20 focus:text-accent-foreground",
            "text-base", // <-- taille augmentée
            className
          )}
          {...props}
        >
          <div className="text-base font-semibold">{title}</div>
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-gray-900 fixed top-0 left-0 w-full z-50">
      <nav aria-label="Global" className="mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Colonne de gauche - Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="flex items-center">
              <Image
                src="/logo/visiloo.png"
                alt="Visiloo"
                width={32}
                height={32}
                className="h-12 w-12 mr-2"
              />
              
              <span className="sr-only">Visiloo</span>
              <span className="text-white text-xl font-bold">Visiloo</span>
            </a>
          </div>

          {/* Colonne du milieu - Navigation */}
          <div className="hidden lg:flex lg:items-center  lg:justify-center lg:flex-1 lg:gap-6">
            <div className="relative">
              <Ressources />
            </div>
            <div className="relative">
              <Fonctionnalites />
            </div>
            <div className="relative">
              <Secteurs />
            </div>
            <div className="relative">
              <APropos />
            </div>
            
            {/* Tarifs */}
            <Link href="/pricing" className="text-sm font-medium text-white hover:text-gray-300 transition-colors whitespace-nowrap px-3 py-2">
              Tarifs
            </Link>

          </div>

          {/* Colonne de droite - Actions */}
          <div className="flex items-center gap-6">
            <LocaleSelectLanguage />
            <a
              href="/login"
              className="hidden lg:block text-sm font-semibold text-white hover:text-gray-300 transition-colors whitespace-nowrap"
            >
              Se connecter <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href="/demo"
              className="hidden lg:block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors whitespace-nowrap"
            >
              Demander une démo
            </a>

            {/* Bouton menu mobile */}
            <button
              type="button"
              className="lg:hidden -m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <div className="flex items-center">
                <span className="text-white text-xl font-bold">Visiloo</span>
              </div>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                {/* Ressources Mobile */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-white hover:bg-white/5 transition-colors">
                    Ressources
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180 transition-transform" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-4">
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">LISTE DE LECTURE</h4>
                      {resourcesItems.readingList.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">CENTRE DE CONNAISSANCES</h4>
                      {resourcesItems.knowledgeCenter.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">SUCCÈS ET SUPPORT</h4>
                      {resourcesItems.successSupport.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">À PROPOS</h4>
                      {resourcesItems.about.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                {/* Fonctionnalités Mobile */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-white hover:bg-white/5 transition-colors">
                    Fonctionnalités
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180 transition-transform" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-4">
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">STRATÉGIE DE CROISSANCE IA</h4>
                      {featuresItems.aiStrategy.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">PLATEFORME MULTI PUBLICATION</h4>
                      {featuresItems.multiPublication.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">RELATIONS CLIENTS</h4>
                      {featuresItems.customerRelations.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                {/* Secteurs Mobile */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-white hover:bg-white/5 transition-colors">
                    Secteurs
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180 transition-transform" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-4">
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">Type d'entreprise</h4>
                      {sectorsItems.companyType.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                    <div className="px-3">
                      <h4 className="text-sm font-semibold text-white mb-2">Type d'industrie</h4>
                      {sectorsItems.industryType.items.map((item) => (
                        <DisclosureButton
                          key={item.name}
                          as="a"
                          href={item.href}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                          {item.name}
                        </DisclosureButton>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>

                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base/7 font-semibold text-white hover:bg-white/5 transition-colors">
                    À propos
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180 transition-transform" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {aboutItems.map((item) => (
                      <DisclosureButton
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block rounded-lg py-2 pr-3 pl-6 text-sm/7 font-semibold text-white hover:bg-white/5 transition-colors flex items-center justify-between"
                      >
                        <span>{item.name}</span>
                        {item.arrow && <ChevronRightIcon className="size-4" />}
                      </DisclosureButton>
                    ))}
                  </DisclosurePanel>
                </Disclosure>

                <a
                  href="/pricing"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-white/5 transition-colors"
                >
                  Tarifs
                </a>
              </div>
              <div className="py-6 space-y-4">
                <a
                  href="/login"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-white/5 transition-colors"
                >
                  Se connecter
                </a>
                <a
                  href="/demo"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white bg-indigo-600 hover:bg-indigo-500 text-center transition-colors"
                >
                  Demander une démo
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}