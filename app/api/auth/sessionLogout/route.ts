import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin'; // Import Firebase Admin Auth

export async function POST(request: NextRequest) { // Prefix unused variable with _
  console.log("Logout request received", request.url);
  const sessionCookie = cookies().get('__session')?.value;

  // 1. Clear the browser cookie immediately, regardless of server-side success
  // This provides a faster perceived logout for the user.
  const response = NextResponse.json({ status: 'success', message: 'Logout initiated' }, { status: 200 });
  response.cookies.set({
    name: '__session',
    value: '',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    // sameSite: 'lax', // Ensure this matches the setting in sessionLogin if you uncommented it there
  });

  if (!sessionCookie) {
    // No cookie to invalidate on the server, but browser cookie is cleared.
    console.log('Logout: No session cookie found to invalidate on server.');
    return response;
  }

  try {
    // 2. Verify the session cookie to get the UID
    console.log('Logout: Verifying session cookie...');
    const decodedToken = await adminAuth.verifySessionCookie(sessionCookie, true); // checkRevoked = true
    const uid = decodedToken.uid;
    console.log(`Logout: Session cookie verified for UID: ${uid}`);

    // 3. Revoke refresh tokens for the user server-side
    console.log(`Logout: Revoking refresh tokens for UID: ${uid}`);
    await adminAuth.revokeRefreshTokens(uid);
    console.log(`Logout: Successfully revoked refresh tokens for UID: ${uid}`);

    // Return the response (which already has the cookie clearing instruction)
    response.headers.set('Content-Type', 'application/json'); // Ensure correct content type
    const body = await response.json(); // Get existing body
    body.message = 'Logout successful, session invalidated'; // Update message
    return new NextResponse(JSON.stringify(body), { status: 200, headers: response.headers });


  } catch (error) {
    console.error('Logout: Error verifying session cookie or revoking tokens:', error);
    // Check for specific errors if needed (e.g., cookie already expired)
    if (error instanceof Error && (error.message.includes('session-cookie-expired') || error.message.includes('invalid-argument'))) {
        console.log('Logout: Session cookie already invalid or expired.');
        // Still return the response that clears the browser cookie
        return response;
    }
    // For other errors, still clear the browser cookie but log the server error
    // Optionally return a different status/message if needed, but clearing the browser cookie is important.
    response.headers.set('Content-Type', 'application/json');
    const body = await response.json();
    body.message = 'Logout completed, but server-side revocation encountered an error.';
    body.serverError = (error as Error).message; // Add error details if desired
    // Consider returning 500 or keeping 200 depends on desired client handling
    return new NextResponse(JSON.stringify(body), { status: 200, headers: response.headers });
  }
}
