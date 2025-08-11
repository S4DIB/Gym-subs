import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { adminDb } from '@/lib/firebase/admin';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature found' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'subscription') {
          // Store customer and subscription info
          const userId = session.metadata?.userId;
          if (userId && session.customer) {
            await adminDb.collection('users').doc(userId).set({
              stripeCustomerId: session.customer,
              subscriptionId: session.subscription,
              planType: session.metadata?.planType,
              trial: session.metadata?.trial === 'true',
              updatedAt: new Date(),
            }, { merge: true });
          }
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by customer ID
        const usersQuery = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', subscription.customer)
          .limit(1)
          .get();

        if (!usersQuery.empty) {
          const userDoc = usersQuery.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: subscription.status,
            subscriptionId: subscription.id,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            updatedAt: new Date(),
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        // Find user by customer ID
        const usersQuery = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', subscription.customer)
          .limit(1)
          .get();

        if (!usersQuery.empty) {
          const userDoc = usersQuery.docs[0];
          await userDoc.ref.update({
            subscriptionStatus: 'cancelled',
            subscriptionId: null,
            cancelAtPeriodEnd: false,
            updatedAt: new Date(),
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.subscription) {
          // Find user by customer ID
          const usersQuery = await adminDb
            .collection('users')
            .where('stripeCustomerId', '==', invoice.customer)
            .limit(1)
            .get();

          if (!usersQuery.empty) {
            const userDoc = usersQuery.docs[0];
            
            // Store payment record
            await adminDb.collection('payments').add({
              userId: userDoc.id,
              stripeInvoiceId: invoice.id,
              amount: invoice.amount_paid,
              currency: invoice.currency,
              status: invoice.status,
              paidAt: new Date(invoice.status_transitions.paid_at! * 1000),
              periodStart: new Date(invoice.period_start! * 1000),
              periodEnd: new Date(invoice.period_end! * 1000),
              createdAt: new Date(),
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        // Find user by customer ID and notify about failed payment
        const usersQuery = await adminDb
          .collection('users')
          .where('stripeCustomerId', '==', invoice.customer)
          .limit(1)
          .get();

        if (!usersQuery.empty) {
          const userDoc = usersQuery.docs[0];
          
          // Store failed payment record
          await adminDb.collection('payments').add({
            userId: userDoc.id,
            stripeInvoiceId: invoice.id,
            amount: invoice.amount_due,
            currency: invoice.currency,
            status: 'failed',
            failedAt: new Date(),
            periodStart: new Date(invoice.period_start! * 1000),
            periodEnd: new Date(invoice.period_end! * 1000),
            createdAt: new Date(),
          });

          // You could send email notification here
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
