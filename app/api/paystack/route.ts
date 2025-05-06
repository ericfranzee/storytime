import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc, writeBatch } from 'firebase/firestore'; // Removed setDoc as it's not used directly
import { calculateExpiryDate, calculateAnnualExpiryDate, getVideoLimit } from '@/app/firebase'; // Import calculateAnnualExpiryDate

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { reference, status, transaction, metadata } = data;
    const userId = metadata?.userId; // Use optional chaining for safety
    const subscriptionPlan = metadata?.plan;
    const billingPeriod = metadata?.billingPeriod; // Get billing period

    // Validate Paystack response - include billingPeriod check
    if (!reference || !status || !transaction || !userId || !subscriptionPlan || !billingPeriod) {
      console.error('Invalid Paystack response (missing required metadata):', data);
      return NextResponse.json({ message: 'Invalid Paystack response: Missing required metadata' }, { status: 400 });
    }

    if (status === 'success') {
      const subscriptionDate = new Date();
      // Calculate expiry based on billing period
      const expiryDateObj = billingPeriod === 'yearly' 
        ? calculateAnnualExpiryDate(subscriptionDate) 
        : calculateExpiryDate(subscriptionDate);
      const expiryDate = expiryDateObj.getTime();
      const expiryDateISO = expiryDateObj.toISOString();
      
      const videoLimit = getVideoLimit(subscriptionPlan);
      // Reset date should align with expiry for simplicity, or could be monthly regardless
      const resetDate = expiryDate; // Reset usage when subscription expires

      const db = getFirestore();
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        console.error('User document not found:', userId);
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      const userData = userDoc.data();
      // const subscriptionId = userData.subscriptionId; // Removed unused variable

      try {
        // Update both user and subscription documents
        const batch = writeBatch(db);
        
        // Update user document
        batch.update(userDocRef, {
          subscriptionPlan: subscriptionPlan
        });
        
        // Update subscription document
        const subscriptionDocRef = doc(db, 'subscriptions', userData.subscriptionId);
        batch.update(subscriptionDocRef, {
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
        });

        await batch.commit();
        return NextResponse.json({ message: 'Subscription recorded successfully' });
      } catch (error: unknown) { // Use unknown
        let message = 'Internal Server Error';
        if (error instanceof Error) {
          message = error.message;
        }
        console.error('Error recording subscription:', message);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
      }
    } else {
      console.log(`Payment failed for reference ${reference}, status: ${status}`);
      return NextResponse.json({ message: 'Payment not successful' }, { status: 400 });
    }
  } catch (error: unknown) { // Use unknown
    let message = 'Internal Server Error';
    if (error instanceof Error) {
      message = error.message;
    }
    console.error('Error processing Paystack webhook:', message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
