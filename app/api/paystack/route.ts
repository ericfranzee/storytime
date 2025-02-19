import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { addSubscription, updateSubscriptionPaymentStatus, calculateExpiryDate, getVideoLimit } from '@/app/firebase';

export const dynamic = 'force-dynamic';

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
if (!PAYSTACK_SECRET_KEY) {
  throw new Error('PAYSTACK_SECRET_KEY is not defined');
}

export async function POST(request: NextRequest) {
  try {
    const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY as string).update(JSON.stringify(await request.json())).digest('hex');
    if (hash !== request.headers.get('x-paystack-signature')) {
      return NextResponse.json({ message: 'Invalid signature' }, { status: 400 });
    }

    const event = await request.json();
    if (event.event === 'charge.success') {
      const { reference, amount, currency, customer, metadata, status } = event.data;
      const userId = metadata.userId;

      if (status === 'success') {
        const subscriptionDate = new Date();
        const expiryDate = calculateExpiryDate(subscriptionDate);
        const videoLimit = getVideoLimit(metadata.plan);

        // Record subscription details in Firebase
        const subscriptionData = {
          userId: userId,
          reference: reference,
          amount: amount / 100, // amount is in kobo, convert to USD
          currency: currency,
          subscriptionPlan: metadata.plan,
          paymentStatus: 'active',
          videoCount: 0,
          usage: 0,
          remainingUsage: videoLimit,
          videoLimit: videoLimit,
          subscriptionStartDate: subscriptionDate.toISOString(),
          expiryDate: expiryDate.toISOString(),
          paymentReference: reference,
          transactionStatus: status,
        };

        try {
          await addSubscription(subscriptionData);
          const db = getFirestore();
          const userDocRef = doc(db, 'users', userId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            await setDoc(userDocRef, {
              subscription: metadata.plan,
              videoCount: 0,
              videoLimit: videoLimit === Infinity ? 'unlimited' : videoLimit,
            }, { merge: true });
          }

          // Update payment status
          await updateSubscriptionPaymentStatus(userId, 'active');

          return NextResponse.json({ message: 'Subscription recorded successfully' });
        } catch (error: any) {
          console.error('Error recording subscription:', error);
          console.error('Error recording subscription - message:', error.message);
          console.error('Error recording subscription - stack:', error.stack);
          return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
        }
      } else {
        console.log(`Payment failed for reference ${reference}, status: ${status}`);
        return NextResponse.json({ message: 'Payment not successful' }, { status: 400 });
      }
    }

    return NextResponse.json({ message: 'Event received' });
  } catch (error: any) {
    console.error('Error processing Paystack webhook:', error);
    console.error('Error processing Paystack webhook - message:', error.message);
    console.error('Error processing Paystack webhook - stack:', error.stack);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
