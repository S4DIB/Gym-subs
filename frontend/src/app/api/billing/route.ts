import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    // Get user's subscription info from Firestore
    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.stripeCustomerId) {
      return NextResponse.json({ subscription: null });
    }

    // Get subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: userData.stripeCustomerId,
      status: 'all',
      limit: 1,
    });

    const subscription = subscriptions.data[0];
    
    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    // Get invoice for current period
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: userData.stripeCustomerId,
    }).catch(() => null);

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        trial_end: subscription.trial_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        plan: {
          nickname: subscription.items.data[0]?.price.nickname,
          amount: subscription.items.data[0]?.price.unit_amount,
          interval: subscription.items.data[0]?.price.recurring?.interval,
        },
      },
      upcoming_invoice: invoice ? {
        amount_due: invoice.amount_due,
        period_start: invoice.period_start,
        period_end: invoice.period_end,
      } : null,
    });
  } catch (error) {
    console.error('Billing API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userId = decodedToken.uid;

    const { action } = await request.json();

    const userDoc = await adminDb.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.stripeCustomerId) {
      return NextResponse.json({ error: 'No customer found' }, { status: 404 });
    }

    if (action === 'cancel') {
      // Cancel subscription at period end
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data[0]) {
        await stripe.subscriptions.update(subscriptions.data[0].id, {
          cancel_at_period_end: true,
        });
      }
    } else if (action === 'reactivate') {
      // Reactivate subscription
      const subscriptions = await stripe.subscriptions.list({
        customer: userData.stripeCustomerId,
        status: 'active',
        limit: 1,
      });

      if (subscriptions.data[0]) {
        await stripe.subscriptions.update(subscriptions.data[0].id, {
          cancel_at_period_end: false,
        });
      }
    } else if (action === 'portal') {
      // Create customer portal session
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: userData.stripeCustomerId,
        return_url: `${request.nextUrl.origin}/dashboard/billing`,
      });
      
      return NextResponse.json({ url: portalSession.url });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Billing action error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
