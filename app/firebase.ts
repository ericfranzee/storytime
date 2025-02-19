import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Helper Functions
export const calculateExpiryDate = (subscriptionDate: Date) => {
  const expiryDate = new Date(subscriptionDate);
  expiryDate.setDate(expiryDate.getDate() + 30);
  return expiryDate;
};

export const getVideoLimit = (plan: string) => {
  switch (plan) {
    case 'pro':
      return 45;
    case 'elite':
      return Infinity;
    case 'free':
    default:
      return 3;
  }
};

// Subscription Management Functions
export const addSubscription = async (subscriptionData: any) => {
  try {
    const docRef = await addDoc(collection(db, "subscriptions"), subscriptionData);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const getSubscriptions = async () => {
  try {
    const subscriptionsQuery = query(collection(db, 'subscriptions'));
    const querySnapshot = await getDocs(subscriptionsQuery);
    const subscriptions = querySnapshot.docs.map(doc => doc.data());
    return subscriptions;
  } catch (e) {
    console.error('Error fetching documents: ', e);
    return [];
  }
};

export const getSubscriptionByUserId = async (userId: string) => {
  try {
    const subscriptionsQuery = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(subscriptionsQuery);
    const subscriptions = querySnapshot.docs.map(doc => doc.data());
    return subscriptions;
  } catch (e) {
    console.error('Error fetching documents: ', e);
    return [];
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const subscriptionsQuery = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(subscriptionsQuery);
    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      return {
        plan: data.subscriptionPlan || 'free',
        usage: data.usage || 0,
        remainingUsage: data.remainingUsage || 0,
        videoLimit: data.videoLimit || 3,
        resetDate: data.resetDate ? new Date(data.resetDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      };
    }
    return null;
  } catch (e) {
    console.error('Error fetching user subscription: ', e);
    return null;
  }
};

export const getUserVideoCount = async (userId: string) => {
  try {
    const subscription = await getUserSubscription(userId);
    if (subscription) {
      return subscription.remainingUsage || 0;
    }
    return 0;
  } catch (e) {
    console.error('Error fetching user remaining usage: ', e);
    return 0;
  }
};

export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error signing in with email and password: ', error);
    throw error;
  }
};

export const signUpWithEmailPassword = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Initialize user's video count and subscription details in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { videoCount: 0, subscriptionId: null }, { merge: true });

    try {
      await createDefaultFreePlan(user.uid, email);
    } catch (e) {
      console.error('Error creating default free plan: ', e);
    }

    return user;
  } catch (error) {
    console.error('Error signing up with email and password: ', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Initialize user's video count and subscription details in Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, { videoCount: 0, subscriptionId: null }, { merge: true });

     try {
      // Check if the user already has a subscription
      const existingSubscriptions = await getSubscriptionByUserId(user.uid);
      if (existingSubscriptions.length === 0) {
        await createDefaultFreePlan(user.uid, user.email || '');
      }
    } catch (e) {
      console.error('Error creating default free plan: ', e);
    }

    return user;
  } catch (error) {
    console.error('Error signing in with Google: ', error);
    throw error;
  }
};

export const updateUserSubscription = async (userId: string, subscriptionData: any) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { subscriptionId: subscriptionData.id });
    const subscriptionDocRef = doc(db, 'subscriptions', subscriptionData.id);
    await setDoc(subscriptionDocRef, {
      userId: subscriptionData.userId,
      email: subscriptionData.email,
      subscriptionPlan: subscriptionData.subscriptionPlan,
      paymentStatus: subscriptionData.paymentStatus,
      videoCount: subscriptionData.videoCount,
      usage: subscriptionData.usage,
      remainingUsage: subscriptionData.remainingUsage,
      subscriptionStartDate: subscriptionData.subscriptionStartDate,
      expiryDate: subscriptionData.expiryDate.getTime(),
    }, { merge: true });
  } catch (e) {
    console.error('Error updating user subscription: ', e);
  }
};

export const createUserSubscription = async (userId: string, email: string, plan: string) => {
  try {
    const subscriptionDate = new Date();
    const expiryDate = calculateExpiryDate(subscriptionDate);
    const videoLimit = getVideoLimit(plan);

    const subscriptionData = {
      userId,
      email,
      subscriptionPlan: plan,
      paymentStatus: 'active',
      videoCount: 0,
      usage: 0,
      remainingUsage: videoLimit,
      videoLimit: videoLimit,
      resetDate: new Date(subscriptionDate.getFullYear(), subscriptionDate.getMonth() + 1, 0).getTime(),
      subscriptionStartDate: subscriptionDate.toISOString(),
      expiryDate: expiryDate.getTime(),
    };
    await addDoc(collection(db, 'subscriptions'), subscriptionData);
  } catch (e) {
    console.error('Error creating user subscription: ', e);
  }
};

export const updateSubscriptionPaymentStatus = async (userId: string, paymentStatus: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const subscriptionId = userDoc.data().subscriptionId;
      const subscriptionDocRef = doc(db, 'subscriptions', subscriptionId);
      await updateDoc(subscriptionDocRef, { paymentStatus });
    }
  } catch (e) {
    console.error('Error updating subscription payment status: ', e);
  }
};

export const incrementVideoUsage = async (userId: string) => {
  try {
    const subscription = await getUserSubscription(userId);
    if (!subscription) {
      console.warn("No subscription found for user", userId);
      return;
    }

    if (subscription.usage >= subscription.videoLimit) {
      throw new Error("Video generation limit reached.");
    }

    const subscriptionsQuery = query(collection(db, 'subscriptions'), where('userId', '==', userId));
    const querySnapshot = await getDocs(subscriptionsQuery);

    if (!querySnapshot.empty) {
      const subscriptionDoc = querySnapshot.docs[0];
      await updateDoc(subscriptionDoc.ref, {
        usage: subscription.usage + 1,
        remainingUsage: subscription.videoLimit - (subscription.usage + 1),
      });
    }
  } catch (e) {
    console.error('Error incrementing video usage: ', e);
    throw e; // Re-throw the error to be handled by the calling function
  }
};

export const getUserUsage = async (userId: string) => {
  try {
    const subscription = await getUserSubscription(userId);
    if (subscription) {
      return subscription.usage || 0;
    }
    return 0;
  } catch (e) {
    console.error('Error fetching user usage: ', e);
    return 0;
  }
};

export const updateUserUsage = async (userId: string, usage: number) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { usage });
  } catch (e) {
    console.error('Error updating user usage: ', e);
  }
};

export const getRemainingUsage = async (userId: string) => {
  try {
    const subscription = await getUserSubscription(userId);
    if (subscription) {
      return subscription.remainingUsage || 0;
    }
    return 0;
  } catch (e) {
    console.error('Error fetching remaining usage: ', e);
    return 0;
  }
};

export const updateRemainingUsage = async (userId: string, remainingUsage: number) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { remainingUsage });
  } catch (e) {
    console.error('Error updating remaining usage: ', e);
  }
};

export const getTrialEndDate = async (userId: string) => {
  try {
    const subscription = await getUserSubscription(userId);
    if (subscription) {
      return subscription.expiryDate;
    }
    return null;
  } catch (e) {
    console.error('Error fetching trial end date: ', e);
    return null;
  }
};

export const createDefaultFreePlan = async (userId: string, email: string) => {
  try {
    const subscriptionData = {
      userId,
      email,
      subscriptionPlan: 'free',
      paymentStatus: 'inactive',
      videoCount: 0,
      usage: 0,
      remainingUsage: 3,
      videoLimit: 3,
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime(),
      subscriptionStartDate: new Date(),
      expiryDate: calculateExpiryDate(new Date()).getTime(),
    };
    await addDoc(collection(db, 'subscriptions'), subscriptionData);
  } catch (e) {
    console.error('Error creating default free plan: ', e);
  }
};

export const resetFreeTierUsage = async (userId: string) => {
  try {
    const subscriptionsQuery = query(
      collection(db, 'subscriptions'),
      where('userId', '==', userId),
      where('subscriptionPlan', '==', 'free')
    );
    const querySnapshot = await getDocs(subscriptionsQuery);

    if (!querySnapshot.empty) {
      const subscriptionDoc = querySnapshot.docs[0];
      await updateDoc(subscriptionDoc.ref, {
        usage: 0,
        remainingUsage: 3,
        expiryDate: calculateExpiryDate(new Date()).getTime(),
      });
    }
  } catch (e) {
    console.error('Error resetting free tier usage: ', e);
  }
};

export { auth };
