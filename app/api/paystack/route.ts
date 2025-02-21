import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { calculateExpiryDate, getVideoLimit } from '@/app/firebase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { reference, status, transaction, metadata } = data;
    const userId = metadata.userId;
    const subscriptionPlan = metadata.plan;

    // Validate Paystack response
    if (!reference || !status || !transaction || !userId || !subscriptionPlan) {
      console.error('Invalid Paystack response:', data);
      return NextResponse.json({ message: 'Invalid Paystack response' }, { status: 400 });
    }

    if (status === 'success') {
      const subscriptionDate = new Date();
      const expiryDate = calculateExpiryDate(subscriptionDate).getTime();
      const videoLimit = getVideoLimit(subscriptionPlan);
      const expiryDateISO = new Date(expiryDate).toISOString();
      const resetDate = expiryDate; // 30 days after subscription

      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error('User document not found:', userId);
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const userData = userDoc.data();
      const subscriptionId = userData.subscriptionId;

      // Get the subscription document
      const subscriptionDocRef = doc(db, 'subscriptions', subscriptionId);
      const subscriptionDoc = await getDoc(subscriptionDocRef);

      const subscriptionData = {
        userId: userId,
        reference: reference,
        transactionId: transaction,
        paymentStatus: status,
        subscriptionPlan: subscriptionPlan,
        videoCount: 0,
        usage: 0,
        remainingUsage: videoLimit,
        videoLimit: videoLimit,
        resetDate: resetDate,
        subscriptionStartDate: subscriptionDate.toISOString(),
        expiryDate: expiryDate,
        expiryDateISO: expiryDateISO,
      };

      try {
        // Update the subscription document
        await setDoc(subscriptionDocRef, subscriptionData, { merge: true });

        await setDoc(userDocRef, {
          subscription: subscriptionPlan,
          videoCount: 0,
          videoLimit: videoLimit === Infinity ? 'unlimited' : videoLimit,
        }, { merge: true });

        return NextResponse.json({ message: 'Subscription recorded successfully' });
      } catch (error: any) {
        console.error('Error recording subscription:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
    } else {
      console.log(`Payment failed for reference ${reference}, status: ${status}`);
      return NextResponse.json({ message: 'Payment not successful' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Error processing Paystack webhook:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
