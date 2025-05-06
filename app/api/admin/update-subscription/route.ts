import { NextResponse, NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { getVideoLimit } from '@/app/firebase'; // Import helper to get limits

// Define expected request body structure
interface UpdateSubscriptionBody {
  targetUserId: string;
  newPlan: 'free' | 'pro' | 'elite';
  // Add other fields if needed, e.g., resetUsage: boolean
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the requesting user is an admin
    const sessionCookie = request.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Missing session cookie' }, { status: 401 });
    }

    let requestingUid: string;
    let isRequestingUserAdmin = false;
    try {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true);
      requestingUid = decodedToken.uid;
      isRequestingUserAdmin = decodedToken.isAdmin === true;
    } catch (error) {
      console.error("Error verifying session cookie:", error);
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    if (!isRequestingUserAdmin) {
      return NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 });
    }

    // 2. Parse and validate request body
    const { targetUserId, newPlan }: UpdateSubscriptionBody = await request.json();

    if (!targetUserId || !['free', 'pro', 'elite'].includes(newPlan)) {
      return NextResponse.json({ error: 'Bad Request: targetUserId and a valid newPlan (free, pro, elite) are required' }, { status: 400 });
    }

    // 3. Find the user's current subscription document
    const subQuery = adminDb.collection('subscriptions').where('userId', '==', targetUserId).limit(1);
    const subSnapshot = await subQuery.get();

    if (subSnapshot.empty) {
      // Handle case where user might exist in Auth but not have a subscription doc yet
      // Option 1: Create a new subscription doc (similar to createDefaultFreePlan but with newPlan)
      // Option 2: Return an error
      console.warn(`Subscription document not found for user ${targetUserId}. Cannot update plan.`);
      return NextResponse.json({ error: `Subscription not found for user ${targetUserId}. Cannot update.` }, { status: 404 });
    }

    const subscriptionDocRef = subSnapshot.docs[0].ref;
    // const _currentSubData = subSnapshot.docs[0].data(); // Prefix unused variable with _

    // 4. Prepare update data
    const videoLimit = getVideoLimit(newPlan);
    // Use Record<string, any> for compatibility with Firebase update
    const updateData: Record<string, number | string> = {
      subscriptionPlan: newPlan,
      paymentStatus: newPlan === 'free' ? 'inactive' : 'active', // Assume active for paid plans
      videoLimit: videoLimit,
      // Reset usage and remaining usage when plan changes
      usage: 0,
      remainingUsage: videoLimit, // Set remaining to the new limit
      updatedAt: new Date().toISOString(), // Keep track of updates
      // Optionally update start/expiry dates if needed based on business logic
      // subscriptionStartDate: new Date().toISOString(),
      // expiryDate: calculateExpiryDate(new Date()).getTime(),
      // expiryDateISO: calculateExpiryDate(new Date()).toISOString(),
    };

    // 5. Update Firestore documents in a transaction/batch
    const userRef = adminDb.collection('users').doc(targetUserId);
    const batch = adminDb.batch();

    batch.update(subscriptionDocRef, updateData);
    batch.update(userRef, {
        subscriptionPlan: newPlan, // Keep user doc consistent
        updatedAt: new Date().toISOString(),
     });

    await batch.commit();

    console.log(`Admin ${requestingUid} updated subscription for user ${targetUserId} to plan ${newPlan}`);

    return NextResponse.json({ status: 'success', message: `User ${targetUserId} subscription updated to ${newPlan}` }, { status: 200 });

  } catch (error: unknown) {
    console.error('Error updating subscription:', error);
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ error: 'Internal Server Error', details: message }, { status: 500 });
  }
}

// Optional: Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
