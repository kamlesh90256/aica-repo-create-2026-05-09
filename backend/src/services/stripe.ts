import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-04-10' as any
});

const prisma = new PrismaClient();

type SubscriptionLike = {
  id: string;
  items: { data: { price: { id: string } }[] };
  status: string;
  current_period_start: number;
  current_period_end: number;
  metadata?: { userId?: string };
};

export async function createCheckoutSession(userId: string, planId: string, domain: string) {
  const plans: Record<string, { priceId: string; name: string; price: number }> = {
    starter: {
      priceId: process.env.STRIPE_PRICE_STARTER || 'price_starter',
      name: 'Starter',
      price: 29
    },
    pro: {
      priceId: process.env.STRIPE_PRICE_PRO || 'price_pro',
      name: 'Pro',
      price: 99
    },
    enterprise: {
      priceId: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise',
      name: 'Enterprise',
      price: 299
    }
  };

  const plan = plans[planId];
  if (!plan) throw new Error('Invalid plan');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: plan.priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${domain}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${domain}/pricing`,
    client_reference_id: userId,
    customer_email: (await prisma.user.findUnique({ where: { id: userId } }))?.email,
    metadata: {
      planId,
      userId
    }
  });

  return session;
}

export async function handleCheckoutSessionCompleted(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const userId = session.client_reference_id || session.metadata?.userId;

  if (!userId) throw new Error('No user ID in session');

  const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as unknown as SubscriptionLike;

  // Create or update subscription in DB
  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    },
    update: {
      stripeSubscriptionId: subscription.id,
      stripePriceId: subscription.items.data[0].price.id,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });
}

export async function handleSubscriptionUpdated(subscriptionId: string) {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId) as unknown as SubscriptionLike;
  const userId = subscription.metadata?.userId;

  if (!userId) return;

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000)
    }
  });
}

export async function handleSubscriptionDeleted(subscriptionId: string) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscriptionId },
    data: { status: 'canceled' }
  });
}

export async function getUserSubscription(userId: string) {
  return prisma.subscription.findUnique({
    where: { userId }
  });
}

export { stripe };
