"use client";

import React, { useState } from "react";
import ModalOnboardingCheckout from "@/components/checkout/ModalCheckout";
import FAQSection from "@/components/layout/FAQSection";
import { notFound, useRouter } from "next/navigation";
import { CheckIcon } from '@heroicons/react/24/solid'
import { Loader2 } from "lucide-react";
import ChatbotMessege from "../ChatbotMessege";


type IntervalType = "monthly" | "yearly";
type PlanType = "pro" | "premium";

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    description: "Pour les entrepreneurs et TPE qui veulent booster leur visibilité.",
    features: [
      "Se faire trouver sur Google sans connaissance technique",
      "Démarquez-vous des concurrents",
      "Publications automatiques",
      "Tâches guidées pour améliorer vos classements",
      "Gestion des avis en un clic",
    ],
    prices: {
      monthly: {
        display: "15€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_MONTHLY!,
      },
      yearly: {
        display: "180€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO_YEARLY!,
      },
    },
    popular: false,
  },
  {
    id: "premium",
    name: "Premium",
    description: "Pour les agences et indépendants gérant plusieurs clients.",
    features: [
      "Gestion de 2-10 profils clients",
      "Optimisation jusqu'à 5 profils",
      "Tableau de bord unifié",
      "Surveillance des concurrents",
      "Génération de contenu avec IA",
      "Responsable de compte dédié",
    ],
    prices: {
      monthly: {
        display: "35€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_MONTHLY!,
      },
      yearly: {
        display: "450€",
        stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM_YEARLY!,
      },
    },
    popular: true,
  },
  {
    id: "enterprise",
    name: "Entreprise",
    description: "Pour les entreprises à volume élevé avec multiples localisations.",
    features: [
      "Nombre illimité de profils",
      "Solution personnalisée",
      "Surveillance proactive",
      "Assistance prioritaire",
      "Analyses marché avancées",
      "Intégrations API",
    ],
    prices: null,
    popular: false,
  },
];

const COMPARISON = [
  {
    label: "Gestion de profil",
    pro: true,
    premium: true,
    enterprise: true,
  },
  {
    label: "Visibilité locale",
    pro: true,
    premium: true,
    enterprise: true,
  },
  {
    label: "Analyse concurrentielle",
    pro: true,
    premium: true,
    enterprise: true,
  },
  {
    label: "Géolocalisation multiple",
    pro: false,
    premium: true,
    enterprise: true,
  },
  {
    label: "Analytics avancés",
    pro: false,
    premium: true,
    enterprise: true,
  },
  {
    label: "Gestion de réputation",
    pro: false,
    premium: false,
    enterprise: true,
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

export default function PricingPage() {

  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<IntervalType>("monthly");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PlanType>("pro");
  const [checkoutInterval, setCheckoutInterval] = useState<IntervalType>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);

  const handleChoose = async (planId: string) => {
    if (planId === "enterprise") {
      router.push("/contact");
      return;
    }
    
    setLoadingPlan(planId);
    setShowFullScreenLoader(true);
    
    // Délai de 5 secondes pour montrer le spinner plein écran
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setCheckoutPlan(planId as PlanType);
    setCheckoutInterval(billingCycle);
    setShowCheckout(true);
    setLoadingPlan(null);
    setShowFullScreenLoader(false);
  };

  return (
    <div className="relative isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      {/* Overlay avec spinner plein écran */}
      {showFullScreenLoader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="flex flex-col items-center">
            <Loader2 className="h-16 w-16 text-amber-600 animate-spin mb-4" />
          </div>
        </div>
      )}
      
      <div aria-hidden="true" className="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl">
        <div
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          className="mx-auto aspect-1155/678 w-288.75 bg-gradient-to-tr from-[#ffa08f] to-[#ff6f61] opacity-20"
        />
      </div>
      
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base/7 font-semibold text-indigo-400">Pricing</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-white sm:text-6xl">
          Choisissez le plan qui vous convient
        </p>
      </div>
      
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-400 sm:text-xl/8">
        Commencez gratuitement, sans engagement. Passez à la vitesse supérieure quand vous êtes prêt.
      </p>
      
      <div className="mt-8 flex justify-center">
        <div className="inline-flex rounded-md shadow-sm bg-gray-800 p-1">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={classNames(
              billingCycle === "monthly" 
                ? "bg-indigo-500 text-white" 
                : "bg-transparent text-gray-400 hover:text-white",
              "px-4 py-2 text-sm font-medium rounded-md"
            )}
          >
            Mensuel
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={classNames(
              billingCycle === "yearly" 
                ? "bg-indigo-500 text-white" 
                : "bg-transparent text-gray-400 hover:text-white",
              "px-4 py-2 text-sm font-medium rounded-md"
            )}
          >
            Annuel <span className="ml-1 text-green-400">(-20%)</span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-3">
        {PLANS.map((plan, planIdx) => (
          <div
            key={plan.id}
            className={classNames(
              plan.popular ? 'relative bg-gray-800 ring-2 ring-indigo-500' : 'bg-white/2.5',
              plan.popular
                ? ''
                : planIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : planIdx === 1
                    ? 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none'
                    : 'rounded-b-3xl sm:rounded-t-none lg:rounded-tr-3xl',
              'rounded-3xl p-8 ring-1 ring-white/10 sm:p-10',
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-indigo-500 text-white px-4 py-1 text-sm font-bold transform translate-x-2 -translate-y-2 rotate-6">
                POPULAIRE
              </div>
            )}
            
            <h3
              className={classNames(
                plan.popular ? 'text-indigo-400' : 'text-indigo-400', 
                'text-base/7 font-semibold'
              )}
            >
              {plan.name}
            </h3>
            
            <p className="mt-4 flex items-baseline gap-x-2">
              <span className={classNames(
                plan.popular ? 'text-white' : 'text-white', 
                'text-5xl font-semibold tracking-tight'
              )}>
                {plan.prices ? plan.prices[billingCycle].display : "Sur mesure"}
              </span>
              {plan.prices && (
                <span className={classNames(
                  plan.popular ? 'text-gray-400' : 'text-gray-400', 
                  'text-base'
                )}>
                  {billingCycle === "monthly" ? "/mois" : "/an"}
                </span>
              )}
            </p>
            
            {plan.prices && billingCycle === "yearly" && (
              <p className="text-sm text-green-400 mt-2">
                Économisez 20% avec le paiement annuel
              </p>
            )}
            
            <p className={classNames(
              plan.popular ? 'text-gray-300' : 'text-gray-300', 
              'mt-6 text-base/7'
            )}>
              {plan.description}
            </p>
            
            <ul
              role="list"
              className={classNames(
                plan.popular ? 'text-gray-300' : 'text-gray-300',
                'mt-8 space-y-3 text-sm/6 sm:mt-10',
              )}
            >
              {plan.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <CheckIcon
                    aria-hidden="true"
                    className={classNames(
                      plan.popular ? 'text-indigo-400' : 'text-indigo-400', 
                      'h-6 w-5 flex-none'
                    )}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handleChoose(plan.id)}
              disabled={loadingPlan === plan.id || showFullScreenLoader}
              className={classNames(
                plan.popular
                  ? 'bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500'
                  : plan.id === "enterprise"
                    ? 'bg-gray-700 text-white hover:bg-gray-600'
                    : 'bg-white/10 text-white ring-1 ring-white/5 hover:bg-white/20 focus-visible:outline-white/75',
                loadingPlan === plan.id ? 'opacity-70 cursor-not-allowed' : '',
                'mt-8 block w-full rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10 relative'
              )}
            >
              {loadingPlan === plan.id ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-5 w-5 text-amber-600 animate-spin mr-2" />
                </div>
              ) : plan.id === "enterprise" ? (
                "Contactez-nous"
              ) : (
                "Choisir ce plan"
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Section Comparaison des fonctionnalités */}
      <div className="mx-auto mt-24 max-w-7xl">
        <div className="bg-gray-800 rounded-2xl p-8 ring-1 ring-white/10 sm:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white">Comparaison des fonctionnalités</h2>
            <p className="mt-4 text-lg text-gray-400">
              Découvrez quelle offre correspond le mieux à vos besoins
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-4 px-6 text-left text-white font-semibold w-1/3 min-w-[200px]">
                    Fonctionnalités
                  </th>
                  <th className="py-4 px-6 text-center text-white font-semibold">Pro</th>
                  <th className="py-4 px-6 text-center text-indigo-400 font-semibold bg-indigo-900/20">
                    Premium
                  </th>
                  <th className="py-4 px-6 text-center text-white font-semibold">
                    Entreprise
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-700/20' : ''}>
                    <td className="py-4 px-6 text-white">{row.label}</td>
                    <td className="py-4 px-6 text-center">
                      {row.pro ? (
                        <CheckIcon className="h-6 w-5 text-indigo-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center bg-indigo-900/10">
                      {row.premium ? (
                        <CheckIcon className="h-6 w-5 text-indigo-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {row.enterprise ? (
                        <CheckIcon className="h-6 w-5 text-indigo-400 mx-auto" />
                      ) : (
                        <span className="text-gray-500">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="mt-24 max-w-7xl mx-auto">
        <FAQSection />
      </div>

      {/* Modal Checkout */}
      <ModalOnboardingCheckout
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        plan={{ id: checkoutPlan, name: checkoutPlan }}
        interval={checkoutInterval}
      />
      
    </div>
    
  );
}