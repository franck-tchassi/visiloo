import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/actions/getCurrentUser';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-07-30.basil', // Utilise une version stable supportée par Stripe
});

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Utilisateur non authentifié' }, { status: 401 });
    }
    const { plan, interval } = await req.json();
    if (!plan || !interval) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    // Mapping plan -> priceId
    const priceMap: Record<string, Record<string, string>> = {
      pro: {
        monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
        yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
      },
      premium: {
        monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
        yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY!,
      },
    };
    const priceId = priceMap[plan]?.[interval];
    if (!priceId) {
      return NextResponse.json({ error: 'Plan ou intervalle invalide' }, { status: 400 });
    }

    // Créer ou retrouver le customer Stripe
    let customerId = currentUser.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: currentUser.email!,
        name: currentUser.name || undefined,
        metadata: { userId: currentUser.id },
      });
      customerId = customer.id;
      // TODO: Mettre à jour l'utilisateur en DB avec customerId si besoin
    }

    // Créer une Subscription Stripe
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete", // <-- AJOUT
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        plan,
        interval,
        userId: currentUser.id,
        priceId,
      },
    });

    const paymentIntent = (subscription.latest_invoice as any)?.payment_intent;

    if (!paymentIntent || typeof paymentIntent === "string") {
      return NextResponse.json({ error: "Impossible de créer le paiement d'abonnement" }, { status: 500 });
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subscriptionId: subscription.id,
      priceId,
    });
  } catch (error: any) {
    console.error('Erreur create-subscription:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}