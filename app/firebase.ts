import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  doc, 
  getDoc, 
  updateDoc, 
  setDoc,
  writeBatch,
  increment 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { sendVerificationEmail } from '@/lib/email-service';

// Types
interface SubscriptionData {
  userId: string;
  email: string;
  subscriptionPlan: 'free' | 'pro' | 'elite';
  paymentStatus: 'active' | 'inactive';
  videoCount: number;
  usage: number;
  remainingUsage: number;
  videoLimit: number;
  resetDate: number;
  subscriptionStartDate: string;
  expiryDate: number;
  expiryDateISO: string;
}

// Add new verification status type
type VerificationStatus = 'pending' | 'verified' | 'expired';

interface VerificationData {
  email: string;
  verificationCode: string;
  expiresAt: number;
  attempts: number;
  status: VerificationStatus;
}

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper Functions
export const calculateExpiryDate = (subscriptionDate: Date): Date => {
  const expiryDate = new Date(subscriptionDate);
  expiryDate.setDate(expiryDate.getDate() + 30);
  return expiryDate;
};

export const getVideoLimit = (plan: string): number => {
  const limits = {
    pro: 45,
    elite: Infinity,
    free: 3
  };
  return limits[plan as keyof typeof limits] || limits.free;
};

export const createDefaultFreePlan = async (userId: string, email: string) => {
  const db = getFirestore();
  const batch = writeBatch(db);
  const subscriptionDate = new Date();

  // Create subscription document
  const subscriptionRef = doc(collection(db, 'subscriptions'));
  const subscriptionData = {
    userId,
    email,
    subscriptionPlan: 'free',
    paymentStatus: 'inactive',
    videoCount: 0,
    usage: 0,
    remainingUsage: 3, // Free plan limit
    videoLimit: 3,
    resetDate: new Date(subscriptionDate.getFullYear(), subscriptionDate.getMonth() + 1, 0).getTime(),
    subscriptionStartDate: subscriptionDate.toISOString(),
    expiryDate: calculateExpiryDate(subscriptionDate).getTime(),
    expiryDateISO: calculateExpiryDate(subscriptionDate).toISOString()
  };
  batch.set(subscriptionRef, subscriptionData);

  // Create or update user document
  const userRef = doc(db, 'users', userId);
  const userData = {
    email,
    subscriptionId: subscriptionRef.id,
    subscriptionPlan: 'free',
    createdAt: subscriptionDate.toISOString(),
    updatedAt: subscriptionDate.toISOString()
  };
  batch.set(userRef, userData, { merge: true });

  // Commit both operations
  try {
    await batch.commit();
    return subscriptionRef.id;
  } catch (error) {
    console.error('Error creating default free plan:', error);
    throw new Error('Failed to create default subscription');
  }
};

// Subscription Management
const createSubscription = async (userId: string, email: string, plan: 'free' | 'pro' | 'elite'): Promise<string> => {
  const subscriptionDate = new Date();
  const subscriptionData: SubscriptionData = {
    userId,
    email,
    subscriptionPlan: plan,
    paymentStatus: plan === 'free' ? 'inactive' : 'active',
    videoCount: 0,
    usage: 0,
    remainingUsage: getVideoLimit(plan),
    videoLimit: getVideoLimit(plan),
    resetDate: new Date(subscriptionDate.getFullYear(), subscriptionDate.getMonth() + 1, 0).getTime(),
    subscriptionStartDate: subscriptionDate.toISOString(),
    expiryDate: calculateExpiryDate(subscriptionDate).getTime(),
    expiryDateISO: calculateExpiryDate(subscriptionDate).toISOString()
  };

  try {
    const batch = writeBatch(db);
    
    // Add subscription document
    const subscriptionRef = doc(collection(db, 'subscriptions'));
    batch.set(subscriptionRef, subscriptionData);
    
    // Update user document
    const userRef = doc(db, 'users', userId);
    batch.update(userRef, {
      subscriptionPlan: plan,
      subscriptionId: subscriptionRef.id
    });

    // Commit the batch
    await batch.commit();
    
    return subscriptionRef.id;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw new Error('Failed to create subscription');
  }
};

// Authentication Functions
const handleUserSignup = async (user: any, email: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      return await createDefaultFreePlan(user.uid, email);
    }
    return userDoc.data().subscriptionId;
  } catch (error) {
    console.error('Error in handleUserSignup:', error);
    throw error;
  }
};

// Add new function to send verification code
export const sendVerificationCode = async (email: string) => {
  try {
    const verificationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const expiresAt = Date.now() + 1800000; // 30 minutes expiry

    const verificationRef = doc(db, 'verifications', email);
    await setDoc(verificationRef, {
      email,
      verificationCode,
      expiresAt,
      attempts: 0,
      status: 'pending'
    } as VerificationData);

    // Send verification email using your email service
    await sendVerificationEmail(email, verificationCode);
    
    return true;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

// Add cleanup function to handle stale verifications
export const cleanupStaleVerification = async (email: string) => {
  try {
    const batch = writeBatch(db);
    
    // Delete verification document
    const verificationRef = doc(db, 'verifications', email);
    batch.delete(verificationRef);
    
    // Delete pending account
    const pendingRef = doc(db, 'pendingAccounts', email);
    batch.delete(pendingRef);
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Cleanup error:', error);
    throw error;
  }
};

// Modify signUpWithEmailPassword to require verification
export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    // Check for existing verification
    const verificationRef = doc(db, 'verifications', email);
    const verificationDoc = await getDoc(verificationRef);

    if (verificationDoc.exists()) {
      const verification = verificationDoc.data();
      // If verification is expired or stale, clean it up
      if (verification.status === 'expired' || verification.expiresAt < Date.now()) {
        await cleanupStaleVerification(email);
      } else {
        // Still valid, offer resend
        return { status: 'pending_verification', email };
      }
    }

    // First, check if email already exists
    const existingUser = await checkExistingEmail(email);
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Send verification code first
    await sendVerificationCode(email);

    // Store pending account info
    const pendingRef = doc(db, 'pendingAccounts', email);
    await setDoc(pendingRef, {
      email,
      password, // Store hashed password
      createdAt: Date.now(),
      type: 'email'
    });

    return { status: 'verification_sent' };
  } catch (error) {
    console.error('Error in signUpWithEmailPassword:', error);
    throw error;
  }
};

// Add verification confirmation function
export const confirmVerification = async (email: string, code: string) => {
  try {
    const verificationRef = doc(db, 'verifications', email);
    const verificationDoc = await getDoc(verificationRef);

    if (!verificationDoc.exists()) {
      throw new Error('No verification pending');
    }

    const verification = verificationDoc.data() as VerificationData;

    if (verification.status === 'expired' || Date.now() > verification.expiresAt) {
      throw new Error('Verification code expired');
    }

    if (verification.attempts >= 3) {
      throw new Error('Too many attempts');
    }

    if (verification.verificationCode !== code) {
      // Increment attempts
      await updateDoc(verificationRef, {
        attempts: increment(1)
      });
      throw new Error('Invalid verification code');
    }

    // Get pending account info
    const pendingRef = doc(db, 'pendingAccounts', email);
    const pendingDoc = await getDoc(pendingRef);

    if (!pendingDoc.exists()) {
      throw new Error('No pending account found');
    }

    const pendingData = pendingDoc.data();

    // Create verified account
    const userCredential = await createUserWithEmailAndPassword(auth, email, pendingData.password);
    await createDefaultFreePlan(userCredential.user.uid, email);

    // Cleanup
    const batch = writeBatch(db);
    batch.delete(verificationRef);
    batch.delete(pendingRef);
    await batch.commit();

    return userCredential.user;
  } catch (error) {
    console.error('Error in confirmVerification:', error);
    throw error;
  }
};

const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email and password:', error);
    throw error;
  }
};

// Modify Google sign-in to require verification for new accounts
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    // Add login hint to ensure consistent login experience
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // New Google account - create account directly without verification
      await createDefaultFreePlan(user.uid, user.email!);
      return user; // Return user directly
    }
    
    // Existing account - proceed with sign in
    return user;
  } catch (error) {
    console.error('Error in signInWithGoogle:', error);
    throw error;
  }
};

// Subscription Management Functions
export const getUserSubscription = async (userId: string) => {
  try {
    const subscriptionsQuery = query(
      collection(db, 'subscriptions'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(subscriptionsQuery);
    
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return {
        plan: data.subscriptionPlan,
        usage: data.usage,
        remainingUsage: data.remainingUsage,
        videoLimit: data.videoLimit,
        videoCount: data.videoCount,
        resetDate: new Date(data.resetDate),
        expiryDate: new Date(data.expiryDate),
        status: data.paymentStatus,
        paymentMethod: 'Paystack',
        expiryDateISO: data.expiryDateISO
      };
    }
    return null;
  } catch (error) {
    console.error('Error in getUserSubscription:', error);
    throw error;
  }
};

export const incrementVideoUsage = async (userId: string) => {
  try {
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      throw new Error('No subscription found');
    }

    if (subscription.usage >= subscription.videoLimit) {
      throw new Error('Video generation limit reached');
    }

    const subscriptionsQuery = query(
      collection(db, 'subscriptions'), 
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(subscriptionsQuery);

    if (!querySnapshot.empty) {
      const subscriptionDoc = querySnapshot.docs[0];
      await updateDoc(subscriptionDoc.ref, {
        usage: subscription.usage + 1,
        remainingUsage: subscription.videoLimit - (subscription.usage + 1),
        videoCount: subscription.videoCount + 1
      });
    }
  } catch (error) {
    console.error('Error in incrementVideoUsage:', error);
    throw error;
  }
};

const checkExistingEmail = async (email: string): Promise<boolean> => {
  try {
    // Check pendingAccounts collection
    const pendingQuery = query(
      collection(db, 'pendingAccounts'),
      where('email', '==', email)
    );
    const pendingSnapshot = await getDocs(pendingQuery);
    if (!pendingSnapshot.empty) {
      return true;
    }

    // Check users collection
    const usersQuery = query(
      collection(db, 'users'),
      where('email', '==', email)
    );
    const usersSnapshot = await getDocs(usersQuery);
    if (!usersSnapshot.empty) {
      return true;
    }

    // Check verifications collection
    const verificationQuery = query(
      collection(db, 'verifications'),
      where('email', '==', email)
    );
    const verificationSnapshot = await getDocs(verificationQuery);
    if (!verificationSnapshot.empty) {
      const verification = verificationSnapshot.docs[0].data();
      if (verification.status === 'pending' && verification.expiresAt > Date.now()) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking existing email:', error);
    throw new Error('Failed to check email existence');
  }
};

// Export necessary functions and objects
export { 
  auth, 
  signInWithEmailPassword,
  sendPasswordResetEmail
};
