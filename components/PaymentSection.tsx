import React from 'react';
import { auth, getUserSubscription } from '@/app/firebase';
import { getFirestore, doc, onSnapshot, DocumentData } from "firebase/firestore";

interface Subscription {
  plan: string;
  usage: number;
  remainingUsage: number;
  expiryDate: any;
}

const PaymentSection = () => {
  const [subscription, setSubscription] = React.useState<Subscription | null>(null);
  const [loading, setLoading] = React.useState(true);
  const db = getFirestore();

  React.useEffect(() => {
    const user = auth.currentUser;
    let unsubscribe: () => void;

    if (user) {
      const fetchSubscription = async () => {
        const sub = await getUserSubscription(user.uid);
        if (sub && 'plan' in sub && 'usage' in sub && 'remainingUsage' in sub && 'expiryDate' in sub) {
          setSubscription(sub as Subscription);
        } else {
          console.error('Invalid subscription data:', sub);
        }
      };

      fetchSubscription();

      // Listen for real-time updates
      unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          if (data && data.subscription && 'plan' in data.subscription && 'usage' in data.subscription && 'remainingUsage' in data.subscription && 'expiryDate' in data.subscription) {
            setSubscription(data.subscription as Subscription);
          }
        }
      });
      setLoading(false);
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className="text-4 font-bold">Subscription Details</h2>
      {subscription ? (
        <div>
          <p>Plan: {subscription.plan}</p>
          <p>Usage: {subscription.usage}</p>
          <p>Remaining Usage: {subscription.remainingUsage}</p>
          <p>
            Expiry Date:{' '}
            {subscription.expiryDate && typeof subscription.expiryDate === 'object' && subscription.expiryDate.seconds ? (
              new Date(subscription.expiryDate.seconds * 1000).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            ) : (
              'N/A'
            )}
          </p>
        </div>
      ) : (
        <p>No active subscription</p>
      )}
    </div>
  );
};

export default PaymentSection;
