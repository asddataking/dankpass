import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import { memberships } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email;
        const subscriptionId = session.subscription;

        if (customerEmail && subscriptionId) {
          // Update user membership to premium
          await db
            .update(memberships)
            .set({
              tier: 'premium',
              stripeSubscriptionId: subscriptionId as string,
              premiumExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            })
            .where(eq(memberships.userId, session.metadata?.userId || ''));
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        if (subscription.status === 'active') {
          await db
            .update(memberships)
            .set({
              tier: 'premium',
              premiumExpiresAt: new Date(subscription.current_period_end * 1000),
            })
            .where(eq(memberships.stripeSubscriptionId, subscription.id));
        } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
          await db
            .update(memberships)
            .set({
              tier: 'free',
              premiumExpiresAt: null,
            })
            .where(eq(memberships.stripeSubscriptionId, subscription.id));
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        await db
          .update(memberships)
          .set({
            tier: 'free',
            premiumExpiresAt: null,
            stripeSubscriptionId: null,
          })
          .where(eq(memberships.stripeSubscriptionId, subscription.id));
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
