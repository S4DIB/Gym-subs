import { NextRequest, NextResponse } from 'next/server';
import { stripe, PLANS, PlanType } from '@/lib/stripe/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const { planType, userId, trial = false } = await request.json();

    if (!planType || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify the user exists in Firebase
    try {
      await adminAuth.getUser(userId);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid user' },
        { status: 401 }
      );
    }

    const plan = PLANS[planType as PlanType];
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: undefined, // Will be filled from Firebase user
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FitLife ${plan.name} Membership`,
              description: `Monthly ${plan.name} gym membership`,
            },
            unit_amount: plan.price * 100, // Stripe uses cents
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      subscription_data: {
        trial_period_days: trial ? 7 : undefined,
        metadata: {
          userId,
          planType,
          trial: trial.toString(),
        },
      },
      metadata: {
        userId,
        planType,
        trial: trial.toString(),
      },
      success_url: `${request.nextUrl.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/join?cancelled=true`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
