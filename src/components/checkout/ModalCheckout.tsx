"use client";

import React, { useEffect, useState } from "react";
import { Elements, PaymentElement, AddressElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { ChevronRight, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

type IntervalType = "monthly" | "yearly";
type PlanType = "pro" | "premium";

const STRIPE_PRICE_PRO_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY!;
const STRIPE_PRICE_PRO_YEARLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_YEARLY!;
const STRIPE_PRICE_PREMIUM_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_MONTHLY!;
const STRIPE_PRICE_PREMIUM_YEARLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM_YEARLY!;

interface ModalOnboardingCheckoutProps {
    open: boolean;
    interval: IntervalType;
    plan: {
        id: string;
        name: string;
    };
    onClose: () => void;
    userId?: string;
}

export default function ModalOnboardingCheckout({ open, onClose, plan, interval, userId }: ModalOnboardingCheckoutProps) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [step, setStep] = useState<1 | 2>(1);
    const [stripeInfo, setStripeInfo] = useState<any>(null);

    // DÉDUIT le priceId à partir du plan et de l'intervalle
    let priceId = "";
    if (plan.id === "pro" && interval === "monthly") priceId = STRIPE_PRICE_PRO_MONTHLY;
    if (plan.id === "pro" && interval === "yearly") priceId = STRIPE_PRICE_PRO_YEARLY;
    if (plan.id === "premium" && interval === "monthly") priceId = STRIPE_PRICE_PREMIUM_MONTHLY;
    if (plan.id === "premium" && interval === "yearly") priceId = STRIPE_PRICE_PREMIUM_YEARLY;

    // Réinitialiser les états lorsque le modal est fermé
    useEffect(() => {
        if (!open) {
            setStripeInfo(null);
            setClientSecret(null);
            setStep(1);
        }
    }, [open]);

    // Utilise le priceId calculé pour charger le bon produit
    useEffect(() => {
        if (!open || !priceId) return;

        let isMounted = true;

        const fetchData = async () => {
            try {
                const productRes = await fetch('/api/stripe-product-info', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ priceId }),
                });

                if (!isMounted) return;

                if (productRes.ok) {
                    const productData = await productRes.json();
                    setStripeInfo(productData);
                } else {
                    console.error("Failed to fetch Stripe product data");
                    setStripeInfo({ error: "Erreur lors du chargement du produit" });
                }
            } catch (error) {
                console.error("Failed to fetch Stripe data:", error);
                if (isMounted) {
                    setStripeInfo({ error: "Erreur lors du chargement du produit" });
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [open, priceId]);

    // Crée le PaymentIntent Stripe
    useEffect(() => {
        if (!open || !priceId) return;

        let isMounted = true;

        fetch("/api/create-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ plan: plan.id, interval }), 
        })
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setClientSecret(data.clientSecret || null);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setClientSecret(null);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [open, plan, interval, priceId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/15">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full flex flex-col md:flex-row p-0 relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
                
                {/* Colonne gauche : récapitulatif produit */}
                <div className="md:w-1/2 w-full bg-gray-50 p-8 flex flex-col justify-between rounded-xl border-gray-200">
                    {stripeInfo && (
                        <div className="space-y-4">
                            <h2>Récapitulatif de la commande</h2>
                            <div>
                            <div className="text-3xl font-bold text-blue-600">
                                {(stripeInfo.price.unit_amount / 100).toFixed(2)} {stripeInfo.price.currency?.toUpperCase() === "EUR" ? "€" : stripeInfo.price.currency?.toUpperCase()}
                                <span className="text-sm text-gray-400 font-normal ml-2">TVA incluse</span>
                            </div>
                            <span>
                                puis
                                 <span className="ml-1">
                                    {(stripeInfo.price.unit_amount / 100).toFixed(2)} {stripeInfo.price.currency?.toUpperCase() === "EUR" ? "€" : stripeInfo.price.currency?.toUpperCase()}
                                 </span>
                                <span className="ml-1">
                                    {stripeInfo.price.recurring?.interval === "year"
                                            ? "annuel"
                                            : "mensuel"}
                                </span>
                            </span>
                            </div>
                            <div>
                              {stripeInfo.product?.images?.[0] && (
                                <img
                                    src={stripeInfo.product.images[0]}
                                    alt={stripeInfo.product.name}
                                    className="h-12 object-contain mb-3"
                                />
                              )}
                            </div>
                            <div className="text-gray-600 text-sm flex flex-col gap-2">
                                <span className="font-semibold">{stripeInfo.product.name}</span>
                                <span>Qté : 1</span>
                            </div>
                            <div className="my-4 border-t border-gray-200" />
                            <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                    <span>
                                        {stripeInfo.price.recurring?.interval === "year"
                                            ? "Sous-total"
                                            : "Sous-total"}
                                    </span>
                                    <span>
                                        {(stripeInfo.price.unit_amount / 100).toFixed(2)} {stripeInfo.price.currency?.toUpperCase() === "EUR" ? "€" : stripeInfo.price.currency?.toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold pt-2 border-t border-gray-200">
                                    <span>Total</span>
                                    <span>
                                        {(stripeInfo.price.unit_amount / 100).toFixed(2)} {stripeInfo.price.currency?.toUpperCase() === "EUR" ? "€" : stripeInfo.price.currency?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="text-xs text-center text-gray-400 pt-6">
                                <span className="inline-flex items-center gap-1">
                                    <Lock className="h-3 w-3" /> Paiement sécurisé via Stripe
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Colonne droite : onboarding */}
                <div className="md:w-1/2 w-full p-8">
                    <div className="text-xl font-bold mb-6 text-center">
                        Vos coordonnées   
                        <span>
                            <ChevronRight className="w-8 h-8" />
                        </span>
                        Paiement
                    </div>
                    {clientSecret && (
                        <Elements stripe={stripePromise} options={{clientSecret}}>
                            <OnboardingForm
                                step={step}
                                setStep={setStep}
                                onClose={onClose}
                            />
                        </Elements>
                    )}
                    
                </div>
            </div>
        </div>
    );
}

// Formulaire onboarding en 2 étapes
function OnboardingForm({ step, setStep, onClose }: { step: 1 | 2; setStep: (s: 1 | 2) => void; onClose: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Étape 1 : coordonnées
    if (step === 1) {
        return (
            <form
                onSubmit={e => {
                    e.preventDefault();
                    setStep(2);
                }}
                className="space-y-6"
            >
                <div>
    <h3 className="font-medium mb-4">
        Nous recueillons ces informations afin de lutter contre la fraude et de garantir que votre paiement est sécurisé.
    </h3>
    <AddressElement
        options={{
            mode: "billing",
            //allowedCountries: ["FR", "BE", "CH", "CA"],
            fields: { 
                //phone: 'always',
               // line2: "never"  // Remplacez "lige2" par "line2" (orthographe correcte)
            
            },
            validation: { 
                phone: { required: 'never' }, 
              //  line2: { required: 'never' }  // Remplacez "ligne2" par "line2" (orthographe anglaise)
            }
        }}
    />
</div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                    Suivant
                </button>
            </form>
        );
    }

    // Étape 2 : paiement
    return (
        <form
            onSubmit={async e => {
                e.preventDefault();
                if (!stripe || !elements) return;
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
            }}
            className="space-y-6"
        >
            <div>
                <h3 className="font-medium text-lg mb-4">Paiement</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Nous recueillons ces informations afin de lutter contre la fraude et de garantir que votre paiement est sécurisé.
                </p>
                <PaymentElement
                    options={{
                        layout: { type: "tabs", defaultCollapsed: false },
                    }}
                />
               
            </div>
            <button
                type="submit"
                disabled={!stripe || isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
                {isProcessing ? "Traitement en cours..." : "Payer maintenant"}
            </button>
            {message && (
                <div className="text-red-600 text-center py-2">{message}</div>
            )}
            <button type="button" onClick={() => setStep(1)} className="w-full mt-2 text-gray-500 underline">Retour</button>
        </form>
    );
}