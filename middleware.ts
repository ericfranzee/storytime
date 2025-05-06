import { NextResponse, NextRequest } from 'next/server';
// Ensure Firebase Admin imports and runtime export are removed

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next(); // Initialize response

  // --- Admin Panel Check ---
  if (pathname.startsWith('/panel')) {
    const token = request.cookies.get('__session')?.value; // Use the cookie name

    if (!token) {
      // No token, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      // console.log('Middleware: No token found, redirecting to login.'); // Commented out
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Revert to calling the internal API route to verify admin status
      const verifyUrl = new URL('/api/auth/verify-admin', request.url); // Use absolute URL based on request
      console.log(`Middleware: Calling verification API: ${verifyUrl.toString()}`);
      const verifyResponse = await fetch(verifyUrl.toString(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pass the cookie correctly in the 'Cookie' header
          'Cookie': `__session=${token}`,
        },
        // Ensure cookies are sent cross-origin if applicable (though likely same-origin here)
        // credentials: 'include', // Usually not needed for same-origin API calls from middleware
      });

      // Log status for debugging
      console.log(`Middleware: Verification API response status: ${verifyResponse.status}`);

      if (!verifyResponse.ok) {
        // API returned an error (e.g., 401, 403, 500)
        const errorData = await verifyResponse.json().catch(() => ({})); // Avoid crashing if body isn't JSON
        console.log('Middleware: Verification failed or user not admin.', errorData);
        // Redirect to home page if not admin or verification failed
        const homeUrl = new URL('/', request.url);
        return NextResponse.redirect(homeUrl);
      }

      // Check the response body for admin status
      const { isAdmin } = await verifyResponse.json();

      if (!isAdmin) {
         console.log('Middleware: User is not admin, redirecting to home.');
         // Explicitly not admin, redirect to home
         const homeUrl = new URL('/', request.url);
         return NextResponse.redirect(homeUrl);
      }

      // If isAdmin is true, allow the request to proceed
      console.log('Middleware: User is admin, allowing access.');
      // Continue to the requested page (handled by returning response later)

    } catch (error) {
      console.error('Middleware: Error calling verification API:', error);
      // Redirect to home on unexpected errors during verification
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
  }
  // --- End Admin Panel Check ---


  // --- Existing Security Headers Logic ---
  const csp = [
    // Base directives
    "default-src 'self' https: blob: data:",
    
    // Scripts - Add all required domains
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paystack.co https://*.paystack.com https://*.googleapis.com https://*.google.com https://*.gstatic.com https://*.firebaseapp.com https://*.firebase.google.com https://apis.google.com",
    
    // Frame sources - Add all required domains
    "frame-src 'self' https://*.youtube.com https://youtube.com https://*.google.com https://accounts.google.com https://*.firebaseapp.com https://*.gstatic.com https://*.paystack.co https://*.paystack.com",
    
    // Connect sources - Add all required domains
    "connect-src 'self' https: wss: data: https://*.googleapis.com https://*.google.com https://accounts.google.com https://*.firebaseapp.com https://*.firebase.com wss://*.firebaseio.com",
    
    // Other standard directives
    "style-src 'self' 'unsafe-inline' https:",
    "img-src 'self' data: blob: https: *.googleusercontent.com lh3.googleusercontent.com *.google.com",
    "font-src 'self' https: data:",
    "media-src 'self' https: blob:",
    "object-src 'none'",
    
    // Add popup specific directives
    "form-action 'self' https://accounts.google.com https://*.firebaseapp.com https://*.paystack.co https://*.paystack.com",
    "frame-ancestors 'self'"
  ].join('; ');

  // Set CSP headers
  response.headers.set('Content-Security-Policy', csp);
  
  // Remove COOP and COEP headers in production
  response.headers.delete('Cross-Origin-Opener-Policy');
  response.headers.delete('Cross-Origin-Embedder-Policy');
  
  // Set other security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Add permissive CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Add additional security headers
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Add Cache-Control for static assets
  if (request.url.includes('/assets/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/ routes
     * 2. /_next/ (Next.js internals)
     * 3. /_static (inside /public)
     * 4. /_vercel (Vercel internals)
     * 5. Static files (e.g. /favicon.ico, /sitemap.xml, /robots.txt)
     */
    '/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)',
  ],
};
