import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Gym subscription plans
export const PLANS = {
  basic: {
    priceId: 'price_basic', // Will be replaced with actual Stripe price IDs
    name: 'Basic',
    price: 29,
    interval: 'month',
    features: [
      'Access to gym equipment',
      'Locker room access',
      'Basic fitness assessment',
      'Mobile app access'
    ]
  },
  standard: {
    priceId: 'price_standard',
    name: 'Standard', 
    price: 49,
    interval: 'month',
    features: [
      'Everything in Basic',
      'Group fitness classes',
      'Personal training session (1/month)',
      'Nutrition consultation',
      'Guest passes (2/month)'
    ]
  },
  premium: {
    priceId: 'price_premium',
    name: 'Premium',
    price: 79,
    interval: 'month', 
    features: [
      'Everything in Standard',
      'Unlimited personal training',
      'Premium classes access',
      'Massage therapy (1/month)',
      'Meal planning service',
      'Priority booking'
    ]
  }
} as const;

export type PlanType = keyof typeof PLANS;
