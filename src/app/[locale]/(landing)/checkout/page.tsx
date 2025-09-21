"use client";

import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, PaymentElement, AddressElement } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";

// Initialiser Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Types
type PlanType = "pro" | "premium";
type IntervalType = "monthly" | "yearly";

// Données des plans
const PLANS = {
  pro: {
    monthly: { price: "9,99€", id: process.env.STRIPE_PRICE_PRO_MONTHLY },
    yearly: { price: "99,99€", id: process.env.STRIPE_PRICE_PRO_YEARLY },
    name: "Pro",
    features: ["Accès complet", "Support prioritaire", "10 projets"]
  },
  premium: {
    monthly: { price: "19,99€", id: process.env.STRIPE_PRICE_PREMIUM_MONTHLY },
    yearly: { price: "199,99€", id: process.env.STRIPE_PRICE_PREMIUM_YEARLY },
    name: "Premium",
    features: ["Toutes les fonctionnalités Pro", "Support 24/7", "Projets illimités", "Accès anticipé"]
  }
};

// Composant principal de la page de checkout
const CheckoutPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("pro");
  const [selectedInterval, setSelectedInterval] = useState<IntervalType>("monthly");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Créer l'intention de paiement lorsque la sélection change
  useEffect(() => {
    const createPaymentIntent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/create-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            plan: selectedPlan,
            interval: selectedInterval
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Erreur lors de la création du paiement");
        }

        setClientSecret(data.clientSecret);
      } catch (error: any) {
        toast.error(error.message);
        setClientSecret(null);
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [selectedPlan, selectedInterval]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Choisissez votre abonnement</h1>
        <p className="text-lg text-center text-gray-600 mb-10">Sélectionnez l'offre qui correspond à vos besoins</p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Section de sélection du plan */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Type d'abonnement</h2>

              <div className="space-y-4">
                {Object.entries(PLANS).map(([key, plan]) => (
                  <div
                    key={key}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPlan === key
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                      }`}
                    onClick={() => setSelectedPlan(key as PlanType)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{plan.name}</h3>
                        <div className="mt-2">
                          <span className="text-2xl font-bold">
                            {selectedInterval === "monthly" ? plan.monthly.price : plan.yearly.price}
                          </span>
                          <span className="text-gray-600 ml-1">
                            /{selectedInterval === "monthly" ? "mois" : "an"}
                          </span>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === key ? "border-blue-500 bg-blue-500" : "border-gray-400"
                        }`}>
                        {selectedPlan === key && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <ul className="mt-3 space-y-1">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Période de facturation</h2>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer text-center ${selectedInterval === "monthly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setSelectedInterval("monthly")}
                >
                  <div className="font-medium">Mensuel</div>
                  <div className="text-sm text-gray-600 mt-1">Facturé chaque mois</div>
                </div>

                <div
                  className={`p-4 border-2 rounded-lg cursor-pointer text-center ${selectedInterval === "yearly"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setSelectedInterval("yearly")}
                >
                  <div className="font-medium">Annuel</div>
                  <div className="text-sm text-green-600 mt-1">Économisez 20%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section de paiement */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Finalisez votre abonnement</h2>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p className="text-gray-600">Chargement du formulaire de paiement...</p>
                </div>
              ) : clientSecret ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm
                    plan={selectedPlan}
                    interval={selectedInterval}
                    price={selectedInterval === "monthly"
                      ? PLANS[selectedPlan].monthly.price
                      : PLANS[selectedPlan].yearly.price
                    }
                  />
                </Elements>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Veuillez sélectionner un plan pour continuer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant de formulaire de paiement
const CheckoutForm = ({ plan, interval, price }: { plan: PlanType; interval: IntervalType; price: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account/subscription-success`,
      },
    });

    if (error) {
      setMessage(error.message || "Une erreur s'est produite");
      toast.error(error.message || "Erreur de paiement");
    } else {
      toast.success("Paiement réussi! Redirection...");
      setTimeout(() => {
        window.location.href = "/account/subscription-success";
      }, 2000);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-5">
        <h3 className="font-medium text-lg mb-4">Détails de facturation</h3>
        <AddressElement
          options={{
            mode: "billing",
            allowedCountries: ["FR", "BE", "CH", "CA"],
            fields: { phone: 'always' },
            validation: { phone: { required: 'always' } }
          }}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-5">
        <h3 className="font-medium text-lg mb-4">Informations de paiement</h3>
        <PaymentElement
          options={{
            layout: { type: "tabs", defaultCollapsed: false },
            fields: { billingDetails: { address: { country: "never" } } }
          }}
        />
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">Total à payer</p>
            <p className="text-sm text-gray-600">Abonnement {PLANS[plan].name} ({interval})</p>
          </div>
          <div className="text-lg font-bold">{price}</div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        {isProcessing ? "Traitement en cours..." : `Payer ${price} maintenant`}
      </button>

      {message && (
        <div className="text-red-600 text-center py-2">{message}</div>
      )}
    </form>
  );
};

export default CheckoutPage;