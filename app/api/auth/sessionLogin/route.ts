import { NextResponse, NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { cookies } from 'next/headers'; // Import cookies from next/headers

// Session duration (e.g., 5 days)
const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    console.log('SessionLogin API: Received request with idToken:', !!idToken); // Log if idToken is received

    if (!idToken) {
      console.error('SessionLogin API: ID token missing.');
      return NextResponse.json({ error: 'ID token required' }, { status: 400 });
    }

    // Verify the ID token while checking if the token is revoked.
    // Note: The auth_time check has been removed to prevent frequent forced re-logins.
    // We rely on the ID token's validity and the session cookie's expiration.
    console.log('SessionLogin API: Verifying ID token...');
    await adminAuth.verifyIdToken(idToken, true); // Still verify the token is valid
    console.log('SessionLogin API: ID token verified successfully.');

    // Create session cookie and set it in the browser.
    // Use the original idToken passed from the client to create the cookie.
    console.log('SessionLogin API: Creating session cookie...');
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    console.log('SessionLogin API: Session cookie created.');

    // Set cookie policy options.
    const options = {
      name: '__session', // Cookie name used in middleware
      value: sessionCookie,
      maxAge: expiresIn / 1000, // maxAge is in seconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      path: '/', // Cookie available on all paths
      // sameSite: 'lax', // Consider 'strict' or 'lax' based on your needs
    };

    // Use the 'cookies().set' method from next/headers
    console.log('SessionLogin API: Setting session cookie...');
    cookies().set(options);
    console.log('SessionLogin API: Session cookie set successfully.');

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('SessionLogin API: Error creating session cookie:', error);
    return NextResponse.json({ error: 'Unauthorized', message: (error as Error).message }, { status: 401 });
  }
}
