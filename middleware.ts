import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
  const response = NextResponse.next();

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
