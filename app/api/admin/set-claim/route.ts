import { NextResponse, NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // 1. Verify the session cookie of the *requesting* user
    const sessionCookie = request.cookies.get('__session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized: Missing session cookie' }, { status: 401 });
    }

    let requestingUid: string;
    let isRequestingUserAdmin = false;
    try {
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true); // Check revoked
      requestingUid = decodedToken.uid;
      // Check if the *requesting* user has the admin claim
      isRequestingUserAdmin = decodedToken.isAdmin === true;
    } catch (error) {
      console.error('Error verifying requestor session cookie:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    // 2. Check if the requesting user is actually an admin
    if (!isRequestingUserAdmin) {
      console.warn(`User ${requestingUid} attempted to set admin claim without permission.`);
      return NextResponse.json({ error: 'Forbidden: Admin privileges required' }, { status: 403 });
    }

    // 3. Get the target user ID and desired admin status from the request body
    const { targetUserId, isAdmin } = await request.json();

    if (!targetUserId || typeof isAdmin !== 'boolean') {
      return NextResponse.json({ error: 'Bad Request: targetUserId (string) and isAdmin (boolean) are required' }, { status: 400 });
    }

    // Prevent admin from accidentally removing their own claim via this endpoint
    if (requestingUid === targetUserId && !isAdmin) {
        return NextResponse.json({ error: 'Bad Request: Cannot remove your own admin status via this endpoint.' }, { status: 400 });
    }

    // 4. Set the custom claim for the target user
    console.log(`Admin ${requestingUid} setting isAdmin=${isAdmin} for user ${targetUserId}`);
    await adminAuth.setCustomUserClaims(targetUserId, { isAdmin: isAdmin });

    // 5. Update the Firestore document for consistency (optional but good practice)
    const userRef = adminDb.collection('users').doc(targetUserId);
    await userRef.update({
      userType: isAdmin ? 'admin' : 'user',
      updatedAt: new Date().toISOString(), // Keep track of updates
    });
    console.log(`Updated Firestore userType for ${targetUserId} to ${isAdmin ? 'admin' : 'user'}`);

    // 6. Inform the client to potentially refresh the target user's token if they are currently logged in
    // (This is complex to handle perfectly, but setting the claim is the main part)

    return NextResponse.json({ status: 'success', message: `User ${targetUserId} admin status set to ${isAdmin}` }, { status: 200 });

  } catch (error) {
    console.error('Error setting custom claim:', error);
    // Check if the target user exists
    if (error instanceof Error && error.message.includes('USER_NOT_FOUND')) {
        return NextResponse.json({ error: `User with ID ${ (await request.json()).targetUserId } not found.` }, { status: 404 });
    }
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 });
  }
}

// Optional: Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
