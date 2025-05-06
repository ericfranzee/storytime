import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import getConfig from 'next/config'; // Import getConfig

// Function to initialize Firebase Admin SDK
function initializeAdminApp(): App | null {
  const { serverRuntimeConfig } = getConfig();
  const {
    FIREBASE_PROJECT_ID,
    FIREBASE_ADMIN_CLIENT_EMAIL,
    FIREBASE_ADMIN_PRIVATE_KEY,
  } = serverRuntimeConfig;

  // Log the values obtained from serverRuntimeConfig
  console.log('[firebase-admin] Attempting initialization via serverRuntimeConfig...');
  console.log(`[firebase-admin] Config - FIREBASE_PROJECT_ID: ${FIREBASE_PROJECT_ID}`);
  console.log(`[firebase-admin] Config - FIREBASE_ADMIN_CLIENT_EMAIL: ${FIREBASE_ADMIN_CLIENT_EMAIL ? 'Exists' : 'MISSING!'}`);
  console.log(`[firebase-admin] Config - FIREBASE_ADMIN_PRIVATE_KEY: ${FIREBASE_ADMIN_PRIVATE_KEY ? 'Exists' : 'MISSING!'}`);


  if (!FIREBASE_PROJECT_ID || !FIREBASE_ADMIN_CLIENT_EMAIL || !FIREBASE_ADMIN_PRIVATE_KEY) {
      console.error('[firebase-admin] Error: Missing Firebase Admin SDK configuration in next.config.js serverRuntimeConfig.');
      // Optionally throw an error or return null depending on how you want to handle missing config
      return null; // Indicate initialization failed
  }

  if (!getApps().length) {
    try {
      console.log('[firebase-admin] Initializing Firebase Admin SDK...');
      const app = initializeApp({
        credential: cert({
          projectId: FIREBASE_PROJECT_ID,
          clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
          privateKey: FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure newlines are handled
        }),
      });
      console.log('[firebase-admin] Firebase Admin SDK initialized successfully.');
      return app;
    } catch (error) {
      console.error('[firebase-admin] Firebase admin initialization error:', error);
      return null; // Indicate initialization failed
    }
  } else {
    console.log('[firebase-admin] Firebase Admin SDK already initialized.');
    return getApps()[0]; // Return the existing default app
  }
}

// Initialize the app
const adminApp = initializeAdminApp();

// Export auth and firestore instances, handling potential initialization failure
// These will throw errors later if adminApp is null and they are used,
// which is appropriate behavior if initialization failed.
export const adminAuth = adminApp ? getAuth(adminApp) : null!; // Use non-null assertion or handle null case in usage
export const adminDb = adminApp ? getFirestore(adminApp) : null!; // Use non-null assertion or handle null case in usage

// Optional: Export the app itself if needed elsewhere
export { adminApp };
