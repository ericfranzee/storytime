/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//import {onRequest} from "firebase-functions/v2/https";
//import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
import { onSchedule, ScheduledEvent } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const checkExpiredSubscriptions = onSchedule('0 0 * * *', async (event: ScheduledEvent) => {
  try {
    const now = Date.now();
    const subscriptionsQuery = db.collection('subscriptions')
      .where('expiryDate', '<', now)
      .where('paymentStatus', '==', 'active');
    const querySnapshot = await subscriptionsQuery.get();

    for (const doc of querySnapshot.docs) {
      const subscription = doc.data();
      const userId = subscription.userId;

      // Update subscription status
      const now = Date.now();
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const expiryDate = endOfMonth.getTime();
      const expiryDateISO = endOfMonth.toISOString();
      const subscriptionStartDate = new Date(now).toISOString();

      await db.collection('subscriptions').doc(doc.id).update({
        paymentStatus: 'inactive',
        expiryDate: expiryDate,
        expiryDateISO: expiryDateISO,
        remainingUsage: 3,
        resetDate: expiryDate,
        subscriptionPlan: 'free',
        subscriptionStartDate: subscriptionStartDate,
        usage: 0,
        videoCount: 0,
        videoLimit: 3,
      });

      // Downgrade user to free plan
      const userDocRef = db.collection('users').doc(userId);
      console.log(userDocRef);
      await db.collection('users').doc(userId).update({
        subscriptionPlan: 'free',
        videoCount: 0,
        videoLimit: 3,
      });

      console.log(`Subscription expired and user downgraded: ${userId}`);

      // Send notification to user (implement notification logic)
      // Example: sendNotification(userId, 'Your subscription has expired.');
    }

    console.log('checkExpiredSubscriptions function finished.');
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
  }
});

export const resetFreeTierUsage = onSchedule('0 0 * * *', async (event: ScheduledEvent) => {
  try {
    const now = Date.now();
    const subscriptionsQuery = db.collection('subscriptions')
      .where('subscriptionPlan', '==', 'free')
      .where('resetDate', '<=', now);
    const querySnapshot = await subscriptionsQuery.get();

    for (const doc of querySnapshot.docs) {
      // Reset usage and update resetDate
      const now = Date.now();
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
      const expiryDate = endOfMonth.getTime();
      const expiryDateISO = endOfMonth.toISOString();
      const subscriptionStartDate = new Date(now).toISOString();

      await db.collection('subscriptions').doc(doc.id).update({
        expiryDate: expiryDate,
        expiryDateISO: expiryDateISO,
        remainingUsage: 3,
        resetDate: expiryDate,
        subscriptionStartDate: subscriptionStartDate,
        usage: 0,
        videoCount: 0,
        videoLimit: 3,
      });

      await db.collection('users').doc(doc.id).update({
        videoCount: 0,
        videoLimit: 3,
      });
      console.log(`Free tier usage reset for user: ${doc.data().userId}`);
    }

    console.log('resetFreeTierUsage function finished.');
  } catch (error) {
    console.error('Error resetting free tier usage:', error);
  }
});
