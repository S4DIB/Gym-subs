# Stripe Integration Setup

## Environment Variables Required

Add these to your `.env.local` file:

```bash
# Stripe Keys (Test Mode - FREE to use)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## How to Get Stripe Keys

1. **Create Stripe Account**: Go to https://stripe.com and sign up (FREE)
2. **Get Test Keys**: Dashboard → Developers → API Keys
   - Copy "Publishable key" (starts with `pk_test_`)
   - Copy "Secret key" (starts with `sk_test_`)
3. **Webhook Secret**: Dashboard → Developers → Webhooks
   - Create endpoint: `http://localhost:3000/api/webhooks/stripe`
   - Copy webhook signing secret (starts with `whsec_`)

## What Works in Test Mode

✅ **Complete payment flows** - Users can "pay" with test cards
✅ **Subscription management** - Cancel, reactivate, billing portal
✅ **Webhook events** - All subscription events work
✅ **Dashboard integration** - View billing info, invoices

## Test Credit Cards

Use these in Stripe test mode:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Any future date & CVC**

## Going Live

When ready for real payments:
- Switch to live keys in production
- Complete business verification
- Activate live payments (2.9% + 30¢ per transaction)
