import { NextResponse, NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin'; // Only need adminAuth now

export async function POST(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('__session')?.value;

    if (!sessionCookie) {
      console.log('VerifyAdmin: No session cookie found');
      return NextResponse.json({ error: 'Session cookie required', isAdmin: false }, { status: 401 });
    }

    console.log('VerifyAdmin: Verifying session cookie...');

    try {
      // Verify the session cookie. Check if the session cookie is revoked.
      const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true); // checkRevoked = true

      // Check for the custom claim directly on the decoded token
      if (decodedToken.isAdmin === true) {
        console.log(`VerifyAdmin: User ${decodedToken.uid} is admin (claim found).`);
        return NextResponse.json({ isAdmin: true });
      } else {
        console.log(`VerifyAdmin: User ${decodedToken.uid} is NOT admin (claim missing or false).`);
        return NextResponse.json({ isAdmin: false }, { status: 403 }); // Forbidden - User is valid but not admin
      }
    } catch (error) {
      console.error('VerifyAdmin: Error verifying session cookie:', error);
      // Handle specific errors like session cookie expired, invalid session cookie, etc.
      if (error instanceof Error && (error.message.includes('session-cookie-expired') || error.message.includes('invalid-argument'))) {
        return NextResponse.json({ error: 'Invalid or expired session cookie', isAdmin: false }, { status: 401 });
      }
      // Treat other verification errors as internal server errors, but indicate not admin
      return NextResponse.json({ error: 'Internal server error during verification', isAdmin: false }, { status: 500 });
    }
  } catch (error) {
    // Catch unexpected errors in the overall request handling
    console.error('VerifyAdmin: Unexpected error in POST handler:', error);
    return NextResponse.json({ error: 'Internal server error', isAdmin: false }, { status: 500 });
  }
}

// Optional: Handle OPTIONS request for CORS preflight if needed from different origins
export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
