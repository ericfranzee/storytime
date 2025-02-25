import { initializeApp } from 'firebase/app';
import { v4 as uuidv4 } from 'uuid';
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
  writeBatch 
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
    const subscriptionId = await createSubscription(user.uid, email, 'free');
    await setDoc(doc(db, 'users', user.uid), {
      email,
      subscriptionId,
      subscriptionPlan: 'free'
    });
    return subscriptionId;
  } catch (error) {
    console.error('Error in handleUserSignup:', error);
    throw error;
  }
};

export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    await handleUserSignup(userCredential.user, email);
    return userCredential.user;
  } catch (error) {
    console.error('Error in signUpWithEmailPassword:', error);
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

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    
    // Check if user already exists
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await handleUserSignup(user, user.email || '');
    }
    
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

// Export necessary functions and objects
export { 
  auth, 
  signInWithEmailPassword,
  sendPasswordResetEmail
};
